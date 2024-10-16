import React, { useContext } from "react";
import { ListPOContext } from "./debitList.control";
import Header from "../../layouts/Header";
import Sidebar from "../../layouts/Sidebar";
import FeatherIcon from "feather-icons-react";
import "../../common/antd.css";
import { Link } from "react-router-dom";
import { FilterIcon } from "../../common/imagepath";
import { Table } from "antd";
import {
  onShowSizeChange,
  itemRender,
} from "../../common/paginationfunction";
import "../../common/antd.css";
import PurchaseOrderFilter from "../purchaseOrderFilter";

const ListPurchaseOrder = () => {
  const {
    converTopurchase,
    clone,
    onDelete,
    setShow,
    debitNoteListdata,
    show,
    menu,
    toggleMobileMenu,
    RowId,
    setRowId,
    filterList,
    setFilterList,
    setFilterArray,
  } = useContext(ListPOContext);

  const columns = [
    {
      title: "#",
      dataIndex: "key",
      render: (text, record, index) => <>{index + 1}</>,
    },
    {
      title: "purchaseId",
      dataIndex: "purchaseId",
    },
    {
      title: "Vendor",
      dataIndex: "vendorInfo.vendor_name",
      render: (text, record) => <>{record?.vendorInfo?.vendor_name}</>,
    },
    {
      title: "Amount",
      dataIndex: "TotalAmount",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
    },
    {
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
            <div className="dropdown-menu dropdown-menu-right credit-note-dropdown">
              <ul>
                <li>
                  <Link
                    className="dropdown-item"
                    to={{
                      pathname: `${"/edit-debit-notes"}/${record._id}`,
                    }}
                  >
                    <i className="far fa-edit me-2" />
                    Edit
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item"
                    to={{
                      pathname: `${"/view-purchases-order"}/${record._id}`,
                    }}
                  >
                    <i className="far fa-eye me-2" />
                    View
                  </Link>
                </li>
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
              </ul>
            </div>
          </div>
        </div>
      ),
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
                    <li>
                      <Link className="btn btn-primary" to="/add-debit-notes">
                        <i
                          className="fa fa-plus-circle me-2"
                          aria-hidden="true"
                        />
                        Add Purchases Order
                      </Link>
                    </li>
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
                            total:
                              filterList?.length > 0
                                ? filterList.length
                                : debitNoteListdata?.length,
                            showTotal: (total, range) =>
                              `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                            showSizeChanger: true,
                            onShowSizeChange: onShowSizeChange,
                            itemRender: itemRender,
                          }}
                          columns={columns}
                          dataSource={
                            filterList?.length > 0
                              ? filterList
                              : debitNoteListdata
                          }
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

          <PurchaseOrderFilter
            setShow={setShow}
            show={show}
            setFilterList={setFilterList}
            setFilterArray={setFilterArray}
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

          <div
            className="modal custom-modal fade"
            id="clone_modal"
            role="dialog"
          >
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
      </div>
    </>
  );
};
export default ListPurchaseOrder;
