import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "../../../../common/antd.css";
import { Table } from "antd";
import {
  onShowSizeChange,
  itemRender,
} from "../../../../common/paginationfunction";
import PurchaseFilter from "../purchaseFilter";
import { FilterIcon } from "../../../../common/imagepath";
import { ListPurchaseContext } from "./listPurchase.control";
import { commonDatacontext } from "../../../../core/commonData";
import { convertFirstLetterToCapital } from "../../../../common/helper";
import dayjs from "dayjs";

const ListPurchase = () => {
  const {
    show,
    setShow,
    onDelete,
    purchaseDelete,
    setPurchaseDelete,
    admin,
    permission,
    List,
    setList,
    handlePagination,
    page,
    pagesize,
    totalCount,
    setTotalCount,
    setPage,
  } = useContext(ListPurchaseContext);
  const { currencyData } = useContext(commonDatacontext);

  const columns = [
    {
      title: "#",
      dataIndex: "_id",
      render: (text, record, index) => (page - 1) * pagesize + (index + 1),
    },
    {
      title: "Purchase ID",
      dataIndex: "purchaseId",
      render: (text,record) => (
      <Link
        to={(admin || permission?.view) ? { pathname: `${"/view-purchase"}/${record?._id}` } : '#'}>
          {text}
      </Link>
    )
    },
    {
      title: "Vendor",
      dataIndex: "vendorId",
      render: (text, record) => {
        return (
          <>
            <h2 className="table-avatar">
              <Link to={{pathname: `${"/view-vendor"}/${record?.vendorId?._id}`}}>
                {record?.vendorId?.vendor_name}{" "}
                <span>{record?.vendorId?.vendor_phone}</span>
              </Link>
            </h2>
          </>
        );
      },
    },
    {
      title: "Amount",
      dataIndex: "TotalAmount",
      render: (text, record) => (
        <>
          {currencyData ? currencyData : "$"}
          {record.roundOff == true ? Number(record?.TotalAmount).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) : Number(record?.taxableAmount).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
          {/* {Number(record?.TotalAmount).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })} */}
        </>
      ),
    },
    {
      title: "Payment Mode",
      dataIndex: "paymentMode",
    },
    {
      title: "Date",
      dataIndex: "purchaseDate",
      render: (text) => dayjs(text).format("DD-MM-YYYY"),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => {
        return (
          <div>
            {text == "PAID" && (
              <span className="badge bg-success-light text-success-light">
                {convertFirstLetterToCapital(text)}
              </span>
            )}
            {text == "Pending" && (
              <span className="badge bg-warning-light text-warning-light">
                {convertFirstLetterToCapital(text)}
              </span>
            )}
            {text == "Cancelled" && (
              <span className="badge bg-danger-light">
                {convertFirstLetterToCapital(text)}
              </span>
            )}
          </div>
        );
      },
    },
    (permission?.update || permission?.view || admin) && {
      title: "Action",
      dataIndex: "Action",
      render: (text, record) => {
        return (
          <div className="d-flex align-items-center customer-details">
            <div className="dropdown dropdown-action">
              <Link
                to="#"
                className=" btn-action-icon "
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fas fa-ellipsis-v" />
              </Link>
              <div className="dropdown-menu dropdown-menu-right credit-note-dropdown purchase-dropdown-menu">
                <ul>
                  {(admin || permission?.update) && (
                    <li>
                      <Link
                        className="dropdown-item"
                        to={`/purchase-edit/${record?._id}`}
                        state={{ detail: "edit", rowData: record }}
                      >
                        <i className="far fa-edit me-2" />
                        Edit
                      </Link>
                    </li>
                  )}
                  {(admin || permission?.delete) && (
                    <li>
                      <Link
                        className="dropdown-item"
                        to=""
                        data-bs-toggle="modal"
                        data-bs-target="#delete_modal"
                        onClick={() => setPurchaseDelete(record._id)}
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
              <h5>Purchases</h5>
              <div className="list-btn">
                <ul className="filter-list">
                  <li>
                    <Link
                      className="btn btn-filters w-auto popup-toggle"
                      onClick={() => setShow(!show)}
                    >
                      <span className="me-2">
                        <img src={FilterIcon} alt="" />
                      </span>
                      Filter{" "}
                    </Link>
                  </li>

                  {(admin || permission?.create) && (
                    <li>
                      <Link className="btn btn-primary" to="/add-purchases">
                        <i
                          className="fa fa-plus-circle me-2"
                          aria-hidden="true"
                        />
                        Add Purchases
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
          {/* /Page Header */}
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
                <div className="col-sm-6 col-md-3">
                  <div className="form-group">
                    <label>Email</label>
                    <input type="text" className="form-control" />
                  </div>
                </div>
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
                      dataSource={List}
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

      <PurchaseFilter
        setShow={setShow}
        show={show}
        setList={setList}
        page={page}
        pagesize={pagesize}
        setTotalCount={setTotalCount}
        setPage={setPage}
        handlePagination={handlePagination}
      />

      <div className="modal custom-modal fade" id="delete_modal" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-body">
              <div className="form-header">
                <h3>Delete Purchases</h3>
                <p>Are you sure want to delete?</p>
              </div>
              <div className="modal-btn delete-action">
                <div className="row">
                  <div className="col-6">
                    <button
                      type="reset"
                      data-bs-dismiss="modal"
                      className="w-100 btn btn-primary paid-continue-btn"
                      onClick={() => onDelete(purchaseDelete)}
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

export default ListPurchase;
