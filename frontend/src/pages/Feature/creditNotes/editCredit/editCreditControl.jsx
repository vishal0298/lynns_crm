/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useEffect, useState } from "react";
import * as yup from "yup";
import { useParams, useNavigate } from "react-router-dom";
import { ApiServiceContext } from "../../../../core/API/api-service";
import {
  successToast,
  customerrorToast,
  credit_note,
  dropdown_api,
} from "../../../../core/core-index";

import { useImageUploader } from "../../hooks/useImageUploader";
import {creditNoteEditSchema} from './editCreditschema'

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

const EditCreditNotesContext = createContext({
  creditNoteEditSchema: creditNoteEditSchema,
  dicountEditForm: dicountEditForm,
  onSubmit: (data) => {},
});

const EditCreditComponentController = (props) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [singlePurchaseReturn, setSinglePurchaseReturn] = useState({});
  const [payment, setPayment] = useState([{ id: 1, text: "Cash" }]);
  const [productService, setProductService] = useState([]);
  const [productServiceCopy, setProductServiceCopy] = useState([]);
  const [taxableAmount, setTaxableAmount] = useState();
  const [vat, setVat] = useState();
  const [totalDiscount, setTotalDiscount] = useState();
  const [totalAmount, setTotalAmount] = useState();
  const [rounded, setRounded] = useState(0.0);
  const [fromEdit, setFromEdit] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [amountColumn, setAmountColumn] = useState(0);
  const [purchaseDelete, setPurchaseDelete] = useState();
  const [round, setRound] = useState(false);
  const [bankModalDismiss, setBankModalDismiss] = useState(false);
  const [roundOffAction, setRoundOffAction] = useState(false);
  const { selectedImage, handleImageUpload } = useImageUploader();
  const [productOptionCopy, setProductOptionCopy] = useState([]);
  const [editPro, setEditPro] = useState({});
  const [newEdit, setNewEdit] = useState({});
  const [modalDismiss, setModalDismiss] = useState(false);
  const [taxList, setTaxList] = useState([]);
  const [trimmedDataURL, setTrimmedDataURL] = useState(null);
  const [signatureData, setSignatureData] = useState(null);
  const [productOption, setProductOption] = useState([]);
  const [bank, setBank] = useState([]);
  const [product, setProduct] = useState([]);
  const { id } = useParams();

  const navigate = useNavigate();
  const { getData, putData } = useContext(ApiServiceContext);

  useEffect(() => {
    var editData = [];
    getQuantity(editData);
    getListcustomer();
    getSinglePurchaseReturn();
    getBankList();
    getTaxList();
    getProductList();
  }, []);

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

  const getSinglePurchaseReturn = async () => {
    const single = await getData(`${credit_note?.View}/${id}`);
    setSinglePurchaseReturn(single?.data);
  };

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

  // useEffect(() => {
  //   var editData = [];
  //   getQuantity(editData);
  // }, []);

  const getProductList = async () => {
    const productList = await getData(dropdown_api?.product_api);

    var dataList = productList?.data;

    if (dataList?.length > 0) {
      setProductServiceCopy(dataList);
      const results = dataList?.filter(({ _id: id1 }) => {
        return singlePurchaseReturn?.items?.some(({ productId: id2 }) => {
          return id2 === id1;
        });
      });

      setProductService(results);
    }
    getQuantity(dataList);
  };

  const getQuantity = (dataList) => {
    let newProductList = [];
    {
      newProductList = dataList?.map((obj1) => {
        const obj2 = singlePurchaseReturn?.items?.find(
          (obj2) => obj2?.productId === obj1._id
        );
        if (obj2) {
          return {
            id: obj1._id,
            text: obj1.name,
            quantity: parseInt(obj2.quantity),
          };
        } else {
          return { id: obj1._id, text: obj1.name, quantity: 1 };
        }
      });

      // if you want to be more clever...
      let result = dataList.filter(
        (o1) =>
          !singlePurchaseReturn?.items?.some((o2) => o1._id === o2.productId)
      );

      let resultForSelect = result?.map((ele) => ({
        id: ele?._id,
        text: ele?.name,
        quantity: 1,
      }));
      setProductOption(resultForSelect);
    }

    setProductOptionCopy(newProductList);
  };

  const getBankList = async () => {
    const bankList = await getData(dropdown_api?.bank_api);

    const newBankList = bankList?.data?.map((item) => {
      return { id: item.userId, text: item.name };
    });

    setBank(newBankList);
  };

  useEffect(() => {
    roundOff(round);
  }, [roundOffAction, productService]);

  const handleUnitChange = (e, id) => {
    setQuantity(e.target.value.trim() ? e.target.value : 0);
    let quantId = productOptionCopy.map((ele) => {
      if (ele.id == id) {
        return {
          ...ele,
          quantity: e.target.value?.trim() ? parseInt(e.target.value) : 0,
        };
      } else {
        return { ...ele };
      }
    });
    setRoundOffAction(!roundOffAction);

    setProductOptionCopy(quantId);
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
      let finished = productOptionCopy.map((ele) => {
        if (item._id === ele.id) {
          const rate = calculateRate(item);
          const discountAmount = calculateDiscountAmount(item); // Calculate the discount amount for each row
          const taxAmount = calculateTaxAmount(item);
          const amount = calculateAmount(item); // Calculate the amount for each row
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
      formData.append(`items[${i}][discount]`, finalArray[i]?.discountAmount);
      formData.append(`items[${i}][tax]`, finalArray[i]?.taxAmount);
      formData.append(`items[${i}][amount]`, finalArray[i]?.amount);
    }
    formData.append("_id", id);
    formData.append(
      "customerId",
      data?.customerId?.value ? data?.customerId?.value : data?.customerId
    );
    formData.append("credit_note_id", data.credit_note_id);
    formData.append("credit_note_date", startDate);
    formData.append("due_date", endDate);
    formData.append("reference_no", data?.reference_no);
    formData.append("discountType", 143);
    formData.append("discount", 10);
    formData.append("tax", "SGST");
    formData.append("taxableAmount", calculateTaxableSum());
    formData.append("totalDiscount", calculateDiscount());
    formData.append("vat", calculateTax().toFixed(2));
    formData.append("roundOff", round);
    // formData.append("roundOff", data?.roundOff?.value);
    formData.append("TotalAmount", calculateSum());
    formData.append("bank", data?.bank?.value ? data?.bank?.value : "");
    formData.append("notes", data?.notes);
    formData.append("termsAndCondition", data?.termsAndCondition);
    formData.append("sign_type", data?.sign_type);
    if (data?.sign_type == "eSignature") {
      formData.append("signatureName", data?.signatureName);
      formData.append("signatureImage", signatureData);
    } else {
      formData.append("signatureId", data?.signatureId?.value);
    }

    if (finalArray?.length > 0) {
      const checkQuantity = finalArray?.some(
        (item) => item?.alertQuantity === 0
      );
      if (checkQuantity) {
        customerrorToast("Product quantity is required");
      } else {
        const successResponse = await putData(
          `${credit_note?.Update}/${id}`,
          formData
        );

        if (successResponse) {
          successToast("Sales Return Updated successfully");
          navigate("/sales-return");
        }
      }
    } else {
      customerrorToast(`Product is required`);
    }
  };

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

  const calculateRate = (record) => {
    var discountQuantity = productOptionCopy.find(
      (ele) => ele.id == record?._id
    )?.quantity;
    return `${(discountQuantity * record?.sellingPrice).toFixed(2)} `;
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

  const calculateSum = () => {
    let initialValue = 0;
    let sum = productService.reduce(function (accumulator, curValue) {
      return parseFloat(accumulator) + parseFloat(calculateAmount(curValue));
    }, initialValue);
    let fixed = sum.toFixed(2);
    return fixed;
  };
  const calculateTaxableSum = () => {
    let initialValue = 0;
    let sum = productService.reduce(function (accumulator, curValue) {
      return parseFloat(accumulator) + parseFloat(calculateRate(curValue));
    }, initialValue);
    let fixed = sum.toFixed(2);
    return fixed;
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
  const calculateTax = () => {
    let initialValue = 0;
    let sum = productService.reduce(function (accumulator, curValue) {
      return parseFloat(accumulator) + parseFloat(calculateTaxAmount(curValue));
    }, initialValue);
    return sum;
  };
  const handleDelete = (id) => {
    let deleted = productService.filter((ele) => ele._id !== id);
    let addDropDown = productService?.find((ele) => ele._id == id);
    var copy = productOptionCopy.map((ele) => {
      if (ele?.id == addDropDown.id) {
        return { ...ele, quantity: 1 };
      } else {
        return { ...ele };
      }
    });

    setProductOptionCopy(copy);

    setProductOption([...productOption, addDropDown]);
    setRoundOffAction(!roundOffAction);
    setProductService(deleted);
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

  const SelectedList = (value) => {
    var selectList = productServiceCopy?.find((ele) => ele?._id === value);
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
    } catch (error) {
      return false;
    }
  };

  const calculateValue = (input) => {
    const inputValue = String(input);
    if (inputValue.endsWith("%")) {
      const numericValue = parseFloat(inputValue);
      if (!isNaN(numericValue)) {
        const percentage = (
          Number(taxableAmount) +
          Number(vat) -
          (Number(taxableAmount) * numericValue) / 100
        ).toFixed(2);
        setTotalAmount(percentage);
        return `Percentage: ${percentage}`;
      }
    } else {
      const numericValue = parseFloat(input);
      if (!isNaN(numericValue)) {
        const result = (
          Number(taxableAmount) +
          Number(vat) -
          Number(taxableAmount) -
          numericValue
        ).toFixed(2);
        setTotalAmount(result);

        return `Result: ${result}`;
      }
    }

    return "Invalid input";
  };

  useEffect(() => {
    calculateValue(totalDiscount);
  }, [totalDiscount]);

  const listData = productOption?.map((item, index) => {
    return { label: item.text, value: item.id, quantity: item.quantity };
  });

  const afterModalSubmit = (modalData) => {
    let Stringified = JSON.parse(JSON.stringify(productService));
    let checkIndex = Stringified?.findIndex(
      (item) => item?.id == modalData?.id
    );

    Stringified.splice(checkIndex, 1, modalData?.record);

    checkIndex && setProductService([...Stringified]);
  };

  return (
    <EditCreditNotesContext.Provider
      value={{
        creditNoteEditSchema,
        singlePurchaseReturn,
        setSinglePurchaseReturn,
        payment,
        setPayment,
        productService,
        setProductService,
        productServiceCopy,
        setProductServiceCopy,
        taxableAmount,
        setTaxableAmount,
        vat,
        setVat,
        totalDiscount,
        setTotalDiscount,
        totalAmount,
        setTotalAmount,
        rounded,
        setRounded,
        fromEdit,
        setFromEdit,
        quantity,
        setQuantity,
        amountColumn,
        setAmountColumn,
        purchaseDelete,
        setPurchaseDelete,
        round,
        setRound,
        bankModalDismiss,
        setBankModalDismiss,
        roundOffAction,
        setRoundOffAction,
        selectedImage,
        handleImageUpload,
        productOptionCopy,
        setProductOptionCopy,
        editPro,
        setEditPro,
        newEdit,
        setNewEdit,
        modalDismiss,
        setModalDismiss,
        taxList,
        setTaxList,
        onSubmit,
        calculateSum,
        calculateDiscount,
        calculateTax,
        afterModalSubmit,
        listData,
        productOption,
        setProductOption,
        bank,
        setBank,
        product,
        setProduct,
        calculateRate,
        calculateDiscountAmount,
        calculateTaxAmount,
        calculateAmount,
        getProductList,
        prepare,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        handleDelete,
        roundOff,
        SelectedList,
        handleUnitChange,
        calculateTaxableSum,
        trimmedDataURL,
        setTrimmedDataURL,
        setSignatureData,
      }}
    >
      {props.children}
    </EditCreditNotesContext.Provider>
  );
};

export { EditCreditNotesContext, EditCreditComponentController };
