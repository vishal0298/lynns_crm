/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../../common/antd.css";
import {
  ApiServiceContext,
  customerrorToast,
  debit_note,
  dropdown_api,
  successToast,
} from "../../../../core/core-index";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import useFilePreview from "../hooks/useFilePreview";

import dayjs from "dayjs";
import { debitSchema } from "./debitSchema";


const AddpurchaseReturnContext = createContext({
  onSubmit: () => {},
});

const AddpurchaseReturnComponentController = (props) => {
  const {
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(debitSchema),
  });
  const [menu, setMenu] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [editPro, setEditPro] = useState({});
  const [modalDismiss, setModalDismiss] = useState(false);
  const [taxList, setTaxList] = useState([]);

  const { getData, postData, patchData, putData, deleteData } =
    useContext(ApiServiceContext);

  // State
  const [vendorList, setVendorList] = useState([]);
  const [bank, setBank] = useState([]);
  const [productService, setProductService] = useState([]);
  const [productServiceCopy, setProductServiceCopy] = useState([]);

  const [quantity, setQuantity] = useState(1);
  const [productOption, setProductOption] = useState([]);
  const [productOptionCopy, setProductOptionCopy] = useState([]);

  const [rounded, setRounded] = useState(0.0);
  const [round, setRound] = useState(false);
  const [roundOffAction, setRoundOffAction] = useState(false);

  const [trimmedDataURL, setTrimmedDataURL] = useState(null);
  const [signatureData, setSignatureData] = useState(null);

  const [totalAmount, setTotalAmount] = useState(0);
  const [num, setNum] = useState("");
  // State

  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMenu(!menu);
  };

  useEffect(() => {
    getProductDetails();
    getBankList();
    getTaxList();
  }, []);

  useEffect(() => {
    roundOff(round);
  }, [roundOffAction]);

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

  // Product List table
  const getProductDetails = async () => {
    try {
      const productList = await getData(dropdown_api?.product_api);
      var dataList = productList?.data;

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

  const listData = productOption?.map((item, index) => {
    return { label: item.text, value: item._id, quantity: item.quantity };
  });
  // Product List table

  // Delete individual Products
  const handleDelete = (id) => {
    let remaining = productService.filter((ele) => ele._id !== id);
    let addDropDown = productService?.find((ele) => ele._id == id);
    let addDropDownForSelect = {
      id: addDropDown?._id,
      text: addDropDown?.name,
      quantity: 1,
    };
    var copy = productOptionCopy.map((ele, index) => {
      if (ele?.id == addDropDown._id) {
        return { ...ele, quantity: 1 };
      } else {
        return { ...ele };
      }
    });
    setProductOptionCopy(copy);
    setProductOption([...productOption, addDropDownForSelect]);
    setRoundOffAction(!roundOffAction);
    setProductService(remaining);
  };
  // Delete individual Products

  const [imgerror, setImgError] = useState("please upload image");

  const file = watch("signatureImage");
  const [filePreview] = useFilePreview(file, setImgError);

  const getBankList = async () => {
    const bankList = await getData(dropdown_api?.bank_api);
    const newBankList = bankList?.data?.map((item) => {
      return { id: item.userId, text: item.name };
    });

    setBank(newBankList);
  };

  const onSubmit = async (data) => {
    let sending = JSON.parse(JSON.stringify(productService));
    let finalArray = [];
    sending.map((item) => {
      let finished = productOptionCopy.map((ele) => {
        if (item._id === ele.id) {
          const rate = calculateRate(item);
          const discountAmount = calculateDiscountAmount(item);
          const taxAmount = calculateTaxAmount(item);
          const amount = calculateAmount(item); 
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
      formData.append(`items[${i}][rate]`, finalArray[i]?.rate);
      formData.append(`items[${i}][discount]`, finalArray[i]?.discountValue);
      formData.append(`items[${i}][tax]`, finalArray[i]?.taxAmount);
      formData.append(`items[${i}][amount]`, finalArray[i]?.amount);
      formData.append(`items[${i}][name]`, finalArray[i]?.name);
      formData.append(
        `items[${i}][discountValue]`,
        finalArray[i]?.discountAmount
      );
    }
    formData.append("vendorId", data.vendorId?.value);
    formData.append("debit_note_id", num);

   
    formData.append("dueDate", dayjs(data?.dueDate).toDate());
    formData.append(
      "purchaseOrderDate",
      dayjs(data?.purchaseOrderDate).toDate()
    );
    // For antd Datepicker
    formData.append("referenceNo", data.referenceNo);
    formData.append("taxableAmount", calculateTaxableSum());
    formData.append("totalDiscount", calculateDiscount());
    formData.append("roundOff", round);
    // formData.append("TotalAmount", calculateFinalTotal());
    formData.append("TotalAmount", totalAmount);
    formData.append("discountType", 143);
    formData.append("discount", 10);
    formData.append("tax", "SGST");
    formData.append("vat", calculateTax().toFixed(2));
    formData.append("notes", data?.notes);
    formData.append("termsAndCondition", data?.termsAndCondition);
    formData.append(
      "bank",
      data?.bank?.value == undefined ? "" : data?.bank?.value
    );
    formData.append("sign_type", data?.sign_type);
    if (data?.sign_type == "eSignature") {
      formData.append("signatureName", data?.signatureName);
      formData.append("signatureImage", signatureData);
    } else {
      formData.append("signatureId", data?.signatureId?.value);
    }
    const incoming = getValues();
    // Check For Zero Products and Zero Product Quantity
    if (finalArray?.length > 0) {
      const checkQuantity = finalArray?.some(
        (item) => item?.alertQuantity === 0
      );
      if (checkQuantity) {
        customerrorToast("Product quantity is required");
      } else {
        const successResponse = await postData(debit_note?.Add, formData);
        if (successResponse) {
          successToast("Debit Notes Added  Successfully");
          navigate("/debit-notes");
        }
      }
    } else {
      customerrorToast(`Products  is required`);
    }
    // Check For Zero Products and Zero Product Quantity
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
  const prepare = (record) => {
    var gotoEdit = {
      rate: record?.purchasePrice,
      discount: record?.discountValue,
      tax: record?.tax?.taxRate,
      id: record?._id,
      record,
    };
    setEditPro(gotoEdit);
    setModalDismiss(true);
  };

  // Calculations

  const calculateDiscount = () => {
    let initialValue = 0;
    let sum = productService.reduce(function (accumulator, curValue) {
      return (
        parseFloat(accumulator) + parseFloat(calculateDiscountAmount(curValue))
      ).toFixed(2);
    }, initialValue);
    return sum;
    // ;
  };

  const calculateDiscountAmount = (record) => {
    var Quantity = productOptionCopy.find(
      (ele) => ele.id == record?._id
    )?.quantity;
    let disQ = Quantity ? parseInt(Quantity) : 0;
    return record?.discountType == 2
      ? `${(
          (disQ * record?.purchasePrice * record?.discountValue) /
          100
        ).toFixed(2)} `
      : disQ === 0
      ? "0.00"
      : record?.discountValue?.toFixed(2);
  };
  const calculateRate = (record) => {
    var Quantity = productOptionCopy.find(
      (ele) => ele.id == record?._id
    )?.quantity;
    let SingleAmount = Quantity ? parseInt(Quantity) : 0;
    return `${(SingleAmount * record?.purchasePrice).toFixed(2)} `;
  };

  const calculateTaxableSum = () => {
    let initialValue = 0;
    let sum = productService?.reduce(function (accumulator, curValue) {
      return parseFloat(accumulator) + parseFloat(calculateRate(curValue));
    }, initialValue);
    let fixed = sum.toFixed(2);
    return fixed;
    // ;
  };
  const calculateSum = () => {
    let initialValue = 0;
    let sum = productService?.reduce(function (accumulator, curValue) {
      return parseFloat(accumulator) + parseFloat(calculateAmount(curValue));
    }, initialValue);
    let fixed = sum.toFixed(2);
    return fixed;
    // ;
  };

  const calculateAmount = (record) => {
    var countFinal = productOptionCopy.find(
      (ele) => ele.id == record?._id
    )?.quantity;

    var countTaxFinal = productServiceCopy.find((ele) => ele._id == record?._id)
      ?.tax?.taxRate;
    // ?.taxRate;

    let discountFinal =
      record?.discountType == 2
        ? `${(
            ((countFinal ? countFinal : 0) *
              record?.purchasePrice *
              record?.discountValue) /
            100
          ).toFixed(2)} `
        : countFinal === 0
        ? "0.00"
        : record?.discountValue?.toFixed(2);

    let SumFinal =
      (countFinal ? countFinal : 0) * record?.purchasePrice - discountFinal;

    let finalTax = (Number(SumFinal) * Number(countTaxFinal)) / 100;
    return (Number(SumFinal) + Number(finalTax)).toFixed(2);
  };

  const calculateTax = () => {
    let initialValue = 0;
    let sum = productService.reduce(function (accumulator, curValue) {
      return parseFloat(accumulator) + parseFloat(calculateTaxAmount(curValue));
    }, initialValue);
    return sum;
    // ;
  };

  const calculateTaxAmount = (record) => {
    var countQuantity = productOptionCopy.find(
      (ele) => ele.id == record?._id
    )?.quantity;
    var countTax = productServiceCopy.find((ele) => ele._id == record?._id)?.tax
      ?.taxRate;
    // ?.taxRate;

    let discountTax =
      record?.discountType == 2
        ? `${(
            ((countQuantity ? countQuantity : 0) *
              record?.purchasePrice *
              record?.discountValue) /
            100
          ).toFixed(2)} `
        : countQuantity === 0
        ? "0.00"
        : record?.discountValue?.toFixed(2);

    let SumTax =
      (countQuantity ? countQuantity : 0) * record?.purchasePrice - discountTax;
    let finalTax = (SumTax * Number(countTax)) / 100;
    return (Number(finalTax) ? finalTax : 0).toFixed(2);
  };

  const calculateFinalTotal = () => {
    let finalTotal =
      parseFloat(calculateSum()) +
      parseFloat(calculateTax()) -
      parseFloat(calculateDiscount());
    // roundOff(round);
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
  const afterModalSubmit = (modalData) => {
    let Stringified = JSON.parse(JSON.stringify(productService));
    let checkIndex = Stringified?.findIndex(
      (item) => item?.id == modalData?.id
    );
    Stringified.splice(checkIndex, 1, modalData?.record);
    checkIndex && setProductService([...Stringified]);
  };

  return (
    <AddpurchaseReturnContext.Provider
      value={{
        taxList,
        setTaxList,
        vendorList,
        setVendorList,
        productService,
        setProductService,
        productServiceCopy,
        setProductServiceCopy,
        productOption,
        setProductOption,
        productOptionCopy,
        setProductOptionCopy,
        onSubmit,
        calculateDiscount,
        calculateDiscountAmount,
        calculateRate,
        calculateSum,
        calculateAmount,
        calculateTax,
        calculateTaxAmount,
        calculateFinalTotal,
        roundOffAction,
        setRoundOffAction,
        round,
        setRound,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        afterModalSubmit,
        roundOff,
        SelectedList,
        handleDelete,
        handleUnitChange,
        calculateTaxableSum,
        rounded,
        setRounded,
        trimmedDataURL,
        setTrimmedDataURL,
        setSignatureData,
        debitSchema,
        setTotalAmount,
        setNum,
        num,
      }}
    >
      {props.children}
    </AddpurchaseReturnContext.Provider>
  );
};

export { AddpurchaseReturnContext, AddpurchaseReturnComponentController };
