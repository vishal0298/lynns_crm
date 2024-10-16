import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "../../../../common/antd.css";
import { Table } from "antd";
import {
  onShowSizeChange,
  itemRender,
} from "../../../../common/paginationfunction";
import CreditHead from "../creditHead";
import CreditFilter from "../CreditFillter";
import { ListCreditNotesContext } from "./creditListControl";
import { commonDatacontext } from "../../../../core/commonData";
import { convertFirstLetterToCapital } from "../../../../common/helper";
import { PreviewImg } from "../../../../common/imagepath";

const CreditNotes = () => {
  const {
    show,
    setShow,
    credits,
    setCredits,
    creditonDelete,
    setCreditonDelete,
    handleImageError,
    onDelete,
    admin,
    permission,
    handlePagination,
    page,
    pagesize,
    totalCount,
    setTotalCount,
    setPage,
  } = useContext(ListCreditNotesContext);
  const { currencyData } = useContext(commonDatacontext);
  const { create, update, view, delete: remove } = permission;

  const columns = [
    {
      title: "#",
      dataIndex: "Id",
      render: (text, record, index) => (page - 1) * pagesize + (index + 1),
    },
    {
      title: "Sales Return ID",
      dataIndex: "credit_note_id",
      render:(text,record) => (
        <Link
        to={(admin || view) ? { pathname: `${"/view-sales-return"}/${record._id}` } : '#'}>
         <span>{text}</span>
      </Link>
      ),
    },
    {
      title: "Customer",
      dataIndex: "customerId",
      render: (text, record) => {
        return (
          <h2 className="table-avatar">
            <Link to={{ pathname: `${"/view-customer"}/${record._id}` }}
                className="avatar avatar-sm me-2">
              <img
                onError={(e) => handleImageError(e)}
                className="avatar-img rounded-circle"
                src={
                  record?.customerInfo?.image
                    ? record?.customerInfo?.image
                    : PreviewImg
                }
                alt="User Image"
              />
            </Link>
            <Link to={{ pathname: `${"/view-customer"}/${record._id}` }}
>
              {record?.customerInfo?.name}{" "}
              <span>{record?.customerInfo?.phone}</span>
            </Link>
          </h2>
        );
      },
    },
    {
      title: "Amount",
      render: (text, record) => (
        <>
          {currencyData ? currencyData : "$"}
          {Number(record?.items[0]?.amount).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </>
      ),
    },
    {
      title: "Payment Mode",
      dataIndex: "paymentMode",
    },
    {
      title: "Created On",
      dataIndex: "createdAt",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => (
        <div>
          {text === "PAID" && (
            <span className="badge bg-success-light text-success-light">
              {convertFirstLetterToCapital(text)}
            </span>
          )}
          {text === "Pending" && (
            <span className="badge bg-warning-light text-warning-light">
              {convertFirstLetterToCapital(text)}
            </span>
          )}
          {text === "Cancelled" && (
            <span className="badge bg-danger-light">
              {convertFirstLetterToCapital(text)}
            </span>
          )}
        </div>
      ),
    },
    (update || view || remove || admin) && {
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
            <div className="dropdown-menu dropdown-menu-right credit-note-dropdown drop-down-menu">
              <ul>
                {(update || admin) && (
                  <li>
                    <Link
                      className="dropdown-item"
                      to={`/edit-sales-return/${record?._id}`}
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
                      onClick={() => setCreditonDelete(record._id)}
                    >
                      <i className="far fa-trash-alt me-2" />
                      Delete
                    </Link>
                  </li>
                )}
                {/* {(view || admin) && (
                  <li>
                    <Link
                      className="dropdown-item"
                      to={{
                        pathname: `${"/view-sales-return"}/${record._id}`,
                      }}
                    >
                      <i className="far fa-eye me-2" />
                      View
                    </Link>
                  </li>
                )} */}
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

          <CreditHead
            setShow={setShow}
            show={show}
            create={create}
            admin={admin}
          />

          {/* Table */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card-table">
                <div className="card-body creditNotes purchase">
                  <div className="table-responsive table-hover">
                    <Table
                      rowKey={(record) => record?._id}
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
                      dataSource={credits}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* /Table */}
        </div>
      </div>

      <CreditFilter
        setShow={setShow}
        show={show}
        setCredits={setCredits}
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
                <h3>Delete Sales Return</h3>
                <p>Are you sure want to delete?</p>
              </div>
              <div className="modal-btn delete-action">
                <div className="row">
                  <div className="col-6">
                    <button
                      type="submit"
                      data-bs-dismiss="modal"
                      className="w-100 btn btn-primary paid-continue-btn"
                      onClick={() => onDelete(creditonDelete)}
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

export default CreditNotes;
