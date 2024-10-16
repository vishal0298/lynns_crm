/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { ApiServiceContext } from "../../../../core/API/api-service";
import {
  purchase_orders as purchase_orders_api,
  dropdown_api,
  successToast,
  customerrorToast,
} from "../../../../core/core-index";
import dayjs from "dayjs";
import { addpurchaseOrderschema } from "./AddpurchaseOrderschema";

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

const AddpurchaseOrderContext = createContext({
  addpurchaseOrderschema: addpurchaseOrderschema,
  dicountEditForm: dicountEditForm,
  submitaddPOForm: () => {},
});

const AddpurchaseOrderComponentController = (props) => {
  const { postData, getData } = useContext(ApiServiceContext);
  const { Add } = purchase_orders_api;
  const [menu, setMenu] = useState(false);
  const toggleMobileMenu = () => setMenu(!menu);
  const navigate = useNavigate();
  const [dueDate, setdueDate] = useState(new Date());
  const [orderDate, setorderDate] = useState(new Date());
  const [dataSource, setDataSource] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [payment, setPayment] = useState([{ id: 1, text: "Cash" }]);
  const [bank, setBank] = useState([]);
  const [taxableAmount, settaxableAmount] = useState(0);
  const [totalDiscount, settotalDiscount] = useState(0);
  const [discount, setdiscount] = useState(0);
  const [totalTax, settotalTax] = useState(0);
  const [totalAmount, settotalAmount] = useState(0);
  const [productData, setProductOptiondata] = useState([]);
  const [productsCloneData, setproductsCloneData] = useState([]);
  const [roundof, setroundof] = useState(false);
  const addbankpocancelModal = useRef(null);
  const [rowErr, setrowErr] = useState([]);
  const [showSubmit, setshowSubmit] = useState(false);
  const [num, setNum] = useState("");

  const [trimmedDataURL, setTrimmedDataURL] = useState(null);
  const [signatureData, setSignatureData] = useState(null);

  const getmasterDetails = async () => {
    try {
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
        setproductsCloneData(DDOPTData);
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

  const submitaddPOForm = async (data) => {
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
      formData.append(`items[${i}][name]`, dataSource[i].name);
      formData.append(`items[${i}][key]`, dataSource[i].key);
      formData.append(`items[${i}][productId]`, dataSource[i].productId);
      formData.append(`items[${i}][quantity]`, dataSource[i].quantity);
      formData.append(`items[${i}][units]`, dataSource[i].units);
      formData.append(`items[${i}][unit]`, dataSource[i].unit_id);
      formData.append(`items[${i}][rate]`, dataSource[i].rate);
      formData.append(`items[${i}][discount]`, dataSource[i].discount);
      formData.append(`items[${i}][tax]`, dataSource[i].tax);
      formData.append(
        `items[${i}][taxInfo]`,
        JSON.stringify(dataSource[i].taxInfo)
      );
      formData.append(`items[${i}][amount]`, dataSource[i].amount);
      formData.append(`items[${i}][discountType]`, dataSource[i].discountType);
      formData.append(
        `items[${i}][isRateFormUpadted]`,
        dataSource[i].isRateFormUpadted
      );
      formData.append(
        `items[${i}][form_updated_discounttype]`,
        dataSource[i].form_updated_discounttype
      );
      formData.append(
        `items[${i}][form_updated_discount]`,
        dataSource[i].form_updated_discount
      );
      formData.append(
        `items[${i}][form_updated_rate]`,
        dataSource[i].form_updated_rate
      );
      formData.append(
        `items[${i}][form_updated_tax]`,
        dataSource[i].form_updated_tax
      );
    }
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
    formData.append("purchaseOrderId", num);
    formData.append("taxableAmount", taxableAmount);
    formData.append("TotalAmount", totalAmount);
    formData.append("vat", totalTax);
    formData.append("totalDiscount", totalDiscount);
    formData.append("discount", discount);
    formData.append("roundOff", roundof);
    formData.append("bank", data.bank?._id == null ? "" : data.bank?._id);
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
      const response = await postData(Add, formData);
      if (response.code === 200) {
        successToast("Purchase order Added Successfully");
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

    if (!/^[a-zA-Z]+$/.test(keyValue)) {
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
        addbankpocancelModal.current.click();
        const Bankresponse = await getData("/bankSettings/listBanks");
        if (Bankresponse.code === 200) {
          setBank(Bankresponse?.data);
        }
        successToast("Bank addedSuccessfully");
      }
      return response;
    } catch (error) {
     
    }
  };

  return (
    <AddpurchaseOrderContext.Provider
      value={{
        setProductOptiondata,
        dataSource,
        setDataSource,
        addpurchaseOrderschema,
        dicountEditForm,
        menu,
        submitaddPOForm,
        handleKeyPress,
        toggleMobileMenu,
        payment,
        productData,
        vendors,
        tax,
        bank,
        taxableAmount,
        settaxableAmount,
        totalTax,
        settotalTax,
        totalAmount,
        settotalAmount,
        totalDiscount,
        settotalDiscount,
        discount,
        setdiscount,
        roundof,
        setroundof,
        addBankSettingsForm,
        productsCloneData,
        setproductsCloneData,
        setorderDate,
        orderDate,
        setdueDate,
        dueDate,
        addbankpocancelModal,
        rowErr,
        setrowErr,
        showSubmit,
        setshowSubmit,
        trimmedDataURL,
        setTrimmedDataURL,
        setSignatureData,
        num,
        setNum,
      }}
    >
      {props.children}
    </AddpurchaseOrderContext.Provider>
  );
};

export { AddpurchaseOrderContext, AddpurchaseOrderComponentController };
