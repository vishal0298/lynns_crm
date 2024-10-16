import React, { useContext } from "react";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import "../../../../common/antd.css";
import { Table } from "antd";
import {
  onShowSizeChange,
  itemRender,
} from "../../../../common/paginationfunction";
import { FilterIcon } from "../../../../common/imagepath";
import StaffFilter from "../staffFilter";
import { ListStaffContext } from "./listStaff.control";

const Staff = () => {
  const {
    show,
    setShow,
    staffList,
    setStaffList,
    staffDelete,
    setStaffDelete,
    onDelete,
    admin,
    permission,
    handlePagination,
    page,
    pagesize,
    totalCount,
    setTotalCount,
    setPage,
  } = useContext(ListStaffContext);
  const { create, update, delete: remove } = permission;

  console.log(staffList)
  
  const columns = [
    {
      title: "#",
      dataIndex: "Id",
      render: (value, item, index) => (page - 1) * pagesize + (index + 1),
    },

    {
      title: "Staff Name",
      dataIndex: "staffName",
      key: 'staffName',
    },
    {
      title: "Employee Id",
      dataIndex: "employeeId",
      key: "employeeId"
    },
    {
      title: "Mobile Number",
      dataIndex: "mobileNumber",
      key: "mobileNumber"
    },
   
    (update || remove || admin) && {
      title: "Action",
      render: (record) => (
        <div className="d-flex align-items-center">
          {(update || admin) && (
            <Link
              className=" btn-action-icon me-2"
              to={{ pathname: `${"/edit-staff"}/${record?._id}` }}
            >
              <i className="fe fe-edit d-flex align-items-center justify-content-center">
                <FeatherIcon icon="edit" />
              </i>
            </Link>
          )}
          {(remove || admin) && (
            <Link
              className=" btn-action-icon"
              to="#"
              onClick={() => setStaffDelete(record._id)}
              data-bs-toggle="modal"
              data-bs-target="#delete_modal"
            >
              <i className="fe fe-trash-2 d-flex align-items-center justify-content-center">
                <FeatherIcon icon="trash-2" />
              </i>
            </Link>
          )}
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
            <div className="content-page-header ">
              <h5>Staff </h5>
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

                  {(create || admin) && (
                    <li>
                      <Link className="btn btn-primary" to="/add-staff">
                        <i
                          className="fa fa-plus-circle me-2"
                          aria-hidden="true"
                        />
                        Add Staff
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
          {/* All Invoice */}
          <div className="card invoices-tabs-card">
            <div className="invoices-main-tabs">
              <div className="row align-items-center">
                <div className="col-lg-12">
                  <div className="invoices-tabs">
                    <ul>
                      <li>
                        <Link to="/product-list">Product</Link>
                      </li>
                      <li>
                        <Link to="/category">Category</Link>
                      </li>
                      <li>
                        <Link to="/units" >
                        Staff
                        </Link>
                      </li>
                      <li>
                        <Link to="/staff" className="active">Staff</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* /All Invoice */}
          {/* Table */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card-table">
                <div className="card-body category">
                  <div className="table-responsive table-hover">
                    <Table
                      rowKey={(record) => record.staffName}
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
                        onChange: (page, pageSize) => {
                          handlePagination(page, pageSize);
                        },
                      }}
                      columns={columns}
                      dataSource={staffList}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* /Table */}
        </div>
      </div>

      <StaffFilter
        setShow={setShow}
        show={show}
        setStaffList={setStaffList}
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
                <h3>Delete Staff</h3>
                <p>Are you sure want to delete?</p>
              </div>
              <div className="modal-btn delete-action">
                <div className="row">
                  <div className="col-6">
                    <button
                      type="reset"
                      data-bs-dismiss="modal"
                      className="w-100 btn btn-primary paid-continue-btn"
                      onClick={() => onDelete(staffDelete)}
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

export default Staff;
