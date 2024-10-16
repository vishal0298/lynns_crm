import React, { useContext, useEffect, useState } from "react";
import {
  ArchiveBook,
  MessageEdit,
  PreviewImg,
  Recepit,
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
import { commonDatacontext } from "../../../core/commonData";
import moment from "moment";
import { userRolesCheck } from "../../../common/commonMethods";

const ViewCustomer = () => {
  const [viewCustomerDetails, setViewCustomerDetails] = useState({});
  let { id } = useParams();
  const { getData } = useContext(ApiServiceContext);
  const { currencyData } = useContext(commonDatacontext);

  useEffect(() => {
    getUserDetails();
    let findModule = userRolesCheck("invoice");
    if (findModule == "admin") {
      setAdmin(true);
    } else {
      setinvoicePermission(findModule);
    }
  }, [id]);

    // For Roles and Permissions
    const [invoicepermission, setinvoicePermission] = useState({});
    const [admin, setAdmin] = useState(false);
    const {view} = invoicepermission;
  

  const getUserDetails = async () => {
    const url = `${customerDetailsApi}?_id=${id}`;
    // const url = `${customerDetailsApi}${id}`;
    try {
      const response = await getData(url);
      if (response?.data) {
        setViewCustomerDetails(response?.data);
      }
    } catch {
      return false;
    }
  };

  const columns = [
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
      title: "Total Amount",
      dataIndex: "TotalAmount",
      render: (text, record) => (
        <>
          {currencyData ? currencyData : "$"}
          {Number(record?.TotalAmount ? record?.TotalAmount : 0).toLocaleString(
            "en-IN",
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )}
        </>
      ),
    },
    {
      title: "Paid Amount",
      dataIndex: "paidAmount",
      render: (text, record) => (
        <>
          {currencyData ? currencyData : "$"}
          {Number(record?.paidAmount ? record?.paidAmount : 0).toLocaleString(
            "en-IN",
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )}
        </>
      ),
    },
    {
      title: "Balance",
      dataIndex: "balance",
      render: (text, record) => (
        <>
          {currencyData ? currencyData : "$"}
          {Number(record?.balance ? record?.balance : 0).toLocaleString(
            "en-IN",
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )}
        </>
      ),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      render: (text) => moment(text).format("DD-MM-YYYY"),
      // sorter: (a, b) => a.Due.length - b.Due.length,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => (
        <div>
          {text === "PAID" && (
            <span className="badge bg-success-light">{text}</span>
          )}
          {text === "PARTIALLY_PAID" && (
            <span className="badge bg-primary-light">PARTIALLY_PAID</span>
          )}
          {text === "DRAFTED" && (
            <span className="badge bg-light-gray text-primary">{text}</span>
          )}
          {text === "SENT" && (
            <span className="badge bg-info-lights">{text}</span>
          )}
        </div>
      ),
    },
  ];
  const cardDetails = viewCustomerDetails?.cardDetails?.[0];

  const customer = viewCustomerDetails?.customerDetails?.[0];

  return (
    <>
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
                  <div className="col-xl-6 col-12">
                    <div className="customer-details">
                      <div className="d-flex align-items-center">
                        <span className="customer-widget-img d-inline-flex">
                          <img
                            className="rounded-circle"
                            src={customer?.image ? customer?.image : PreviewImg}
                            alt=""
                          />
                        </span>
                        <div className="customer-details-cont">
                          <h6>{customer?.name ? customer?.name : ""}</h6>
                          <p>
                            {viewCustomerDetails?.name
                              ? viewCustomerDetails?.name
                              : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div className="col-xl-6 col-12">
                    <div className="customer-details">
                      <div className="d-flex align-items-center">
                        <span className="customer-widget-icon d-inline-flex">
                          <i className="fe fe-mail">
                            <FeatherIcon icon="mail" />
                          </i>
                        </span>
                        <div className="customer-details-cont">
                          <h6>Email Address</h6>
                          <p>{customer?.email ? customer?.email : ""}</p>
                        </div>
                      </div>
                    </div>
                  </div> */}
                  <div className="col-xl-6 col-12">
                    <div className="customer-details">
                      <div className="d-flex align-items-center">
                        <span className="customer-widget-icon d-inline-flex">
                          <i className="fe fe-phone">
                            <FeatherIcon icon="phone" />
                          </i>
                        </span>
                        <div className="customer-details-cont">
                          <h6>Phone Number</h6>
                          <p>{customer?.phone ? customer?.phone : ""}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                 
                  <div className="col-xl-6 col-12">
                    <div className="customer-details">
                      <div className="d-flex align-items-center">
                        <span className="customer-widget-icon d-inline-flex">
                          <i className="fe fe-globe">
                            <FeatherIcon icon="globe" />
                          </i>
                        </span>
                        <div className="customer-details-cont">
                          <h6>Address</h6>
                          <p className="customer-mail">
                            {customer?.address ? customer?.address : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-6 col-12">
                    <div className="customer-details">
                      <div className="d-flex align-items-center">
                        <span className="customer-widget-icon d-inline-flex">
                          <i className="fe fe-globe">
                            <FeatherIcon icon="users" />
                          </i>
                        </span>
                        <div className="customer-details-cont">
                          <h6>Membership</h6>
                          <p className="customer-mail">
                            {customer?.membership_type ? customer?.membership_type : ""}
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
              <div className="col-xl-3 col-lg-4 col-sm-6 col-12 d-flex">
                <div className="card inovices-card w-100">
                  <div className="card-body">
                    <div className="dash-widget-header">
                      <span className="inovices-widget-icon bg-info-light">
                        <img src={Recepit} alt="" />
                      </span>
                      <div className="dash-count">
                        <div className="dash-title">Total Invoice</div>
                        <div className="dash-counts">
                          <p>
                            {currencyData ? currencyData : "$"}
                            {Number(
                              cardDetails?.totalRecs?.[0]?.amount
                                ? cardDetails?.totalRecs?.[0]?.amount
                                : 0
                            ).toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <p className="inovices-all">
                        No of Invoice
                        <span className="rounded-circle bg-light-gray">
                          {cardDetails?.totalRecs?.[0]?.count
                            ? cardDetails?.totalRecs?.[0]?.count
                            : 0}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-4 col-sm-6 col-12 d-flex">
                <div className="card inovices-card w-100">
                  <div className="card-body">
                    <div className="dash-widget-header">
                      <span className="inovices-widget-icon bg-primary-light">
                        <img src={TransactionMinus} alt="" />
                      </span>
                      <div className="dash-count">
                        <div className="dash-title">Outstanding</div>
                        <div className="dash-counts">
                          <p>
                            {currencyData ? currencyData : "$"}
                            {Number(
                              cardDetails?.outStandingRecs?.[0]?.amount
                                ? cardDetails?.outStandingRecs?.[0]?.amount
                                : 0
                            ).toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <p className="inovices-all">
                        No of Invoice
                        <span className="rounded-circle bg-light-gray">
                          {cardDetails?.outStandingRecs?.[0]?.count
                            ? cardDetails?.outStandingRecs?.[0]?.count
                            : 0}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-4 col-sm-6 col-12 d-flex">
                <div className="card inovices-card w-100">
                  <div className="card-body">
                    <div className="dash-widget-header">
                      <span className="inovices-widget-icon bg-warning-light">
                        <img src={ArchiveBook} alt="" />
                      </span>
                      <div className="dash-count">
                        <div className="dash-title">Total Overdue</div>
                        <div className="dash-counts">
                          <p>
                            {currencyData ? currencyData : "$"}
                            {Number(
                              cardDetails?.overDueRecs?.[0]?.amount
                                ? cardDetails?.outStandingRecs?.[0]?.amount
                                : 0
                            ).toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <p className="inovices-all">
                        No of Invoice{" "}
                        <span className="rounded-circle bg-light-gray">
                          {" "}
                          {cardDetails?.overDueRecs?.[0]?.count
                            ? cardDetails?.overDueRecs?.[0]?.count
                            : 0}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-lg-4 col-sm-6 col-12 d-flex">
                <div className="card inovices-card w-100">
                  <div className="card-body">
                    <div className="dash-widget-header">
                      <span className="inovices-widget-icon bg-green-light">
                        <img src={MessageEdit} alt="" />
                      </span>
                      <div className="dash-count">
                        <div className="dash-title">Draft</div>
                        <div className="dash-counts">
                          <p>
                            {currencyData ? currencyData : "$"}
                            {Number(
                              cardDetails?.draftedRecs?.[0]?.amount
                                ? cardDetails?.draftedRecs?.[0]?.amount
                                : 0
                            ).toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <p className="inovices-all">
                        No of Invoice{" "}
                        <span className="rounded-circle bg-light-gray">
                          {" "}
                          {cardDetails?.draftedRecs?.[0]?.count
                            ? cardDetails?.draftedRecs?.[0]?.count
                            : 0}
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
                        rowKey={(record) => record._id}
                        columns={columns}
                        dataSource={
                          viewCustomerDetails?.customerDetails?.[0]?.invoiceRecs
                        }
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
    </>
  );
};

export default ViewCustomer;
