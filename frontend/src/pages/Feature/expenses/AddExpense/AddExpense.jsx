import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import { DropIcon } from "../../../../common/imagepath";
import { expenseSchema } from "../../../../common/schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { ApiServiceContext, ExpenseNum } from "../../../../core/core-index";
import { AddExpenseContext } from "./AddExpense.control";
import useFilePreview from "../../hooks/useFilePreview";
import { handleNumberRestriction } from "../../../../constans/globals";
import DatePickerComponent from "../../datePicker/DatePicker";
import dayjs from "dayjs";

const AddExpense = () => {
  const { getData } = useContext(ApiServiceContext);

  // eslint-disable-next-line no-unused-vars
  const [paymentOptions, setPaymentOptions] = useState([
    { label: "CASH", value: "Cash" },
    { label: "UPI", value: "Upi" },
    { label: "CARD", value: "Card" },
    { label: "MEMBERSHIP", value: "Membership" },
  ]);
  // eslint-disable-next-line no-unused-vars
  const [paymentStatus, setPaymentStatus] = useState([
    { label: "Paid", value: "Paid" },
    { label: "Pending", value: "Pending" },
    { label: "Cancelled", value: "Cancelled" },
  ]);

  const {
    handleSubmit,
    control,
    setValue,
    trigger,
    register,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(expenseSchema),
  });

  const { onSubmit, num, setNum } = useContext(AddExpenseContext);

  const [imgerror, setImgError] = useState("");
  const file = watch("attachment");
  const [filePreview] = useFilePreview(file, setImgError);
  // ;
  useEffect(() => {
    getExpenseNumber();
    let elements = Array.from(
      document.getElementsByClassName("react-datepicker-wrapper")
    );
    elements.map((element) => element.classList.add("width-100"));
  }, []);

  useEffect(() => {
    setValue("expenseDate", dayjs());
  }, [setValue]);

  const disableFutureDate = (current) => {
    return current && current > dayjs().endOf("day");
  };

  const getExpenseNumber = async () => {
    const response = await getData(ExpenseNum);
    setNum(response?.data);
  };

  // useEffect(() => {
  //   getExpenseNumber();
  // }, []);

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <h3 className="page-title">Add Expenses</h3>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group input_text">
                          <label>Expense Id</label>
                          <Controller
                            name="expenseId"
                            type="number"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <input
                                className={`form-control ${
                                  errors?.expenseId ? "error-input" : ""
                                }`}
                                type="text"
                                value={num}
                                placeholder="Enter Invoice Number"
                                autoComplete="false"
                                readOnly={true}
                                disabled={true}
                              />
                            )}
                            defaultValue=""
                          />
                          <small>{errors?.expenseId?.message}</small>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group">
                          <label>Reference Number </label>
                          <Controller
                            name="reference"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <>
                                <input
                                  type="text"
                                  onKeyPress={handleNumberRestriction}
                                  onInput={(e) =>
                                    (e.target.value = e.target.value.slice(
                                      0,
                                      20
                                    ))
                                  }
                                  className="form-control"
                                  placeholder="Enter Reference Number"
                                  value={value}
                                  onChange={(val) => {
                                    onChange(val);
                                    trigger("reference");
                                  }}
                                />

                                {errors.reference && (
                                  <p className="text-danger">
                                    {errors.reference.message}
                                  </p>
                                )}
                              </>
                            )}
                            defaultValue=""
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
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
                                  type="text"
                                  onKeyPress={handleNumberRestriction}
                                  onInput={(e) =>
                                    (e.target.value = e.target.value.slice(
                                      0,
                                      20
                                    ))
                                  }
                                  className="form-control"
                                  placeholder="Enter Amount"
                                  value={value}
                                  onChange={(val) => {
                                    onChange(val);
                                    trigger("amount");
                                  }}
                                />

                                {errors.amount && (
                                  <p className="text-danger">
                                    {errors.amount.message}
                                  </p>
                                )}
                              </>
                            )}
                            defaultValue=""
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group">
                          <label>
                            Payment Mode <span className="text-danger"> *</span>
                          </label>
                          <Controller
                            name="paymentMode"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <>
                                <Select
                                  placeholder="Select Payment Mode"
                                  className=" w-100"
                                  options={paymentOptions}
                                  value={value}
                                  onChange={(e) => {
                                    onChange(e);
                                    trigger("paymentMode");
                                  }}
                                  classNamePrefix="select_kanakku"
                                />
                                {errors.paymentMode && (
                                  <p className="text-danger">
                                    {errors.paymentMode.message}
                                  </p>
                                )}
                              </>
                            )}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group date-form-group">
                          <label className="d-block">
                            Expense Date <span className="text-danger"> *</span>
                          </label>
                          {/* For antd Datepicker */}
                          <Controller
                            control={control}
                            name="expenseDate"
                            render={({ field: { value, onChange } }) => (
                              <>
                                <DatePickerComponent
                                  disabledDate={disableFutureDate}
                                  value={value}
                                  onChange={onChange}
                                />
                                {errors.expenseDate && (
                                  <p className="text-danger">
                                    {errors.expenseDate.message}
                                  </p>
                                )}
                              </>
                            )}
                          ></Controller>
                          {/* For antd Datepicker */}
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group">
                          <label>
                            Payment Status
                            <span className="text-danger"> *</span>
                          </label>
                          <Controller
                            name="status"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <>
                                <Select
                                  placeholder="Select Payment Status"
                                  className="w-100"
                                  options={paymentStatus}
                                  value={value}
                                  onChange={(e) => {
                                    onChange(e);
                                    trigger("status");
                                  }}
                                  classNamePrefix="select_kanakku"
                                />
                                {errors.status && (
                                  <p className="text-danger">
                                    {errors.status.message}
                                  </p>
                                )}
                              </>
                            )}
                          />
                        </div>
                      </div>

                      <div className="col-lg-6 col-md-12">
                        <div className="form-group">
                          <label>Attachment</label>
                          <div className="form-group service-upload mb-0">
                            <span>
                              <img src={DropIcon} alt="upload" />
                            </span>
                            <h6 className="drop-browse align-center">
                              Drop your files here or
                              <span className="text-primary ms-1">browse</span>
                            </h6>
                            <p className="text-muted">Maximum size: 50MB</p>

                            <Controller
                              name="attachment"
                              control={control}
                              // eslint-disable-next-line no-unused-vars
                              render={({ field: { value, onChange } }) => (
                                <>
                                  <input
                                    type="file"
                                    multiple=""
                                    id="attachment"
                                    {...register("attachment")}
                                  />
                                </>
                              )}
                            />
                            <div id="frames"></div>
                          </div>

                          {!imgerror && filePreview && (
                            <img
                              src={filePreview}
                              className="uploaded-imgs"
                              style={{
                                display: "flex",
                                maxWidth: "200px",
                                maxHeight: "200px",
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="add-vendor-btns text-end">
                      <Link
                        to="/expenses"
                        className="btn btn-primary cancel me-2"
                      >
                        Cancel
                      </Link>
                      <button className="btn btn-primary" type="submit">
                        Add
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default AddExpense;
