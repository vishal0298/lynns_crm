import React, { useContext } from "react";
import { ListvendorContext } from "./listVendor.control";
import "../../../../common/antd.css";
import { Table } from "antd";
import { Link } from "react-router-dom";
import { FilterIcon } from "../../../../common/imagepath";
import VendorFilter from "../vendorFilter";
import {
  itemRender,
  onShowSizeChange,
} from "../../../../common/paginationfunction";
import { commonDatacontext } from "../../../../core/commonData";

const ListVendors = () => {
  const {
    onDelete,
    setShow,
    vendorlist,
    show,
    vendordelete,
    setVedordelete,
    setVendorlist,
    admin,
    permission,
    ledger,
    handlePagination,
    page,
    pagesize,
    totalCount,
    setTotalCount,
  } = useContext(ListvendorContext);
  const { currencyData } = useContext(commonDatacontext);

  const columns = [
    {
      title: "#",
      dataIndex: "Id",
      render: (value, item, index) => (page - 1) * pagesize + (index + 1),
    },
    {
      title: "Name",
      key: "vendor_name",
      render: (record) => (
        <>
          <h2 className="table-avatar">
            <Link to={(admin || permission?.view) ? { pathname: `${"/view-vendor"}/${record._id}` } : '#'}>
              {record.vendor_name} <span>{record.vendor_email}</span>
            </Link>
          </h2>
        </>
      ),
    },
    {
      title: "Phone",
      dataIndex: "vendor_phone",
    },
    {
      title: "Created On",
      key: "created_at",
      render: (record) => <>{record.created_at}</>,
    },
    {
      title: "Closing Balance",
      dataIndex: "balance",
      key: "balance",
      render: (text, record) => (
        <>
          {currencyData ? currencyData : "$"}
          {Number(record?.balance).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
            ? Number(record?.balance).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : 0}
        </>
      ),
    },
    (permission?.update || permission?.delete || admin) && {
      title: "Action",
      render: (record) => (
        <>
          <div className="d-flex align-items-center">
            {(ledger?.create || admin) && (
              <Link
                to={{ pathname: `${"/add-ledger"}/${record._id}` }}
                className="btn btn-greys me-2"
              >
                <i className="fa fa-eye me-1" /> Ledger
              </Link>
            )}
            {(admin || permission?.update || permission?.delete) && (
              <div className="dropdown dropdown-action">
                <Link
                  to="#"
                  className=" btn-action-icon "
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fas fa-ellipsis-v" />
                </Link>
                <div className="dropdown-menu dropdown-menu-end">
                  <ul>
                    {(admin || permission?.update) && (
                      <li>
                        <Link
                          className="dropdown-item"
                          to={{ pathname: `${"/edit-vendors"}/${record._id}` }}
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
                          onClick={() => setVedordelete(record._id)}
                          data-bs-toggle="modal"
                          data-bs-target="#delete_modal"
                        >
                          <i className="far fa-trash-alt me-2" />
                          Delete
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            )}
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
            <div className="content-page-header ">
              <h5>Vendors</h5>
              <div className="list-btn">
                <ul className="filter-list">
                  <li>
                    <Link
                      className="btn btn-filters w-auto popup-toggle"
                      onClick={() => setShow(!show)}
                    >
                      <span className="me-2">
                        <img src={FilterIcon} />
                      </span>
                      Filter{" "}
                    </Link>
                  </li>
                  {(permission?.create || admin) && (
                    <li>
                      <Link className="btn btn-primary" to="/add-vendors">
                        <i
                          className="fa fa-plus-circle me-2"
                          aria-hidden="true"
                        />
                        Add Vendors
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
          <div className="row">
            <div className="col-sm-12">
              <div className=" card-table">
                <div className="card-body vendors purchase">
                  <div className="table-responsive table-hover table-striped">
                    <Table
                      rowKey={(record) => record?._id}
                      pagination={{
                        // total: vendorlist.length,
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
                      dataSource={vendorlist}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <VendorFilter
        setShow={setShow}
        show={show}
        setVendorlist={setVendorlist}
        pagesize={pagesize}
        page={page}
        setTotalCount={setTotalCount}
      />

      <div className="modal custom-modal fade" id="delete_modal" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-body">
              <div className="form-header">
                <h3>Delete Vendor</h3>
                <p>Are you sure want to delete?</p>
              </div>
              <div className="modal-btn delete-action">
                <div className="row">
                  <div className="col-6">
                    <button
                      type="submit"
                      data-bs-dismiss="modal"
                      className="w-100 btn btn-primary paid-continue-btn"
                      onClick={() => onDelete(vendordelete)}
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

export default ListVendors;
