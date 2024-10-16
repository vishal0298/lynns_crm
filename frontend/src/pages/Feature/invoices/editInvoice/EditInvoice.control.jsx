/* eslint-disable react/prop-types */
import React, {
  createContext,
  useRef,
  useContext,
  useEffect,
  useState,
} from "react";
import * as yup from "yup";
import { useParams, useNavigate } from "react-router-dom";
import { ApiServiceContext } from "../../../../core/API/api-service";
import {
  invoice as invoice_api,
  dropdown_api,
  successToast,
  customerrorToast,
} from "../../../../core/core-index";
import dayjs from "dayjs";
import { staffApi } from "../../../../constans/apiname";

const editInvoiceschema = yup
  .object({
    customerId: yup.object().shape({
      _id: yup.string().required("Choose Any Customer"),
    }),
    payment_method: yup.object().shape({
      value: yup.string().required("Choose payment mode"),
    }),
    invoiceDate: yup.string().required("Choose Invoice Date"),

    dueDate: yup.string().required("Choose Due Date"),
    isRecurring: yup.boolean(),
    recurringCycle: yup.number().when("isRecurring", (recurringCycle) => {
      if (recurringCycle && recurringCycle == true) {
        return yup
          .string()
          .test(
            (value) =>
              typeof value === "number" && !/[eE+-]/.test(value.toString())
          )
          .typeError("Enter Valid Recurring Cycle");
      } else {
        return yup.string().notRequired();
      }
    }),

    sign_type: yup.string().typeError("Choose Signature Type"),
    signatureName: yup.string().when("sign_type", (sign_type) => {
      if (sign_type == "eSignature") {
        return yup.string().nullable().required("Enter Signature Name");
      } else {
        return yup.string().nullable().notRequired();
      }
    }),
    signatureData: yup.string().when("sign_type", (sign_type) => {
      if (sign_type == "eSignature") {
        return yup
          .string()
          .test(
            "is-eSignature",
            `Draw The Signature`,
            async (value) => value == "true"
          );
      } else {
        return yup.string().notRequired();
      }
    }),
    signatureId: yup.lazy((value, originalValue) => {
      if (originalValue?.sign_type === "manualSignature") {
        return yup.object().shape({
          _id: yup.string().required("Signature ID is required"),
          signatureName: yup.string().required("Signature Name is required"),
          signatureImage: yup
            .string()
            .url("Invalid URL")
            .required("Signature Image URL is required"),
          status: yup.boolean().required("Status is required"),
          markAsDefault: yup.boolean().required("Mark as Default is required"),
          isDeleted: yup.boolean().required("Is Deleted is required"),
          userId: yup.string().required("User ID is required"),
          createdAt: yup.string().required("Created At is required"),
          updatedAt: yup.string().required("Updated At is required"),
          __v: yup.number().required("__v is required"),
          value: yup.string().required("Value is required"),
          label: yup.string().required("Label is required"),
        });
      } else {
        return yup.object().notRequired();
      }
    }),
  })
  .required();

const dicountEditForm = yup
  .object({
    discount: yup
      .number()
      .test(
        (value) => typeof value === "number" && !/[eE+-]/.test(value.toString())
      )
      .typeError("Enter Valid Discount price"),
    rate: yup
      .number()
      .test(
        (value) => typeof value === "number" && !/[eE+-]/.test(value.toString())
      )
      .typeError("Enter Valid Rate"),
  })
  .required();

const EditinvoiceContext = createContext({
  editInvoiceschema: editInvoiceschema,
  dicountEditForm: dicountEditForm,
  submiteditInvoiceForm: () => {},
});

const EditinvoiceComponentController = (props) => {
  const { postData, putData, getData } = useContext(ApiServiceContext);
  const { Base, Update } = invoice_api;
  const [menu, setMenu] = useState(false);
  const toggleMobileMenu = () => setMenu(!menu);
  const navigate = useNavigate();
  const [dueDate, setdueDate] = useState(new Date());
  const [invoiceDate, setinvoiceDate] = useState(new Date());
  const [dataSource, setDataSource] = useState([]);
  const [customersData, setCustomers] = useState([]);
  const [bank, setBank] = useState([]);
  const [taxableAmount, settaxableAmount] = useState(0);
  const [totalDiscount, settotalDiscount] = useState(0);
  const [totalTax, settotalTax] = useState(0);
  const [totalAmount, settotalAmount] = useState(0);
  const [productData, setProductOptiondata] = useState([]);
  const [productsCloneData, setproductsCloneData] = useState([]);
  const [invoiceData, setInvoicedata] = useState([]);
  const [roundof, setroundof] = useState(true);
  const editbankpocancelModal = useRef(null);
  const [rowErr, setrowErr] = useState([]);
  const [showSubmit, setshowSubmit] = useState(false);
  const [count, setCount] = useState(0);
  const [imgerror, setImgError] = useState("");
  const [files, setFile] = useState(null);

  const { id } = useParams();
  const [staffDetails, setStaffDetails] = useState([]);
  const [trimmedDataURL, setTrimmedDataURL] = useState(null);
  const [signatureData, setSignatureData] = useState(null);

  const [staffData, setStaffData] = useState({});
    const [serviceFromData, setServiceFromData] = useState({});
  
    // useEffect(() => {
    //   console.log(staffData)
    // }, [staffData])
    // useEffect(() => {
    //   console.log(serviceFromData)
    // }, [serviceFromData])
    
    // Generic handler for both staff and service_from, differentiating based on fieldType
    const handleFieldChange = (value, key, fieldType) => {
      if (fieldType === "staffName") {
        setStaffData((prev) => ({
          ...prev,
          [key]: value, // Store staff data by key
        }));
      } else if (fieldType === "service_from") {
        console.log(value)
        setServiceFromData((prev) => ({
          ...prev,
          [key]: value, // Store service_from data by key
        }));
      }
      // setValue(`${fieldType}${key}`, value); // Update form value in react-hook-form
    };

  useEffect(() => {
    console.log('hello');
    getStaffDetails();
  }, []);

  const getStaffDetails = async () => {
    try {
      const response = await getData(`${staffApi}`);
      console.log(typeof(response?.data))
      if (response) {
        // eslint-disable-next-line no-undef
        setStaffDetails(response?.data);
      }
    } catch {
      return false;
    }
  };

  const getmasterDetails = async () => {
    try {
      let selectedProdIds = [];
      const viewInvoicedata = await getData(`${Base}/${id}`);
      if (viewInvoicedata.code === 200) {
        setInvoicedata(viewInvoicedata?.data?.invoice_details);
        setDataSource(viewInvoicedata?.data?.invoice_details?.items);

        let tempArray = [];
        let tempArrayItems = viewInvoicedata?.data?.invoice_details?.items;
        tempArrayItems.forEach((element) => {
          tempArray.push({
            field: `qtyInput${element.key}`,
            valid: true,
            key: Number(element.key),
          });
        });

        setCount(tempArray.length);

        setrowErr([...rowErr, ...tempArray]);

        let duedate = viewInvoicedata?.data?.invoice_details?.dueDate;
        let Duedate = duedate?.split("/").reverse().join("/");
        setdueDate(new Date(Duedate));

        let invoicedate = viewInvoicedata?.data?.invoice_details?.invoiceDate;
        let Invoicedate = invoicedate?.split("/").reverse().join("/");
        setinvoiceDate(new Date(Invoicedate));

        let items = viewInvoicedata?.data?.invoice_details?.items;
        items.forEach((itm) => {
          selectedProdIds.push(itm.productId);
        });
      }

      const productresponse = await getData(dropdown_api.product_api);
      if (productresponse.code === 200) {
        let data = productresponse.data;
        let DDOPTData = data.map((item) => {
          return {
            ...item,
            value: item._id,
            label: item.name,
          };
        });

        setProductOptiondata(DDOPTData);
        let prods = DDOPTData.filter((prod) => {
          return !selectedProdIds.includes(prod._id);
        });
        setproductsCloneData(prods);
      }

      const Customersresponse = await getData(dropdown_api.customer_api);
      if (Customersresponse.code === 200) {
        setCustomers(Customersresponse?.data);
      }

      const Bankresponse = await getData(dropdown_api.bank_api);
      if (Bankresponse.code === 200) {
        setBank(Bankresponse?.data);
      }

      const Taxresponse = await getData(dropdown_api.tax_api);
      if (Taxresponse.code === 200) {
        setTax(Taxresponse?.data);
      }
    } catch (error) {
      //
    }
  };

  useEffect(() => {
    getmasterDetails();
    let elements = Array.from(
      document.getElementsByClassName("react-datepicker-wrapper")
    );
    elements.map((element) => element.classList.add("w-100"));
  }, []);

  const [tax, setTax] = useState([]);

  const submiteditInvoiceForm = async (data) => {
    let invoiceDate =
      data?.invoiceDate == undefined ? new Date() : data?.invoiceDate;
    let dueDate = data?.dueDate == undefined ? new Date() : data?.dueDate;

    if (rowErr.length > 0) {
      let errors = rowErr.filter((row) => {
        return row.valid == false;
      });
      if (errors.length > 0) {
        customerrorToast(`Product quantity is required`);
        return;
      }
    } else {
      customerrorToast(`Products  is required`);
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < dataSource.length; i++) {
      formData.append(`items[${i}][name]`, dataSource[i]?.name);
      formData.append(`items[${i}][key]`, i);
      formData.append(`items[${i}][productId]`, dataSource[i]?.productId);
      formData.append(`items[${i}][quantity]`, dataSource[i]?.quantity);
      formData.append(`items[${i}][staff]`, staffData[i]);
      formData.append(`items[${i}][service_from]`, serviceFromData[i]?.value);
      formData.append(`items[${i}][units]`, dataSource[i]?.units);
      formData.append(`items[${i}][unit]`, dataSource[i]?.unit_id);
      formData.append(`items[${i}][rate]`, dataSource[i]?.rate);
      formData.append(`items[${i}][discount]`, dataSource[i]?.discount);
      formData.append(`items[${i}][tax]`, dataSource[i]?.tax);
      let taxIfoFormdata = dataSource[i].taxInfo;
      if (typeof dataSource[i].taxInfo !== "string")
        taxIfoFormdata = JSON.stringify(dataSource[i].taxInfo);
      formData.append(`items[${i}][taxInfo]`, taxIfoFormdata);
      formData.append(`items[${i}][amount]`, dataSource[i]?.amount);
      formData.append(`items[${i}][discountType]`, dataSource[i]?.discountType);
      formData.append(
        `items[${i}][isRateFormUpadted]`,
        dataSource[i]?.isRateFormUpadted
      );
      formData.append(
        `items[${i}][form_updated_discounttype]`,
        dataSource[i]?.form_updated_discounttype
      );
      formData.append(
        `items[${i}][form_updated_discount]`,
        dataSource[i]?.form_updated_discount
      );
      formData.append(
        `items[${i}][form_updated_rate]`,
        dataSource[i]?.form_updated_rate
      );
      formData.append(
        `items[${i}][form_updated_tax]`,
        dataSource[i]?.form_updated_tax
      );
    }
    formData.append("invoiceNumber", data.invoiceNumber);
    formData.append("customerId", data.customerId?._id);
    formData.append("payment_method", data.payment_method?.value);
    formData.append(
      "dueDate",
      dayjs(data?.dueDate || new Date()).toISOString()
    );
    formData.append(
      "invoiceDate",
      dayjs(data?.invoiceDate || new Date()).toISOString()
    );
    formData.append("referenceNo", data.referenceNo);
    formData.append("taxableAmount", taxableAmount);
    formData.append("TotalAmount", totalAmount);
    formData.append("vat", totalTax);
    formData.append("totalDiscount", totalDiscount);
    formData.append("roundOff", roundof);
    formData.append("bank", data.bank?._id ? data.bank?._id : "");
    formData.append("notes", data.notes);
    formData.append("termsAndCondition", data.termsAndCondition);
    formData.append("sign_type", data?.sign_type);
    if (data?.sign_type == "eSignature") {
      formData.append("signatureName", data?.signatureName);
      formData.append("signatureImage", signatureData);
    } else {
      formData.append("signatureId", data?.signatureId?.value);
    }

    try {
      const response = await putData(`${Update}/${invoiceData._id}`, formData);
      if (response.code === 200) {
        successToast("Invoice Updated Successfully");
        navigate("/invoice-list");
      }
      return response;
    } catch (error) {
    }
  };

  const handleKeyPress = (event) => {
    const keyCode = event.keyCode || event.which;
    const keyValue = String.fromCharCode(keyCode);
    if (/^\d+$/.test(keyValue)) {
      event.preventDefault();
    }
  };

  const addBankSettingsForm = async (data) => {
    const formData = {};
    formData.name = data.name;
    formData.bankName = data.bankName;
    formData.branch = data.branch;
    formData.accountNumber = data.accountNumber;
    formData.IFSCCode = data.IFSCCode;
    try {
      const response = await postData("/bankSettings/addBank", formData);
      if (response.code === 200) {
        editbankpocancelModal.current.click();
        successToast("Bank addedSuccessfully");
        const Bankresponse = await getData("/bankSettings/listBanks");
        if (Bankresponse.code === 200) {
          setBank(Bankresponse?.data);
        }
      }
      return response;
    } catch (error) {
      return false;
    }
  };

  return (
    <EditinvoiceContext.Provider
      value={{
        setProductOptiondata,
        dataSource,
        setDataSource,
        editInvoiceschema,
        dicountEditForm,
        menu,
        submiteditInvoiceForm,
        handleKeyPress,
        toggleMobileMenu,
        productData,
        customersData,
        tax,
        bank,
        invoiceData,
        taxableAmount,
        settaxableAmount,
        totalTax,
        settotalTax,
        totalAmount,
        settotalAmount,
        totalDiscount,
        settotalDiscount,
        roundof,
        setroundof,
        staffDetails, 
        setStaffDetails,
        addBankSettingsForm,
        productsCloneData,
        setproductsCloneData,
        setinvoiceDate,
        invoiceDate,
        setdueDate,
        dueDate,
        editbankpocancelModal,
        rowErr,
        setrowErr,
        showSubmit,
        setshowSubmit,
        count,
        setCount,
        imgerror,
        setImgError,
        files,
        setFile,
        trimmedDataURL,
        setTrimmedDataURL,
        setSignatureData,
        staffData,
        setStaffData,
        serviceFromData,
        setServiceFromData,
        handleFieldChange,
      }}
    >
      {props.children}
    </EditinvoiceContext.Provider>
  );
};

export { EditinvoiceContext, EditinvoiceComponentController };
