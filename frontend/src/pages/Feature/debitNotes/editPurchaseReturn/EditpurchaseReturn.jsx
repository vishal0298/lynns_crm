/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import "../../../../common/antd.css";
import { Popconfirm, Table } from "antd";
import FeatherIcon from "feather-icons-react";
import { ApiServiceContext, warningToast } from "../../../../core/core-index";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { editdebitSchema } from "../../../../common/schema";
import { listVendor } from "../../../../constans/apiname";
import moment from "moment";
import { BankSettings, dropdown_api } from "../../../../core/end_points/end_points";
import { useDropzone } from "react-dropzone";
import EditProductForm from "../../modalForm/EditProductForm";
import AddBankForm from "../../modalForm/AddBankForm";
import SelectDropDown from "../../react-Select/SelectDropDown";
import useFilePreview from "../../hooks/useFilePreview";
import { EditPurchaseReturnContext } from "./EditpurchaseReturn.control";
import { commonDatacontext } from "../../../../core/commonData";
import { handleNumberRestriction } from "../../../../constans/globals";
import dayjs from "dayjs";
import DatePickerComponent from "../../datePicker/DatePicker";
import SignaturePadComponent from "../../../../common/SignaturePadComponent";
import { handleKeyPress } from "../../../../common/helper";

const EditPurchaseReturn = () => {
  const [purchaseReturnDelete, setPurchaseReturnDelete] = useState("");
  const [taxableAmount, setTaxableAmount] = useState();
  const [vat, setVat] = useState();
  const [totalDiscount, setTotalDiscount] = useState();
  const [totalAmount, setTotalAmount] = useState();
  const [rounded, setRounded] = useState(0.0);
  const [quantity, setQuantity] = useState(1);
  const [purchaseDelete, setPurchaseDelete] = useState();
  const [bankModalDismiss, setBankModalDismiss] = useState(false);
  const [refer, setRefer] = useState(false);

  const [product, setProduct] = useState([]);

  const [editPro, setEditPro] = useState({});
  const [newEdit, setNewEdit] = useState({});
  const [modalDismiss, setModalDismiss] = useState(false);
  const {
    handleSubmit,
    control,
    setValue,
    clearErrors,

    trigger,
    register,
    getValues,

    watch,
    resetField,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(editdebitSchema),
   
  });

  const {
    productServiceCopy,
    setProductServiceCopy,
    productService,
    setProductService,
    taxList,
    productOption,
    setProductOption,
    productOptionCopy,
    setProductOptionCopy,
    setBank,
    onSubmit,
    calculateRate,
    calculateDiscountAmount,
    calculateTaxAmount,
    calculateAmount,
    calculateSum,
    calculateDiscount,
    calculateTax,
    singlePurchaseReturn,
    setStartDate,
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
  } = useContext(EditPurchaseReturnContext);

  const { currencyData } = useContext(commonDatacontext);

  useEffect(() => {
    let effect = productServiceCopy.find((item) => item.id === newEdit.id);
  }, [newEdit]);
  const navigate = useNavigate();
  const { getData, postData, patchData, putData, deleteData } =
    useContext(ApiServiceContext);

  const [files, setFile] = useState(null);
  const [selectedSign, setselectedSign] = useState("/");

  const file = watch("signatureImage");
  const [filePreview] = useFilePreview(file, setImgError);

  useEffect(() => {
    if (imgerror) {
      warningToast(imgerror);
      resetField("signatureImage");
      setImgError("");
    }
  }, [imgerror]);

  useEffect(() => {
    if (filePreview) setFile(filePreview);
  }, [filePreview]);

  useEffect(() => {
    if (singlePurchaseReturn?.id) {
      getProductList();
      setInitial();
    }
  }, [singlePurchaseReturn]);

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
    setValue("debit_note_id", singlePurchaseReturn?.debit_note_id);
    setValue("vendorId", singlePurchaseReturn?.vendorId?._id);

    setStartDate(dayjs(singlePurchaseReturn?.purchaseOrderDate));
    setEndDate(dayjs(singlePurchaseReturn?.dueDate));

    setValue(
      "purchaseOrderDate",
      moment(singlePurchaseReturn?.purchaseOrderDate)
    );
    setValue("paymentMode", singlePurchaseReturn?.paymentMode);
    setValue("referenceNo", singlePurchaseReturn?.referenceNo);
    setValue("signatureName", singlePurchaseReturn?.signatureName);
    // setValue("signatureImage", singlePurchaseReturn?.signatureImage);
    setValue("dueDate", moment(singlePurchaseReturn?.dueDate));
    setValue("notes", singlePurchaseReturn?.notes);
    // setValue("bank", singlePurchaseReturn?.bank);
    setValue("termsAndCondition", singlePurchaseReturn?.termsAndCondition);
    setTaxableAmount(singlePurchaseReturn?.taxableAmount);
    setTotalDiscount(singlePurchaseReturn?.totalDiscount);
    setVat(singlePurchaseReturn?.vat);
    setRound(singlePurchaseReturn?.roundOff);
    setTotalAmount(singlePurchaseReturn?.TotalAmount);
    setFile(singlePurchaseReturn?.signatureImage);
    // setId(singlePurchaseReturn?._id);
    // setProductService(editRecord?.items);
  };

  
  // For antd Date picker

  useEffect(() => {
    var editData = [];
    getQuantity(editData);
    // setProductService(editData);
    // setProductServiceCopy(editData);

    // getSinglePurchase(editRecord?._id);
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
    const productList = await getData(dropdown_api?.product_api);
    var dataList = productList?.data;
    if (dataList?.length > 0) {
      setProductServiceCopy(dataList);
      let datas = [];
      // datas(dataList[0]);
      const results = dataList?.filter(({ _id: id1 }) => {
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
    const bankList = await getData(BankSettings?.List);
    const newBankList = bankList?.data?.map((item) => {
      return { id: item.userId, text: item.name };
    });

    setBank(newBankList);
  };
  // useEffect(() => {
  //   // calculateTotal();
  // }, [productService]);
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
  const handleImageChange = (file) => {
    setValue("signatureImage", file); // Assuming you're using setValue from react-hook-form to update the form data
  };
  const [previewImage, setPreviewImage] = useState("");

  const { getRootProps, getInputProps } = useDropzone({
    maxLength: 4,
    onDrop: (acceptedFile) => {
      // setValue("images", acceptedFile)
      // setFileImage(acceptedFile);
      // eslint-disable-next-line no-undef
      getBase64(acceptedFile?.[0]).then((result) => {
        acceptedFile["base64"] = result;
        setPreviewImage(acceptedFile.base64);
      });
    },
  });
  const incoming = getValues();

  const onModalSubmit = () => {};
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
            type="text"
            maxLength={10}
            onKeyPress={handleNumberRestriction}
            className="form-control"
            value={
              productOptionCopy.find((ele) => ele.id == record?._id)?.quantity
            }
            onChange={(e) => handleUnitChange(e, record?._id)}
          />
        );
      },
    },
    {
      title: "Unit",
      dataIndex: "units",
      render: (record) => <span>{record?.name}</span>,
    },
    {
      title: "Rate",
      // dataIndex: "purchasePrice",
      key: "purchasePrice",
      render: (record) => {
        return (
          <span>
            {currencyData ? currencyData : "$"}
            {calculateRate(record)}
          </span>
        );
      },
    },
    {
      title: "Discount",
      // dataIndex: "discountValue",
      key: "discountValue",
      render: (record) => {
        return (
          <span>
            {currencyData ? currencyData : "$"}
            {calculateDiscountAmount(record)}
          </span>
        );
      },
    },
    {
      title: "Tax",
      // dataIndex: "tax",
      key: "tax",
      render: (record) => {
        return (
          <span>
            {currencyData ? currencyData : "$"}
            {calculateTaxAmount(record)}
          </span>
        );
      },
    },
    {
      title: "Amount",
      key: "Amount",
      render: (text, record) => {
        return (
          <span>
            {currencyData ? currencyData : "$"}
            {calculateAmount(record)}
          </span>
        );
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
              // data-bs-toggle="modal"
              // data-bs-target="#delete_discount"
              // onClick={() => setPurchaseDelete(record.id)}
            >
              <Popconfirm
                title="Sure you want to delete?"
                onConfirm={() => handleDelete(record._id)}
              >
                <span>
                  <i className="fe fe-trash-2">
                    <FeatherIcon icon="trash-2" />
                  </i>
                </span>
              </Popconfirm>
            </Link>
          </div>
        </>
      ),
      // sorter: (a, b) => a.Action.length - b.Action.length,
    },
  ];

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

  useEffect(() => {
    let elements = Array.from(
      document.getElementsByClassName("react-datepicker-wrapper")
    );
    elements.map((element) => element.classList.add("w-100"));
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

  const addlist = () => {};

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

  const disablePastDate = (current) => {
    // Disable dates that are before today
    return current && current < dayjs().startOf("day");
  };

  const disableFutureDate = (current) => {
    // Disable dates that are after today
    return current && current > dayjs().endOf("day");
  };
  //  For antd Datepicker

  const TotalValue = Number(
    round ? Math.round(calculateSum()) : calculateSum()
  ).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  useEffect(() => {
    setTotalAmount(round ? Math.round(calculateSum()) : calculateSum());
  }, [TotalValue]);

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="content-page-header">
            <h5>Edit Purchase Return</h5>
          </div>
          <div className="row">
            <div className="col-md-12">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="card-body">
                  <div className="form-group-item border-0 mb-0">
                    <div className="row align-item-center">
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group">
                          <label>Purchase Return Id</label>
                          <Controller
                            name="debit_note_id"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Enter Purchases Id"
                                  value={value}
                                  disabled={true}
                                  onChange={(val) => {
                                    onChange(val);
                                    trigger("debit_note_id");
                                  }}
                                />
                                {errors.debit_note_id && (
                                  <p className="text-danger">
                                    {errors.debit_note_id.message}
                                  </p>
                                )}
                              </>
                            )}
                            defaultValue=""
                          />
                        </div>
                      </div>

                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group">
                          <label>
                            Select Vendor<span className="text-danger"> *</span>
                          </label>
                          <ul className="form-group-plus css-equal-heights">
                            <li>
                              <Controller
                                name="vendorId"
                                control={control}
                                render={({
                                  field: { value, onChange, ref },
                                }) => (
                                  <>
                                    <SelectDropDown
                                      setValue={setValue}
                                      name={"vendorId"}
                                      id={singlePurchaseReturn?.vendorId?._id}
                                      value={value}
                                      onChange={(val) => {
                                        onChange(val);
                                        trigger("vendorId");
                                      }}
                                      reference={ref}
                                    />
                                    {errors.vendorId && (
                                      <p className="text-danger">
                                        {errors.vendorId.message}
                                      </p>
                                    )}
                                  </>
                                )}
                              />
                            </li>
                            <li>
                              <Link
                                className="btn btn-primary form-plus-btn"
                                to="/add-vendors"
                                // onClick={addList}
                              >
                                <i className="fas fa-plus-circle"></i>
                              </Link>
                            </li>
                          </ul>
                          {/* <ul className="form-group-plus css-equal-heights">
                            <li>
                              <Controller
                                name="vendor"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <>
                                    <Select2
                                      className="w-100"
                                      data={product}
                                      options={{
                                        placeholder: "Choose Vendor",
                                      }}
                                      onChange={(val) => {
                                        onChange(val);
                                        trigger("vendor");
                                      }}
                                    />
                                    {errors.vendor && (
                                      <p className="text-danger">
                                        {errors.vendor.message}
                                      </p>
                                    )}
                                  </>
                                )}
                              />
                            </li>
                            <li>
                              <Link
                                className="btn btn-primary form-plus-btn"
                                to="/add-customer"
                              >
                                <i className="fas fa-plus-circle" />
                              </Link>
                            </li>
                          </ul> */}
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group date-form-group">
                          <label>Purchases Date</label>
                          {/* <DatePicker
                            disabled={true}
                            className="datetimepicker form-control"
                            dateFormat={"dd/MM/yyyy"}
                            selected={startDate}
                            maxDate={new Date()}
                            // placeholderText="Select Date"
                            // value={
                            //   moment(startDate).format("DD/MM/YYYY") !==
                            //   moment(new Date()).format("DD/MM/YYYY")
                            //     ? moment(startDate).format("DD/MM/YYYY")
                            //     : moment(startDate).format("DD/MM/YYYY")
                            // }
                            onChange={(date) => setStartDate(date)}
                            name="purchaseOrderDate"
                          ></DatePicker> */}

                          {/* For antd Datepicker */}
                          <Controller
                            control={control}
                            name="purchaseOrderDate"
                            render={({ field: { value, onChange, ref } }) => (
                              <DatePickerComponent
                                disabledDate={disableFutureDate}
                                value={value}
                                onChange={(date) => {
                                  setStartDate(date);
                                  onChange(date);
                                }}
                              />
                            )}
                          ></Controller>
                          {/* For antd Datepicker */}
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group flexColumn date-form-group">
                          <label>Due Date</label>
                          {/* <DatePicker
                            className="datetimepicker form-control"
                            selected={endDate}
                            name="dueDate"
                            minDate={new Date()}
                            dateFormat="dd/MM/yyyy"
                            // value={
                            //   moment(endDate).format("DD/MM/YYYY") !==
                            //   moment(new Date()).format("DD/MM/YYYY")
                            //     ? moment(endDate).format("DD/MM/YYYY")
                            //     : moment(endDate).format("DD/MM/YYYY")
                            // }
                            // placeholderText="Select Date"
                            onChange={(date) => setEndDate(date)}
                          ></DatePicker> */}

                          <Controller
                            control={control}
                            name="dueDate"
                            render={({ field: { value, onChange, ref } }) => (
                              <DatePickerComponent
                                disabledDate={disablePastDate}
                                value={value}
                                onChange={(date) => {
                                  setEndDate(date);
                                  onChange(date);
                                }}
                              />
                            )}
                          ></Controller>

                          {/* For antd DatePicker */}
                          {/* <Controller
                            control={control}
                            name="dueDate"
                            render={({ field: { value, onChange, ref } }) => (
                              <DatePicker
                                className="datetimepicker form-control"
                                picker="date"
                                format="DD/MM/YYYY"
                                onChange={(date) => {
                                  onChange(date ? dayjs(date) : null);
                                }}
                                value={value ? dayjs(value) : null}
                                // disabledDate={disabledDate}
                              ></DatePicker>
                            )}
                          ></Controller> */}
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group">
                          <label>Reference No</label>
                          <Controller
                            name="referenceNo"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Enter Reference Number"
                                  value={value}
                                  onKeyPress={handleNumberRestriction}
                                  onChange={(val) => {
                                    onChange(val);
                                    trigger("referenceNo");
                                  }}
                                />

                                {errors.referenceNo && (
                                  <p className="text-danger">
                                    {errors.referenceNo.message}
                                  </p>
                                )}
                              </>
                            )}
                            defaultValue=""
                          />
                        </div>
                      </div>

                      <div className="col-lg-12">
                        <div className="form-group">
                          <label>
                            Products<span className="text-danger"> *</span>
                          </label>
                          <ul className="form-group-plus css-equal-heights">
                            <li>
                              <Controller
                                name="products"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <>
                                    {/* <Select2
                                      className="w-100"
                                      data={productOption}
                                      options={{
                                        placeholder: "Select Product",
                                      }}
                                      value={value}
                                      type="text"
                                      label={"Name"}
                                      placeholder="Enter Email Address"
                                      onChange={(e) => {
                                        onChange(e);
                                        trigger("products");
                                        SelectedList(e?.target?.value);
                                      }}
                                    /> */}

                                    <Select
                                      // styles={styles}
                                      classNamePrefix="select_kanakku"
                                      className="w-100"
                                      options={listData}
                                      placeholder="Select Products"
                                      // value={listData?.text}
                                      value={value}
                                      onChange={(e) => {
                                        onChange(e);
                                        trigger("products");
                                        SelectedList(e?.value);
                                      }}
                                    />
                                  </>
                                )}
                              />
                            </li>
                            <li>
                              <Link
                                className="btn btn-primary form-plus-btn"
                                to="add-product"
                                // onClick={addList}
                              >
                                <i className="fas fa-plus-circle"></i>
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-group-item">
                    <div className="card-table product-list edit-quotation category">
                      <div className="card-body">
                        <Table
                          columns={columns}
                          dataSource={productService}
                          rowKey={(record) => record?._id}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group-item border-0 p-0">
                    <div className="row">
                      <div className="col-xl-6 col-lg-12">
                        <div className="form-group-bank">
                          <div className="row align-items-center">
                            <div className="col-md-8">
                              <div className="form-group">
                                <label>Select Bank</label>
                                <Controller
                                  name="bank"
                                  control={control}
                                  render={({ field: { value, onChange } }) => (
                                    <>
                                      <SelectDropDown
                                        setValue={setValue}
                                        name={"bank"}
                                        id={singlePurchaseReturn?.bank}
                                        module={true}
                                        value={value}
                                        onChange={(val) => {
                                          onChange(val);
                                        }}
                                        goto={refer}
                                      />
                                    </>
                                  )}
                                />
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-groups">
                                <Link
                                  className="btn btn-primary"
                                  to="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#bank_details"
                                  onClick={() => setBankModalDismiss(true)}
                                >
                                  Add Bank
                                </Link>
                              </div>
                            </div>
                          </div>
                          <div className="form-group notes-form-group-info">
                            <label>Notes</label>
                            <Controller
                              name="notes"
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <>
                                  <textarea
                                    className="form-control"
                                    placeholder="Enter Notes"
                                    name="notes"
                                    value={value}
                                    onChange={(val) => {
                                      onChange(val);
                                      trigger("notes");
                                    }}
                                  />
                                </>
                              )}
                              defaultValue=""
                            />
                          </div>
                          <div className="form-group notes-form-group-info mb-0">
                            <label>Terms and Conditions</label>
                            <Controller
                              name="termsAndCondition"
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <>
                                  <textarea
                                    className="form-control"
                                    placeholder="Enter Terms and Conditions"
                                    value={value}
                                    onChange={(val) => {
                                      onChange(val);
                                      trigger("termsAndCondition");
                                    }}
                                  />
                                </>
                              )}
                              defaultValue=""
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-6 col-lg-12">
                        <div className="form-group-bank">
                          <div className="invoice-total-box">
                            <div className="invoice-total-inner">
                              <p>
                                Amount
                                <span name="taxableAmount">
                                  {/* ${Number(taxableAmount).toFixed(2)} */}
                                  {currencyData ? currencyData : "$"}
                                  {/* {calculateSum()} */}
                                  {Number(calculateSum()).toLocaleString(
                                    "en-IN",
                                    {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }
                                  )}
                                </span>
                              </p>
                              <p>
                                Discount{" "}
                                <span>
                                  {currencyData ? currencyData : "$"}
                                  {/* {calculateDiscount()} */}
                                  {Number(calculateDiscount()).toLocaleString(
                                    "en-IN",
                                    {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }
                                  )}
                                </span>
                              </p>
                              <p>
                                Tax
                                <span>
                                  {currencyData ? currencyData : "$"}
                                  {/* ${Number(vat).toFixed(2)} */}
                                  {/* {calculateTax().toFixed(2)} */}
                                  {Number(calculateTax()).toLocaleString(
                                    "en-IN",
                                    {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }
                                  )}
                                </span>
                              </p>
                              <div className="status-toggle justify-content-between">
                                <div className="d-flex align-center">
                                  <p>Round Off </p>
                                  <Controller
                                    name="roundOff"
                                    control={control}
                                    render={({
                                      field: { value, onChange },
                                    }) => (
                                      <>
                                        <input
                                          id="rating_1"
                                          className="check"
                                          type="checkbox"
                                          checked={round}
                                          value={value}
                                          onChange={(val) => {
                                            onChange(val);
                                            trigger("roundOff");
                                            roundOff(val.target.checked);
                                            setRound(!round);
                                          }}
                                          // onChange={handleInputChange}
                                        />
                                      </>
                                    )}
                                  />

                                  <label
                                    htmlFor="rating_1"
                                    className="checktoggle checkbox-bg"
                                  >
                                    checkbox
                                  </label>
                                </div>
                                <span>
                                  {currencyData ? currencyData : "$"}
                                  {rounded}
                                </span>
                              </div>
                            </div>
                            <div className="invoice-total-footer">
                              <h4>
                                Total Amount{" "}
                                <span>
                                  {currencyData ? currencyData : "$"}
                                  {TotalValue}
                                  {/* {Number(
                                    round
                                      ? Math.round(calculateSum())
                                      : calculateSum()
                                  ).toLocaleString("en-IN", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })} */}
                                </span>
                              </h4>
                            </div>
                            <hr />
                          </div>
                          <SignaturePadComponent
                            setValue={setValue}
                            register={register}
                            trigger={trigger}
                            formcontrol={control}
                            errors={errors}
                            clearErrors={clearErrors}
                            setTrimmedDataURL={setTrimmedDataURL}
                            trimmedDataURL={trimmedDataURL}
                            setSignatureData={setSignatureData}
                            handleKeyPress={handleKeyPress}
                            data={singlePurchaseReturn}
                            setselectedSign={setselectedSign}
                            selectedSign={selectedSign}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-end">
                    <Link
                      to="/debit-notes"
                      type="reset"
                      className="btn btn-primary cancel me-2"
                    >
                      Cancel
                    </Link>
                    <button type="submit" className="btn btn-primary">
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <EditProductForm
        editPro={editPro}
        // setEditPro={(data) => {
        //   ;
        // }}
        afterModalSubmit={afterModalSubmit}
        setEditPro={setEditPro}
        newEdit={newEdit}
        modalDismiss={modalDismiss}
        setModalDismiss={setModalDismiss}
        setNewEdit={setNewEdit}
        taxList={taxList}
      />
      <AddBankForm
        bankModalDismiss={bankModalDismiss}
        setBankModalDismiss={setBankModalDismiss}
        successCallBack={() => getBankList()}
        setRefer={setRefer}
      />

      <div
        className="modal custom-modal fade"
        id="delete_discount"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header border-0 justify-content-center pb-0">
              <div className="form-header modal-header-title text-center mb-0">
                <h4 className="mb-2">Delete Product / Services</h4>
                <p>Are you sure want to delete?</p>
              </div>
            </div>
            <div className="modal-body">
              <div className="modal-btn delete-action">
                <div className="row">
                  <div className="col-6">
                    <Link
                      to="#"
                      data-bs-dismiss="modal"
                      className="btn btn-primary paid-continue-btn"
                      onClick={() => handleDelete(purchaseDelete)}
                    >
                      Delete
                    </Link>
                  </div>
                  <div className="col-6">
                    <Link
                      to="#"
                      data-bs-dismiss="modal"
                      className="btn btn-primary paid-cancel-btn"
                    >
                      Cancel
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditPurchaseReturn;
