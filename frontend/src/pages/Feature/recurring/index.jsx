import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../layouts/Header";
import Sidebar from "../layouts/Sidebar";
import Data from "../assets/jsons/recurringInvoice";
import "../common/antd.css";
import { Table } from "antd";
import {
  onShowSizeChange,
  itemRender,
} from "../common/paginationfunction";
import AddVendor from "../vendors/addVendor";
import RecurringHead from "./recurringHead";
import FeatherIcon from "feather-icons-react";

const RecurringInvoice = () => {
  const [menu, setMenu] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [show, setShow] = useState(false);

  const toggleMobileMenu = () => {
    setMenu(!menu);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const datasource = Data?.Data;

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const columns = [
    {
      title: "Invoice ID",
      dataIndex: "Invoice",
      render: (text, record) => (
        <Link to="/invoice-details" className="invoice-link">
          {record.Invoice}
        </Link>
      ),
      sorter: (a, b) => a.Invoice.length - b.Invoice.length,
    },
    {
      title: "Category",
      dataIndex: "Category",
      sorter: (a, b) => a.Category.length - b.Category.length,
    },
    {
      title: "Created On",
      dataIndex: "Created",
      sorter: (a, b) => a.Created.length - b.Created.length,
    },
    {
      title: "Invoice To",
      dataIndex: "Name",
      render: (text, record) => (
        <h2 className="table-avatar">
          <Link to="/profile" className="avatar avatar-sm me-2">
            <img
              className="avatar-img rounded-circle"
              src={record.img}
              alt="User Image"
            />
          </Link>
          <Link to="/profile">
            {record.Name} <span>{record.Email}</span>
          </Link>
        </h2>
      ),
      sorter: (a, b) => a.Name.length - b.Name.length,
    },
    {
      title: "Total Amount",
      dataIndex: "Total",
      sorter: (a, b) => a.Total.length - b.Total.length,
    },
    {
      title: "Paid Amount",
      dataIndex: "Paid",
      sorter: (a, b) => a.Paid.length - b.Paid.length,
    },
    {
      title: "Payment Mode",
      dataIndex: "Payment",
      sorter: (a, b) => a.Payment.length - b.Payment.length,
    },
    {
      title: "Balance",
      dataIndex: "Balance",
      sorter: (a, b) => a.Balance.length - b.Balance.length,
    },
    {
      title: "Due Date",
      dataIndex: "Due",
      sorter: (a, b) => a.Due.length - b.Due.length,
    },
    {
      title: "Status",
      dataIndex: "Status",
      render: (text) => (
        <div>
          {text === "Paid" && (
            <span className="badge bg-success-light">{text}</span>
          )}
          {text === "Overdue" && (
            <span className="badge bg-warning-light text-warning">{text}</span>
          )}
          {text === "Cancelled" && (
            <span className="badge bg-danger-light">{text}</span>
          )}
        </div>
      ),
      sorter: (a, b) => a.Status.length - b.Status.length,
    },
    {
      title: "Action",
      dataIndex: "Action",
      render: () => (
        <>
          <div className="text-end recurring-text">
            <div className="dropdown dropdown-action">
              <Link
                to="#"
                className="btn-action-icon"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fas fa-ellipsis-v" />
              </Link>
              <div className="dropdown-menu dropdown-menu-end">
                <Link className="dropdown-item" to="/edit-invoice">
                  <i className="far fa-edit me-2" />
                  Edit
                </Link>
                <Link className="dropdown-item" to="/invoice-details">
                  <i className="far fa-eye me-2" />
                  View
                </Link>
                <Link
                  className="dropdown-item"
                  to="#"
                  data-bs-toggle="modal"
                  data-bs-target="#delete_modal"
                >
                  <i className="far fa-trash-alt me-2" />
                  Delete
                </Link>
                <Link className="dropdown-item" to="/invoice-details">
                  {/* <i className="fe fe-send me-2" /> */}
                  <FeatherIcon icon="send" className="me-2" />
                  Send
                </Link>
                <Link className="dropdown-item" to="/invoice-details">
                  {/* <i className="fe fe-file-text me-2" /> */}
                  <FeatherIcon icon="file-text" className="me-2" />
                  Clone Invoice
                </Link>
              </div>
            </div>
          </div>
        </>
      ),
      sorter: (a, b) => a.Action.length - b.Action.length,
    },
  ];

  return (
    <>
      <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
        <Header onMenuClick={() => toggleMobileMenu()} />
        <Sidebar />

        <div className="page-wrapper">
          <div className="content container-fluid">
            <RecurringHead setShow={setShow} show={show} />

            {/* /Inovices card */}

            {/* Table */}
            <div className="row">
              <div className="col-sm-12">
                <div className="card-table">
                  <div className="card-body invoiceList purchase">
                    <div className="table-responsive table-hover">
                      <Table
                        pagination={{
                          total: datasource.length,
                          showTotal: (total, range) =>
                            `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                          showSizeChanger: true,
                          onShowSizeChange: onShowSizeChange,
                          itemRender: itemRender,
                        }}
                        rowSelection={rowSelection}
                        columns={columns}
                        dataSource={datasource}
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

        <AddVendor setShow={setShow} show={show} />

        <div className="modal custom-modal fade" id="delete_paid" role="dialog">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <div className="form-header">
                  <h3>Delete Invoice Paid</h3>
                  <p>Are you sure want to delete?</p>
                </div>
                <div className="modal-btn delete-action">
                  <div className="row">
                    <div className="col-6">
                      <Link
                        to="#"
                        className="btn btn-primary paid-continue-btn"
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
      </div>
    </>
  );
};

export default RecurringInvoice;
