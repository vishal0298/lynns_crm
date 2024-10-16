/* eslint-disable no-undef */
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import "../../../../common/antd.css";
import { Table } from "antd";
import FeatherIcon from "feather-icons-react";
import {
  onShowSizeChange,
  itemRender,
} from "../../../../common/paginationfunction";
import { FilterIcon } from "../../../../common/imagepath";
import { debit_note, successToast } from "../../../../core/core-index";
import DebitFilter from "../debitFilter";
import { commonDatacontext } from "../../../../core/commonData";
import { ListDebitNotesContext } from "./listDebitNotes.control";
import dayjs from "dayjs";

const ListDebitNotes = () => {
  const {
    show,
    setShow,
    purchaseReturn,
    setPurchaseReturn,
    purchaseReturnDelete,
    setpurchaseReturnDelete,
    onDelete,
    admin,
    permission,
    handlePagination,
    page,
    pagesize,
    totalCount,
    setTotalCount,
    getPurchaseReturn,
    postData,
    setPage,
  } = useContext(ListDebitNotesContext);
  const { currencyData } = useContext(commonDatacontext);
  const [RowId, setRowId] = useState("");

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      render: (text, record, index) => (page - 1) * pagesize + (index + 1),
      // sorter: (a, b) => a.id.length - b.id.length,
    },
    {
      title: "Debit Notes ID",
      dataIndex: "debit_note_id",
      render: (text,record) => (
        <Link
          to={(admin || permission?.view) ? {pathname: `${"/view-debitnotes"}/${record?._id}`} : '#'}>
            {text}
        </Link>
      )
    },
    {
      title: "Vendor",
      dataIndex: "vendor_name",
      render: (text, record) => {
        return (
          <>
            <h2 className="table-avatar">
              <Link to={{pathname: `${"/view-vendor"}/${record?.vendorId?._id}`}}>{record?.vendorId?.vendor_name}</Link>
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
          {Number(record?.TotalAmount).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </>
      ),
    },
    {
      title: "Created On",
      dataIndex: "purchaseOrderDate",
      render: (text) => dayjs(text).format("DD-MM-YYYY"),
    },
    (permission?.update || permission?.view || permission?.delete || admin) && {
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
              <div className="dropdown-menu dropdown-menu-right purchase-return-dropdown-menu">
                <ul>
                  {(admin || permission?.update) && (
                    <li>
                      <Link
                        className="dropdown-item"
                        to={`/edit-debit-notes/${record?._id}`}
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
                        data-bs-toggle="modal"
                        data-bs-target="#delete_modal"
                        onClick={() => setpurchaseReturnDelete(record?._id)}
                      >
                        <i className="far fa-trash-alt me-2" />
                        Delete
                      </Link>
                    </li>
                  )}
                  {/* {(admin || permission?.view) && (
                    <li>
                      <Link
                        className="dropdown-item"
                        to={{
                          pathname: `${"/view-debitnotes"}/${record._id}`,
                        }}
                      >
                        <FeatherIcon icon="eye" className="me-2" />
                        View
                      </Link>
                    </li>
                  )} */}
                  {(admin || permission?.update || permission?.create) && (
                    <li>
                      <Link
                        className="dropdown-item"
                        to="#"
                        onClick={() => setRowId(record?._id)}
                        data-bs-toggle="modal"
                        data-bs-target="#clone_modal"
                      >
                        {/* <i className="fe fe-copy me-2" /> */}
                        <FeatherIcon icon="copy" className="me-2" />
                        Clone
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

  const clone = async (id) => {
    try {
      const url = `${debit_note?.clone}/${id}/clone`;
      const response = await postData(url, {});
      successToast("Debit Notes Cloned  Successfully");
      setPurchaseReturn([...purchaseReturn, response.clonedDebitNote]);
      getPurchaseReturn();
      const ClonedResponse = await getData(debit_note?.List);
      if (ClonedResponse?.code === 200) {
        setSearchFilter(
          ClonedResponse?.data?.list?.length > 0 ? ClonedResponse?.data : []
        );
      }
      return response;
    } catch (error) {
      return false;
    }
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="content-page-header">
              <h5>Purchase Return</h5>
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
                      <Link className="btn btn-primary" to="/add-debit-notes">
                        <i
                          className="fa fa-plus-circle me-2"
                          aria-hidden="true"
                        />
                        Add Purchase Return
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
                      dataSource={purchaseReturn}
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

      <DebitFilter
        setPurchaseReturn={setPurchaseReturn}
        setShow={setShow}
        show={show}
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
                <h3>Delete Debit Notes</h3>
                <p>Are you sure want to delete?</p>
              </div>
              <div className="modal-btn delete-action">
                <div className="row">
                  <div className="col-6">
                    <button
                      type="reset"
                      data-bs-dismiss="modal"
                      className="w-100 btn btn-primary paid-continue-btn"
                      onClick={() => onDelete(purchaseReturnDelete)}
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
                <h3>Clone Debit Notes</h3>
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

export default ListDebitNotes;
