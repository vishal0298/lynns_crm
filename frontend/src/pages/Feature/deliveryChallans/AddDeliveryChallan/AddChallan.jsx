/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import "../../../../common/antd.css";
import { Popconfirm, Table } from "antd";
import FeatherIcon from "feather-icons-react";
import { ApiServiceContext, DeliveryChallanNum } from "../../../../core/core-index";
import { productListapi } from "../../../../core/core-index";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import EditProductForm from "../../modalForm/EditProductForm";
import AddBankForm from "../../modalForm/AddBankForm";
import SelectDropDown from "../../react-Select/SelectDropDown";
import useFilePreview from "../../hooks/useFilePreview";
import { AddChallanContext } from "./AddChallan.control";
import { commonDatacontext } from "../../../../core/commonData";
import { handleNumberRestriction } from "../../../../constans/globals";
import { handleKeyPress } from "../../../../common/helper";
import SignaturePadComponent from "../../../../common/SignaturePadComponent";
import dayjs from "dayjs";
import DatePickerComponent from "../../datePicker/DatePicker";
import { viewCustomerApi } from "../../../../constans/apiname";

const AddChallan = () => {
  const [menu, setMenu] = useState(false);
  const [editPro, setEditPro] = useState({});
  const [newEdit, setNewEdit] = useState({});
  const [modalDismiss, setModalDismiss] = useState(false);
  const [bankModalDismiss, setBankModalDismiss] = useState(false);
  const [refer, setRefer] = useState(false);
  const [selectedSign, setselectedSign] = useState("/");

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
    onSubmit,
    calculateRate,
    calculateDiscountAmount,
    calculateTaxAmount,
    calculateAmount,
    calculateSum,
    calculateDiscount,
    calculateTax,
    round,
    setRound,
    roundOffAction,
    setRoundOffAction,
    getBankList,
    calculateTaxableSum,
    trimmedDataURL,
    setTrimmedDataURL,
    setSignatureData,
    setCurrentCustomer,
    currentCustomer,
    num,
    setNum,
    DeliveryChallanSchema,
  } = useContext(AddChallanContext);
  const {
    handleSubmit,
    control,
    setValue,
    clearErrors,
    trigger,
    register,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(DeliveryChallanSchema),
  });
  const { getData } = useContext(ApiServiceContext);

  const { currencyData } = useContext(commonDatacontext);

  // State

  const [quantity, setQuantity] = useState(1);

  const [purchaseReturnDelete, setPurchaseReturnDelete] = useState("");

  const [rounded, setRounded] = useState(0.0);

  // State

  useEffect(() => {
    let elements = Array.from(
      document.getElementsByClassName("react-datepicker-wrapper")
    );
    elements.map((element) => element.classList.add("w-100"));
    getChallanNumber();

  }, []);

  useEffect(() => {
    roundOff(round);
  }, [roundOffAction]);

  const [imgerror, setImgError] = useState("");
  const file = watch("signatureImage");
  const [filePreview] = useFilePreview(file, setImgError);

  // Product List table
  const getProductDetails = async () => {
    try {
      const productList = await getData(productListapi);
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
        id: item?.id,
        text: item?.name,
        quantity: 1,
      };
    });
    setProductOption(newProductList);
    setProductOptionCopy(newProductList);
  };

  // To add the selected option to table and remove that option from the dropdown
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
  // To add the selected option to table and remove that option from the dropdown

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
      render: (text, record) => {
        return (
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
                  onConfirm={() =>
                    handleDelete(record._id)
                  }
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
        );
      },
    
    },
  ];

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

  if (customer?.id && customer.id !== currentCustomer?.id) {
    setCurrentCustomer({ id: customer.id });
  }

  // Calculations
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

  
  const disablePastDate = (current) => {
    // Disable dates that are before today
    return current && current < dayjs().startOf("day");
  };

  const disableFutureDate = (current) => {
    // Disable dates that are after today
    return current && current > dayjs().endOf("day");
  };
  //  For antd Datepicker
  const getChallanNumber = async () => {
    const response = await getData(DeliveryChallanNum);
    setNum(response?.data);
  };

  // useEffect(() => {
  //   getChallanNumber();
  // }, []);

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="content-page-header">
            <h5>Create Delivery Challan</h5>
          </div>
          <div className="row">
            <div className="col-md-12">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="card-body">
                  <div className="form-group-item border-0 mb-0">
                    <div className="row align-item-center">
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group input_text">
                          <label>Invoice Number</label>
                          <Controller
                            name="deliveryChallanNumber"
                            type="number"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <input
                                className={`form-control ${
                                  errors?.deliveryChallanNumber
                                    ? "error-input"
                                    : ""
                                }`}
                                type="text"
                                value={num}
                                placeholder="Enter Invoice Number"
                                autoComplete="false"
                                readOnly={true}
                                disabled={true}
                              />
                            )}
                            defaultValue=""
                          />
                          <small>
                            {errors?.deliveryChallanNumber?.message}
                          </small>
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
                                to="/add-customer"
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
                          {/* <DatePicker
                            disabled={true}
                            className="datetimepicker form-control"
                            maxDate={new Date()}
                            dateFormat="dd/MM/yyyy"
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                          ></DatePicker> */}

                          {/* For antd Datepicker */}
                          <Controller
                            control={control}
                            name="deliveryChallanDate"
                            render={({ field: { value, onChange, ref } }) => (
                              <DatePickerComponent
                                disabledDate={disableFutureDate}
                                value={value}
                                onChange={onChange}
                              />
                            )}
                          ></Controller>
                          {/* For antd Datepicker */}
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group date-form-group">
                          <label>Due Date</label>
                          {/* <DatePicker
                            className="datetimepicker form-control"
                            selected={endDate}
                            name="dueDate"
                            minDate={new Date()}
                            dateFormat="dd/MM/yyyy"
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
                                onChange={onChange}
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
                                  onChange={(val) => {
                                    onChange(val);
                                    trigger("referenceNo");
                                  }}
                                  {...register("referenceNo")}
                                />
                                {/* {errors.referenceNo && (
                                  <p className="text-danger">
                                    {errors.referenceNo.message}
                                  </p>
                                )} */}
                              </>
                            )}
                            defaultValue=""
                          />
                        </div>
                      </div>
                      {customer && (
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
                                  to={`/edit-customer/${customer.id}`}
                                >
                                  <i className="fas fa-edit" />
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                      )}
                      <div className="col-lg-12">
                        <div className="form-group">
                          <label>
                            Products<span className="text-danger"> *</span>
                          </label>
                          <ul className="form-group-plus css-equal-heights">
                            <li>
                              {/* <Select2
                                className="w-100"
                                data={productOption}
                                options={{
                                  placeholder: "Select Product",
                                }}
                              /> */}
                              <Controller
                                name="products"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <>
                                    <Select
                                      // styles={styles}
                                      classNamePrefix="select_kanakku"
                                      className="w-100"
                                      options={listData}
                                      // value={listData?.text}
                                      value=""
                                      onChange={(e) => {
                                        onChange(e);
                                        trigger("products");
                                        SelectedList(e?.value);
                                      }}
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
                                <i className="fas fa-plus-circle" />
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-group-item">
                    <div className="card-table">
                      <div className="card-body editInvoice category">
                        <div className="table-responsive table-hover">
                          <Table
                            // pagination={{
                            //   total: productService.length,
                            //   showTotal: (total, range) =>
                            //     `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                            //   showSizeChanger: true,
                            //   onShowSizeChange: onShowSizeChange,
                            //   itemRender: itemRender,
                            // }}
                            rowKey={(record) => record._id}
                            pagination={false}
                            columns={columns}
                            dataSource={productService}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div className="row">
                    <div className="col-md-4">
                      <div className="row">
                        <div className="col-lg-7">
                          <div className="form-group">
                            <label>Discount Type</label>
                            <Select2
                              className="w-100"
                              data={percentage}
                              options={{
                                placeholder: "Percentage(%)",
                              }}
                            />
                          </div>
                        </div>
                        <div className="col-lg-5">
                          <div className="form-group">
                            <label>Discount(%)</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder={10}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>Tax</label>
                        <Select2
                          className="w-100"
                          data={tax}
                          options={{
                            placeholder: "No Tax",
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-md-4" />
                  </div> */}
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
                                  render={({
                                    field: { value, onChange, ref },
                                  }) => (
                                    <>
                                      <SelectDropDown
                                        placeholder="Select Bank"
                                        module={true}
                                        value={value}
                                        onChange={(val) => {
                                          onChange(val);
                                        }}
                                        reference={ref}
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
                                    {...register("notes")}
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
                                    {...register("termsAndCondition")}
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
                                Amount{" "}
                                <span>
                                  {currencyData ? currencyData : "$"}
                                  {/* {calculateSum()} */}
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
                                          // defaultChecked="true"
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
                                  {/* {round
                                    ? Math.round(calculateSum())
                                    : calculateSum()} */}
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
                            selectedSign={selectedSign}
                            setselectedSign={setselectedSign}
                            data={{}}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-end">
                    <Link
                      // type="reset"
                      to="/delivery-challans"
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
                      onClick={() => handleDelete(purchaseReturnDelete)}
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

export default AddChallan;
