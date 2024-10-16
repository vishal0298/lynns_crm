/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../../../common/antd.css";
import * as yup from "yup";
import {
  ApiServiceContext,
  customerrorToast,
  delivery_challans,
  dropdown_api,
  errorToast,
  successToast,
} from "../../../../core/core-index";
import dayjs from "dayjs";
const DeliveryChallanSchema = yup.object().shape({
  customerId: yup.object().required("Choose Any Customer"),
  sign_type: yup.string().typeError("Choose Signature Type"),
  signatureName: yup.string().when("sign_type", (sign_type) => {
    if (sign_type == "eSignature") {
      return yup.string().nullable().required("Enter Signature Name");
    } else {
      return yup.string().notRequired();
    }
  }),
  address: yup
    .string()
    .required("Shipping Address is required")
    .typeError("Choose delivery address")
    .trim(),
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
});
const AddChallanContext = createContext({
  onSubmit: () => {},
});

const AddChallanComponentController = (props) => {
  const [menu, setMenu] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [editPro, setEditPro] = useState({});
  const [modalDismiss, setModalDismiss] = useState(false);
  const [taxList, setTaxList] = useState([]);

  const { getData, postData } = useContext(ApiServiceContext);

  // State
  const [vendorList, setVendorList] = useState([]);
  const [bank, setBank] = useState([]);
  const [productService, setProductService] = useState([]);
  const [productServiceCopy, setProductServiceCopy] = useState([]);

  const [product, setProduct] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [productOption, setProductOption] = useState([]);
  const [productOptionCopy, setProductOptionCopy] = useState([]);
  const [purchaseReturnDelete, setPurchaseReturnDelete] = useState("");
  const [currentCustomer, setCurrentCustomer] = useState({ id: "" });
  const [rounded, setRounded] = useState(0.0);
  const [round, setRound] = useState(false);
  const [roundOffAction, setRoundOffAction] = useState(false);
  const [num, setNum] = useState("");

  const [imageFile, setImageFile] = useState([]);

  const [trimmedDataURL, setTrimmedDataURL] = useState(null);
  const [signatureData, setSignatureData] = useState(null);

  // State

  const navigate = useNavigate();

  useEffect(() => {
    let elements = Array.from(
      document.getElementsByClassName("react-datepicker-wrapper")
    );
    elements.map((element) => element.classList.add("w-100"));
    getVendorList();
    getProductDetails();
    getBankList();
    getTaxList();
  }, []);

  useEffect(() => {
    roundOff(round);
  }, [roundOffAction]);

  // useEffect(() => {
  //   getVendorList();
  //   getProductDetails();
  //   getBankList();
  //   getTaxList();
  // }, []);
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

  const getVendorList = async () => {
    const response = await getData(dropdown_api?.customer_api);
    let vendors = response?.data;
    const vendorOptions = vendors.map((item) => ({
      id: item?._id,
      text: item?.vendor_name,
    }));
    setVendorList(vendorOptions);
  };

  // Product List table
  const getProductDetails = async () => {
    try {
      const productList = await getData(dropdown_api?.product_api);
      var dataList = productList?.data;
      if (dataList?.length > 0) {
        setProductServiceCopy(dataList);
        let datas = [];
        // datas(dataList[0]);
        setProductService(datas);

        // setValue("products", dataList[0]?.id);
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
    var selectList = productServiceCopy?.find((ele) => ele?.id == value);
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
        selectList?.id ? [...productService, selectList] : [...productService]
      );
      setRoundOffAction(!roundOffAction);
    } catch (error) {
      return false;
    }
  };

  const listData = productOption?.map((item, index) => {
    return { label: item.text, value: item.id, quantity: item.quantity };
  });
  // Product List table

  // Delete individual Products
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
  // Delete individual Products

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
      formData.append(`items[${i}][discount]`, finalArray[i]?.discountValue);
      formData.append(`items[${i}][tax]`, finalArray[i]?.taxAmount);
      formData.append(`items[${i}][amount]`, finalArray[i]?.amount);
      formData.append(`items[${i}][name]`, finalArray[i]?.name);
      formData.append(
        `items[${i}][discountValue]`,
        finalArray[i]?.discountAmount
      );
    }
    formData.append("customerId", data.customerId?.value);
    
    formData.append("dueDate", dayjs(data?.dueDate).toDate());
    formData.append(
      "deliveryChallanDate",
      dayjs(data?.deliveryChallanDate).toDate()
    );
    // For antd Datepicker
    formData.append("referenceNo", data.referenceNo);
    formData.append("taxableAmount", calculateTaxableSum());
    formData.append("totalDiscount", calculateDiscount());
    formData.append("roundOff", round);
    formData.append("deliveryChallanNumber", num);
    formData.append("TotalAmount", calculateSum());
    formData.append("discountType", 143);
    formData.append("discount", 10);
    formData.append("tax", "SGST");
    formData.append("vat", calculateTax().toFixed(2));
    formData.append("notes", data?.notes);
    formData.append("termsAndCondition", data?.termsAndCondition);
    formData.append("sign_type", data?.sign_type);
    if (data?.sign_type == "eSignature") {
      formData.append("signatureName", data?.signatureName);
      formData.append("signatureImage", signatureData);
    } else {
      formData.append("signatureId", data?.signatureId?.value);
    }

    formData.append(
      "deliveryAddress[name]",
      currentCustomer.shippingAddress.name
    );
    formData.append(
      "deliveryAddress[addressLine1]",
      currentCustomer.shippingAddress.addressLine1
    );
    formData.append(
      "deliveryAddress[addressLine2]",
      currentCustomer.shippingAddress.addressLine2
    );
    formData.append(
      "deliveryAddress[city]",
      currentCustomer.shippingAddress.city
    );
    formData.append(
      "deliveryAddress[state]",
      currentCustomer.shippingAddress.state
    );
    formData.append(
      "deliveryAddress[pincode]",
      currentCustomer.shippingAddress.pincode
    );
    formData.append(
      "deliveryAddress[country]",
      currentCustomer.shippingAddress.country
    );

    formData.append(
      "bank",
      data?.bank?.value == undefined ? "" : data?.bank?.value
    );
    // const incoming = getValues();

    if (finalArray?.length > 0) {
      const checkQuantity = finalArray?.some(
        (item) => item?.alertQuantity === 0
      );

      if (checkQuantity) {
        customerrorToast("Product quantity is required");
      } else {
        const successResponse = await postData(
          delivery_challans?.Add,
          formData
        );
        if (successResponse.code == 200) {
          successToast("Delivery Challan Added  Successfully");
          navigate("/delivery-challans");
        }else{
          errorToast(successResponse?.data?.message)
        }
      }
    } else {
      customerrorToast(`Products  is required`);
    }

   
  };

  const handleUnitChange = (e, id) => {
    setQuantity(e.target.value);
    let quantId = productOptionCopy.map((ele) => {
      if (ele.id == id) {
        return { ...ele, quantity: parseInt(e.target.value) };
      } else {
        return { ...ele };
      }
    });
    setRoundOffAction(!roundOffAction);

    setProductOptionCopy(quantId);
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
    // ;
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
  const afterModalSubmit = (modalData) => {
    let Stringified = JSON.parse(JSON.stringify(productService));
    let checkIndex = Stringified?.findIndex(
      (item) => item?.id == modalData?.id
    );
    Stringified.splice(checkIndex, 1, modalData?.record);
    checkIndex && setProductService([...Stringified]);
  };

  return (
    <AddChallanContext.Provider
      value={{
        productServiceCopy,
        setProductServiceCopy,
        productService,
        setProductService,
        product,
        bank,
        setBank,
        setProduct,
        taxList,
        setTaxList,
        productOption,
        setProductOption,
        productOptionCopy,
        setProductOptionCopy,
        onSubmit,
        calculateRate,
        calculateDiscountAmount,
        calculateTaxAmount,
        calculateAmount,
        calculateSum,
        calculateDiscount,
        calculateTax,
        setImageFile,
        setEndDate,
        startDate,
        setStartDate,
        endDate,
        round,
        setRound,
        roundOffAction,
        setRoundOffAction,
        calculateTaxableSum,
        trimmedDataURL,
        setTrimmedDataURL,
        setSignatureData,
        DeliveryChallanSchema,
        setCurrentCustomer,
        currentCustomer,
        num,
        setNum,
      }}
    >
      {props.children}
    </AddChallanContext.Provider>
  );
};

export { AddChallanContext, AddChallanComponentController };
