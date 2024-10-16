import React, { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import { DropIcon } from "../../../../common/imagepath";
import {
  ApiServiceContext,
  expenses,
  warningToast,
} from "../../../../core/core-index";
import { ViewExpenseContext } from "./ViewExpense.control";
import useFilePreview from "../../hooks/useFilePreview";
import { handleNumberRestriction } from "../../../../constans/globals";
import dayjs from "dayjs";
import DatePickerComponent from "../../datePicker/DatePicker";

const ViewExpense = () => {
  const { getData } = useContext(ApiServiceContext);
  // eslint-disable-next-line no-unused-vars
  const [expense, setExpense] = useState({});
  const urlId = useParams();
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
    resetField,
    watch,
    formState: { errors },
  } = useForm({});

  const { onSubmit, imgerror, setImgError,startDate, setStartDate } =
    useContext(ViewExpenseContext);

  // useEffect(() => {
  //   getSingleExpense();
  // }, []);

  const [files, setFile] = useState([]);

  const file = watch("attachment");
  const [filePreview] = useFilePreview(file, setImgError);

  useEffect(() => {
    if (imgerror) {
      warningToast(imgerror);
      resetField("attachment");
      setImgError("");
    }
  }, [imgerror]);

  useEffect(() => {
    if (filePreview) setFile(filePreview);
  }, [filePreview]);

  const getSingleExpense = async () => {
    const singleExpense = await getData(`${expenses?.View}/${urlId?.id}`);
    let singleExpenseData = singleExpense?.data?.expenseDetails;
    setExpense(singleExpenseData);
    paymentOptions?.find(
      (item) =>
        item.value == singleExpenseData?.paymentMode &&
        setValue("paymentMode", item)
    );
    paymentStatus?.find(
      (item) =>
        item.value == singleExpenseData?.status && setValue("status", item)
    );
    setStartDate(singleExpenseData?.expenseDate);
    setValue("expenseDate", dayjs(singleExpenseData?.expenseDate));
    setValue("amount", singleExpenseData?.amount);
    setValue("expenseId", singleExpenseData?.expenseId);
    setValue("reference", singleExpenseData?.reference);
    setFile(singleExpenseData?.attachment);
    setValue("description", singleExpenseData?.description);
  };

  useEffect(() => {
    getSingleExpense();
    let elements = Array.from(
      document.getElementsByClassName("react-datepicker-wrapper")
    );
    elements.map((element) => element.classList.add("width-100"));
  }, []);

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="page-header">
            <div className="row">
              <div className="col-sm-12">
                <h3 className="page-title">View Expenses</h3>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <form>
                    <div className="row">
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group">
                          <label>
                            Expense ID<span className="text-danger"> *</span>
                          </label>
                          <Controller
                            name="expenseId"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <>
                                <input
                                  type="text"
                                  maxLength={20}
                                  className="form-control"
                                  placeholder="Enter Expense ID"
                                  value={value|| '' }
                                  onChange={(val) => {
                                    onChange(val);
                                    trigger("expenseId");
                                  }}
                                  readOnly={true}
                                  disabled={true}
                                />
                                {errors.expenseId && (
                                  <p className="text-danger">
                                    {errors.expenseId.message}
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
                                  value={value|| '' }
                                  readOnly={true}
                                  disabled={true}
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
                                  value={value|| '' }
                                  readOnly={true}
                                  disabled={true}
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
                            Payment Mode
                            <span className="text-danger"> *</span>
                          </label>
                          <Controller
                            name="paymentMode"
                            control={control}
                            render={({ field: { value } }) => (
                            <>
                               <input
                                  className={`form-control`}
                                  type="text"
                                  value={value?.value|| '' }
                                  readOnly={true}
                                  disabled={true}
                                />
                            </>
                            )}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group">
                          <label>
                            Expense Date <span className="text-danger"> *</span>
                          </label>
                          <Controller
                            control={control}
                            name="expenseDate"
                            render={({ field: { value } }) => (
                              <input
                              className={`form-control`}
                              type="text"
                              value={dayjs(startDate).format("DD/MM/YYYY")|| '' }
                              readOnly={true}
                              disabled={true}
                            />
                            )}
                          ></Controller>
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
                            render={({ field: { value } }) => (
                              <>
                               <input
                                  className={`form-control`}
                                  type="text"
                                  value={value?.value|| '' }
                                  readOnly={true}
                                  disabled={true}
                                />
                              </>
                            )}
                          />
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-12">
                        <div className="form-group">
                          <label>
                            Attachment
                          </label>
                          {!imgerror
                            ? files?.[0]?.length > 0 && (
                                <img
                                  src={files}
                                  className="uploaded-imgs"
                                  style={{
                                    display: files ? "flex" : "none",
                                    maxWidth: "200px",
                                    maxHeight: "200px",
                                  }}
                                  alt=""
                                />
                              )
                            : null}
                        </div>
                      </div>
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
export default ViewExpense;
