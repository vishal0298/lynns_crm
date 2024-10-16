/* eslint-disable no-unsafe-optional-chaining */
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import "../../../../common/antd.css";
import FeatherIcon from "feather-icons-react";
import {
  onShowSizeChange,
  itemRender,
} from "../../../../common/paginationfunction";
import { FilterIcon, PreviewImg } from "../../../../common/imagepath";
import DcFilter from "../dcFilter";
import { commonDatacontext } from "../../../../core/commonData";
import { Table } from "antd";
import { ListChallanContext } from "./listChallan.control";
import moment from "moment";

const ListChallans = () => {
  const {
    show,
    setShow,
    challanDelete,
    setChallanDelete,
    challans,
    onDelete,
    admin,
    permission,
    setChallans,
    handlePagination,
    page,
    pagesize,
    totalCount,
    setTotalCount,
    clone,
    setPage,
  } = useContext(ListChallanContext);
  const { currencyData } = useContext(commonDatacontext);
  const { create, update, view, delete: remove } = permission;
  const [RowId, setRowId] = useState("");

  const columns = [
    {
      title: "#",
      render: (text, record, index) => (page - 1) * pagesize + (index + 1),
    },
    {
      title: "Challan ID",
      dataIndex: "deliveryChallanNumber",
      render: (text,record) => (
        <Link
          to={(admin || view) ? {pathname: `${"/view-delivery-challan"}/${record?._id}`} : '#'}>
           <span>{text}</span>
        </Link>
      )
    },
    {
      title: "Customer",
      dataIndex: "customerId",
      render: (text, record) => {
        return (
          <>
            <h2 className="table-avatar">
              <Link to="#" className="avatar avatar-sm me-2">
                <img
                  // onError={handleImageError}
                  className="avatar-img rounded-circle"
                  src={
                    record?.customerId?.image
                      ? record?.customerId?.image
                      : PreviewImg
                  }
                  alt="User Image"
                />
              </Link>
              <Link to="#">
                {record?.customerId?.name}
                <span>{record?.customerId?.phone}</span>
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
          {(record?.TotalAmount).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </>
      ),
    },
    {
      title: "Created On",
      dataIndex: "deliveryChallanDate",
      render: (text) => moment(text).format("DD-MM-YYYY"),
    },
    (update || view || admin) && {
      title: "Action",
      dataIndex: "Action",
      render: (text, record) => (
        <>
          <div className="text-start customer-details">
            <div className="dropdown dropdown-action">
              <Link
                to="#"
                className=" btn-action-icon "
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fas fa-ellipsis-v" />
              </Link>
              <div className="dropdown-menu dropdown-menu-right quatation-dropdown dc-dropdown-menu">
                <ul>
                  {(update || admin) && (
                    <li>
                      <Link
                        className="dropdown-item"
                        to={`/edit-delivery-challan/${record?._id}`}
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
                        onClick={() => setChallanDelete(record._id)}
                      >
                        <i className="far fa-trash-alt me-2" />
                        Delete
                      </Link>
                    </li>
                  )}
            
                  {(create || update || admin) && (
                    <li>
                      <Link
                        onClick={() => setRowId(record?._id)}
                        className="dropdown-item"
                        to="#"
                        data-bs-toggle="modal"
                        data-bs-target="#clone_modal"
                      >
                        <FeatherIcon icon="copy" className="me-2" />
                        Clone
                      </Link>
                    </li>
                  )}
                </ul>
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
          {/* Page Header */}
          <div className="page-header">
            <div className="content-page-header">
              <h5>Delivery Challans</h5>
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
                      Filter
                    </Link>
                  </li>
                  {(create || admin) && (
                    <li>
                      <Link
                        className="btn btn-primary"
                        to="/add-delivery-challans"
                      >
                        <i
                          className="fa fa-plus-circle me-2"
                          aria-hidden="true"
                        />
                        Create Delivery Challans
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
                      dataSource={challans}
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
      {/* <AddVendor setShow={setShow} show={show} /> */}
      <DcFilter
        setShow={setShow}
        show={show}
        pagesize={pagesize}
        page={page}
        setChallans={setChallans}
        setTotalCount={setTotalCount}
        setPage={setPage}
        handlePagination={handlePagination}
      />
      <div className="modal custom-modal fade" id="delete_modal" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-body">
              <div className="form-header">
                <h3>Delete Delivery Challan</h3>
                <p>Are you sure want to delete?</p>
              </div>
              <div className="modal-btn delete-action">
                <div className="row">
                  <div className="col-6">
                    <button
                      type="reset"
                      data-bs-dismiss="modal"
                      className="w-100 btn btn-primary paid-continue-btn"
                      onClick={() => onDelete(challanDelete)}
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
      <div className="modal custom-modal fade" id="clone_modal" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-body">
              <div className="form-header">
                <h3>Clone Delivery Challan</h3>
                <p>Are you sure want to clone this ?</p>
              </div>
              <div className="modal-btn delete-action">
                <div className="row">
                  <div className="col-6">
                    <Link
                      to="/debit-notes"
                      onClick={() => clone(RowId)}
                      data-bs-dismiss="modal"
                      className="w-100 btn btn-primary paid-continue-btn"
                    >
                      Clone
                    </Link>
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
    </>
  );
};

export default ListChallans;
