/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  createContext,
} from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import "../../../../common/antd.css";
import FeatherIcon from "feather-icons-react";
import {
  ApiServiceContext,
  customerrorToast,
  productListapi,
  successToast,
  warningToast,
} from "../../../../core/core-index";

import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { editdebitSchema } from "../../../../common/schema";
import { listVendor } from "../../../../constans/apiname";
import moment from "moment";
import { debit_note, dropdown_api } from "../../../../core/end_points/end_points";
import { useDropzone } from "react-dropzone";

const EditPurchaseReturnContext = createContext({
  onSubmit: () => {},
});
const EditPurchaseReturnComponentController = (props) => {
  const [menu, setMenu] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [singlePurchaseReturn, setSinglePurchaseReturn] = useState({});
  const [productService, setProductService] = useState([]);
  const [productServiceCopy, setProductServiceCopy] = useState([]);
  const [taxableAmount, setTaxableAmount] = useState();
  const [vat, setVat] = useState();
  const [totalDiscount, setTotalDiscount] = useState();
  const [totalAmount, setTotalAmount] = useState();
  const [rounded, setRounded] = useState(0.0);
  const [quantity, setQuantity] = useState(1);
  const [purchaseDelete, setPurchaseDelete] = useState();
  const [round, setRound] = useState(false);

  const [roundOffAction, setRoundOffAction] = useState(false);

  const [product, setProduct] = useState([]);

  const [productOption, setProductOption] = useState([]);
  const [productOptionCopy, setProductOptionCopy] = useState([]);

  const [editPro, setEditPro] = useState({});
  const [newEdit, setNewEdit] = useState({});
  const [modalDismiss, setModalDismiss] = useState(false);
  const [taxList, setTaxList] = useState([]);

  const { id } = useParams();
  const location = useLocation();
  const {
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(editdebitSchema),
  });

  const [trimmedDataURL, setTrimmedDataURL] = useState(null);
  const [signatureData, setSignatureData] = useState(null);

  useEffect(() => {
    let effect = productServiceCopy.find((item) => item.id === newEdit.id);
  }, [newEdit]);
  const navigate = useNavigate();
  const { getData, postData, patchData, putData, deleteData } =
    useContext(ApiServiceContext);
  

  // useEffect(() => {
  //   getSinglePurchaseReturn();
  //   getBankList();
  //   getTaxList();
  // }, []);

  const [imgerror, setImgError] = useState("");
  useEffect(() => {
    if (imgerror) {
      warningToast(imgerror);
      setImgError("");
    }
  }, [imgerror]);

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
    const single = await getData(`${debit_note?.View}/${id}`);
    setSinglePurchaseReturn(single?.data);
  };
  const prepareData = (record) => {
    var list = {
      amount: "2000",
      discountType: parseInt(record?.discount),
      discountValue: parseInt(record?.discountValue),
      name: record?.name,
      id: record?.productId,
      alertQuantity: parseInt(record?.quantity),
      purchasePrice: parseInt(record?.rate),
      tax: { taxRate: parseInt(record?.tax) },
    };
    return list;
  };

  const setInitial = () => {
    setValue("purchaseId", singlePurchaseReturn?.debit_note_id);
    setValue("vendorId", singlePurchaseReturn?.vendorId?._id);

    let inputDate = singlePurchaseReturn?.dueDate;
    const dueDate = moment(
      new Date(inputDate),
      "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ"
    ).format("DD-MM-YYYY");

    setValue("purchaseOrderDate", singlePurchaseReturn?.purchaseDate);
    setValue("paymentMode", singlePurchaseReturn?.paymentMode);
    setValue("referenceNo", singlePurchaseReturn?.referenceNo);
    setValue("signatureName", singlePurchaseReturn?.signatureName);
    setValue("dueDate", singlePurchaseReturn?.dueDate);
    setValue("notes", singlePurchaseReturn?.notes);
    setValue("termsAndCondition", singlePurchaseReturn?.termsAndCondition);
    setTaxableAmount(singlePurchaseReturn?.taxableAmount);
    setTotalDiscount(singlePurchaseReturn?.totalDiscount);
    setVat(singlePurchaseReturn?.vat);
    setTotalAmount(singlePurchaseReturn?.TotalAmount);
    setFile(singlePurchaseReturn?.signatureImage);
   
  };
  useEffect(() => {
    var editData = [];
    getQuantity(editData);
   
  }, []);
  const getVendorList = async () => {
    const VendorList = await getData(listVendor);
    const newList = VendorList?.data?.map((item) => {
      return {
        id: item._id,
        text: item.vendor_name,
        value: item._id,
        label: item.vendor_name,
      };
    });

    setProduct(newList);
  };

  const getProductList = async () => {
    const productList = await getData(productListapi);
    var dataList = productList?.data;
    if (dataList?.length > 0) {
      setProductServiceCopy(dataList);
      let datas = [];
      // datas(dataList[0]);
      const results = dataList?.filter(({ id: id1 }) => {
        return singlePurchaseReturn?.items?.some(({ productId: id2 }) => {
          return id2 === id1;
        });
      });

      setProductService(results);
    }
    // setValue("products", dataList[0]?.id);
    getQuantity(dataList);
  };
  const getQuantity = (dataList) => {
    let newProductList = [];
    {
      newProductList = dataList?.map((obj1) => {
        const obj2 = singlePurchaseReturn?.items?.find(
          (obj2) => obj2?.productId === obj1.id
        );
        if (obj2) {
          return {
            id: obj1.id,
            text: obj1.name,
            quantity: parseInt(obj2.quantity),
          };
        } else {
          return { id: obj1.id, text: obj1.name, quantity: 1 };
        }
      });

      // if you want to be more clever...
      let result = dataList.filter(
        (o1) =>
          !singlePurchaseReturn?.items?.some((o2) => o1.id === o2.productId)
      );
      setProductOption(result);
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
  }, [roundOffAction]);
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
  const calculateTotal = () => {
    let total = 0;
    let localtax = 0;
    let localdiscount = 0;
    let totalAmount = productService?.map((item) => {
      item?.purchasePrice &&
        setTaxableAmount((total += Number(item?.purchasePrice)));
      item?.tax?.taxRate && setVat((localtax += Number(item?.tax?.taxRate)));
      item?.discountType &&
        setTotalDiscount((localdiscount += Number(item?.discountType)));
    });
  };
  const handleImageChange = (file) => {
    setValue("signatureImage", file); 
  };
  const [previewImage, setPreviewImage] = useState("");

  const { getRootProps, getInputProps } = useDropzone({
    maxLength: 4,
    onDrop: (acceptedFile) => {
      // eslint-disable-next-line no-undef
      getBase64(acceptedFile?.[0]).then((result) => {
        acceptedFile["base64"] = result;
        setPreviewImage(acceptedFile.base64);
      });
    },
  });
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
      formData.append(`items[${i}][rate]`, finalArray[i]?.purchasePrice);
      formData.append(`items[${i}][discount]`, finalArray[i]?.discountAmount);
      formData.append(`items[${i}][tax]`, finalArray[i]?.taxAmount);
      formData.append(`items[${i}][amount]`, finalArray[i]?.amount);
      formData.append(`items[${i}][name]`, finalArray[i]?.name);
    }
    formData.append("_id", id);
    formData.append(
      "vendorId",
      data.vendorId?.id ? data.vendorId?.id : data.vendorId
    );
    formData.append("debit_note_id", data.debit_note_id);
    formData.append("purchaseOrderDate", startDate);
    formData.append("dueDate", endDate);
    formData.append("referenceNo", data.referenceNo);
    formData.append("discountType", 143);
    formData.append("discount", 10);
    formData.append("tax", "SGST");
    formData.append("taxableAmount", calculateSum());
    formData.append("totalDiscount", calculateDiscount());
    formData.append("vat", calculateTax().toFixed(2));
    formData.append("roundOff", round);
    formData.append("TotalAmount", calculateFinalTotal());
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
          `${debit_note?.Update}/${id}`,
          formData
        );
        if (successResponse) {
          successToast("Debit Notes Updated  Successfully");
          navigate("/debit-notes");
        }
      }
    } else {
      customerrorToast(`Product is required`);
    }
  };

const onModalSubmit = (data) => {};
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

  const handleImageError = (event) => {
    // ;
    event.target.style.display = "none";

    event.target.src = "";
  };
  const columns = [
    {
      title: "Product/Service",
      dataIndex: "name",
      // sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Quantity",
      dataIndex: "alertQuantity",
      // sorter: (a, b) => a.quantity.length - b.quantity.length,
      render: (text, record) => {
        return (
          <input
            type="number"
            className="form-control"
            value={
              productOptionCopy.find((ele) => ele.id == record?.id)?.quantity
            }
            onChange={(e) => handleUnitChange(e, record?.id)}
          />
        );
      },
    },
    {
      title: "Unit",
      dataIndex: "units",
      // sorter: (a, b) => a.units.length - b.units.length,
      render: (record) => <span>{record?.name}</span>,
    },
    {
      title: "Rate",
      // dataIndex: "purchasePrice",
      key: "purchasePrice",
      // sorter: (a, b) => a.purchasePrice.length - b.purchasePrice.length,
      render: (record) => {
        return <span>{calculateRate(record)}</span>;
      },
    },
    {
      title: "Discount",
      // dataIndex: "discountValue",
      key: "discountValue",
      // sorter: (a, b) => a.discountType.length - b.discountType.length,
      render: (record) => {
        return <span>{calculateDiscountAmount(record)}</span>;
      },
    },
    {
      title: "Tax",
      // dataIndex: "tax",
      key: "tax",
      // sorter: (a, b) => a.tax.length - b.tax.length,
      render: (record) => {
        return <span>{calculateTaxAmount(record)}</span>;
      },
    },
    {
      title: "Amount",
      key: "Amount",
      render: (text, record) => {
        return <span>{calculateAmount(record)}</span>;
      },
    },
    {
      title: "Action",
      dataIndex: "Action",
      render: (text, record) => (
        <>
          <div className="d-flex align-items-center">
            <Link
              to="#"
              className="btn-action-icon me-2"
              data-bs-toggle="modal"
              data-bs-target="#add_discount"
              onClick={() => {
                prepare(record);
              }}
            >
              <span>
                <i className="fe fe-edit">
                  <FeatherIcon icon="edit" />
                </i>
              </span>
            </Link>
            <Link
              to="#"
              className="btn-action-icon"
              data-bs-toggle="modal"
              data-bs-target="#delete_discount"
              onClick={() => setPurchaseDelete(record.id)}
            >
              <span>
                <i className="fe fe-trash-2">
                  <FeatherIcon icon="trash-2" />
                </i>
              </span>
            </Link>
          </div>
        </>
      ),
      // sorter: (a, b) => a.Action.length - b.Action.length,
    },
  ];

  const calculateRate = (record) => {
    var discountQuantity = productOptionCopy.find(
      (ele) => ele.id == record?._id
    )?.quantity;
    let disQ = discountQuantity ? parseInt(discountQuantity) : 0;
    return `${(disQ * record?.purchasePrice).toFixed(2)} `;
  };

  const calculateDiscountAmount = (record) => {
    var discountQuantity = productOptionCopy.find(
      (ele) => ele.id == record?._id
    )?.quantity;
    let disQ = discountQuantity ? parseInt(discountQuantity) : 0;
    return record?.discountType == 2
      ? `${(
          (disQ * record?.purchasePrice * record?.discountValue) /
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
    // ;
  };
  const handleDelete = (id) => {
    let deleted = productService.filter((ele) => ele.id !== id);
    let addDropDown = productService?.find((ele) => ele.id == id);
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

  useEffect(() => {
    let elements = Array.from(
      document.getElementsByClassName("react-datepicker-wrapper")
    );
    elements.map((element) => element.classList.add("w-100"));
    getSinglePurchaseReturn();
    getBankList();
    getTaxList();
  }, []);

  const calculateFinalTotal = () => {
    let finalTotal =
      parseFloat(calculateSum()) +
      parseFloat(calculateTax()) -
      parseFloat(calculateDiscount());
    // .toFixed(2), "CalculateSum");
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

  const [currency, setCurrency] = useState([
    { id: 1, text: "Select Currency" },
    { id: 2, text: "US dollar" },
    { id: 3, text: "Euro" },
    { id: 4, text: "Pound sterling" },
    { id: 5, text: "Swiss franc" },
  ]);

  const [percentage, setPercentage] = useState([
    { id: 1, text: "Percentage(%)" },
    { id: 2, text: "Fixed" },
  ]);

  const [tax, setTax] = useState([
    { id: 1, text: "No Tax" },
    { id: 2, text: "IVA - (21%)" },
    { id: 3, text: "IRPF - (-15%)" },
    { id: 4, text: "PDV - (20%)" },
  ]);

  const [bank, setBank] = useState([
    { id: 1, text: "Select Bank" },
    { id: 2, text: "SBI" },
    { id: 3, text: "IOB" },
    { id: 4, text: "Canara" },
  ]);
  const addlist = () => {};

  const spanRef = useRef(null);
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
    <EditPurchaseReturnContext.Provider
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
        calculateTotal,
        calculateRate,
        calculateDiscountAmount,
        calculateTaxAmount,
        calculateAmount,
        calculateSum,
        calculateDiscount,
        calculateTax,
        singlePurchaseReturn,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        setImgError,
        imgerror,
        round,
        setRound,
        roundOffAction,
        setRoundOffAction,
        trimmedDataURL,
        setTrimmedDataURL,
        setSignatureData,
      }}
    >
      {props.children}
    </EditPurchaseReturnContext.Provider>
  );
};

export { EditPurchaseReturnContext, EditPurchaseReturnComponentController };
