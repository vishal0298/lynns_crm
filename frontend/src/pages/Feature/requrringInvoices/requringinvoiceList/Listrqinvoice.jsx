import React, { useContext, useState, useEffect } from "react";
import { ListrqinvoiceContext } from "./Listrqinvoice.control";
import { useForm, Controller } from "react-hook-form";
import FeatherIcon from "feather-icons-react";
import "../../../../common/antd.css";
import { Link } from "react-router-dom";
import InvoiceFilter from "../invoiceFilter";
import { Table } from "antd";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  onShowSizeChange,
  itemRender,
} from "../../../../common/paginationfunction";
import { commonDatacontext } from "../../../../core/commonData";
import { amountFormat } from "../../../../common/helper";
import moment from "moment";

const Listrqinvoice = () => {
  const {
    onDelete,
    setShow,
    invoicelistData,
    show,
    RowId,
    setRowId,
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
    setInvoiceListData,
    handlePagination,
    page,
    pagesize,
    totalCount,
    setTotalCount,
  } = useContext(ListrqinvoiceContext);
  const { currencyData } = useContext(commonDatacontext);

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
    resetField("payment_method");
    setValue("invoiceNumber", data?.invoiceNumber);
    setValue("invoiceId", data?._id);
    setValue("invoiceAmount", data.TotalAmount);
    setValue("balanceAmount", data.balance);
    setValue("amount", data.balance);
  };

  const [amountvalue, setamountValue] = useState("");

  const handleInputChange = (event) => {
    const numericValue = event.target.value.replace(/[^0-9.]/g, "");
    setamountValue(numericValue);
  };

  useEffect(() => {
    setValue("amount", amountvalue);
  }, [amountvalue]);

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset();
    }
  }, [formState, reset]);

  const columns = [
    {
      title: "#",
      dataIndex: "key",
      render: (value, item, index) => (page - 1) * pagesize + (index + 1),
    },
    {
      title: "Invoice ",
      dataIndex: "invoiceNumber",
      render: (text, record) => (
        <Link
          to={{ pathname: `${"/edit-invoice"}/${record._id}` }}
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
            to={{ pathname: `${"/edit-customer"}/${record?.customerId?._id}` }}
            className="avatar avatar-sm me-2"
          >
            {record.renderImage}
            {record?.customerId?.image ? (
              <img
                className="avatar-img rounded-circle"
                src={record?.customerId?.image}
                onError={(event) => {
                  event.target.src = "/fd81bd24259926e384cfb88c2301d548.png";
                }}
                alt="#"
              />
            ) : (
              <img
                className="aavatar avatar-sm me-2 avatar-img rounded-circle"
                src="/fd81bd24259926e384cfb88c2301d548.png"
                alt="User Image"
              />
            )}
          </Link>
          <Link
            to={{ pathname: `${"/edit-customer"}/${record?.customerId?._id}` }}
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
          {currencyData ? currencyData : "$"}
          {amountFormat(record.TotalAmount)}
        </>
      ),
    },
    {
      title: "Paid Amount",
      dataIndex: "paidAmount",
      render: (text, record) => (
        <>
          {currencyData ? currencyData : "$"}
          {amountFormat(record?.paidAmount)}
        </>
      ),
    },
    {
      title: "Balance",
      dataIndex: "balance",
      render: (text, record) => (
        <>
          {currencyData ? currencyData : "$"}
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
            <span className="badge bg-info-lights">{text}</span>
          )}
          {text === "UNPAID" && (
            <span className="badge bg-light-gray text-secondary">{text}</span>
          )}
          {text === "PARTIALLY_PAID" && (
            <span className="badge bg-primary-light">PARTIALLY PAID</span>
          )}
          {text === "CANCELLED" && (
            <span className="badge bg-danger-light">{text}</span>
          )}
          {text === "OVERDUE" && (
            <span className="badge bg-warning-light text-warning">{text}</span>
          )}
          {text === "PAID" && (
            <span className="badge bg-success-light">{text}</span>
          )}
          {text === "DRAFTED" && (
            <span className="badge bg-success-light">{text}</span>
          )}
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "Action",
      render: (text, record) => (
        <>
          <div className="text-end customer-details">
            <div className="dropdown dropdown-action">
              <Link
                to="#"
                className="btn-action-icon"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fas fa-ellipsis-v" />
              </Link>
              <div className="dropdown-menu dropdown-menu-end customer-dropdown">
                {record?.status != "PAID" && (
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
                <Link
                  className="dropdown-item"
                  to={{ pathname: `${"/edit-invoice"}/${record._id}` }}
                >
                  <i className="far fa-edit me-2" />
                  Edit
                </Link>
                <Link
                  className="dropdown-item"
                  to={{ pathname: `${"/view-invoice"}/${record._id}` }}
                >
                  <i className="far fa-eye me-2" />
                  View
                </Link>
                
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
                <Link
                  className="dropdown-item"
                  onClick={() => setRowId(record?._id)}
                  data-bs-toggle="modal"
                  data-bs-target="#requringStatus_modal"
                  to="/#"
                >
                  <FeatherIcon icon="file-text" className="me-2" />
                  Recurring
                </Link>
                <Link
                  className="dropdown-item"
                  onClick={() => setRowId(record?._id)}
                  data-bs-toggle="modal"
                  data-bs-target="#clone_modal"
                  to="/#"
                >
                  <FeatherIcon icon="copy" className="me-2" />
                  Clone as Recurring Invoice
                </Link>
              </div>
            </div>
          </div>
        </>
      ),
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="page-header">
            <div className="content-page-header">
              <h5>Recurring Invoices</h5>
              <div className="list-btn">
                <ul className="filter-list">
              
                </ul>
              </div>
            </div>
          </div>

         

          {/* Table */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card-table">
                <div className="card-body product-list">
                  <div className="table-responsive table-hover">
                    <Table
                      pagination={{
                        total: totalCount,
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
                      rowKey={(record) => record.id}
                    />
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
        setInvoiceListData={setInvoiceListData}
        page={page}
        pagesize={pagesize}
        fromDate={fromDate}
        toDate={toDate}
        setfromDate={setfromDate}
        settoDate={settoDate}
        setTotalCount={setTotalCount}
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
                      onClick={() => convertTosalesReturn(RowId)}
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
                <h3>Change Invoice Requrring Status </h3>
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
                      Change
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
                            value={value}
                            onChange={onChange}
                            readOnly={true}
                            disabled={true}
                          />
                        )}
                        defaultValue=""
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
                        defaultValue=""
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
                        defaultValue=""
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
                        defaultValue=""
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
                      <small>{errors?.payment_method?.id?.message}</small>
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
                        render={({ field: { value } }) => (
                          <input
                            className={`form-control ${
                              errors?.amount ? "error-input" : ""
                            }`}
                            type="text"
                            value={value}
                            onChange={handleInputChange}
                            placeholder="Enter Amount"
                            autoComplete="false"
                          />
                        )}
                        defaultValue=""
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
   
    </>
  );
};
export default Listrqinvoice;
