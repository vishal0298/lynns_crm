/* eslint-disable no-unsafe-optional-chaining */
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "../../../../common/antd.css";
import { Table } from "antd";
import {
  onShowSizeChange,
  itemRender,
} from "../../../../common/paginationfunction";
import { FilterIcon } from "../../../../common/imagepath";
import { ListCustomerContext } from "./listCustomer.control";
import CustomerFilter from "../customerFilter";
import { commonDatacontext } from "../../../../core/commonData";

const ListCustomer = () => {
  const {
    show,
    setShow,
    list,
    setList,
    customerDelete,
    setCustomerDelete,
    onDelete,
    activate,
    handleImageError,
    permission,
    admin,
    handlePagination,
    page,
    pagesize,
    totalCount,
    setTotalCount,
    setPage,
  } = useContext(ListCustomerContext);
  const { currencyData } = useContext(commonDatacontext);
  
  console.log(list)

  const columns = [
    {
      title: "#",
      dataIndex: "Id",
      render: (value, item, index) => (page - 1) * pagesize + (index + 1),
    },
    {
      title: "Name",
      key: "customer_name",
      render: (record) => (
        <>
          <h2 className="table-avatar">
          <Link
              className="avatar avatar-md me-2"
              to={(admin || permission?.view) ? { pathname: `${"/view-customer"}/${record._id}` } : '#'}
            >
              <img
                onError={handleImageError}
                className="avatar-img rounded-circle"
                src={record?.image}
                alt="User Image"
              />
            </Link>
            <Link  to={(admin || permission?.view) ? { pathname: `${"/view-customer"}/${record._id}` } : '#'}>
              <p style={{ color: "black" }}>
                {record.name} <span>{record.email}</span>
              </p>
            </Link>
          </h2>
        </>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Membership Type",
      dataIndex: "membership_type",
      key: "membership_type",
    },
    // {
    //   title: "Balance",
    //   dataIndex: "balance",
    //   key: "balance",
    //   render: (text, record) => (
    //     <>
    //       {currencyData ? currencyData : "$"}
    //       {(record?.balance).toLocaleString("en-IN", {
    //         minimumFractionDigits: 2,
    //         maximumFractionDigits: 2,
    //       })}
    //     </>
    //   ),
    // },
    // {
    //   title: "Total Invoice",
    //   dataIndex: "noOfInvoices",
    //   key: "noOfInvoices",
    // },
    // {
    //   title: "Created On",
    //   key: "createdAt",
    //   render: (record) => <>{record.createdAt}</>,
    // },
    // {
    //   title: "Status",
    //   key: "status",
    //   render: (record) => (
    //     <div>
    //       {record?.status == "Active" ? (
    //         <span className="badge badge-pill bg-success-light">Active</span>
    //       ) : (
    //         <span className="badge badge-pill bg-danger-light">Inactive</span>
    //       )}
    //     </div>
    //   ),
    // },
    (permission?.update || admin) && {
      title: "Action",
      key: "Action",
      render: (record) => (
        <>
          <div className="table-invoice d-flex align-items-center">
            {record?.status == "Active"? (
              <Link
              to={`/add-invoice?cid=${record._id}`}
              className="btn btn-greys me-2"
            >
              <i className="fa fa-plus-circle me-1" /> Invoice
            </Link>
            ):<></>}
            

            <div className="dropdown dropdown-action">
              <Link
                to="#"
                className=" btn-action-icon "
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fas fa-ellipsis-v" />
              </Link>
              <div className="dropdown-menu dropdown-menu-end customer-dropdown-menu">
                <ul>
                  {(admin || permission?.update) && (
                    <li>
                      <Link
                        className="dropdown-item"
                        to={{
                          pathname: `${"/edit-customer"}/${record._id}`,
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
                        onClick={() => setCustomerDelete(record._id)}
                        data-bs-toggle="modal"
                        data-bs-target="#delete_modal"
                      >
                        <i className="far fa-trash-alt me-2" />
                        Delete
                      </Link>
                    </li>
                  )}
                 

                  {record.status == "Deactive" &&
                    (permission?.create ||
                      permission?.update ||
                      permission?.view ||
                      admin) && (
                      <li>
                        <Link
                          className="dropdown-item"
                          onClick={() => activate(record._id, "activate")}
                        >
                          <i className="far fa-bell me-2" />
                          Active
                        </Link>
                      </li>
                    )}

                  {record.status == "Active" &&
                    (permission?.create || permission?.update || admin) && (
                      <li>
                        <Link
                          className="dropdown-item"
                          onClick={() => activate(record._id, "deactivate")}
                        >
                          <i className="far fa-bell-slash me-2" />
                          Inactive
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
      <div className="page-wrapper customers">
        <div className="content container-fluid">
          <div className="page-header">
            <div className="content-page-header">
              <h5>Customers</h5>
              <div className="list-btn">
                <ul className="filter-list">
                  <li>
                    <Link
                      className="btn btn-filters w-auto popup-toggle"
                      onClick={() => setShow(!show)}
                    >
                      <span className="me-2">
                        <img src={FilterIcon} alt="filter" />
                      </span>
                      Filter{" "}
                    </Link>
                  </li>
                  {(admin || permission?.create) && (
                    <li>
                      <Link className="btn btn-primary" to="/add-customer">
                        <i
                          className="fa fa-plus-circle me-2"
                          aria-hidden="true"
                        />
                        Add Customer
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
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
                      dataSource={list}
                      rowKey={(record) => record?._id}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CustomerFilter
        setShow={setShow}
        show={show}
        setList={setList}
        pagesize={pagesize}
        page={page}
        setTotalCount={setTotalCount}
        setPage={setPage}
        handlePagination={handlePagination}
      />

      <div className="modal custom-modal fade" id="delete_modal" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-body">
              <div className="form-header">
                <h3>Delete Customer</h3>
                <p>Are you sure want to delete?</p>
              </div>
              <div className="modal-btn delete-action">
                <div className="row">
                  <div className="col-6">
                    <button
                      type="reset"
                      data-bs-dismiss="modal"
                      className="w-100 btn btn-primary paid-continue-btn"
                      onClick={() => onDelete(customerDelete)}
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
export default ListCustomer;
