import React, { useContext } from "react";
import { ListPOContext } from "./PoList.control";
import FeatherIcon from "feather-icons-react";
import "../../../../common/antd.css";
import { Link } from "react-router-dom";
import { FilterIcon } from "../../../../common/imagepath";
import { Table } from "antd";
import {
  onShowSizeChange,
  itemRender,
} from "../../../../common/paginationfunction";
import "../../../../common/antd.css";
import PurchaseOrderFilter from "../purchaseOrderFilter";
import moment from "moment";
import { commonDatacontext } from "../../../../core/commonData";

const ListPurchaseOrder = () => {
  const {
    converTopurchase,
    clone,
    onDelete,
    setShow,
    purchaseOrderData,
    setPurchaseOrderList,
    show,
    RowId,
    setRowId,
    admin,
    permission,
    handlePagination,
    page,
    pagesize,
    totalCount,
    setTotalCount,
    setPage,
  } = useContext(ListPOContext);
  const { currencyData } = useContext(commonDatacontext);

  const columns = [
    {
      title: "#",
      dataIndex: "key",
      render: (text, record, index) => (page - 1) * pagesize + (index + 1),
    },
    {
      title: "Purchase Order ID",
      dataIndex: "purchaseOrderId",
      render:(text,record) => (
        <Link
        to={(admin || permission?.view) ? { pathname: `${"/view-purchases-order"}/${record._id}` } : '#'}>
         <span>{text}</span>
      </Link>
      ),
    },
    {
      title: "Vendor",
      dataIndex: "vendorInfo.vendor_name",
      render: (text, record) => (
      <Link
        to={(admin || permission?.view) ? { pathname: `${"/view-vendor"}/${record?.vendorInfo?._id}` } : '#'}>
         <span> {record?.vendorInfo?.vendor_name}</span>
      </Link>
      )
    },
    {
      title: "Amount",
      dataIndex: "TotalAmount",
      render: (text, record) => (
        <>
          {currencyData ? currencyData : "$"}
          {Number(record.TotalAmount).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </>
      ),
    },
    {
      title: "Date",
      dataIndex: "purchaseOrderDate",
      render: (text) => moment(text).format("DD-MM-YYYY"),
    },
    (permission?.update || permission?.view || admin) && {
      title: "Action",
      dataIndex: "Action",
      render: (text, record) => (
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
            <div className="dropdown-menu dropdown-menu-right credit-note-dropdown purchase-order-dropdown-menu">
              <ul>
                {(admin || permission?.update) && (
                  <li>
                    <Link
                      className="dropdown-item"
                      to={{
                        pathname: `${"/edit-purchases-order"}/${record._id}`,
                      }}
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
                      to="#"
                      onClick={() => setRowId(record?._id)}
                      data-bs-toggle="modal"
                      data-bs-target="#delete_modal"
                    >
                      <i className="far fa-trash-alt me-2" />
                      Delete
                    </Link>
                  </li>
                )}

                {(admin || permission?.update || permission?.create) && (
                  <li>
                    <Link
                      className="dropdown-item"
                      onClick={() => setRowId(record?._id)}
                      data-bs-toggle="modal"
                      data-bs-target="#convert_modal"
                      to="/#"
                    >
                      <FeatherIcon icon="repeat" className="me-2" />
                      Convert To Purchase
                    </Link>
                  </li>
                )}
                {(admin || permission?.update || permission?.create) && (
                  <li>
                    <Link
                      className="dropdown-item"
                      onClick={() => setRowId(record?._id)}
                      data-bs-toggle="modal"
                      data-bs-target="#clone_modal"
                      to="/#"
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
              <h5>Purchase Orders</h5>
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
                      <Link
                        className="btn btn-primary"
                        to="/add-purchases-order"
                      >
                        <i
                          className="fa fa-plus-circle me-2"
                          aria-hidden="true"
                        />
                        Add Purchases Order
                      </Link>
                    </li>
                  )}
                </ul>
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
                        dataSource={purchaseOrderData}
                        rowKey={(record) => record._id}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Table */}
          </div>
        </div>


        <PurchaseOrderFilter
          setShow={setShow}
          show={show}
          setPurchaseOrderList={setPurchaseOrderList}
          page={page}
          pagesize={pagesize}
          setTotalCount={setTotalCount}
          setPage={setPage}
          handlePagination={handlePagination}
        />

        <div
          className="modal custom-modal fade"
          id="delete_modal"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-body">
                <div className="form-header">
                  <h3>Delete Purchases Order</h3>
                  <p>Are you sure want to delete this ?</p>
                </div>
                <div className="modal-btn delete-action">
                  <div className="row">
                    <div className="col-6">
                      <Link
                        to="/purchase-orders"
                        onClick={() => onDelete(RowId)}
                        data-bs-dismiss="modal"
                        className="w-100 btn btn-primary paid-continue-btn"
                      >
                        Delete
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

        <div
          className="modal custom-modal fade"
          id="convert_modal"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-body">
                <div className="form-header">
                  <h3>Convert to Purchases</h3>
                  <p>Are you sure want to Convert?</p>
                </div>
                <div className="modal-btn delete-action">
                  <div className="row">
                    <div className="col-6">
                      <button
                        type="reset"
                        onClick={() => converTopurchase(RowId)}
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

        <div className="modal custom-modal fade" id="clone_modal" role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-body">
                <div className="form-header">
                  <h3>Clone Purchases Order</h3>
                  <p>Are you sure want to clone this ?</p>
                </div>
                <div className="modal-btn delete-action">
                  <div className="row">
                    <div className="col-6">
                      <Link
                        to="/purchase-orders"
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
      </div>
    </>
  );
};
export default ListPurchaseOrder;
