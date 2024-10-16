import React, { useContext, useState, useEffect, useRef } from "react";
import { ListinvoiceContext } from "./Listinvoice.control";
import { useForm, Controller } from "react-hook-form";
import FeatherIcon from "feather-icons-react";
import "../../../../common/antd.css";
import { Link } from "react-router-dom";
import InvoiceFilter from "../invoiceFilter";
import InvoiceHead from "../invoiceHead";
import { Table } from "antd";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  onShowSizeChange,
  itemRender,
} from "../../../../common/paginationfunction";
import { commonDatacontext } from "../../../../core/commonData";
import { amountFormat, convertFirstLetterToCapital } from "../../../../common/helper";
import alterUserimg from "../../../../assets/img/profile-holder.png";
import moment from "moment";

const Listinvoice = () => {
  const {
    onDelete,
    setShow,
    invoicelistData,
    show,
    activeTab,
    getInvoicetabData,
    RowId,
    setRowId,
    setconvertData,
    convertData,
    send,
    clone,
    requringStatus,
    convertTosalesReturn,
    receivedon,
    setreceivedon,
    paymentMethodsData,
    addpaymentsForm,
    addpaymentcancelModal,
    addpaymentschema,
    fromDate,
    toDate,
    setfromDate,
    settoDate,
    admin,
    permission,
    setInvoiceListData,
    handlePagination,
    page,
    pagesize,
    totalCount,
    setTotalCount,
    setPage,
    sendpaymentLink,
  } = useContext(ListinvoiceContext);
  const { currencyData } = useContext(commonDatacontext);
  const { create, update, view, delete: remove } = permission;
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);

  
  const [totalAmount, setTotalAmount] = useState()
  
  const calculateTotalAmount = () => {
    let total = 0;
    if(invoicelistData?.length > 0)
      {
        console.log(invoicelistData)
      invoicelistData?.map((invocie)=>{
      invocie?.items?.map((item) => {
        total += parseInt(item.amount)
      })
    })
    setTotalAmount(total)
    } 
  }
  useEffect(() => {
    if(Array.isArray(invoicelistData) && invoicelistData?.length != 0){
      calculateTotalAmount()
    }
  }, [invoicelistData])
  
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
    
  };
  const paginationConfig = {
    current: currentPage,
    pageSize: pageSize,
    total: totalCount,
    onChange: handlePageChange,
    showSizeChanger: true,
    onShowSizeChange: handlePageChange,
  };
  useEffect(() => {
  }, [totalCount]);
  const editModal = (data) => {
    let paymentmethodobj = paymentMethodsData.find(
      (obj) => obj.value == data?.payment_method
    );
    resetField("notes");
    setValue("invoiceNumber", data?.invoiceNumber);
    setValue("invoiceId", data?._id);
    setValue("invoiceAmount", amountFormat(data.TotalAmount));
    setValue("balanceAmount", amountFormat(data.balance));
    setValue("amount", Number(data.balance).toFixed(2));
    setAmountValue(Number(data.balance).toFixed(2));
    setValue(
      "payment_method",
      paymentmethodobj || { label: "Cash", value: "Cash" }
    );
  };

  const [amountValue, setAmountValue] = useState("");
  const cursorPosition = useRef(null);

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

  const columns = [
    {
      title: "#",
      dataIndex: "key",
      render: (text, record, index) => (page - 1) * pagesize + (index + 1),
    },
    {
      title: "Invoice Number",
      dataIndex: "invoiceNumber",
      render: (text, record) => (
        <Link
          to={ ((view || admin)) ?{ pathname: `${"/view-invoice"}/${record._id}`} : "#" }
          className="invoice-link"
        >
          {record.invoiceNumber}
        </Link>
      ),
    },
    {
      title: "Created On",
      dataIndex: "invoiceDate",
      render: (text) => moment(text).format("DD-MM-YYYY"),
    },
    {
      title: "Invoice To",
      dataIndex: "Name",
      render: (text, record) => (
        <h2 className="table-avatar">
          <Link
            to={{ pathname: `${"/view-customer"}/${record?.customerId?._id}` }}
            className="avatar avatar-sm me-2"
          >
            {record.renderImage}
            {record?.customerId?.image ? (
              <img
                className="avatar-img rounded-circle"
                src={record?.customerId?.image}
                onError={(event) => {
                  event.target.src = alterUserimg;
                }}
                alt="#"
              />
            ) : (
              <img
                className="aavatar avatar-sm me-2 avatar-img rounded-circle"
                src={alterUserimg}
                alt="User Image"
              />
            )}
          </Link>
          <Link
            to={{ pathname: `${"/view-customer"}/${record?.customerId?._id}` }}
          >
            {record?.customerId?.name
              ? record?.customerId?.name
              : `Deleted Customer`}{" "}
            {record?.customerId?.phone && (
              <span>{record?.customerId?.phone}</span>
            )}
          </Link>
        </h2>
      ),
    },
    {
      title: "Total Amount",
      dataIndex: "TotalAmount",
      render: (text, record) => (
        <>
          {currencyData}
          {amountFormat(record.TotalAmount)}
        </>
      ),
    },
    {
      title: "Paid Amount",
      dataIndex: "paidAmount",
      render: (text, record) => (
        <>
          {currencyData}
          {amountFormat(record?.paidAmount)}
        </>
      ),
    },
    {
      title: "Payment Mode",
      dataIndex: "payment_method",
    },
    {
      title: "Balance",
      dataIndex: "balance",
      render: (text, record) => (
        <>
          {currencyData}
          {amountFormat(record?.balance)}
        </>
      ),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      render: (text) => moment(text).format("DD-MM-YYYY"),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => (
        <div>
          {text === "REFUND" && (
            <span className="badge bg-info-lights">
              {convertFirstLetterToCapital(text)}
            </span>
          )}
          {text === "SENT" && (
            <span className="badge bg-info-lights">
              {convertFirstLetterToCapital(text)}
            </span>
          )}
          {text === "UNPAID" && (
            <span className="badge bg-light-gray text-secondary">
              {convertFirstLetterToCapital(text)}
            </span>
          )}
          {text === "PARTIALLY_PAID" && (
            <span className="badge bg-primary-light">Partially Paid</span>
          )}
          {text === "CANCELLED" && (
            <span className="badge bg-danger-light">
              {convertFirstLetterToCapital(text)}
            </span>
          )}
          {text === "OVERDUE" && (
            <span className="badge bg-danger-light">
              {convertFirstLetterToCapital(text)}
            </span>
          )}
          {text === "PAID" && (
            <span className="badge bg-success-light">
              {convertFirstLetterToCapital(text)}
            </span>
          )}
          {text === "DRAFTED" && (
            <span className="badge bg-warning">
              {convertFirstLetterToCapital(text)}
            </span>
          )}
        </div>
      ),
    },
    (create || update || admin) && {
      title: "Action",
      dataIndex: "Action",
      render: (text, record) => (
        <>
          <div className="d-flex align-items-center customer-details">
            <div className="dropdown dropdown-action">
              <Link
                to="#"
                className="btn-action-icon"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fas fa-ellipsis-v" />
              </Link>
              <div className="dropdown-menu dropdown-menu-end quatation-dropdown invoice-dropdown-menu">
                {record?.status != "PAID" &&
                  record?.payment_method != "Online" &&
                  (create || update || admin) && (
                    <Link
                      className="dropdown-item"
                      to="#"
                      onClick={() => editModal(record)}
                      data-bs-toggle="modal"
                      data-bs-target="#add_payment"
                    >
                      <i className="fa-solid fa-cash-register me-2" />
                      Payment
                    </Link>
                  )}

                {record?.status != "PAID" && (create || update || admin) && (
                  <Link
                    className="dropdown-item"
                    to="#"
                    onClick={() => setRowId(record?._id)}
                    data-bs-toggle="modal"
                    data-bs-target="#send_payment_modal"
                  >
                    <FeatherIcon icon="credit-card" className="me-2" />
                    Send Payment Link
                  </Link>
                )}

                {(update || admin) &&
                  record?.status != "PAID" &&
                  record?.status != "PARTIALLY_PAID" && (
                    <Link
                      className="dropdown-item"
                      to={{ pathname: `${"/edit-invoice"}/${record._id}` }}
                    >
                      <i className="far fa-edit me-2" />
                      Edit
                    </Link>
                  )}
               

                {(create || update || admin) && (
                  <Link
                    className="dropdown-item"
                    to="#"
                    onClick={() => setRowId(record?._id)}
                    data-bs-toggle="modal"
                    data-bs-target="#send_modal"
                  >
                    <FeatherIcon icon="send" className="me-2" />
                    Send
                  </Link>
                )}
                <Link className="dropdown-item"  to={{ pathname: `${"/print-download-invoice"}/${record._id}` }}>
                  <FeatherIcon icon="download" className="me-2" />
                  Print & Download
                </Link>
                {(create || update || admin) && !record.isSalesReturned && (
                  <Link
                    className="dropdown-item"
                    onClick={() => setRowId(record?._id)}
                    data-bs-toggle="modal"
                    data-bs-target="#convert_modal"
                    to="/#"
                  >
                    <FeatherIcon icon="file-text" className="me-2" />
                    Convert to Sales Return
                  </Link>
                )}
                {record?.isRecurring && (create || update || admin) && (
                  <Link
                    className="dropdown-item"
                    onClick={() => setRowId(record?._id)}
                    data-bs-toggle="modal"
                    data-bs-target="#requringStatus_modal"
                    to="/#"
                  >
                    <FeatherIcon icon="file-text" className="me-2" />
                    Cancel Recurring
                  </Link>
                )}
                {(create || update || admin) && (
                  <Link
                    className="dropdown-item"
                    onClick={() => setRowId(record?._id)}
                    data-bs-toggle="modal"
                    data-bs-target="#clone_modal"
                    to="/#"
                  >
                   
                    <FeatherIcon icon="copy" className="me-2" />
                    Clone as Invoice
                  </Link>
                )}
              </div>
            </div>
          </div>
        </>
      ),
    },
  ].filter(Boolean);

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <InvoiceHead
            invoicelistData={invoicelistData}
            setShow={setShow}
            show={show}
            currencyData={currencyData}
            amountFormat={amountFormat}
            permission={permission}
            admin={admin}
          />

          <div className="card invoices-tabs-card">
            <div className="invoices-main-tabs">
              <div className="row align-items-center">
                <div className="col-lg-12">
                  <div className="invoices-tabs">
                    <ul>
                      <li>
                        <Link
                          to={"/invoice-list"}
                          className={activeTab == "ALL" ? "active" : ""}
                          onClick={() => getInvoicetabData("ALL")}
                        >
                          All
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={"/invoice-list"}
                          className={activeTab == "PAID" ? "active" : ""}
                          onClick={() => getInvoicetabData("PAID")}
                        >
                          Paid
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={"/invoice-list"}
                          className={activeTab == "OVERDUE" ? "active" : ""}
                          onClick={() => getInvoicetabData("OVERDUE")}
                        >
                          Overdue
                        </Link>
                      </li>
                     
                      <li>
                        <Link
                          to={"/invoice-list"}
                          className={
                            activeTab == "PARTIALLY_PAID" ? "active" : ""
                          }
                          onClick={() => getInvoicetabData("PARTIALLY_PAID")}
                        >
                          Partially paid
                        </Link>
                      </li>
                     
                      <li>
                        <Link
                          to={"/invoice-list"}
                          className={activeTab == "DRAFTED" ? "active" : ""}
                          onClick={() => getInvoicetabData("DRAFTED")}
                        >
                          Draft
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={"/invoice-list"}
                          className={activeTab == "SENT" ? "active" : ""}
                          onClick={() => getInvoicetabData("SENT")}
                        >
                          Sent
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card-table">
                <div className="card-body product-list purchase">
                  <div className="table-responsive table-hover">
                    <Table
                      pagination={{
                        total: totalCount,
                        paginationConfig,
                        showTotal: (total, range) =>
                          `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                        showSizeChanger: true,
                        onShowSizeChange: onShowSizeChange,
                        itemRender: itemRender,
                        pageSizeOptions: [10, 25, 50, 100],
                        defaultPageSize: 10,
                        defaultCurrent: 1,
                        onChange: (page, pageSize) =>
                          handlePagination(page, pageSize),
                      }}
                      columns={columns}
                      dataSource={invoicelistData}
                      rowKey={(record) => record._id}
                    />
                   <b>Total Amount {amountFormat(totalAmount)}</b> 
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* /Table */}
        </div>
      </div>

      <InvoiceFilter
        setShow={setShow}
        show={show}
        invoicelistData={invoicelistData}
        setInvoiceListData={setInvoiceListData}
        page={page}
        pagesize={pagesize}
        fromDate={fromDate}
        toDate={toDate}
        setfromDate={setfromDate}
        settoDate={settoDate}
        setTotalCount={setTotalCount}
        setPage={setPage}
        handlePagination={handlePagination}
      />

      <div className="modal custom-modal fade" id="delete_modal" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-body">
              <div className="form-header">
                <h3>Delete Invoice</h3>
                <p>Are you sure want to delete?</p>
              </div>
              <div className="modal-btn delete-action">
                <div className="row">
                  <div className="col-6">
                    <button
                      type="reset"
                      onClick={() => onDelete(RowId)}
                      data-bs-dismiss="modal"
                      className="w-100 btn btn-primary paid-continue-btn"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="col-6">
                    <button
                      type="submit"
                      data-bs-dismiss="modal"
                      className="w-100 btn btn-primary paid-cancel-btn"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal custom-modal fade" id="send_modal" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-body">
              <div className="form-header">
                <h3>Send Invoice</h3>
                <p>Are you sure want to send Invoice ?</p>
              </div>
              <div className="modal-btn delete-action">
                <div className="row">
                  <div className="col-6">
                    <button
                      type="reset"
                      onClick={() => send(RowId)}
                      data-bs-dismiss="modal"
                      className="w-100 btn btn-primary paid-continue-btn"
                    >
                      Send
                    </button>
                  </div>
                  <div className="col-6">
                    <button
                      data-bs-dismiss="modal"
                      className="w-100 btn btn-primary paid-cancel-btn"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal custom-modal fade"
        id="send_payment_modal"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-body">
              <div className="form-header">
                <h3>Send Payment Link</h3>
                <p>Are you sure want to Pay On Online ?</p>
              </div>
              <div className="modal-btn delete-action">
                <div className="row">
                  <div className="col-6">
                    <button
                      type="reset"
                      onClick={() => sendpaymentLink(RowId)}
                      data-bs-dismiss="modal"
                      className="w-100 btn btn-primary paid-continue-btn"
                    >
                      Send Payment Link
                    </button>
                  </div>
                  <div className="col-6">
                    <button
                      data-bs-dismiss="modal"
                      className="w-100 btn btn-primary paid-cancel-btn"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal custom-modal fade" id="convert_modal" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-body">
              <div className="form-header">
                <h3>Convert to Sales Return</h3>
                <p>Are you sure want to Convert?</p>
              </div>
              <div className="modal-btn delete-action">
                <div className="row">
                  <div className="col-6">
                    <button
                      type="reset"
                      onClick={() => convertTosalesReturn(RowId, activeTab)}
                      data-bs-dismiss="modal"
                      className="w-100 btn btn-primary paid-continue-btn"
                    >
                      Convert
                    </button>
                  </div>
                  <div className="col-6">
                    <button
                      data-bs-dismiss="modal"
                      className="w-100 btn btn-primary paid-cancel-btn"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal custom-modal fade"
        id="requringStatus_modal"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-body">
              <div className="form-header">
                <h3>Cancel Recurring Invoice </h3>
                <p>Are you sure ?</p>
              </div>
              <div className="modal-btn delete-action">
                <div className="row">
                  <div className="col-6">
                    <button
                      type="reset"
                      onClick={() => requringStatus(RowId)}
                      data-bs-dismiss="modal"
                      className="w-100 btn btn-primary paid-continue-btn"
                    >
                      Yes
                    </button>
                  </div>
                  <div className="col-6">
                    <button
                      data-bs-dismiss="modal"
                      className="w-100 btn btn-primary paid-cancel-btn"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal custom-modal fade" id="clone_modal" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-body">
              <div className="form-header">
                <h3>Clone Invoice</h3>
                <p>Are you sure want to clone this ?</p>
              </div>
              <div className="modal-btn delete-action">
                <div className="row">
                  <div className="col-6">
                    <button
                      type="reset"
                      onClick={() => clone(RowId)}
                      data-bs-dismiss="modal"
                      className="w-100 btn btn-primary paid-continue-btn"
                    >
                      Clone
                    </button>
                  </div>
                  <div className="col-6">
                    <button
                      data-bs-dismiss="modal"
                      className="w-100 btn btn-primary paid-cancel-btn"
                    >
                      Cancel
                    </button>
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
                            value={value || ""}
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
                            value={value || ""}
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
                            value={value || ""}
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
                            type="text"
                            value={value || ""}
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
                            className={`form-control react-selectcomponent w-100 ${
                              errors?.payment_method ? "error-input" : ""
                            }`}
                            placeholder="Select Payment Method"
                            options={paymentMethodsData}
                          />
                        )}
                      />
                      <small>{errors?.payment_method?.value?.message}</small>
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group input_text">
                      <label>
                        Amount <span className="text-danger">*</span>
                      </label>
                      <Controller
                        name="amount"
                        control={control}
                        defaultValue=""
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
                            value={value || ""}
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
     
    </>
  );
};
export default Listinvoice;
