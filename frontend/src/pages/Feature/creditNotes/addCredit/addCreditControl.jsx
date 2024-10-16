/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiServiceContext } from "../../../../core/API/api-service";
import {
  successToast,
  customerrorToast,
  credit_note,
  dropdown_api,
} from "../../../../core/core-index";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import * as yup from "yup";
import {addpurchaseOrderschema} from './addCreditschema'

const dicountEditForm = yup
  .object({
    discount: yup
      .number()
      .test(
        (value) => typeof value === "number" && !/[eE+-]/.test(value.toString())
      )
      .typeError("Enter the valid discount price"),
    rate: yup
      .number()
      .test(
        (value) => typeof value === "number" && !/[eE+-]/.test(value.toString())
      )
      .typeError("Enter the valid Rate"),
  })
  .required();

const AddCreditNotesContext = createContext({
  addpurchaseOrderschema: addpurchaseOrderschema,
  dicountEditForm: dicountEditForm,
  onSubmit: () => {},
});

const AddCreditNotesComponentController = (props) => {
  const [productOptionCopy, setProductOptionCopy] = useState([]);
  const [productService, setProductService] = useState([]);
  const [endDate, setEndDate] = useState(new Date());
  const [round, setRound] = useState(false);
  const [rounded, setRounded] = useState(0.0);
  const [productServiceCopy, setProductServiceCopy] = useState([]);
  const [roundOffAction, setRoundOffAction] = useState(false);
  const [bankModalDismiss, setBankModalDismiss] = useState(false);
  const [taxList, setTaxList] = useState([]);
  const [newEdit, setNewEdit] = useState({});
  const [modalDismiss, setModalDismiss] = useState(false);
  const [editPro, setEditPro] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [purchaseDelete, setPurchaseDelete] = useState();
  const [product, setProduct] = useState([]);
  const [dueDate, setdueDate] = useState(new Date());

  const [trimmedDataURL, setTrimmedDataURL] = useState(null);
  const [signatureData, setSignatureData] = useState(null);

  const [productOption, setProductOption] = useState([]);

 
  const [bank, setBank] = useState([]);
  const [num, setNum] = useState("");

  const {
    formState: { errors },
  } = useForm({ resolver: yupResolver() });

  const navigate = useNavigate();

  useEffect(() => {
    roundOff(round);
  }, [roundOffAction]);

  const handleDelete = (id) => {
    let deleted = productService.filter((ele) => ele._id !== id);
    let addDropDown = productService?.find((ele) => ele._id == id);
    let addDropDownForSelect = {
      id: addDropDown?._id,
      text: addDropDown?.name,
      quantity: 1,
    };
    var copy = productOptionCopy.map((ele) => {
      if (ele?.id == addDropDown._id) {
        return { ...ele, quantity: 1 };
      } else {
        return { ...ele };
      }
    });

    setProductOptionCopy(copy);
    setProductOption([...productOption, addDropDownForSelect]);
    setRoundOffAction(!roundOffAction);
    setProductService(deleted);
  };


  const { postData, getData } = useContext(ApiServiceContext);

  const listData = productOption?.map((item) => {
    return { label: item.text, value: item.id, quantity: item.quantity };
  });


  const prepare = (record) => {
    var gotoEdit = {
      rate: record?.sellingPrice,
      discount: record?.discountValue,
      tax: record?.tax?.taxRate,
      id: record?._id,
      record,
    };

    setEditPro(gotoEdit);
    setModalDismiss(true);
  };

  const getBankList = async () => {
    const bankList = await getData(dropdown_api?.bank_api);

    const newBankList = bankList?.data?.map((item) => {
      return { id: item.userId, text: item.name };
    });

    setBank(newBankList);
  };

  useEffect(() => {
    let elements = Array.from(
      document.getElementsByClassName("react-datepicker-wrapper")
    );
    elements.map((element) => element.classList.add("w-100"));
  }, []);

  const onSubmit = async (data) => {
    let sending = JSON.parse(JSON.stringify(productService));

    let finalArray = [];
    sending.map((item) => {
      // eslint-disable-next-line no-unused-vars
      let finished = productOptionCopy.map((ele) => {
        const rate = calculateRate(item);
        const discountAmount = calculateDiscountAmount(item);
        const taxAmount = calculateTaxAmount(item);
        const amount = calculateAmount(item); 
        if (item._id === ele.id) {
          finalArray.push({
            ...item,
            alertQuantity: ele.quantity,
            rate: rate,
            amount: amount,
            discountAmount: discountAmount,
            taxAmount: taxAmount,
          });
          return {
            ...item,
            alertQuantity: ele.quantity,
            amount: amount,
            discountAmount: discountAmount,
            taxAmount: taxAmount,
          };
        }
      });
    });

    const formData = new FormData();

    for (let i = 0; i < finalArray.length; i++) {
      formData.append(`items[${i}][productId]`, finalArray[i]._id);
      formData.append(`items[${i}][quantity]`, finalArray[i].alertQuantity);
      formData.append(`items[${i}][unit]`, finalArray[i]?.units?._id);
      formData.append(`items[${i}][rate]`, finalArray[i]?.sellingPrice);
      formData.append(`items[${i}][discount]`, finalArray[i]?.discountValue);
      formData.append(`items[${i}][tax]`, finalArray[i]?.tax?.taxRate);
      formData.append(`items[${i}][amount]`, finalArray[i]?.amount);
      formData.append(`items[${i}][name]`, finalArray[i]?.name);
      formData.append(
        `items[${i}][discountValue]`,
        finalArray[i]?.discountAmount
      );
    }
    formData.append(
      "customerId",
      data?.customerId?.value ? data?.customerId?.value : data?.customerId
    );
    
    formData.append("due_date", dayjs(data?.due_date).toDate());
    formData.append("credit_note_date", dayjs(data?.credit_note_date).toDate());
    formData.append("reference_no", data.reference_no);
    formData.append("credit_note_id", num);
    formData.append("taxableAmount", calculateTaxableSum());
    formData.append("totalDiscount", calculateDiscount());
    formData.append("roundOff", round);
    formData.append("TotalAmount", calculateFinalTotal());
    formData.append("discountType", 143);
    formData.append("discount", 10);
    formData.append("tax", "SGST");
    formData.append("vat", calculateTax().toFixed(2));
    formData.append("notes", data?.notes);
    formData.append(
      "termsAndCondition",
      data?.termsAndCondition == undefined ? "" : data?.termsAndCondition
    );
    formData.append("sign_type", data?.sign_type);
    if (data?.sign_type == "eSignature") {
      formData.append("signatureName", data?.signatureName);
      formData.append("signatureImage", signatureData);
    } else {
      formData.append("signatureId", data?.signatureId?.value);
    }
    formData.append("bank", data?.bank?.id == undefined ? "" : data?.bank?.id);

    if (finalArray?.length > 0) {
      const checkQuantity = finalArray?.some(
        (item) => item?.alertQuantity === 0
      );
      if (checkQuantity) {
        customerrorToast("Product quantity is required");
      } else {
        const successResponse = await postData(credit_note?.Add, formData);

        if (successResponse) {
          successToast("Sales Return added successfully");
          navigate("/sales-return");
        }
      }
    } else {
      customerrorToast(`Products  is required`);
    }
  };

  const afterModalSubmit = (modalData) => {
    let Stringified = JSON.parse(JSON.stringify(productService));
    let checkIndex = Stringified?.findIndex(
      (item) => item?.id == modalData?.id
    );

    Stringified.splice(checkIndex, 1, modalData?.record);

    checkIndex && setProductService([...Stringified]);
  };

  const handleUnitChange = (e, id) => {
    setQuantity(e.target.value);
    let quantId = productOptionCopy.map((ele) => {
      if (ele.id == id) {
        return { ...ele, quantity: Number(e.target.value) };
      } else {
        return { ...ele };
      }
    });
    setRoundOffAction(!roundOffAction);

    setProductOptionCopy(quantId);
  };

  useEffect(() => {
    getListcustomer();
    getProductDetails();
    getBankList();
    getTaxList();
  }, []);

  const getListcustomer = async () => {
    const response = await getData(dropdown_api?.customer_api);
    const newList = response?.data?.map((item) => {
      return {
        id: item._id,
        text: item.name,
        value: item._id,
        label: item.name,
      };
    });

    setProduct(newList);
  };

  const getProductDetails = async () => {
    try {
      const response = await getData(dropdown_api?.product_api);

      const dataList = response?.data;
      if (dataList?.length > 0) {
        setProductServiceCopy(dataList);
        let datas = [];

        setProductService(datas);
        getQuantity(dataList);
      }
    } catch (error) {
      return false;
    }
  };

  const getQuantity = (dataList) => {
    let newProductList = [];
    newProductList = dataList?.map((item) => {
      return {
        id: item?._id,
        text: item?.name,
        quantity: 1,
      };
    });
    setProductOption(newProductList);

    setProductOptionCopy(newProductList);
  };

  const SelectedList = (value) => {
    var selectList = productServiceCopy?.find((ele) => ele?._id == value);
    var add = [];
    add.push(selectList);

    let productOptionRemove = JSON.parse(JSON.stringify(productOption));
    let removeFromDropDown = productOptionRemove?.findIndex(
      (ele) => ele.id == value
    );
    productOptionRemove?.splice(removeFromDropDown, 1);

    setProductOption(productOptionRemove);
    try {
      setProductService(
        selectList?._id ? [...productService, selectList] : [...productService]
      );
      setRoundOffAction(!roundOffAction);
    } catch (error) {
      return false;
    }
  };
  
  const calculateDiscount = () => {
    let initialValue = 0;
    let sum = productService.reduce(function (accumulator, curValue) {
      return (
        parseFloat(accumulator) + parseFloat(calculateDiscountAmount(curValue))
      ).toFixed(2);
    }, initialValue);
    return sum;
  };

  const calculateDiscountAmount = (record) => {
    var discountQuantity = productOptionCopy.find(
      (ele) => ele.id == record?._id
    )?.quantity;
    let disQ = discountQuantity ? parseInt(discountQuantity) : 0;
    return record?.discountType == 2
      ? `${(
          (disQ * record?.sellingPrice * record?.discountValue) /
          100
        ).toFixed(2)} `
      : disQ === 0
      ? "0.00"
      : record?.discountValue?.toFixed(2);
  };

  const calculateSum = () => {
    let initialValue = 0;
    let sum = productService.reduce(function (accumulator, curValue) {
      return parseFloat(accumulator) + parseFloat(calculateAmount(curValue));
    }, initialValue);
    let fixed = sum.toFixed(2);
    return fixed;
  };
  const calculateRate = (record) => {
    var Quantity = productOptionCopy.find(
      (ele) => ele.id == record?._id
    )?.quantity;
    let SingleAmount = Quantity ? parseInt(Quantity) : 0;
    return `${(SingleAmount * record?.sellingPrice).toFixed(2)} `;
  };

  const calculateTaxableSum = () => {
    let initialValue = 0;
    let sum = productService?.reduce(function (accumulator, curValue) {
      return parseFloat(accumulator) + parseFloat(calculateRate(curValue));
    }, initialValue);
    let fixed = sum.toFixed(2);
    return fixed;
  };
  const getTaxList = async () => {
    const tax = await getData(dropdown_api?.tax_api);

    let newTax = tax?.data?.map((item) => {
      return {
        id: item?.id,
        label: item?.name + ` ${item?.taxRate}%`,
        value: parseInt(item?.taxRate),
      };
    });
    setTaxList(newTax);
  };

  const calculateAmount = (record) => {
    var countFinal = productOptionCopy.find(
      (ele) => ele.id == record?._id
    )?.quantity;

    var countTaxFinal = productServiceCopy.find((ele) => ele._id == record?._id)
      ?.tax?.taxRate;

    let discountFinal =
      record?.discountType == 2
        ? `${(
            ((countFinal ? countFinal : 0) *
              record?.sellingPrice *
              record?.discountValue) /
            100
          ).toFixed(2)} `
        : countFinal === 0
        ? "0.00"
        : record?.discountValue?.toFixed(2);

    let SumFinal =
      (countFinal ? countFinal : 0) * record?.sellingPrice - discountFinal;
    let finalTax = (Number(SumFinal) * Number(countTaxFinal)) / 100;
    return (Number(SumFinal) + Number(finalTax)).toFixed(2);
  };

  const calculateTax = () => {
    let initialValue = 0;
    let sum = productService.reduce(function (accumulator, curValue) {
      return parseFloat(accumulator) + parseFloat(calculateTaxAmount(curValue));
    }, initialValue);
    return sum;
  };

  const calculateTaxAmount = (record) => {
    var countQuantity = productOptionCopy.find(
      (ele) => ele.id == record?._id
    )?.quantity;
    var countTax = productServiceCopy.find((ele) => ele._id == record?._id)?.tax
      ?.taxRate;
    let discountTax =
      record?.discountType == 2
        ? `${(
            ((countQuantity ? countQuantity : 0) *
              record?.sellingPrice *
              record?.discountValue) /
            100
          ).toFixed(2)} `
        : countQuantity === 0
        ? "0.00"
        : record?.discountValue?.toFixed(2);

    let SumTax =
      (countQuantity ? countQuantity : 0) * record?.sellingPrice - discountTax;
    let finalTax = (SumTax * Number(countTax)) / 100;

    return (Number(finalTax) ? finalTax : 0).toFixed(2);
  };

  const calculateFinalTotal = () => {
    let finalTotal =
      parseFloat(calculateSum()) +
      parseFloat(calculateTax()) -
      parseFloat(calculateDiscount());

    return finalTotal.toFixed(2);
  };

  const roundOff = (value) => {
    let finalSum = calculateSum();
    if (value) {
      Math.round(calculateSum());
      let off = Math.round(finalSum);
      let finalOff = off - finalSum;

      let numberOff = parseFloat(finalOff);
      setRounded(numberOff.toFixed(2));
    } else {
      setRounded(0.0);
    }
    return
  };

  return (
    <AddCreditNotesContext.Provider
      value={{
        productOptionCopy,
        setProductOptionCopy,
        productService,
        setProductService,
        endDate,
        setEndDate,
        round,
        setRound,
        rounded,
        setRounded,
        productServiceCopy,
        setProductServiceCopy,
        roundOffAction,
        setRoundOffAction,
        bankModalDismiss,
        setBankModalDismiss,
        taxList,
        setTaxList,
        newEdit,
        setNewEdit,
        modalDismiss,
        setModalDismiss,
        editPro,
        setEditPro,
        quantity,
        setQuantity,
        purchaseDelete,
        setPurchaseDelete,
        afterModalSubmit,
        handleUnitChange,
        getListcustomer,
        getProductDetails,
        getQuantity,
        SelectedList,
        calculateDiscount,
        calculateDiscountAmount,
        calculateSum,
        getTaxList,
        calculateAmount,
        calculateTax,
        calculateTaxAmount,
        calculateFinalTotal,
        roundOff,
        onSubmit,
        listData,
        product,
        setProduct,
        prepare,
        setdueDate,
        dueDate,
        handleDelete,
        calculateTaxableSum,
        trimmedDataURL,
        setTrimmedDataURL,
        setSignatureData,
        addpurchaseOrderschema,
        num,
        setNum,
      }}
    >
      {props.children}
    </AddCreditNotesContext.Provider>
  );
};

export { AddCreditNotesContext, AddCreditNotesComponentController };
