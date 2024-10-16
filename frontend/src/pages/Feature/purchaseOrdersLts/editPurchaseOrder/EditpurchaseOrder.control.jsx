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
  purchase_orders as purchase_orders_api,
  dropdown_api,
  successToast,
  customerrorToast,
} from "../../../../core/core-index";
import dayjs from "dayjs";

const editpurchaseOrderschema = yup
  .object({
    purchaseId: yup.string().required("Enter  purchases_id"),

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
    signatureId: yup.string().when("sign_type", (sign_type) => {
      if (sign_type == "manualSignature") {
        return yup.object().shape({
          value: yup.string().required("Choose Signature Name"),
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
      .typeError("Enter Valid Discount Price"),
    rate: yup
      .number()
      .test(
        (value) => typeof value === "number" && !/[eE+-]/.test(value.toString())
      )
      .typeError("Enter Valid Rate"),
  })
  .required();

const EditpurchaseOrderContext = createContext({
  editpurchaseOrderschema: editpurchaseOrderschema,
  dicountEditForm: dicountEditForm,
  submiteditPOForm: () => {},
});

const EditproductComponentController = (props) => {
  const { postData, putData, getData } = useContext(ApiServiceContext);
  const { Upadte, View } = purchase_orders_api;
  const [menu, setMenu] = useState(false);
  const toggleMobileMenu = () => setMenu(!menu);
  const navigate = useNavigate();
  const [dueDate, setdueDate] = useState(new Date());
  const [orderDate, setorderDate] = useState(new Date());
  const [dataSource, setDataSource] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [bank, setBank] = useState([]);
  const [taxableAmount, settaxableAmount] = useState(0);
  const [totalDiscount, settotalDiscount] = useState(0);
  const [totalTax, settotalTax] = useState(0);
  const [totalAmount, settotalAmount] = useState(0);
  const [productData, setProductOptiondata] = useState([]);
  const [productsCloneData, setproductsCloneData] = useState([]);
  const [poData, setPurchaseOorderdata] = useState([]);
  const [roundof, setroundof] = useState(true);
  const editbankpocancelModal = useRef(null);
  const [rowErr, setrowErr] = useState([]);
  const [count, setCount] = useState(0);
  const [tax, setTax] = useState([]);

  const { id } = useParams();

  const [trimmedDataURL, setTrimmedDataURL] = useState(null);
  const [signatureData, setSignatureData] = useState(null);

  const getmasterDetails = async () => {
    try {
      let selectedProdIds = [];
      const viewPodata = await getData(`${View}/${id}`);
      if (viewPodata.code === 200) {
        setPurchaseOorderdata(viewPodata?.data);
        setDataSource(viewPodata?.data?.items);

        let tempArray = [];
        let tempArrayItems = viewPodata?.data?.items;
        tempArrayItems.forEach((element) => {
          tempArray.push({
            field: `qtyInput${element.key}`,
            valid: true,
            key: Number(element.key),
          });
        });

        setCount(tempArray.length + 1);

        setrowErr([...rowErr, ...tempArray]);

        let duedate = viewPodata?.data?.dueDate;
        let Duedate = duedate?.split("/").reverse().join("/");
        setdueDate(new Date(Duedate));

        let orderdate = viewPodata?.data?.purchaseOrderDate;
        let Orderdate = orderdate?.split("/").reverse().join("/");
        setorderDate(new Date(Orderdate));

        let items = viewPodata?.data.items;
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

      const Vendorresponse = await getData(dropdown_api.vendor_api);
      if (Vendorresponse.code === 200) {
        setVendors(Vendorresponse?.data);
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
    }
  };

  useEffect(() => {
    getmasterDetails();
    let elements = Array.from(
      document.getElementsByClassName("react-datepicker-wrapper")
    );
    elements.map((element) => element.classList.add("w-100"));
  }, []);

  const submiteditPOForm = async (data) => {
    let purchaseOrderDate =
      data?.purchaseOrderDate == undefined
        ? new Date()
        : data?.purchaseOrderDate;
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
    formData.append("purchaseOrderId", data.purchaseId);
    formData.append("vendorId", data.vendorId?._id);
    formData.append(
      "dueDate",
      dayjs(data?.dueDate || new Date()).toISOString()
    );
    formData.append(
      "purchaseOrderDate",
      dayjs(data?.purchaseOrderDate || new Date()).toISOString()
    );
    formData.append("referenceNo", data.referenceNo);
    formData.append("taxableAmount", taxableAmount);
    formData.append("TotalAmount", totalAmount);
    formData.append("vat", totalTax);
    formData.append("totalDiscount", totalDiscount);
    formData.append("roundOff", roundof);
    formData.append("bank", data.bank?._id == undefined ? "" : data.bank?._id);
    formData.append("notes", data.notes);
    formData.append("termsAndCondition", data.termsAndCondition);
    formData.append("sign_type", data?.sign_type);
    if (data?.sign_type == "eSignature") {
      formData.append(
        "signatureName",
        data?.signatureName ? data?.signatureName : ""
      );
      formData.append("signatureImage", signatureData);
    } else {
      formData.append(
        "signatureId",
        data?.signatureId?.value ? data?.signatureId?.value : {}
      );
    }

    try {
      const response = await putData(`${Upadte}/${poData._id}`, formData);
      if (response.code === 200) {
        successToast("Purchase order Updated Successfully");
        navigate("/purchase-orders");
      }
      return response;
    } catch (error) {
      //
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
        const Bankresponse = await getData("/bankSettings/listBanks");
        if (Bankresponse.code === 200) {
          setBank(Bankresponse?.data);
        }
        successToast("Bank addedSuccessfully");
      }
      return response;
    } catch (error) {
      /* empty */
    }
  };

  return (
    <EditpurchaseOrderContext.Provider
      value={{
        setProductOptiondata,
        dataSource,
        setDataSource,
        editpurchaseOrderschema,
        dicountEditForm,
        menu,
        submiteditPOForm,
        handleKeyPress,
        toggleMobileMenu,
        productData,
        vendors,
        tax,
        bank,
        poData,
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
        addBankSettingsForm,
        productsCloneData,
        setproductsCloneData,
        setorderDate,
        orderDate,
        setdueDate,
        dueDate,
        editbankpocancelModal,
        rowErr,
        setrowErr,
        count,
        setCount,
        trimmedDataURL,
        setTrimmedDataURL,
        setSignatureData,
      }}
    >
      {props.children}
    </EditpurchaseOrderContext.Provider>
  );
};

export { EditpurchaseOrderContext, EditproductComponentController };
