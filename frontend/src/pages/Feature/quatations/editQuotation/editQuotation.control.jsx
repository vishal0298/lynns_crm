/* eslint-disable react/prop-types */
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../../../common/antd.css";
import {
  ApiServiceContext,
  customerrorToast,
  dropdown_api,
  errorToast,
  quotation,
  successToast,
  warningToast,
} from "../../../../core/core-index";
import { useImageUploader } from "../../hooks/useImageUploader";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const quotationSchema = yup.object().shape({
  customerId: yup.object().required("Choose Any Customer"),
  sign_type: yup.string().typeError("Choose Signature Type"),
  signatureName: yup.string().when("sign_type", (sign_type) => {
    if (sign_type == "eSignature") {
      return yup.string().nullable().required("Enter Signature Name");
    } else {
      return yup.string().notRequired();
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
      return yup.string().notRequired();
    }
  }),
});

const EditQuotationContext = createContext({
  quotationSchema: quotationSchema,
  submiteditPOForm: () => {},
});

const EditQuotationsComponentController = (props) => {
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
  const [GST, setGST] = useState(true);
  const [files, setFile] = useState(null);
  const [imgerror, setImgError] = useState("");
  const [trimmedDataURL, setTrimmedDataURL] = useState(null);
  const [signatureData, setSignatureData] = useState(null);
  const { id } = useParams();

  const { setValue, getValues } = useForm({
    resolver: yupResolver(),
  });

  useEffect(() => {
    if (imgerror) {
      warningToast(imgerror);
      setImgError("");
    }
  }, [imgerror]);

  useEffect(() => {
    var editData = [];
    getQuantity(editData);
    let elements = Array.from(
      document.getElementsByClassName("react-datepicker-wrapper")
    );
    elements.map((element) => element.classList.add("w-100"));
  }, []);

  useEffect(() => {
    let effect = productServiceCopy.find((item) => item.id === newEdit.id);
  }, [newEdit]);
  const navigate = useNavigate();
  const { getData, putData } = useContext(ApiServiceContext);


  const [product, setProduct] = useState([]);

  const [productOption, setProductOption] = useState([]);
  const [percentage, setPercentage] = useState([]);
  const [tax, setTax] = useState([]);
  const [gstMethod, setGstMethod] = useState([]);

  const [bank, setBank] = useState([]);

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
    const single = await getData(`${quotation?.View}/${id}`);
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
      let datas = [];
      const results = dataList?.filter(({ _id: id1 }) => {
        return singlePurchaseReturn?.items?.some(({ productId: id2 }) => {
          return id2 === id1;
        });
      });

      setProductService(results);
    }
    getQuantity(dataList);
  };

  useEffect(() => {
    getListcustomer();
    getSinglePurchaseReturn();
    getBankList();
    getTaxList();
  }, []);

  useEffect(() => {
    getProductList();
  }, [singlePurchaseReturn]);

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

  const calculateTotal = () => {
    let total = 0;
    let localtax = 0;
    let localdiscount = 0;
    let totalAmount = productService?.map((item) => {
      item?.sellingPrice &&
        setTaxableAmount((total += Number(item?.sellingPrice)));
      item?.tax?.taxRate && setVat((localtax += Number(item?.tax?.taxRate)));
      item?.discountType &&
        setTotalDiscount((localdiscount += Number(item?.discountType)));
    });
  };

  const handleImageChange = (file) => {
    setValue("signatureImage", file); 
  };

  const incoming = getValues();

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
      formData.append(`items[${i}][rate]`, finalArray[i]?.sellingPrice);
      formData.append(`items[${i}][discount]`, finalArray[i]?.discountAmount);
      formData.append(`items[${i}][tax]`, finalArray[i]?.taxAmount);
      formData.append(`items[${i}][amount]`, finalArray[i]?.amount);
    }
    formData.append("_id", id);
    formData.append("customerId", data?.customerId?.value);
    formData.append("quotation_date", startDate);
    formData.append("due_date", endDate);
    formData.append("quotation_id", data.quotationId);
    formData.append("reference_no", data?.reference_no);
    formData.append("discountType", 143);
    formData.append("discount", 10);
    formData.append("tax", "SGST");
    formData.append("taxableAmount", calculateTaxableSum());
    formData.append("totalDiscount", calculateDiscount());
    formData.append("vat", calculateTax().toFixed(2));
    formData.append("roundOff", round);
    formData.append("TotalAmount", calculateSum());
    formData.append("bank", data?.bank?.value ? data?.bank?.value : data?.bank);
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
          `${quotation?.Update}/${id}`,
          formData
        );
        if (successResponse.code == 200) {
          successToast("Quotation updated successfully");
          navigate("/quotations");
        }else{
          errorToast(successResponse?.data?.message)
        }
      }
    } else {
      customerrorToast(`Product is required`);
    }
  };

  const onModalSubmit = () => {};
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
  const calculateTaxableSum = () => {
    let initialValue = 0;
    let sum = productService?.reduce(function (accumulator, curValue) {
      return parseFloat(accumulator) + parseFloat(calculateRate(curValue));
    }, initialValue);
    let fixed = sum.toFixed(2);
    return fixed;
    // ;
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
    return (Number(finalTax) ? (GST ? finalTax : 0) : 0).toFixed(2);
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
    return (Number(SumFinal) + (GST ? Number(finalTax) : 0)).toFixed(2);
  };

  const calculateSum = () => {
    let initialValue = 0;
    let sum = productService.reduce(function (accumulator, curValue) {
      return parseFloat(accumulator) + parseFloat(calculateAmount(curValue));
    }, initialValue);
    let fixed = sum.toFixed(2);
    return fixed;
    // ;
  };
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

  const spanRef = useRef(null);

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
    } catch (error) {
      /* empty */
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

  const listData = productOption?.map((item) => {
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

  const handleImageError = (event) => {
    event.target.style.display = "none";
  };

  return (
    <EditQuotationContext.Provider
      value={{
        product,
        productOption,
        percentage,
        tax,
        gstMethod,
        bank,
        getTaxList,
        getSinglePurchaseReturn,
        getListcustomer,
        getProductList,
        getQuantity,
        getBankList,
        handleUnitChange,
        calculateTotal,
        handleImageChange,
        onSubmit,
        incoming,
        onModalSubmit,
        calculateRate,
        calculateDiscountAmount,
        calculateTaxAmount,
        calculateAmount,
        calculateSum,
        calculateDiscount,
        calculateTax,
        handleDelete,
        calculateFinalTotal,
        roundOff,
        SelectedList,
        calculateValue,
        listData,
        afterModalSubmit,
        handleImageError,
        spanRef,
        quotationSchema,
        singlePurchaseReturn,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
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
        GST,
        setGST,
        files,
        setFile,
        imgerror,
        setImgError,
        prepare,
        calculateTaxableSum,
        trimmedDataURL,
        setTrimmedDataURL,
        setSignatureData,
      }}
    >
      {props.children}
    </EditQuotationContext.Provider>
  );
};

export { EditQuotationContext, EditQuotationsComponentController };
