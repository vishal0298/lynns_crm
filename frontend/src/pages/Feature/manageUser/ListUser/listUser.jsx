import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "../../../../common/antd.css";
import { Table } from "antd";
import FeatherIcon from "feather-icons-react";
import {
  onShowSizeChange,
  itemRender,
} from "../../../../common/paginationfunction";
import UserFilter from "../userFilter";
import { ListUserContext } from "./listUser.control";
import moment from "moment";

const ListUsers = () => {
  const {
    show,
    setShow,
    users,
    userDelete,
    setUserDelete,
    filterList,
    setFilter,
    setFilterArray,
    searchFilter,
    setsearchFilter,
    permission,
    admin,
    page,
    pagesize,
    totalCount,
    setTotalCount,
    handlePagination,
    onDelete,
    getUsers,
    handleImageError,
  } = useContext(ListUserContext);
  const { update, delete: remove } = permission;

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      render: (value, item, index) => (page - 1) * pagesize + (index + 1),
    },
    {
      title: "User Name",
      dataIndex: "userName",
      render: (text, record) => {
        return (
          <>
            <h2 className="table-avatar">
              <Link to="#" className="avatar avatar-sm me-2">
                <img
                  className="avatar-img rounded-circle"
                  onError={handleImageError}
                  src={record?.image}
                  alt="User Image"
                />
              </Link>
              <Link to="#">
                {record.firstName + " " + record.lastName}
                <span>{record.email}</span>
              </Link>
            </h2>
          </>
        );
      },
    },
    {
      title: "Mobile Number",
      dataIndex: "mobileNumber",
    },
    {
      title: "Role",
      dataIndex: "role",
    },
    {
      title: "Created On",
      dataIndex: "createdAt",
      render: (text) => moment(text).format("DD-MM-YYYY"),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => (
        <div>
          {text == "Active" ? (
            <span className="badge badge-pill bg-success-light">Active</span>
          ) : (
            <span className="badge badge-pill bg-ash-gray text-gray-light">
              Inactive
            </span>
          )}
        </div>
      ),
    },
    (update || remove || admin) && {
      title: "Action",
      dataIndex: "Action",
      render: (text, record) => {
        const isSuperAdmin = record?.role == "Super Admin";
        return (
          <>
            {!isSuperAdmin && (
              <div className="d-flex align-items-center">
                <div className="dropdown dropdown-action">
                  <Link
                    to="#"
                    className=" btn-action-icon "
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="fas fa-ellipsis-v" />
                  </Link>
                  <div className="dropdown-menu dropdown-menu-right">
                    <ul>
                      {(update || admin) && (
                        <li>
                          <Link
                            className="dropdown-item"
                            to={`/edit-user/${record?._id}`}
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
                            onClick={() => setUserDelete(record._id)}
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
            )}
          </>
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
            <div className="content-page-header ">
              <h5>Users</h5>
              <div className="list-btn">
                <ul className="filter-list">
                  <li>
                    <Link
                      className="btn btn-filters w-auto popup-toggle"
                      onClick={() => setShow(!show)}
                    >
                      <span className="me-2">
                        {/* <i className="fe fe-filter" /> */}
                        <FeatherIcon icon="filter" />
                      </span>
                      Filter{" "}
                    </Link>
                  </li>

                  <li>
                    <Link className="btn btn-primary" to="/add-user">
                      <i
                        className="fa fa-plus-circle me-2"
                        aria-hidden="true"
                      />
                      Add user
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card-table">
                <div className="card-body purchase">
                  <div className="table-responsive table-hover">
                    <Table
                      pagination={{
                        total: totalCount,

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
                      dataSource={filterList?.length > 0 ? filterList : users}
                      rowKey={(record) => record?._id}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <UserFilter
        setShow={setShow}
        show={show}
        setFilter={setFilter}
        setFilterArray={setFilterArray}
        searchFilter={searchFilter}
        setsearchFilter={setsearchFilter}
        filterList={filterList}
        users={users}
        getUsers={getUsers}
        pagesize={pagesize}
        page={page}
        setTotalCount={setTotalCount}
      />

      <div className="modal custom-modal fade" id="delete_modal" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-body">
              <div className="form-header">
                <h3>Delete User</h3>
                <p>Are you sure want to delete?</p>
              </div>
              <div className="modal-btn delete-action">
                <div className="row">
                  <div className="col-6">
                    <button
                      type="reset"
                      data-bs-dismiss="modal"
                      className="w-100 btn btn-primary paid-continue-btn"
                      onClick={() => onDelete(userDelete)}
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

export default ListUsers;
