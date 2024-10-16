import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import "../../../../common/antd.css";
import { Table } from "antd";
import FeatherIcon from "feather-icons-react";
import {
  onShowSizeChange,
  itemRender,
} from "../../../../common/paginationfunction";
import ExpenseFilter from "../expenseFilter";
import { ListExpenseContext } from "./listExpense.control";
import { commonDatacontext } from "../../../../core/commonData";

const ListExpense = () => {
  const {
    show,
    setShow,
    expense,
    setExpense,
    onDelete,
    expenseDelete,
    setExpenseDelete,
    admin,
    permission,
    handlePagination,
    page,
    pagesize,
    totalCount,
    setTotalCount,
    setPage,
  } = useContext(ListExpenseContext);

  const { currencyData } = useContext(commonDatacontext);
  const { create, update, delete: remove } = permission;
  // eslint-disable-next-line no-unused-vars
  const [product, setProduct] = useState([
    { id: 1, text: "Select Payment Mode" },
    { id: 2, text: "Cash" },
    { id: 3, text: "Upi" },
    { id: 4, text: "Card" },
    { id: 5, text: "Membership" },
  ]);

  // eslint-disable-next-line no-unused-vars
  const [payment, setPayment] = useState([
    { id: 1, text: "Select Payment Status" },
    { id: 2, text: "Paid" },
    { id: 3, text: "Payment" },
    { id: 4, text: "Pending" },
  ]);

  const columns = [
    {
      title: "#",
      dataIndex: "Id",
      render: (text, record, index) => (page - 1) * pagesize + (index + 1),
    },
    {
      title: "Expense ID",
      dataIndex: "expenseId",
      render: (text,record) => (
        <Link
          to={(admin || permission?.view) ? {pathname: `${"/view-expenses"}/${record?._id}`} : '#'}>
           <span>{text}</span>
        </Link>
      )
    },
    {
      title: "Reference",
      dataIndex: "reference",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (text, record) => (
      
        <>
          {currencyData}
          {((BigInt(record?.amount)).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }))}
        </>
      ),
    },
    {
      title: "Payment Mode",
      dataIndex: "paymentMode",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => (
        <div>
          {text === "Paid" && (
            <span className="badge bg-success-light text-success-light">
              {text}
            </span>
          )}
          {text === "Pending" && (
            <span className="badge bg-warning-light text-warning-light">
              {text}
            </span>
          )}
          {text === "Cancelled" && (
            <span className="badge bg-danger-light">{text}</span>
          )}
        </div>
      ),
    },
    (update || remove || admin) && {
      title: "Action",
      dataIndex: "Action",
      render: (text, record) => {
        return (
          <>
            <div className="d-flex align-items-center credit-notes">
             
              <div className="dropdown dropdown-action">
                <Link
                  to="#"
                  className=" btn-action-icon "
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fas fa-ellipsis-v" />
                </Link>
                <div className="dropdown-menu dropdown-menu-right">
                  <ul>
                    {(update || admin) && (
                      <li>
                        <Link
                          className="dropdown-item"
                          to={`/edit-expenses/${record?._id}`}
                          
                        >
                          <i className="far fa-edit me-2" />
                          Edit
                        </Link>
                      </li>
                    )}
                    {(remove || admin) && (
                      <li>
                        <Link
                          className="dropdown-item"
                          to="#"
                          data-bs-toggle="modal"
                          data-bs-target="#delete_modal"
                          onClick={() => setExpenseDelete(record._id)}
                        >
                          <i className="far fa-trash-alt me-2" />
                          Delete
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </>
        );
      },
    },
  ].filter(Boolean);

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="content-page-header">
              <h5>Expenses</h5>
              <div className="list-btn">
                <ul className="filter-list">
                  <li>
                    <Link
                      className="btn btn-filters w-auto popup-toggle"
                      onClick={() => setShow(!show)}
                    >
                      <span className="me-2">
                        <FeatherIcon icon="filter" />
                      </span>
                      Filter{" "}
                    </Link>
                  </li>

                  {(create || admin) && (
                    <li>
                      <Link
                        className="btn btn-primary"
                        to="/add-expenses"
                      >
                        <i
                          className="fa fa-plus-circle me-2"
                          aria-hidden="true"
                        />
                        Add Expenses
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          {/* Table */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card-table">
                <div className="card-body purchase">
                  <div className="table-responsive table-hover">
                    <Table
                      pagination={{
                        total: totalCount,
                        current: page,
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
                      dataSource={expense}
                      rowKey={(record) => record?._id}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* /Table */}
        </div>
      </div>
      <ExpenseFilter
        setShow={setShow}
        show={show}
        setExpense={setExpense}
        page={page}
        pagesize={pagesize}
        setTotalCount={setTotalCount}
        setPage={setPage}
        handlePagination={handlePagination}
      />
      <div className="modal custom-modal fade" id="add_expenses" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header border-0 pb-0">
              <div className="form-header modal-header-title text-start mb-0">
                <h4 className="mb-0">Add Expenses</h4>
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
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label>Expense ID</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Expense ID"
                    />
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label>Reference</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Reference"
                    />
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label>Amount </label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter Amount"
                    />
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label>Payment Mode</label>
                    <Select
                      // className="w-100"
                      data={product}
                      options={{
                        placeholder: "Select Payment Mode",
                      }}
                    />
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label>Expense Date </label>
                    <input
                      type="text"
                      className="form-control datetimepicker"
                      placeholder="Select Expense Date"
                    />
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label>Payment Status</label>
                    <Select
                      // className="w-100"
                      data={payment}
                      options={{
                        placeholder: "Select Payment Status",
                      }}
                    />
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <div className="form-upload-label">
                      <label>Attachment </label>
                    </div>
                    <div className="form-upload-file">
                      <span>
                        <i className="fe fe-upload-cloud me-2" />
                        Attach Files
                      </span>
                      <input type="file" multiple="" id="image_sign" />
                      <div id="frames" />
                    </div>
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="form-group mb-0">
                    <label>Notes</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Notes"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <Link
                to="#"
                data-bs-dismiss="modal"
                className="btn btn-primary paid-cancel-btn me-2"
              >
                Cancel
              </Link>
              <Link
                to="#"
                data-bs-dismiss="modal"
                className="btn btn-primary paid-continue-btn"
              >
                Add Expenses
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="modal custom-modal fade" id="edit_expenses" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header border-0 pb-0">
              <div className="form-header modal-header-title text-start mb-0">
                <h4 className="mb-0">Edit Expenses</h4>
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
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label>Expense ID</label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue="EXP-148061"
                      placeholder="Enter Name"
                    />
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label>Reference</label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue={25689825}
                      placeholder="Enter Reference Number"
                    />
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label>Amount</label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue="1,54,220"
                      placeholder="Select Date"
                    />
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label>Payment Mode</label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue="Cash"
                      placeholder="Enter Payment Mode"
                    />
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label>Expense Date</label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue="29 Jan 2022"
                      placeholder="Enter Expense Date"
                    />
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label>Payment Mode</label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue="Cash"
                      placeholder="Enter Payment Mode"
                    />
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label>Attachment</label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue="Attachment"
                      placeholder="Enter Attachment Number"
                    />
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="form-group mb-0">
                    <label>Notes</label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue="Notes"
                      placeholder="Enter Notes Number"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <Link
                to="#"
                data-bs-dismiss="modal"
                className="btn btn-primary paid-cancel-btn me-2"
              >
                Cancel
              </Link>
              <Link
                to="#"
                data-bs-dismiss="modal"
                className="btn btn-primary paid-continue-btn"
              >
                Update
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="modal custom-modal fade" id="delete_modal" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-body">
              <div className="form-header">
                <h3>Delete Expenses</h3>
                <p>Are you sure want to delete?</p>
              </div>
              <div className="modal-btn delete-action">
                <div className="row">
                  <div className="col-6">
                    <button
                      type="reset"
                      data-bs-dismiss="modal"
                      className="w-100 btn btn-primary paid-continue-btn"
                      onClick={() => onDelete(expenseDelete)}
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
    </>
  );
};
export default ListExpense;
