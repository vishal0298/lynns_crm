/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "../../../../common/antd.css";
import { Popconfirm, Table } from "antd";
import FeatherIcon from "feather-icons-react";
import EditProductForm from "../../modalForm/EditProductForm";
import AddBankForm from "../../modalForm/AddBankForm";
import { styles } from "../../react-Select/Selectstyles";
import SelectDropDown from "../../react-Select/SelectDropDown";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AddpurchaseReturnContext } from "./AddpurchaseReturn.control";
import useFilePreview from "../../hooks/useFilePreview";
import { commonDatacontext } from "../../../../core/commonData";
import { handleNumberRestriction } from "../../../../constans/globals";
import dayjs from "dayjs";
import DatePickerComponent from "../../datePicker/DatePicker";
import { handleKeyPress } from "../../../../common/helper";
import SignaturePadComponent from "../../../../common/SignaturePadComponent";
import * as yup from "yup";
import { ApiServiceContext, DebitNum } from "../../../../core/core-index";

const AddPurchaseReturn = () => {
  const [menu, setMenu] = useState(false);
  const [editPro, setEditPro] = useState({});
  const [newEdit, setNewEdit] = useState({});
  const [modalDismiss, setModalDismiss] = useState(false);
  const [bankModalDismiss, setBankModalDismiss] = useState(false);
  const [selectedSign, setselectedSign] = useState("/");

  const { currencyData } = useContext(commonDatacontext);

  const {
    taxList,
    productService,
    calculateDiscount,
    calculateDiscountAmount,
    calculateRate,
    calculateSum,
    calculateAmount,
    calculateTax,
    calculateTaxAmount,
    productOption,
    productOptionCopy,
    round,
    setRound,
    roundOffAction,
    onSubmit,
    afterModalSubmit,
    roundOff,
    SelectedList,
    handleDelete,
    handleUnitChange,
    calculateTaxableSum,
    rounded,
    trimmedDataURL,
    setTrimmedDataURL,
    setSignatureData,
    debitSchema,
    setTotalAmount,
    setNum,
    num,
  } = useContext(AddpurchaseReturnContext);

  const {
    handleSubmit,
    control,
    trigger,
    register,
    clearErrors,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(debitSchema),
  });
  // State
  const [quantity, setQuantity] = useState(1);
  const [purchaseReturnDelete, setPurchaseReturnDelete] = useState("");
  const [refer, setRefer] = useState(false);

  const [imgerror, setImgError] = useState("");
  const file = watch("signatureImage");
  const [filePreview] = useFilePreview(file, setImgError);
  const { getData } = useContext(ApiServiceContext);

  useEffect(() => {
    let elements = Array.from(
      document.getElementsByClassName("react-datepicker-wrapper")
    );
    elements.map((element) => element.classList.add("w-100"));
    getDebitNumber();
  }, []);

  useEffect(() => {
    roundOff(round);
  }, [roundOffAction]);


  const listData = productOption?.map((item, index) => {
    return { label: item.text, value: item.id, quantity: item.quantity };
  });

  const prepare = (record) => {
    var gotoEdit = {
      rate: record?.purchasePrice,
      discount: record?.discountValue,
      tax: record?.tax?.taxRate,
      id: record?._id,
      record,
    };
    setEditPro(gotoEdit);
    setModalDismiss(true);
  };
  const columns = [
    {
      title: "Product/Service",
      dataIndex: "name",
    },
    {
      title: "Quantity",
      dataIndex: "alertQuantity",
      render: (text, record) => {
        return (
          <input
            type="text"
            maxLength={10}
            onKeyPress={handleNumberRestriction}
            className="form-control"
            value={
              productOptionCopy.find((ele) => ele.id == record?._id)?.quantity
            }
            onChange={(e) => handleUnitChange(e, record?._id)}
          />
        );
      },
    },
    {
      title: "Unit",
      key: "units",
      render: (record) => <span>{record?.units?.symbol}</span>,
    },
    {
      title: "Rate",
      key: "purchasePrice",
      render: (record) => {
        return <span>{calculateRate(record)}</span>;
      },
    },
    {
      title: "Discount",
      key: "discountValue",
      render: (record) => {
        return (
          <span>
            {currencyData ? currencyData : "$"}
            {calculateDiscountAmount(record)}
          </span>
        );
      },
    },
    {
      title: "Tax",
      key: "tax",
      render: (record) => {
        return (
          <span>
            {currencyData ? currencyData : "$"}
            {calculateTaxAmount(record)}
          </span>
        );
      },
    },
    {
      title: "Amount",
      key: "Amount",
      render: (text, record) => {
        return (
          <span>
            {currencyData ? currencyData : "$"}
            {calculateAmount(record)}
          </span>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "Action",
      render: (text, record) => {
        return (
          <>
            <div className="d-flex align-items-center">
              <Link
                to="#"
                className="btn-action-icon me-2"
                data-bs-toggle="modal"
                data-bs-target="#add_discount"
                onClick={() => {
                  prepare(record);
                }}
              >
                <span>
                  <i className="fe fe-edit">
                    <FeatherIcon icon="edit" />
                  </i>
                </span>
              </Link>
              <Link to="#" className="btn-action-icon">
                <Popconfirm
                  title="Sure you want to delete?"
                  onConfirm={() =>
                    handleDelete(record._id, purchaseReturnDelete)
                  }
                >
                  <span>
                    <i className="fe fe-trash-2">
                      <FeatherIcon icon="trash-2" />
                    </i>
                  </span>
                </Popconfirm>
              </Link>
            </div>
          </>
        );
      },
    },
  ];

  const disablePastDate = (current) => {
    return current && current < dayjs().startOf("day");
  };
  const disableFutureDate = (current) => {
    return current && current > dayjs().endOf("day");
  };

  const TotalValue = Number(
    round ? Math.round(calculateSum()) : calculateSum()
  ).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  useEffect(() => {
    setTotalAmount(round ? Math.round(calculateSum()) : calculateSum());
  }, [TotalValue]);

  const getDebitNumber = async () => {
    const response = await getData(DebitNum);
    setNum(response?.data);
  };

  // useEffect(() => {
  //   getDebitNumber();
  // }, []);

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="content-page-header">
            <h5>Add Purchase Return </h5>
          </div>
          <div className="row">
            <div className="col-md-12">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="card-body">
                  <div className="form-group-item border-0 mb-0">
                    <div className="row align-item-center">
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group input_text">
                          <label>Purchase Return Id</label>
                          <Controller
                            name="debit_note_id"
                            type="number"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <input
                                className={`form-control ${
                                  errors?.debit_note_id ? "error-input" : ""
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
                          <small>{errors?.debit_note_id?.message}</small>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group">
                          <label>
                            Select Vendor<span className="text-danger"> *</span>
                          </label>
                          <ul className="form-group-plus css-equal-heights">
                            <li>
                              <Controller
                                name="vendorId"
                                control={control}
                                render={({
                                  field: { value, onChange, ref },
                                }) => (
                                  <>
                                    <SelectDropDown
                                      value=""
                                      placeholder="Select Vendor"
                                      onChange={(val) => {
                                        onChange(val);
                                        trigger("vendorId");
                                      }}
                                      reference={ref}
                                    />
                                    {errors.vendorId && (
                                      <p className="text-danger">
                                        {errors?.vendorId?.message}
                                      </p>
                                    )}
                                  </>
                                )}
                              />
                            </li>
                            <li>
                              <Link
                                className="btn btn-primary form-plus-btn"
                                to="/add-vendors"
                              >
                                <i className="fas fa-plus-circle" />
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group date-form-group">
                          <label>Purchases Date</label>
                          {/* For antd Datepicker */}
                          <Controller
                            control={control}
                            name="purchaseOrderDate"
                            render={({ field: { value, onChange, ref } }) => (
                              <DatePickerComponent
                                disabledDate={disableFutureDate}
                                value={value}
                                onChange={onChange}
                              />
                            )}
                          ></Controller>
                          {/* For antd Datepicker */}
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group date-form-group">
                          <label>Due Date</label>
                          <Controller
                            control={control}
                            name="dueDate"
                            render={({ field: { value, onChange, ref } }) => (
                              <DatePickerComponent
                                disabledDate={disablePastDate}
                                value={value}
                                onChange={onChange}
                              />
                            )}
                          ></Controller>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group">
                          <label>Reference No</label>
                          <Controller
                            name="referenceNo"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Enter Reference Number"
                                  onKeyPress={handleNumberRestriction}
                                  onChange={(val) => {
                                    onChange(val);
                                    trigger("referenceNo");
                                  }}
                                  {...register("referenceNo")}
                                />
                              </>
                            )}
                          />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="form-group">
                          <label>
                            Products<span className="text-danger"> *</span>
                          </label>
                          <ul className="form-group-plus css-equal-heights">
                            <li>
                              <Controller
                                name="products"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <>
                                    <Select
                                      classNamePrefix="select_kanakku"
                                      className="w-100"
                                      options={listData}
                                      value=""
                                      onChange={(e) => {
                                        onChange(e);
                                        trigger("products");
                                        SelectedList(e?.value);
                                      }}
                                      placeholder="Select Products"
                                    />
                                  </>
                                )}
                              />
                            </li>
                            <li>
                              <Link
                                className="btn btn-primary form-plus-btn"
                                to="/add-product"
                              >
                                <i className="fas fa-plus-circle" />
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-group-item">
                    <div className="card-table">
                      <div className="card-body editInvoice category">
                        <div className="table-responsive table-hover">
                          <Table
                            rowKey={(record) => record._id}
                            pagination={false}
                            columns={columns}
                            dataSource={productService}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="form-group-item border-0 p-0">
                    <div className="row">
                      <div className="col-xl-6 col-lg-12">
                        <div className="form-group-bank">
                          <div className="row align-items-center">
                            <div className="col-md-8">
                              <div className="form-group">
                                <label>Select Bank</label>
                                <Controller
                                  name="bank"
                                  control={control}
                                  render={({
                                    field: { value, onChange, ref },
                                  }) => (
                                    <>
                                      <SelectDropDown
                                        module={true}
                                        // value=""
                                        placeholder="Select Bank"
                                        onChange={(val) => {
                                          onChange(val);
                                        }}
                                        reference={ref}
                                        goto={refer}
                                      />
                                    </>
                                  )}
                                />
                              </div>
                            </div>
                            <div className="col-md-4">
                              <div className="form-groups">
                                <Link
                                  className="btn btn-primary"
                                  to="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#bank_details"
                                  onClick={() => setBankModalDismiss(true)}
                                >
                                  Add Bank
                                </Link>
                              </div>
                            </div>
                          </div>
                          <div className="form-group notes-form-group-info">
                            <label>Notes</label>
                            <Controller
                              name="notes"
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <>
                                  <textarea
                                    className="form-control"
                                    placeholder="Enter Notes"
                                    defaultValue={""}
                                    name="notes"
                                    {...register("notes")}
                                    value={value}
                                    onChange={(val) => {
                                      onChange(val);
                                      trigger("notes");
                                    }}
                                  />
                                </>
                              )}
                            />
                          </div>
                          <div className="form-group notes-form-group-info mb-0">
                            <label>Terms and Conditions</label>
                            <Controller
                              name="termsAndCondition"
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <>
                                  <textarea
                                    className="form-control"
                                    placeholder="Enter Terms and Conditions"
                                    defaultValue={""}
                                    value={value}
                                    onChange={(val) => {
                                      onChange(val);
                                      trigger("termsAndCondition");
                                    }}
                                    {...register("termsAndCondition")}
                                  />
                                </>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-6 col-lg-12">
                        <div className="form-group-bank">
                          <div className="invoice-total-box">
                            <div className="invoice-total-inner">
                              <p>
                                Amount{" "}
                                <span>
                                  {currencyData ? currencyData : "$"}
                                  {/* {calculateSum()} */}
                                  {Number(calculateTaxableSum()).toLocaleString(
                                    "en-IN",
                                    {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }
                                  )}
                                </span>
                              </p>
                              <p>
                                Discount{" "}
                                <span>
                                  {currencyData ? currencyData : "$"}
                                  {/* {calculateDiscount()} */}
                                  {Number(calculateDiscount()).toLocaleString(
                                    "en-IN",
                                    {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }
                                  )}
                                </span>
                              </p>
                              <p>
                                Tax
                                <span>
                                  {currencyData ? currencyData : "$"}
                                  {Number(calculateTax()).toLocaleString(
                                    "en-IN",
                                    {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }
                                  )}
                                </span>
                              </p>
                              <div className="status-toggle justify-content-between">
                                <div className="d-flex align-center">
                                  <p>Round Off </p>
                                  <Controller
                                    name="roundOff"
                                    control={control}
                                    render={({
                                      field: { value, onChange },
                                    }) => (
                                      <>
                                        <input
                                          id="rating_1"
                                          className="check"
                                          type="checkbox"
                                          checked={round}
                                          value={value}
                                          onChange={(val) => {
                                            onChange(val);
                                            trigger("roundOff");
                                            roundOff(val.target.checked);
                                            setRound(val.target.checked);
                                          }}
                                    
                                        />
                                      </>
                                    )}
                                  />
                                  <label
                                    htmlFor="rating_1"
                                    className="checktoggle checkbox-bg"
                                  >
                                    checkbox
                                  </label>
                                </div>
                                <span>
                                  {currencyData ? currencyData : "$"}
                                  {rounded}
                                </span>
                              </div>
                            </div>
                            <div className="invoice-total-footer">
                              <h4>
                                Total Amount{" "}
                                <span>
                                  {currencyData ? currencyData : "$"}
                                  {TotalValue}
                                 
                                </span>
                              </h4>
                            </div>
                          </div>
                          <SignaturePadComponent
                            setValue={setValue}
                            register={register}
                            trigger={trigger}
                            formcontrol={control}
                            errors={errors}
                            clearErrors={clearErrors}
                            setTrimmedDataURL={setTrimmedDataURL}
                            trimmedDataURL={trimmedDataURL}
                            setSignatureData={setSignatureData}
                            handleKeyPress={handleKeyPress}
                            selectedSign={selectedSign}
                            setselectedSign={setselectedSign}
                            data={{}}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-end">
                    
                    <Link to={-1} className="btn btn-primary cancel me-2">
                      Cancel
                    </Link>
                    <button type="submit" className="btn btn-primary">
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <EditProductForm
        editPro={editPro}
        
        afterModalSubmit={afterModalSubmit}
        setEditPro={setEditPro}
        newEdit={newEdit}
        modalDismiss={modalDismiss}
        setModalDismiss={setModalDismiss}
        setNewEdit={setNewEdit}
        taxList={taxList}
      />
      <AddBankForm
        bankModalDismiss={bankModalDismiss}
        setBankModalDismiss={setBankModalDismiss}
        // eslint-disable-next-line no-undef
        successCallBack={() => getBankList()}
        setRefer={setRefer}
      />

      <div
        className="modal custom-modal fade"
        id="delete_discount"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header border-0 justify-content-center pb-0">
              <div className="form-header modal-header-title text-center mb-0">
                <h4 className="mb-2">Delete Product / Services</h4>
                <p>Are you sure want to delete?</p>
              </div>
            </div>
            <div className="modal-body">
              <div className="modal-btn delete-action">
                <div className="row">
                  <div className="col-6">
                    <Link
                      to="#"
                      data-bs-dismiss="modal"
                      className="btn btn-primary paid-continue-btn"
                      onClick={() => handleDelete(purchaseReturnDelete)}
                    >
                      Delete
                    </Link>
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

export default AddPurchaseReturn;
