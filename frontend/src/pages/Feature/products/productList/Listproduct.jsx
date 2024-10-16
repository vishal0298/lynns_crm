import React, { useContext, useState } from "react";
import { ListproductContext } from "./Listproduct.control";
import "../../../../common/antd.css";
import { Link } from "react-router-dom";
import ProductFilter from "../productFilter";
import { FilterIcon } from "../../../../common/imagepath";
import { Table } from "antd";
import {
  onShowSizeChange,
  itemRender,
} from "../../../../common/paginationfunction";
import { commonDatacontext } from "../../../../core/commonData";
import { amountFormat } from "../../../../common/helper";

const Listproduct = () => {
  const {
    productlist,
    setProductList,
    show,
    setShow,
    onDelete,
    admin,
    permission,
    handlePagination,
    page,
    setPage,
    pagesize,
    totalCount,
    setTotalCount,
  } = useContext(ListproductContext);
  const [primaryId, setprimaryId] = useState("");
  const { create, update, delete: remove } = permission;
  const { currencyData } = useContext(commonDatacontext);
  const columns = [
    {
      title: "#",
      dataIndex: "Id",
      render: (value, item, index) => (page - 1) * pagesize + (index + 1),
    },
    {
      title: "Item",
      dataIndex: "name",
    },
    {
      title: "Alert Quantity",
      dataIndex: "alertQuantity",
    },
    {
      title: "Sales Price",
      dataIndex: "sellingPrice",
      render: (text, record) => (
        <>
          {currencyData ? currencyData : "$"}
          {amountFormat(record?.sellingPrice)}
        </>
      ),
    },
    {
      title: "Purchase Price",
      dataIndex: "purchasePrice",
      render: (text, record) => (
        <>
          {currencyData ? currencyData : "$"}
          {amountFormat(record?.purchasePrice)}
        </>
      ),
    },
    (update || remove || admin) && {
      title: "Action",
      render: (text, record) => (
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
                      to={{ pathname: `${"/edit-product"}/${record._id}` }}
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
                      onClick={() => setprimaryId(record?._id)}
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
              <h5>Products / Services</h5>
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
                      <Link className="btn btn-primary" to="/add-product">
                        <i
                          className="fa fa-plus-circle me-2"
                          aria-hidden="true"
                        />
                        Add Product
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
                        <Link to="/product-list" className="active">
                          Product
                        </Link>
                      </li>
                      <li>
                        <Link to="/category">Category</Link>
                      </li>
                      <li>
                        <Link to="/units">Units</Link>
                      </li>
                      <li>
                        <Link to="/staff">Staff</Link>
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
              <div className=" card-table">
                <div className="card-body product-list purchase">
                  <div className="table-responsive table-hover table-striped">
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
                      dataSource={productlist}
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
      <ProductFilter
        setShow={setShow}
        show={show}
        setProductList={setProductList}
        pagesize={pagesize}
        page={page}
        setTotalCount={setTotalCount}
        handlePagination={handlePagination}
        setPage={setPage}
      />
      <div className="modal custom-modal fade" id="delete_modal" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-body">
              <div className="form-header">
                <h3>Delete Products / Services</h3>
                <p>Are you sure want to delete?</p>
              </div>
              <div className="modal-btn delete-action">
                <div className="row">
                  <div className="col-6">
                    <button
                      onClick={() => onDelete(primaryId)}
                      type="reset"
                      data-bs-dismiss="modal"
                      className="w-100 btn btn-primary paid-continue-btn"
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
export default Listproduct;
