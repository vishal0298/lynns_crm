/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Select from "react-select";
import "../../../../common/antd.css";
import { Popconfirm, Table } from "antd";
import FeatherIcon from "feather-icons-react";
import { ApiServiceContext, warningToast } from "../../../../core/core-index";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { EditDeliveryChallanSchema } from "../../../../common/schema";
import {
  onShowSizeChange,
  itemRender,
} from "../../../../common/paginationfunction";
import { listVendor, viewCustomerApi } from "../../../../constans/apiname";
import { dropdown_api } from "../../../../core/end_points/end_points";
import { useDropzone } from "react-dropzone";
import EditProductForm from "../../modalForm/EditProductForm";
import AddBankForm from "../../modalForm/AddBankForm";
import SelectDropDown from "../../react-Select/SelectDropDown";
import useFilePreview from "../../hooks/useFilePreview";
import { EditChallanContext } from "./EditChallan.control";
import moment from "moment";
import { commonDatacontext } from "../../../../core/commonData";
import { handleNumberRestriction } from "../../../../constans/globals";
import SignaturePadComponent from "../../../../common/SignaturePadComponent";
import { handleKeyPress } from "../../../../common/helper";
import dayjs from "dayjs";
import DatePickerComponent from "../../datePicker/DatePicker";

const EditChallan = () => {
  const [menu, setMenu] = useState(false);
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
    watch,
    trigger,
    register,
    getValues,
    resetField,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(EditDeliveryChallanSchema),
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
    singleChallan,
    setEndDate,
    setStartDate,
    setImgError,
    imgerror,
    round,
    setRound,
    roundOffAction,
    setRoundOffAction,
    calculateTaxableSum,
    trimmedDataURL,
    setTrimmedDataURL,
    setSignatureData,
    currentCustomer,
    setCurrentCustomer,
  } = useContext(EditChallanContext);
  const { currencyData } = useContext(commonDatacontext);
  const toggleMobileMenu = () => {
    setMenu(!menu);
  };
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
    let effect = productServiceCopy.find((item) => item.id === newEdit.id);
  }, [newEdit]);
  const navigate = useNavigate();
  const { getData, postData, patchData, putData, deleteData } =
    useContext(ApiServiceContext);

  useEffect(() => {
    if (singleChallan?.id) getProductList();
    setInitial();
  }, [singleChallan]);
  const prepareData = (record) => {
    var list = {
      amount: "2000",
      discountType: parseInt(record?.discount),
      discountValue: parseInt(record?.discountValue),
      name: record?.name,
      id: record?.productId,
      alertQuantity: parseInt(record?.quantity),
      sellingPrice: parseInt(record?.rate),
      tax: { taxRate: parseInt(record?.tax) },
    };
    return list;
  };

  const setInitial = () => {
    setValue(
      "address",
      `${singleChallan?.deliveryAddress?.addressLine1} ${singleChallan?.deliveryAddress?.addressLine2} ${singleChallan?.deliveryAddress?.city} ${singleChallan?.deliveryAddress?.state} ${singleChallan?.deliveryAddress?.country} ${singleChallan?.deliveryAddress?.pincode}`
    );
    setCurrentCustomer((prev) => ({
      ...prev,
      shippingAddress: singleChallan.deliveryAddress,
    }));
    setValue("deliveryChallanNumber", singleChallan?.deliveryChallanNumber);
    setValue("customerId", singleChallan?.customerId?._id);
    setValue("paymentMode", singleChallan?.paymentMode);
    setValue("referenceNo", singleChallan?.referenceNo);
    setValue("signatureName", singleChallan?.signatureName);
    setValue("notes", singleChallan?.notes);
    setValue("termsAndCondition", singleChallan?.termsAndCondition);
    setTaxableAmount(singleChallan?.taxableAmount);
    setTotalDiscount(singleChallan?.totalDiscount);
    setVat(singleChallan?.vat);
    setRound(singleChallan?.roundOff);
    setValue("roundOff", singleChallan?.roundOff);
    setTotalAmount(singleChallan?.TotalAmount);
    setFile(singleChallan?.signatureImage);

    setStartDate(dayjs(singleChallan?.deliveryChallanDate));
    setEndDate(dayjs(singleChallan?.dueDate));

    setValue("dueDate", moment(singleChallan?.dueDate));
    setValue("deliveryChallanDate", moment(singleChallan?.deliveryChallanDate));
  };
  useEffect(() => {
    if (singleChallan?.id) getProductList();
    setInitial();
  }, [singleChallan]);
  // useEffect(() => {
  //   var editData = [];
  //   getQuantity(editData);
  // }, []);
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
      
      const results = dataList?.filter(({ _id: id1 }) => {
        return singleChallan?.items?.some(({ productId: id2 }) => {
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
        const obj2 = singleChallan?.items?.find(
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
        (o1) => !singleChallan?.items?.some((o2) => o1._id === o2.productId)
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

  const handleImageChange = (file) => {
    setValue("signatureImage", file); // Assuming you're using setValue from react-hook-form to update the form data
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

  const onModalSubmit = (data) => {};
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
  const columns = [
    {
      title: "Product/Service",
      dataIndex: "name",
    },
    {
      title: "Quantity",
      dataIndex: "alertQuantity",
      render: (text, record) => {
        return (
          <input
            type="text"
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
      key: "sellingPrice",
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

  const getCustomerDetails = async () => {
    const url = `${viewCustomerApi}/${customer.id}`;
    try {
      const response = await getData(url);
      if (response?.data) {
        setValue(
          "address",
          `${response.data?.shippingAddress?.addressLine1} ${response.data?.shippingAddress?.addressLine2} ${response.data?.shippingAddress?.city} ${response.data?.shippingAddress?.state} ${response.data?.shippingAddress?.country} ${response.data?.shippingAddress?.pincode}`
        );
        setCurrentCustomer((prev) => ({
          ...prev,
          shippingAddress: response.data?.shippingAddress,
        }));
      }
      // ;
    } catch {
      return false;
    }
  };
  useEffect(() => {
    if (customer?.id) getCustomerDetails();
  }, [currentCustomer.id]);

  const customer = watch("customerId");
  const address = watch("address");
  if (customer?.id && customer.id !== currentCustomer?.id) {
    setCurrentCustomer((prev) => ({ ...prev, id: customer.id }));
  }

  useEffect(() => {
    let elements = Array.from(
      document.getElementsByClassName("react-datepicker-wrapper")
    );
    elements.map((element) => element.classList.add("w-100"));
    var editData = [];
    getQuantity(editData);
  }, []);

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

  const [currency, setCurrency] = useState([
    { id: 1, text: "Select Currency" },
    { id: 2, text: "US dollar" },
    { id: 3, text: "Euro" },
    { id: 4, text: "Pound sterling" },
    { id: 5, text: "Swiss franc" },
  ]);

  const addlist = () => {};
  const handleImageError = (event) => {
    event.target.style.display = "none";
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

  //  For antd Datepicker
  useEffect(() => {
    setValue("deliveryChallanDate", dayjs());
    setValue("dueDate", dayjs());
  }, [setValue]);
  const disablePastDate = (current) => {
   
    return current && current < dayjs().startOf("day");
  };
  const disableFutureDate = (current) => {
    return current && current > dayjs().endOf("day");
  };


  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="content-page-header">
            <h5>Edit Delivery Challan</h5>
          </div>
          <div className="row">
            <div className="col-md-12">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="card-body">
                  <div className="form-group-item border-0 mb-0">
                    <div className="row align-item-center">
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group">
                          <label>
                            Delivery Challan Number
                            <span className="text-danger"> *</span>
                          </label>
                          <Controller
                            name="deliveryChallanNumber"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Enter Purchases Id"
                                  value={value}
                                  onChange={(val) => {
                                    onChange(val);
                                    trigger("deliveryChallanNumber");
                                  }}
                                  readOnly={true}
                                  disabled={true}
                                />
                                {errors.deliveryChallanNumber && (
                                  <p className="text-danger">
                                    {errors.deliveryChallanNumber.message}
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
                            Select Customer
                            <span className="text-danger"> *</span>
                          </label>
                          <ul className="form-group-plus css-equal-heights">
                            <li>
                              <Controller
                                name="customerId"
                                control={control}
                                render={({
                                  field: { value, onChange, ref },
                                }) => (
                                  <>
                                    <SelectDropDown
                                      module={"Customer"}
                                      placeholder="Select Customer"
                                      setValue={setValue}
                                      name={"customerId"}
                                      id={singleChallan?.customerId?._id}
                                      value={value}
                                      onChange={(val) => {
                                        onChange(val);
                                        trigger("customerId");
                                      }}
                                      reference={ref}
                                    />
                                    {errors.customerId && (
                                      <p className="text-danger">
                                        {errors.customerId.message}
                                      </p>
                                    )}
                                  </>
                                )}
                              />
                            </li>
                            <li>
                              <Link
                                className="btn btn-primary form-plus-btn"
                                to="/add-customers"
                              >
                                <i className="fas fa-plus-circle" />
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group date-form-group">
                          <label>Delivery Challan Date</label>
                          
                          {/* For antd Datepicker */}
                          <Controller
                            control={control}
                            name="deliveryChallanDate"
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
                                  onKeyPress={handleNumberRestriction}
                                  value={value}
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
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group">
                          <label>
                            Shipping Address
                            <span className="text-danger"> *</span>{" "}
                          </label>
                          <ul className="form-group-plus css-equal-heights">
                            <li>
                              <Controller
                                name="address"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <>
                                    <input
                                      title={
                                        currentCustomer?.shippingAddress
                                          ? `${currentCustomer?.shippingAddress?.addressLine1} ${currentCustomer?.shippingAddress?.addressLine2} ${currentCustomer?.shippingAddress?.city} ${currentCustomer?.shippingAddress?.state} ${currentCustomer?.shippingAddress?.country} ${currentCustomer?.shippingAddress?.pincode}`
                                          : ""
                                      }
                                      type="text"
                                      className="form-control"
                                      disabled={true}
                                      placeholder=""
                                      onKeyPress={handleNumberRestriction}
                                      onChange={(val) => {
                                        onChange(val);
                                        trigger("address");
                                      }}
                                      {...register("address")}
                                    />
                                    {errors.address && (
                                      <p className="text-danger">
                                        {errors.address.message}
                                      </p>
                                    )}
                                  </>
                                )}
                                defaultValue=""
                              />
                            </li>
                            <li>
                              <Link
                                className="btn btn-primary form-plus-btn"
                                to={`/edit-customer/${currentCustomer?.id}`}
                              >
                                <i className="fas fa-edit" />
                              </Link>
                            </li>
                          </ul>
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
                                   

                                    <Select
                                      classNamePrefix="select_kanakku"
                                      className="w-100"
                                      options={listData}
                                      onChange={(e) => {
                                        onChange(e);
                                        trigger("products");
                                        SelectedList(e?.value);
                                      }}
                                      value=""
                                      placeholder="Select Products"
                                    />
                                  </>
                                )}
                              />
                            </li>
                            <li>
                              <Link
                                className="btn btn-primary form-plus-btn"
                                to="/add-product"
                                
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
                          
                          pagination={{
                            
                            showTotal: (total, range) =>
                              `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                            showSizeChanger: true,
                            onShowSizeChange: onShowSizeChange,
                            itemRender: itemRender,
                          }}
                          columns={columns}
                          dataSource={productService}
                          rowKey={(record) => record?._id}
                        />
                        {}
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
                                        placeholder="Select Bank"
                                        name={"bank"}
                                        id={singleChallan?.bank}
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
                                    {...register("notes")}
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
                                    {...register("termsAndCondition")}
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
                                  {currencyData ? currencyData : "$"}
                                  {Number(calculateTaxableSum()).toLocaleString(
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
                                    defaultValue={false}
                                    render={({
                                      field: { value, onChange },
                                    }) => (
                                      <>
                                        <input
                                          id="rating_1"
                                          className="check"
                                          type="checkbox"
                                          checked={value} // Use value from field to control the input
                                          onChange={(e) => {
                                            onChange(e.target.checked); // Update value with the new checked state
                                            trigger("roundOff");
                                            roundOff(e.target.checked);
                                            setRound(!round);
                                          }}
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
                                 
                                  {Number(
                                    round
                                      ? Math.round(calculateSum())
                                      : calculateSum()
                                  ).toLocaleString("en-IN", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
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
                            data={singleChallan}
                            setselectedSign={setselectedSign}
                            selectedSign={selectedSign}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-end">
                    <Link
                      to="/delivery-challans"
                      // type="reset"
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

export default EditChallan;
