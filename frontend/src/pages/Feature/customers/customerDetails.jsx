import React, { useContext, useEffect, useState } from "react";
import Header from "../layouts/Header";
import Sidebar from "../layouts/Sidebar";
import {
  ArchiveBook,
  Clipboard,
  MessageEdit,
  Recepit,
  Rotate,
  TransactionMinus,
} from "../../../common/imagepath";
import FeatherIcon from "feather-icons-react";
import { Table } from "antd";
import {
  onShowSizeChange,
  itemRender,
} from "../../../common/paginationfunction";
import "../../../common/antd.css";
import { Link } from "react-router-dom";
import { customerDetailsApi } from "../../../constans/apiname";
import { useParams } from "react-router-dom";
import { ApiServiceContext } from "../../../core/core-index";
import { hostName } from "../../../assets/constant";

const CustomerDetails = () => {
  const [menu, setMenu] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [viewCustomerDetails, setViewCustomerDetails] = useState({});
  let { id } = useParams();
  const { getData } = useContext(ApiServiceContext);
  useEffect(() => {
    getUserDetails();
  }, [id]);

  const getUserDetails = async () => {
    const url = `${customerDetailsApi}?_id=${id}`;
    try {
      const response = await getData(url);
      if (response?.data?.customerDetails) {
        setViewCustomerDetails(response?.data?.customerDetails?.[0]);
      }
    } catch {
      return false;
    }
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const toggleMobileMenu = () => {
    setMenu(!menu);
  };

  const columns = [
    {
      title: "Invoice ID",
      dataIndex: "Invoice",
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
            <span className="badge bg-danger-light text-danger">{text}</span>
          )}
          {text === "Partially Paid" && (
            <span className="badge bg-primary-light">{text}</span>
          )}
          {text === "Unpaid" && (
            <span className="badge bg-light-gray text-secondary">{text}</span>
          )}
          {text === "Draft" && (
            <span className="badge bg-light-gray text-primary">{text}</span>
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
          <div className="dropdown dropdown-action customer-details">
            <Link
              to="#"
              className=" btn-action-icon "
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="fas fa-ellipsis-v" />
            </Link>
            <div className="dropdown-menu dropdown-menu-end customer-dropdown">
              <ul>
                <li>
                  <Link className="dropdown-item" to="/edit-customer">
                    <i className="far fa-edit me-2" />
                    Edit
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item"
                    to="javascript:void(0);"
                    data-bs-toggle="modal"
                    data-bs-target="#delete_modal"
                  >
                    <i className="far fa-trash-alt me-2" />
                    Delete
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/customer-details">
                    <i className="far fa-eye me-2" />
                    View
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="#">
                    <FeatherIcon icon="send" className="me-2" />
                    Send
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="#">
                    <FeatherIcon icon="download" className="me-2" />
                    Download
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/add-sales-return">
                    <FeatherIcon icon="file-text" className="me-2" />
                    Convert to Sales Return
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="#">
                    <FeatherIcon icon="copy" className="me-2" />
                    Clone as Invoice
                  </Link>
                </li>
              </ul>
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
            {/* Page Header */}
            <div className="page-header">
              <div className="content-page-header">
                <h5>Customer Details</h5>
              </div>
            </div>
            {/* /Page Header */}
            <div className="card customer-details-group">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-xl-3 col-lg-4 col-md-6 col-12">
                    <div className="customer-details">
                      <div className="d-flex align-items-center">
                        <span className="customer-widget-img d-inline-flex">
                          <img
                            className="rounded-circle"
                            src={`${hostName}/${viewCustomerDetails?.image}`}
                            alt=""
                          />
                        </span>
                        <div className="customer-details-cont">
                          <h6>{viewCustomerDetails?.customer_name}</h6>
                          <p>{viewCustomerDetails?.name}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div className="col-xl-3 col-lg-4 col-md-6 col-12">
                    <div className="customer-details">
                      <div className="d-flex align-items-center">
                        <span className="customer-widget-icon d-inline-flex">
                          <i className="fe fe-mail">
                            <FeatherIcon icon="mail" />
                          </i>
                        </span>
                        <div className="customer-details-cont">
                          <h6>Email Address</h6>
                          <p>{viewCustomerDetails?.email}</p>
                        </div>
                      </div>
                    </div>
                  </div> */}
                  <div className="col-xl-3 col-lg-4 col-md-6 col-12">
                    <div className="customer-details">
                      <div className="d-flex align-items-center">
                        <span className="customer-widget-icon d-inline-flex">
                          <i className="fe fe-phone">
                            <FeatherIcon icon="phone" />
                          </i>
                        </span>
                        <div className="customer-details-cont">
                          <h6>Phone Number</h6>
                          <p>{viewCustomerDetails?.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-4 col-md-6 col-12">
                    <div className="customer-details">
                      <div className="d-flex align-items-center">
                        <span className="customer-widget-icon d-inline-flex">
                          <i className="fe fe-airplay">
                            <FeatherIcon icon="airplay" />
                          </i>
                        </span>
                        <div className="customer-details-cont">
                          <h6>Company Name</h6>
                          <p>Lynns Salon Corporation</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-4 col-md-6 col-12">
                    <div className="customer-details">
                      <div className="d-flex align-items-center">
                        <span className="customer-widget-icon d-inline-flex">
                          <i className="fe fe-globe">
                            <FeatherIcon icon="globe" />
                          </i>
                        </span>
                        <div className="customer-details-cont">
                          <h6>Website</h6>
                          <p className="customer-mail">
                            {viewCustomerDetails?.website}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-4 col-md-6 col-12">
                    <div className="customer-details">
                      <div className="d-flex align-items-center">
                        <span className="customer-widget-icon d-inline-flex">
                          <i className="fe fe-briefcase">
                            <FeatherIcon icon="briefcase" />
                          </i>
                        </span>
                        <div className="customer-details-cont">
                          <h6>Company Address</h6>
                          <p>
                            {viewCustomerDetails?.billingAddress?.addressLine1}{" "}
                            {viewCustomerDetails?.billingAddress?.addressLine2},{" "}
                            {viewCustomerDetails?.billingAddress?.pincode}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Search Filter */}
            <div id="filter_inputs" className="card filter-card">
              <div className="card-body pb-0">
                <div className="row">
                  <div className="col-sm-6 col-md-3">
                    <div className="form-group">
                      <label>Name</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  {/* <div className="col-sm-6 col-md-3">
                    <div className="form-group">
                      <label>Email</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div> */}
                  <div className="col-sm-6 col-md-3">
                    <div className="form-group">
                      <label>Phone</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Search Filter */}
            {/* Inovices card */}
            <div className="row">
              <div className="col-xl-2 col-lg-4 col-sm-6 col-12 d-flex">
                <div className="card inovices-card w-100">
                  <div className="card-body">
                    <div className="dash-widget-header">
                      <span className="inovices-widget-icon bg-info-light">
                        <img src={Recepit} alt="" />
                      </span>
                      <div className="dash-count">
                        <div className="dash-title">Total Invoice</div>
                        <div className="dash-counts">
                          <p>$298</p>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <p className="inovices-all">
                        No of Invoice{" "}
                        <span className="rounded-circle bg-light-gray">02</span>
                      </p>
                      <p className="inovice-trending text-success-light">
                        02{" "}
                        <span className="ms-2">
                          <FeatherIcon icon="trending-up" />
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-lg-4 col-sm-6 col-12 d-flex">
                <div className="card inovices-card w-100">
                  <div className="card-body">
                    <div className="dash-widget-header">
                      <span className="inovices-widget-icon bg-primary-light">
                        <img src={TransactionMinus} alt="" />
                      </span>
                      <div className="dash-count">
                        <div className="dash-title">Outstanding</div>
                        <div className="dash-counts">
                          <p>$325,215</p>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <p className="inovices-all">
                        No of Invoice{" "}
                        <span className="rounded-circle bg-light-gray">03</span>
                      </p>
                      <p className="inovice-trending text-success-light">
                        04{" "}
                        <span className="ms-2">
                          <FeatherIcon icon="trending-up" />
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-lg-4 col-sm-6 col-12 d-flex">
                <div className="card inovices-card w-100">
                  <div className="card-body">
                    <div className="dash-widget-header">
                      <span className="inovices-widget-icon bg-warning-light">
                        <img src={ArchiveBook} alt="" />
                      </span>
                      <div className="dash-count">
                        <div className="dash-title">Total Overdue</div>
                        <div className="dash-counts">
                          <p>$7825</p>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <p className="inovices-all">
                        No of Invoice{" "}
                        <span className="rounded-circle bg-light-gray">01</span>
                      </p>
                      <p className="inovice-trending text-danger-light">
                        03{" "}
                        <span className="ms-2">
                          <FeatherIcon icon="trending-down" />
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-lg-4 col-sm-6 col-12 d-flex">
                <div className="card inovices-card w-100">
                  <div className="card-body">
                    <div className="dash-widget-header">
                      <span className="inovices-widget-icon bg-primary-light">
                        <img src={Clipboard} alt="" />
                      </span>
                      <div className="dash-count">
                        <div className="dash-title">Cancelled</div>
                        <div className="dash-counts">
                          <p>100</p>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <p className="inovices-all">
                        No of Invoice{" "}
                        <span className="rounded-circle bg-light-gray">04</span>
                      </p>
                      <p className="inovice-trending text-danger-light">
                        05{" "}
                        <span className="ms-2">
                          <FeatherIcon icon="trending-down" />
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-lg-4 col-sm-6 col-12 d-flex">
                <div className="card inovices-card w-100">
                  <div className="card-body">
                    <div className="dash-widget-header">
                      <span className="inovices-widget-icon bg-green-light">
                        <img src={MessageEdit} alt="" />
                      </span>
                      <div className="dash-count">
                        <div className="dash-title">Draft</div>
                        <div className="dash-counts">
                          <p>$125,586</p>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <p className="inovices-all">
                        No of Invoice{" "}
                        <span className="rounded-circle bg-light-gray">06</span>
                      </p>
                      <p className="inovice-trending text-danger-light">
                        02{" "}
                        <span className="ms-2">
                          <FeatherIcon icon="trending-down" />
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-lg-4 col-sm-6 col-12 d-flex">
                <div className="card inovices-card w-100">
                  <div className="card-body">
                    <div className="dash-widget-header">
                      <span className="inovices-widget-icon bg-danger-light">
                        <img src={Rotate} alt="" />
                      </span>
                      <div className="dash-count">
                        <div className="dash-title">Recurring</div>
                        <div className="dash-counts">
                          <p>$86,892</p>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <p className="inovices-all">
                        No of Invoice{" "}
                        <span className="rounded-circle bg-light-gray">03</span>
                      </p>
                      <p className="inovice-trending text-success-light">
                        02{" "}
                        <span className="ms-2">
                          <FeatherIcon icon="trending-up" />
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Inovices card */}
            {/* Table */}
            <div className="row">
              <div className="col-sm-12">
                <div className="card-table">
                  <div className="card-body">
                    <div className="table-responsive table-hover customer-details table-striped">
                      <Table
                        pagination={{
                          total: viewCustomerDetails?.length,
                          showTotal: (total, range) =>
                            `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                          showSizeChanger: true,
                          onShowSizeChange: onShowSizeChange,
                          itemRender: itemRender,
                        }}
                        rowSelection={rowSelection}
                        rowKey={(record) => record.id}
                        columns={columns}
                        dataSource={viewCustomerDetails?.invoiceRecs}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Table */}
            {/* Delete Items Modal */}
            <div
              className="modal custom-modal fade"
              id="delete_modal"
              role="dialog"
            >
              <div className="modal-dialog modal-dialog-centered modal-md">
                <div className="modal-content">
                  <div className="modal-body">
                    <div className="form-header">
                      <h3>Delete Customer Details</h3>
                      <p>Are you sure want to delete?</p>
                    </div>
                    <div className="modal-btn delete-action">
                      <div className="row">
                        <div className="col-6">
                          <Link
                            to="#"
                            data-bs-dismiss="modal"
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
            {/* /Delete Items Modal */}
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerDetails;
