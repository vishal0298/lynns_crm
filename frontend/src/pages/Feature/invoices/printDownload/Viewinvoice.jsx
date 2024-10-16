/* eslint-disable no-undef */
import React, { useContext, useEffect, useState, useRef } from "react";
import { ViewinvoiceContext } from "./Viewinvoice.control";
import { ListinvoiceContext } from "../invoiceList/Listinvoice.control";
import { Link } from "react-router-dom";
import Header from "../../layouts/Header";
import Sidebar from "../../layouts/Sidebar";
import FeatherIcon from "feather-icons-react";
import { Table } from "antd";
import { DetailsLogo } from "../../../../common/imagepath";
import Select from "react-select";
import DatePicker from "react-datepicker";
import moment from "moment";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { commonDatacontext } from "../../../../core/commonData";
import { amountFormat } from "../../../../common/helper";
import { useSelector } from "react-redux";

const ViewInvoice = () => {
  const { addpaymentschema } = useContext(ListinvoiceContext);
  const { currencyData, companyData } = useContext(commonDatacontext);
  const {
    addpaymentcancelModal,
    addpaymentsForm,
    dataSource,
    menu,
    toggleMobileMenu,
    invoiceData,
    receivedon,
    setreceivedon,
    paymentMethodsData,
  } = useContext(ViewinvoiceContext);
  const [dueDays, setDuedays] = useState(0);
  const {
    handleSubmit: addPaymentHandleformsubmit,
    control,
    setValue,
    trigger,
    reset,
    resetField,
    formState,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addpaymentschema),
    defaultValues: {
      notes: "",
    },
  });

  const editModal = (data) => {
    reset({ payment_method: "" });
    resetField("payment_method");
    resetField("notes");
    setValue("invoiceNumber", data?.invoiceNumber);
    setValue("invoiceId", data?._id);
    setValue("invoiceAmount", data.TotalAmount);
    setValue("balanceAmount", data.balance);
    setValue("amount", data.balance);
    setAmountValue(data.balance);
  };

  const [amountValue, setAmountValue] = useState("");
  const cursorPosition = useRef(null);
  const { invoiceLogo } = useSelector((state) => state?.app);
  const handleKeyPress = (event) => {
    const key = event.key;
    const isNumber = /[0-9]/.test(key);
    if (!isNumber) {
      event.preventDefault();
    }
  };

  const sanitizeInput = (inputValue) => {
    const sanitizedValue = inputValue.replace(/[^0-9.]/g, "");
    return sanitizedValue;
  };

  const handlePaste = (event) => {
    const pastedValue = event.clipboardData.getData("text/plain");
    const sanitizedValue = sanitizeInput(pastedValue);
    setAmountValue(sanitizedValue);
    setValue("amount", sanitizedValue);
    event.preventDefault();
  };

  const handleDrop = (event) => {
    const droppedValue = event.dataTransfer.getData("text/plain");
    const sanitizedValue = sanitizeInput(droppedValue);
    setAmountValue(sanitizedValue);
    setValue("amount", sanitizedValue);
    event.preventDefault();
  };

  const handleBlur = () => {
    const sanitizedValue = sanitizeInput(amountValue);
    setAmountValue(sanitizedValue);
    setValue("amount", sanitizedValue);
  };

  const handleKeyDown = (event) => {
    const isBackspaceOrDelete =
      event.key === "Backspace" || event.key === "Delete";
    const inputElement = event.target;
    const { selectionStart, selectionEnd } = inputElement;

    if (
      isBackspaceOrDelete &&
      selectionStart === selectionEnd &&
      selectionStart > 0
    ) {
      cursorPosition.current = selectionStart - 1;
    }
  };

  const handleInput = (event) => {
    const inputValue = event.target.value;
    const sanitizedValue = sanitizeInput(inputValue);
    setAmountValue(sanitizedValue);
    setValue("amount", sanitizedValue);

    if (cursorPosition.current !== null) {
      setTimeout(() => {
        const inputElement = event.target;
        const newPosition = Math.max(cursorPosition.current, 0);
        inputElement.setSelectionRange(newPosition, newPosition);
        cursorPosition.current = null;
      }, 0);
    }
  };

  const handleDragStart = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset();
    }
  }, [formState, reset]);

  useEffect(() => {
    const calculateDaysRemaining = () => {
      const currentDate = moment();
      const dueDateTime = moment(invoiceData?.dueDate);
      const diffInDays = dueDateTime.diff(currentDate, 'days');
      setDuedays(diffInDays);
    };
    if (invoiceData?.dueDate != undefined) calculateDaysRemaining();
  }, [invoiceData]);

  const columns = [
    {
      title: "Product / Service",
      dataIndex: "name",
    },
    {
      title: "Unit",
      dataIndex: "units",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
    },
    {
      title: `Rate`,
      dataIndex: "rate",
      render: (text,record) => (
        <>
          {currencyData ? currencyData : "$"}
          {record?.rate}
        </>
      ),
    },
    {
      title: `Discount`,
      dataIndex: "discount",
      render: (text,record) => (
        <>
          {currencyData ? currencyData : "$"}
          {record?.discount}
        </>
      ),
    },
    
    {
      title: `Staff`,
      dataIndex: "staff",
      render: (text,record) => (
        <>
          { console.log(record)}
          {currencyData ? currencyData : "$"}
          {record?.staff}
        </>
      ),
    },
    {
      title: `Service From`,
      dataIndex: "service_from",
      render: (text,record) => (
        <>
          {currencyData ? currencyData : "$"}
          {record?.service_from}
        </>
      ),
    },
    {
      title: `Tax`,
      dataIndex: "tax",
      render: (text,record) => (
        <>
          {currencyData ? currencyData : "$"}
          {record?.tax}
        </>
      ),
    },
    {
      title: `Amount`,
      dataIndex: "amount",
      render: (text,record) => (
        <>
          {currencyData ? currencyData : "$"}
          {record?.amount}
        </>
      ),
    },
  ];

  const handleImageError = (event) => {
    event.target.src = DetailsLogo;
  };

  return (
    <>
      <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
        <Header onMenuClick={() => toggleMobileMenu()} />
        <Sidebar />
        <div className="page-wrapper">
          <div className="content container-fluid">
            {/* Page Header */}
            <div className="page-header">
              <div className="content-invoice-header">
                <h5>Invoice Details</h5>
                <div className="list-btn">
                  <ul className="filter-list"></ul>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            <div className="row justify-content-center">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <div className="card-table">
                      <div className="card-body">
                        {/* Invoice Logo */}
                        <div className="invoice-item invoice-item-one">
                          <div className="row align-items-center">
                            <div className="col-md-6">
                              <div className="invoice-logo">
                                <img
                                  onError={handleImageError}
                                  src={invoiceLogo}
                                  alt="logo"
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="invoice-info">
                                <h1>{invoiceData?.status}</h1>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* /Invoice Logo */}
                        {/* Invoice Date */}
                        <div className="invoice-item invoice-item-date">
                          <div className="row">
                            <div className="col-md-4">
                              <p className="text-start invoice-details">
                                Issue Date<span>: </span>
                                <strong>
                                  {moment(invoiceData?.invoiceDate).format(
                                    "DD-MM-YYYY"
                                  )}
                                </strong>
                              </p>
                            </div>
                            <div className="col-md-4">
                              <p className="text-start invoice-details">
                                Due Date<span>: </span>
                                <strong>
                                  {moment(invoiceData?.dueDate).format(
                                    "DD-MM-YYYY"
                                  )}
                                </strong>
                                {invoiceData?.status != "OVERDUE" ? (
                                  <span className="text-danger">
                                    Due in {dueDays} days
                                  </span>
                                ) : (
                                  <span className="text-danger">OVERDUE </span>
                                )}
                              </p>
                            </div>
                            <div className="col-md-4">
                              <p className="invoice-details">
                                Invoice No<span>: </span>
                                <strong>{invoiceData?.invoiceNumber}</strong>
                              </p>
                            </div>
                          </div>
                        </div>
                        {/* /Invoice Date */}
                        {/* Invoice To */}
                        <div className="invoice-item invoice-item-two">
                          <div className="row">
                            <div className="col-md-4">
                              <div className="invoice-info">
                                <strong className="customer-text-one">
                                  Invoice To<span>:</span>
                                </strong>
                                <p className="invoice-details-two">
                                  {invoiceData?.customerId?.name
                                    ? invoiceData?.customerId?.name
                                    : ""}
                                  <br />
                                  {invoiceData?.customerId?.email
                                    ? invoiceData?.customerId?.email
                                    : ""}
                                  <br />
                                  {invoiceData?.customerId?.phone
                                    ? invoiceData?.customerId?.phone
                                    : ""}
                                </p>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="invoice-info invoice-info2">
                                <strong className="customer-text-one">
                                  Pay To<span>:</span>
                                </strong>
                                <p className="invoice-details-two text-start">
                                  {companyData?.companyName
                                    ? companyData?.companyName
                                    : ""}
                                  <br />
                                  {companyData?.companyAddress ? (
                                    (companyData?.companyAddress ||
                                      companyData?.addressLine1 ||
                                      companyData?.addressLine2,
                                    companyData?.city)
                                  ) : (
                                    <>
                                      <p></p>
                                    </>
                                  )}
                                  <br />
                                  {companyData?.state ? (
                                    (companyData?.state, companyData?.pincode)
                                  ) : (
                                    <>
                                      <p></p>
                                    </>
                                  )}
                                  <br />
                                  {companyData?.country
                                    ? companyData?.country
                                    : ""}
                                </p>
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="invoice-info invoice-info2">
                                <strong className="customer-text-one">
                                  Payment Details<span>:</span>
                                </strong>

                                <p className="text-start invoice-details-t invoice-details">
                                  {/* Payment Term<span>: </span><strong>15 days</strong> */}
                                  {invoiceData?.status != "PAID" &&
                                    (invoiceData?.status != "OVERDUE" ? (
                                      <span className="text-danger">
                                        Due in {dueDays} days
                                      </span>
                                    ) : (
                                      <span className="text-danger">
                                        OVERDUE
                                      </span>
                                    ))}
                                </p>
                                {/* {invoiceData?.status != "PAID" && (
                                  <div className="pay-btn">
                                    <Link
                                      to="#"
                                      onClick={() => editModal(invoiceData)}
                                      data-bs-toggle="modal"
                                      data-bs-target="#add_payment"
                                      className="btn btn-primary mt-2"
                                    >
                                      Pay Now
                                    </Link>
                                  </div>
                                )} */}
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* /Invoice To */}
                        {/* Invoice Item */}
                        <div className="invoice-item invoice-table-wrap">
                          <div className="invoice-table-head">
                            <h6>Items:</h6>
                          </div>
                          <div className="row">
                            <div className="col-md-12">
                              <div className=" card-table">
                                <div className="card-body product-list">
                                  <div className="table-responsive table-hover table-striped">
                                    <Table
                                      bordered
                                      dataSource={dataSource}
                                      columns={columns}
                                      pagination={{
                                        position: ["none", "none"],
                                      }}
                                      rowKey={(record) => record?.productId}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* /Invoice Item */}
                        {/* Terms & Conditions */}
                        <div className="terms-conditions credit-details">
                          <div className="row align-items-center justify-content-between">
                            <div className="col-lg-6 col-md-6">
                              <div className="invoice-terms align-center justify-content-start">
                                <span className="invoice-terms-icon bg-white-smoke me-3">
                                  <i className="fe fe-file-text">
                                    <FeatherIcon icon="file-text" />
                                  </i>
                                </span>
                                <div className="invocie-note">
                                  <h6>Terms &amp; Conditions</h6>
                                  <p className="mb-0">
                                    {invoiceData?.termsAndCondition}
                                  </p>
                                </div>
                              </div>
                              <div className="invoice-terms align-center justify-content-start">
                                <span className="invoice-terms-icon bg-white-smoke me-3">
                                  <i className="fe fe-file-minus">
                                    <FeatherIcon icon="file-minus" />
                                  </i>
                                </span>
                                <div className="invocie-note">
                                  <h6>Note</h6>
                                  <p className="mb-0">{invoiceData?.notes}</p>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-5 col-md-6">
                              <div className="invoice-total-card">
                                <div className="invoice-total-box">
                                  <div className="invoice-total-inner">
                                    <p>
                                      Amount{" "}
                                      <span>
                                        {currencyData ? currencyData : "$"}
                                        {amountFormat(
                                          invoiceData?.taxableAmount
                                        )}
                                      </span>
                                    </p>
                                    <p>
                                      Discount
                                      <span>
                                        {currencyData ? currencyData : "$"}
                                        {amountFormat(
                                          invoiceData?.totalDiscount
                                        )}
                                      </span>
                                    </p>
                                    <p>
                                      Tax{" "}
                                      <span>
                                        {currencyData ? currencyData : "$"}
                                        {amountFormat(invoiceData?.vat)}
                                      </span>
                                    </p>
                                  </div>
                                  <div className="invoice-total-footer">
                                    <h4>
                                      Total Amount{" "}
                                      <span>
                                        {currencyData ? currencyData : "$"}
                                        {amountFormat(invoiceData?.TotalAmount)}
                                      </span>
                                    </h4>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="invoice-sign text-end">
                          <span className="d-block">
                            {invoiceData?.signatureName}
                          </span>
                          {invoiceData?.signatureImage && (
                            <img
                              className="img-fluid d-inline-block uploaded-imgs"
                              style={{
                                display: "flex",
                                maxWidth: "200px",
                                maxHeight: "200px",
                              }}
                              src={invoiceData?.signatureImage}
                              alt=""
                            />
                          )}
                        </div>
                        {/* /Terms & Conditions */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* add payment start */}
        <div className="modal custom-modal fade" id="add_payment" role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-md">
            <form onSubmit={addPaymentHandleformsubmit(addpaymentsForm)}>
              <div className="modal-content">
                <div className="modal-header border-0 pb-0">
                  <div className="form-header modal-header-title text-start mb-0">
                    <h4 className="mb-0">Add Payment</h4>
                  </div>
                  <button
                    type="button"
                    className="close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    <span className="align-center" aria-hidden="true">
                      ×
                    </span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group input_text">
                        <label>
                          Invoice <span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="invoiceNumber"
                          type="text"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <input
                              className={`form-control ${
                                errors?.invoiceNumber ? "error-input" : ""
                              }`}
                              type="text"
                              value={value}
                              onChange={onChange}
                              readOnly={true}
                              disabled={true}
                            />
                          )}
                        />
                        <small>{errors?.invoiceNumber?.message}</small>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group input_text">
                        <label>Invoice Amount</label>
                        <Controller
                          name="invoiceAmount"
                          type="text"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <input
                              className={`form-control ${
                                errors?.invoiceAmount ? "error-input" : ""
                              }`}
                              type="text"
                              value={value}
                              onChange={onChange}
                              readOnly={true}
                              disabled={true}
                            />
                          )}
                        />
                        <small>{errors?.invoiceAmount?.message}</small>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6">
                      <div className="form-group input_text">
                        <label>
                          Balance Amount <span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="invoiceId"
                          type="hidden"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <input
                              type="hidden"
                              value={value}
                              onChange={onChange}
                            />
                          )}
                        />
                        <Controller
                          name="balanceAmount"
                          type="number"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <input
                              className={`form-control ${
                                errors?.balanceAmount ? "error-input" : ""
                              }`}
                              type="number"
                              value={value}
                              onChange={onChange}
                              readOnly={true}
                              disabled={true}
                            />
                          )}
                        />
                        <small>{errors?.balanceAmount?.message}</small>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12">
                      <div className="form-group input_text">
                        <label>Received Date</label>
                        <br></br>
                        <Controller
                          control={control}
                          name="received_on"
                          render={({ field: { onChange } }) => (
                            <DatePicker
                              className={`datetimepicker w-100 form-control ${
                                errors?.received_on ? "error-input" : ""
                              }`}
                              selected={receivedon}
                              dateFormat="dd/MM/yyyy"
                              onKeyDown={(e) => {
                                e.preventDefault();
                              }}
                              onChange={(val) => {
                                setreceivedon(val);
                                onChange(val);
                                trigger("received_on");
                              }}
                            ></DatePicker>
                          )}
                        />
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12">
                      <div className="form-group input_text">
                        <label>Payment Method</label>
                        <Controller
                          name="payment_method"
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              className={`w-100 ${
                                errors?.payment_method ? "error-input" : ""
                              }`}
                              placeholder="Choose Payment Method"
                              getOptionLabel={(option) => `${option.text}`}
                              getOptionValue={(option) => `${option.id}`}
                              options={paymentMethodsData}
                              classNamePrefix="select_kanakku"
                            />
                          )}
                        />
                        <small>{errors?.payment_method?.message}</small>
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12">
                      <div className="form-group input_text">
                        <label>
                          Amount <span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="amount"
                          type="text"
                          control={control}
                          render={({ field: { onChange } }) => (
                            <input
                              className={`form-control ${
                                errors?.amount ? "error-input" : ""
                              }`}
                              type="text"
                              name="amount"
                              value={amountValue}
                              onChange={onChange}
                              onKeyPress={handleKeyPress}
                              onPaste={handlePaste}
                              onDrop={handleDrop}
                              onBlur={handleBlur}
                              onKeyDown={handleKeyDown}
                              onInput={handleInput}
                              onDragStart={handleDragStart}
                              style={{ userSelect: "none" }}
                              placeholder="Enter Amount"
                              autoComplete="false"
                            />
                          )}
                        />
                        <small>{errors?.amount?.message}</small>
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12">
                      <div className="form-group input_text notes-form-group-info">
                        <label>Notes</label>
                        <Controller
                          name="notes"
                          type="text"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <textarea
                              className={`form-control ${
                                errors?.notes ? "error-input" : ""
                              }`}
                              type="text"
                              value={value}
                              onChange={onChange}
                              placeholder="Enter Notes"
                              autoComplete="false"
                            />
                          )}
                        />
                        <small>{errors?.notes?.message}</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <Link
                    to="#"
                    ref={addpaymentcancelModal}
                    data-bs-dismiss="modal"
                    className="btn btn-primary paid-cancel-btn me-2"
                  >
                    Cancel
                  </Link>
                  <button
                    className="btn btn-primary paid-continue-btn"
                    type="submit"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        {/* add payment end */}
      </div>
    </>
  );
};
export default ViewInvoice;
