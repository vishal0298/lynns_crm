import React, { useContext, useEffect } from "react";
import "../../../../common/antd.css";
import { Table } from "antd";
import moment from "moment";
import {
  onShowSizeChange,
  itemRender,
} from "../../../../common/paginationfunction";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import { AddLedgerContext } from "../addLedger/addControl";

import { Controller, useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import { handleKeyDown } from "../../../../constans/globals";
import { commonDatacontext } from "../../../../core/commonData";

const AddLedger = () => {
  const {
    onDelete,
    deleteId,
    invalidSubmit,
    onSubmitEdit,
    radio2,
    setRadio2,
    radio1,
    setRadio1,
    onSubmit,
    setStartDate,
    setLedgerEdit,
    schema,
    source,
    startDate,
    setDeleteId,
    ledgerEdit,
    setModalDisable,
    handlePagination,
    page,
    totalCount,
  } = useContext(AddLedgerContext);
  const { currencyData } = useContext(commonDatacontext);

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    trigger,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema), mode: "onChange" });

  useEffect(() => {
    if (ledgerEdit?.mode == "Credit") {
      setRadio2(true);
      setRadio1(false);
    }
    if (ledgerEdit?.mode == "Debit") {
      setRadio1(true);
      setRadio2(false);
    }
    if (Object.keys(ledgerEdit).length == 0) {
      setRadio1(false);
      setRadio2(false);
    }
  }, [ledgerEdit]);

  useEffect(() => {
    if (Object.keys(ledgerEdit).length > 0) {
      setValue("name", ledgerEdit?.name);
      setValue("date", ledgerEdit?.date);
      setValue("reference", ledgerEdit?.reference);
      setValue("mode", ledgerEdit?.mode);
    } else {
      setValue("name", "");
      setValue("date", "");
      setValue("reference", "");
      setValue("mode", "");
    }
  }, [ledgerEdit]);

  useEffect(() => {
    !errors?.name?.message ||
      !errors?.reference?.message ||
      !errors?.mode?.message ||
      setModalDisable(false);
  }, [errors]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <>
          <h2 className="table-avatar">
          
            {text}
          </h2>
        </>
      ),
    },
    {
      title: "Reference",
      dataIndex: "reference",
    },
    {
      title: "Created",
      dataIndex: "date",
    },
    {
      title: "Mode",
      dataIndex: "mode",
      render: (text) => (
        <div>
          {text === "Credit" && (
            <span className="text-success-light">{text}</span>
          )}
          {text === "Debit" && (
            <span className="text-danger-light">{text}</span>
          )}
        </div>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (text, record) => (
        <>
          {currencyData ? currencyData : "$"}
          {Number(record?.amount).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </>
      ),
    },
    {
      title: "Closing Balance",
      dataIndex: "closingBalance",
      render: (text, record) => (
        <>
          {currencyData ? currencyData : "$"}
          {Number(record?.closingBalance).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </>
      ),
    },
  ];

  const checkDisable = () => {
    const controllerName = ["mode", "reference", "name", "amount"];
    return controllerName.every((val) => watch(val));
  };

  const handleChange = (date) => {
    setStartDate(date);
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="content-page-header">
              <h5>Ledger</h5>
              <div className="list-btn">
                <ul className="filter-list">
                  <li>
                    <Link
                      className="btn btn-primary"
                      to="#"
                      data-bs-toggle="modal"
                      data-bs-target="#add_ledger"
                      onClick={() => {
                        setValue("name", "");
                        setValue("date", "");
                        setValue("reference", "");
                        setValue("mode", "");
                        setRadio1(false);
                        setRadio2(false);
                        reset();
                        setLedgerEdit({});
                      }}
                    >
                      <i
                        className="fa fa-plus-circle me-2"
                        aria-hidden="true"
                      />
                      Create Ledger
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
              <div className="card-table">
                <div className="card-body ledger purchase">
                  <div className="table-responsive table-striped table-hover">
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
                      dataSource={source}
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

      {/* <AddVendor /> */}

      {/* Add Ledger */}
      <div className="modal custom-modal fade" id="add_ledger" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header border-0 pb-0">
              <div className="form-header modal-header-title text-start mb-0">
                <h4 className="mb-0">Add Ledger</h4>
              </div>
              <button
                onClick={() => {
                  setLedgerEdit({});
                  reset();
                }}
                type="button"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span className="align-center" aria-hidden="true">
                  ×
                </span>
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit, invalidSubmit)}>
              <div className="modal-body">
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>
                        Name <span className="text-danger"> *</span>
                      </label>
                      <Controller
                        name="name"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <>
                            <input
                              className="form-control"
                              value={value}
                              type="text"
                              placeholder="Enter Name"
                              label={"Name"}
                              onChange={(val) => {
                                onChange(val);
                                trigger("name");
                              }}
                            />
                            <small style={{ color: "red" }}>
                              {errors.name?.message}
                            </small>
                          </>
                        )}
                        defaultValue=""
                      />

                     
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Date</label>
                      <div className="cal-icon cal-icon-info">
                        <Controller
                          control={control}
                          name="date"
                          render={({ field: { onChange } }) => (
                            <DatePicker
                              className="datetimepicker form-control"
                              maxDate={new Date()}
                              dateFormat="dd/MM/yyyy"
                              selected={startDate}
                              onKeyDown={(e) => {
                                e.preventDefault();
                              }}
                              onChange={(date) => {
                                setStartDate(date);
                                trigger("date");
                                onChange(date);
                              }}
                            ></DatePicker>
                          )}
                          defaultValue=""
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>
                        Reference <span className="text-danger"> *</span>
                      </label>
                      <Controller
                        name="reference"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <>
                            <input
                              onKeyDown={(e) => handleKeyDown(e)}
                              className="form-control"
                              value={value}
                              type="text"
                              placeholder="Enter Reference Number"
                              label={"Name"}
                              onChange={(val) => {
                                onChange(val);
                                trigger("reference");
                              }}
                            />
                            <small style={{ color: "red" }}>
                              {errors.reference?.message}
                            </small>
                          </>
                        )}
                        defaultValue=""
                      />
                    
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>
                        Amount <span className="text-danger"> *</span>
                      </label>
                      <Controller
                        name="amount"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <>
                            <input
                              className="form-control"
                              value={value}
                              type="text"
                              placeholder="Enter Amount"
                              label={"Name"}
                              onChange={(val) => {
                                onChange(val);
                                trigger("amount");
                              }}
                            />
                            <small style={{ color: "red" }}>
                              {errors.amount?.message}
                            </small>
                          </>
                        )}
                        defaultValue=""
                      />
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group d-inline-flex align-center mb-0">
                      <label className="me-5 mb-0">Mode</label>
                      <div>
                        <label className="custom_radio me-3 mb-0">
                          <Controller
                            name="mode"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <>
                                <input
                                  className="form-control"
                                  value={value}
                                  type="radio"
                                  label={"Name"}
                                  checked={radio1}
                                  onChange={() => {
                                    onChange("Debit");
                                    setRadio1(true);
                                    setRadio2(false);
                                    setValue("Credit", "");
                                    trigger("Debit");
                                  }}
                                />
                              </>
                            )}
                            defaultValue=""
                          />
                          <span className="checkmark" /> Debit
                        </label>
                        <label className="custom_radio mb-0">
                          <Controller
                            name="mode"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <>
                                <input
                                  className="form-control"
                                  value={value}
                                  type="radio"
                                  label={"Name"}
                                  checked={radio2}
                                  onChange={() => {
                                    onChange("Credit");
                                    setValue("Debit", "");
                                    setRadio1(false);
                                    setRadio2(true);
                                    trigger("Credit");
                                  }}
                                />
                              
                              </>
                            )}
                            defaultValue=""
                          />
                          <span className="checkmark" /> Credit
                        </label>
                      </div>
                    </div>
                    <small className="d-block" style={{ color: "red" }}>
                      {errors.mode?.message}
                    </small>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <Link
                  to="#"
                  data-bs-dismiss="modal"
                  className="btn btn-primary paid-cancel-btn me-2"
                  onClick={() => {
                    setRadio1(false);
                    setRadio2(false);
                    reset();
                  }}
                >
                  Cancel
                </Link>
                {/* <Link to="#" data-bs-dismiss="modal"> */}
                <button
                  className="btn btn-primary paid-continue-btn"
                  type="submit"
                  data-bs-dismiss={checkDisable() && "modal"}
                  // disabled={}
                  id="addModel"
                  // ref={cancelModal}
                >
                  {" "}
                  Submit
                </button>
                {/* </Link> */}
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Add Ledger */}

      {/* Edit Ledger */}
      <div className="modal custom-modal fade" id="edit_ledger" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header border-0 pb-0">
              <div className="form-header modal-header-title text-start mb-0">
                <h4 className="mb-0">Edit Ledger</h4>
              </div>
              <button
                onClick={() => {
                  setLedgerEdit({});
                  reset();
                }}
                type="button"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span className="align-center" aria-hidden="true">
                  ×
                </span>
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmitEdit)}>
              <div className="modal-body">
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>
                        Name <span className="text-danger"> *</span>
                      </label>
                      <Controller
                        name="name"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <>
                            <input
                              className="form-control"
                              value={value}
                              type="text"
                              placeholder="Enter Name"
                              label={"Name"}
                              onChange={(val) => {
                                onChange(val);
                                trigger("name");
                              }}
                            />
                            <small style={{ color: "red" }}>
                              {errors.name?.message}
                            </small>
                          </>
                        )}
                        defaultValue=""
                      />
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Date</label>
                      <div className="cal-icon cal-icon-info">
                        <DatePicker
                          className="datetimepicker form-control"
                          selected={startDate}
                          onChange={handleChange}
                          value={
                            // moment(startDate).format("DD/MM/YYYY") !==
                            // moment(new Date()).format("DD/MM/YYYY")
                            //   ? 
                              moment(startDate).format("DD/MM/YYYY")
                              // : moment(startDate).format("DD/MM/YYYY")
                          }
                          maxDate={new Date()}
                        ></DatePicker>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>
                        Reference <span className="text-danger"> *</span>
                      </label>
                      <Controller
                        name="reference"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <>
                            <input
                              onKeyDown={(e) => handleKeyDown(e)}
                              className="form-control"
                              value={value}
                              type="text"
                              placeholder="Enter Reference Number"
                              label={"Name"}
                              onChange={(val) => {
                                onChange(val);
                                trigger("reference");
                              }}
                            />
                            <small style={{ color: "red" }}>
                              {errors.reference?.message}
                            </small>
                          </>
                        )}
                        defaultValue=""
                      />
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group mb-0">
                      <label>Mode</label>
                      <div>
                        <label className="custom_radio me-3 mb-0">
                          <Controller
                            name="mode"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <>
                                <input
                                  className="form-control"
                                  value={value}
                                  type="radio"
                                  label={"Name"}
                                  checked={radio1}
                                  onChange={() => {
                                    onChange("Debit");
                                    setRadio1(true);
                                    setRadio2(false);
                                    setValue("Credit", "");
                                    trigger("Debit");
                                  }}
                                />
                              </>
                            )}
                            defaultValue=""
                          />
                          <span className="checkmark" /> Debit
                        </label>
                        <label className="custom_radio mb-0">
                          <Controller
                            name="mode"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <>
                                <input
                                  className="form-control"
                                  value={value}
                                  type="radio"
                                  label={"Name"}
                                  checked={radio2}
                                  onChange={() => {
                                    onChange("Credit");
                                    setValue("Debit", "");
                                    setRadio1(false);
                                    setRadio2(true);
                                    trigger("Credit");
                                  }}
                                />
                              </>
                            )}
                            defaultValue=""
                          />
                          <span className="checkmark" /> Credit
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <Link
                  to="#"
                  data-bs-dismiss="modal"
                  className="btn btn-primary paid-cancel-btn me-2"
                >
                  Cancel
                </Link>
                {/* <Link to="#"> */}
                <button
                  className="btn btn-primary paid-continue-btn"
                  type="submit"
                  data-bs-dismiss={checkDisable() && "modal"}
                >
                  {" "}
                  Update
                </button>

                {/* </Link> */}
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Edit Ledger */}

      {/* Delete Ledger */}
      <div className="modal custom-modal fade" id="delete_modal" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-body">
              <div className="form-header">
                <h3>Delete Ledger</h3>
                <p>Are you sure want to delete?</p>
              </div>
              <div className="modal-btn delete-action">
                <div className="row">
                  <div className="col-6">
                    <button
                      type="submit"
                      data-bs-dismiss="modal"
                      className="w-100 btn btn-primary paid-continue-btn"
                      onClick={() => onDelete(deleteId)}
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
          {/* </form> */}
        </div>
      </div>
      {/* /Delete Ledger */}
    </>
  );
};

export default AddLedger;
