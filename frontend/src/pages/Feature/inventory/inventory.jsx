import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../../common/antd.css";
import { Table } from "antd";
import {
  onShowSizeChange,
  itemRender,
} from "../../../common/paginationfunction";
import InventoryFilter from "./inventoryFilter";
import { FilterIcon } from "../../../common/imagepath";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ApiServiceContext, successToast } from "../../../core/core-index";
import {
  addStockInventory,
  deleteInventory,
  listInventory,
  outStockInventory,
} from "../../../constans/apiname";
import * as yup from "yup";
import { handleKeyDown, handleNumberRestriction } from "../../../constans/globals";
import { commonDatacontext } from "../../../core/commonData";
import { userRolesCheck } from "../../../common/commonMethods";

const InventorySchema = yup.object().shape({
  productId: yup.string().required("Name is a Required Field"),
  mode: yup.string().nullable(true),

  quantity: yup
    .number("Quantity Must Be a Number")
    .max(1000000, "Maximum Value Exceeded")
    .positive("Quantity Must Be a Positive Number")

    .typeError("Quantity Must Be a Number")
    .integer("Quantity Must Be a Integer"),
});

const Inventory = () => {
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    trigger,

    formState: { errors, isDirty, isValid },
  } = useForm({ resolver: yupResolver(InventorySchema) });
  const { currencyData } = useContext(commonDatacontext);

  const [show, setShow] = useState(false);
  const [inventorylist, setInventorylist] = useState([]);
  const [inventoryId, setInventoryId] = useState("");
  const [modelHide, setmodelHide] = useState(false);
  const [permission, setPermission] = useState({});
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    getProductDetails();
    let findModule = userRolesCheck("inventory");
    if (findModule == "admin") {
      setAdmin(true);
    } else {
      setPermission(findModule);
    }
  }, []);
  
  const { create, update, delete: remove } = permission;

  const EditStock = (details, type) => {
    setInventoryId(details?._id);
    setValue("productId", details?.name);
    setValue("quantity", 0);
    setValue("units", details?.unitInfo?.[0]?.name);
  };

  const [page, setPage] = useState(1);
  const [pagesize, setPagesize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const handlePagination = async (page, pageSize) => {
    setPage(page);
    setPagesize(pageSize);
    getProductDetails(page, pageSize);
  };

  const getProductDetails = async (currentpage = 1, currentpagesize = 10) => {
    try {
      let skipSize;
      skipSize = currentpage == 1 ? 0 : (currentpage - 1) * currentpagesize;
      const response = await getData(
        `${listInventory}?limit=${currentpagesize}&skip=${skipSize}`
      );
      if (response.code === 200) {
        setInventorylist(response.data);
        setTotalCount(response.totalRecords);
      }
      return response;
    } catch (error) {
      
    }
  };

  // useEffect(() => {
  //   getProductDetails();
  // }, []);

  const { getData, postData, patchData, putData } =
    useContext(ApiServiceContext);

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      render: (text, record, index) => (page - 1) * pagesize + (index + 1),
    },
    {
      title: "Item",
      dataIndex: "name",
    },
    {
      title: "Code",
      dataIndex: "sku",
    },
    {
      title: "Units",
      dataIndex: "unitInfo.name",

      render: (text, recrod) => <div>{recrod?.unitInfo?.[0]?.name}</div>,
    },
    {
      title: "Quantity",
      dataIndex: "inventoryInfo",

      render: (text, recrod) => (
        <div>
          {recrod?.inventory_Info?.[0]?.quantity
            ? recrod?.inventory_Info?.[0]?.quantity
            : 0}
        </div>
      ),
    },
    {
      title: "Sales Price",
      dataIndex: "sellingPrice",
      render: (text, record) => (
        <>
          {currencyData ? currencyData : "$"}
          {Number(record?.sellingPrice).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </>
      ),
    },
    {
      title: "Purchase Price",
      dataIndex: "purchasePrice",
      render: (text, record) => (
        <>
          {currencyData ? currencyData : "$"}
          {Number(record?.purchasePrice).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </>
      ),
    },
    (create || update || admin) && {
      title: "Action",
      dataIndex: "Action",
      render: (text, record) => {
        return (
          <div className="d-flex align-items-center">
            {(create || update || admin) && (
              <Link
                to="#"
                className="btn btn-greys bg-success-light me-2"
                data-bs-toggle="modal"
                data-bs-target="#stock_in"
                onClick={() => {
                  EditStock(record);
                }}
              >
                <i className="fa fa-plus-circle me-1" /> Stock in
              </Link>
            )}
            {(create || update || admin) && (
              <Link
                to="#"
                className="btn btn-greys bg-danger-light me-2"
                data-bs-toggle="modal"
                data-bs-target="#stock_out"
                onClick={() => {
                  EditStock(record, "delete");
                }}
              >
                <i className="fa fa-plus-circle me-1" /> Stock out
              </Link>
            )}
          </div>
        );
      },
      
    },
  ].filter(Boolean);

  // eslint-disable-next-line no-unused-vars
  const onDelete = async (id) => {
    const url = `${deleteInventory}/${id}`;
    const obj = { _id: id };
    try {
      const response = await patchData(url, obj);
      if (response) {
        getProductDetails();
        
      }
    } catch {
      return false;
    }
  };

  const onAddSubmit = async (data) => {
    const obj = {
      quantity: data?.quantity,
      notes: data?.notes,
    };

    if (inventoryId) {
      obj["productId"] = inventoryId;
    }

    try {
      const response = await postData(addStockInventory, obj);
      if (response) {
        getProductDetails(page, pagesize);
        successToast("Stock Added Successfully");
        resetData();
        setmodelHide(true);
      }
    } catch {
      return false;
    }
  };

  const onOutSubmit = async (data) => {
    const obj = {
      quantity: data?.quantity,
    };
    if (inventoryId) {
      obj["productId"] = inventoryId;
    }

    try {
      const response = await putData(outStockInventory, obj);
      if (response) {
        getProductDetails(page, pagesize);
        setmodelHide(true);
        resetData();
        successToast("Stock Removed Successfully");
      }
    } catch {
      return false;
    }
  };

  const resetData = () => {
    reset();
    setValue("notes", "");
  };

  const handleScroll = (event) => {
    event.preventDefault(); 
    const deltaY = event.deltaY;

  };

  useEffect(() => {
    const inputElement = document.getElementById("myInput");
    inputElement.addEventListener("wheel", handleScroll, { passive: false });

    return () => {
      inputElement.removeEventListener("wheel", handleScroll);
    };
  }, []);

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="content-page-header ">
              <h5>Inventory</h5>
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
                </ul>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          {/* Table */}
          <div className="row">
            <div className="col-sm-12">
              <div className=" card-table">
                <div className="card-body">
                  <div className="table-responsive table-hover">
                    <Table
                      rowKey={(record) => record?._id}
                      style={{ minWidth: "100%" }}
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
                      dataSource={inventorylist}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* /Table */}
        </div>
      </div>

      <InventoryFilter
        setShow={setShow}
        show={show}
        setInventorylist={setInventorylist}
        page={page}
        pagesize={pagesize}
        setTotalCount={setTotalCount}
        setPage={setPage}
        handlePagination={handlePagination}
      />

      <div className="modal custom-modal fade" id="stock_in" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header border-0 pb-0">
              <div className="form-header modal-header-title text-start mb-0">
                <h4 className="mb-0">Add Stock in</h4>
              </div>
              <button
                type="button"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => resetData()}
              >
                <span className="align-center" aria-hidden="true">
                  ×
                </span>
              </button>
            </div>
            <form onSubmit={handleSubmit(onAddSubmit)}>
              <div className="modal-body">
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Name</label>
                      <Controller
                        name="productId"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <>
                            <input
                              disabled={true}
                              className="bg-white-smoke form-control"
                              value={value}
                              type="text"
                              placeholder="vn"
                              label={"Name"}
                              onChange={(val) => {
                                onChange(val);
                                trigger("productId");
                              }}
                            />
                            <small style={{ color: "red" }}>
                              {errors.productId?.message}
                            </small>
                          </>
                        )}
                        defaultValue=""
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-12">
                    <div className="form-group">
                      <label>
                        Quantity<span className="text-danger"> *</span>
                      </label>
                      <Controller
                        name="quantity"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <>
                            <input
                              id="myInput"
                              className="form-control"
                              value={value}
                              type="text"
                              onKeyPress={handleNumberRestriction}
                              placeholder={0}
                              label={"Name"}
                              onChange={(val) => {
                                onChange(val);
                                trigger("quantity");
                              }}
                            />
                            <small style={{ color: "red" }}>
                              {errors.quantity?.message}
                            </small>
                          </>
                        )}
                        defaultValue=""
                      />
                      
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-12">
                    <div className="form-group mb-0 ">
                      <label>Units</label>
                      <Controller
                        name="units"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <>
                            <input
                              disabled={true}
                              className="bg-white-smoke form-control"
                              value={value}
                              onChange={(val) => {
                                onChange(val);
                                trigger("units");
                              }}
                            />
                          </>
                        )}
                        defaultValue=""
                      />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group mb-0">
                      <label>Notes</label>
                      <Controller
                        name="notes"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <>
                            <textarea
                              value={value}
                              rows={3}
                              cols={3}
                              className="form-control"
                              placeholder="Enter Notes"
                              onChange={(val) => {
                                onChange(val);
                                trigger("notes");
                              }}
                            />
                          </>
                        )}
                        defaultValue=""
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <Link
                  to="#"
                  data-bs-dismiss="modal"
                  className="btn btn-primary paid-cancel-btn me-2"
                  onClick={resetData}
                >
                  Cancel
                </Link>
              
                <button
                  className="btn btn-primary paid-continue-btn"
                  type="submit"
                  data-bs-dismiss="modal"
                  disabled={!isDirty || !isValid}
                >
                  Add Quantity
                </button>

              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="modal custom-modal fade" id="stock_out" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header border-0 pb-0">
              <div className="form-header modal-header-title text-start mb-0">
                <h4 className="mb-0">Remove Stock</h4>
              </div>
              <button
                type="button"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={resetData}
              >
                <span className="align-center" aria-hidden="true">
                  ×
                </span>
              </button>
            </div>
            <form onSubmit={handleSubmit(onOutSubmit)}>
              <div className="modal-body">
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Name</label>
                      <Controller
                        name="productId"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <>
                            <input
                              disabled={true}
                              className="bg-white-smoke form-control"
                              value={value}
                              type="text"
                              placeholder="SEO Service"
                              label={"Name"}
                              onChange={(val) => {
                                onChange(val);
                                trigger("productId");
                              }}
                            />
                          </>
                        )}
                        defaultValue=""
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-12">
                    <div className="form-group">
                      <label>
                        Quantity<span className="text-danger"> *</span>
                      </label>
                      <Controller
                        name="quantity"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <>
                            <input
                              className="form-control"
                              id="myInput"
                              value={value}
                              type="text"
                              max={1000}
                              placeholder={0}
                              onKeyDown={(e) => handleKeyDown(e)}
                              onKeyPress={handleNumberRestriction}
                              label={"Name"}
                              onChange={(val) => {
                                onChange(val);
                                trigger("quantity");
                              }}
                            />
                            <small style={{ color: "red" }}>
                              {errors.quantity?.message}
                            </small>
                          </>
                        )}
                        defaultValue=""
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-12">
                    <div className="form-group mb-0">
                      <label>Units</label>
                      <Controller
                        name="units"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <>
                            <input
                              disabled={true}
                              className="bg-white-smoke form-control"
                              value={value}
                              onChange={(val) => {
                                onChange(val);
                                trigger("units");
                              }}
                            />
                          </>
                        )}
                        defaultValue=""
                      />
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="form-group mb-0">
                      <label>Notes</label>
                      <Controller
                        name="notes"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <>
                            <textarea
                              value={value}
                              rows={3}
                              cols={3}
                              className="form-control"
                              placeholder="Enter Notes"
                              onChange={(val) => {
                                onChange(val);
                                trigger("notes");
                              }}
                            />
                          </>
                        )}
                        defaultValue=""
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <Link
                  to="#"
                  data-bs-dismiss="modal"
                  className="btn btn-primary paid-cancel-btn me-2"
                  onClick={resetData}
                >
                  Cancel
                </Link>
                <button
                  data-bs-dismiss="modal"
                  type="submit"
                  className="btn btn-primary paid-continue-btn"
                  disabled={!isDirty || !isValid}
                >
                  Remove Quantity
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="modal custom-modal fade" id="delete_stock" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-body">
              <div className="form-header">
                <h3>Delete Inventory</h3>
                <p>Are you sure want to delete?</p>
              </div>
              <div className="modal-btn delete-action">
                <div className="row">
                  <div className="col-6">
                    <button
                      type="submit"
                      className="btn btn-primary paid-continue-btn w-100"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="col-6">
                    <Link
                      to="#"
                      data-bs-dismiss="modal"
                      className="btn btn-primary paid-cancel-btn"
                    >
                      Cancel
                    </Link>
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

export default Inventory;
