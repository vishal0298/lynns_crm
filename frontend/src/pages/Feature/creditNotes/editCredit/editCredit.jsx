/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import FeatherIcon from "feather-icons-react";
import { Link, useParams } from "react-router-dom";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import { Popconfirm, Table } from "antd";
import {
  itemRender,
  onShowSizeChange,
} from "../../../../common/paginationfunction";
import EditProductForm from "../../modalForm/EditProductForm";
import AddBankForm from "../../modalForm/AddBankForm";
import SelectDropDown from "../../react-Select/SelectDropDown";
import { yupResolver } from "@hookform/resolvers/yup";
import { EditCreditNotesContext } from "./editCreditControl";
import { commonDatacontext } from "../../../../core/commonData";
import SignaturePadComponent from "../../../../common/SignaturePadComponent";
import { handleKeyPress } from "../../../../common/helper";
import dayjs from "dayjs";
import DatePickerComponent from "../../datePicker/DatePicker";
import { handleNumberRestriction } from "../../../../constans/globals";

const EditCredit = () => {
  const {
    creditNoteEditSchema,
    singlePurchaseReturn,
    productService,
    setTaxableAmount,
    setVat,
    setTotalDiscount,
    setTotalAmount,
    rounded,
    purchaseDelete,
    round,
    setRound,
    bankModalDismiss,
    setBankModalDismiss,
    productOptionCopy,
    editPro,
    setEditPro,
    newEdit,
    setNewEdit,
    modalDismiss,
    setModalDismiss,
    taxList,
    onSubmit,
    calculateSum,
    calculateDiscount,
    calculateTax,
    afterModalSubmit,
    listData,
    product,
    calculateRate,
    calculateDiscountAmount,
    calculateTaxAmount,
    calculateAmount,
    getProductList,
    prepare,
    setEndDate,
    setStartDate,
    handleDelete,
    roundOff,
    SelectedList,
    handleUnitChange,
    calculateTaxableSum,
    trimmedDataURL,
    setTrimmedDataURL,
    setSignatureData,
  } = useContext(EditCreditNotesContext);
  const { currencyData } = useContext(commonDatacontext);

  const { id } = useParams();
  const {
    handleSubmit,
    control,
    setValue,
    clearErrors,
    trigger,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(creditNoteEditSchema),
  });

  const [refer, setRefer] = useState(false);
  const [selectedSign, setselectedSign] = useState("/");

  const setInitial = () => {
    listData?.filter((item) => {
      item?.value == singlePurchaseReturn?.items?.[0]?.productId &&
        setValue("products", item);
    });
    listData?.filter((item) => {
      item?.value == singlePurchaseReturn?.items?.[0]?.productId &&
        SelectedList(item?.value);
    });
    setStartDate(dayjs(singlePurchaseReturn?.credit_note_date));
    setEndDate(dayjs(singlePurchaseReturn?.due_date));
    setValue("credit_note_id", singlePurchaseReturn?.credit_note_id);
    setValue("customerId", singlePurchaseReturn?.customerId);
    setValue("reference_no", singlePurchaseReturn?.reference_no);
    setValue("due_date", dayjs(singlePurchaseReturn?.due_date));
    setValue("credit_note_date", dayjs(singlePurchaseReturn?.credit_note_date));
    setValue("notes", singlePurchaseReturn?.notes);
    setValue("termsAndCondition", singlePurchaseReturn?.termsAndCondition);
    setTaxableAmount(singlePurchaseReturn?.taxableAmount);
    setTotalDiscount(singlePurchaseReturn?.totalDiscount);
    setVat(singlePurchaseReturn?.vat);
    setRound(singlePurchaseReturn?.roundOff);
    setValue("roundOff", singlePurchaseReturn?.roundOff);
    setTotalAmount(singlePurchaseReturn?.TotalAmount);
    setValue("credit_note_id", singlePurchaseReturn?.credit_note_id);
  };

  useEffect(() => {
    if (singlePurchaseReturn?.id) getProductList();
    setInitial();
  }, [singlePurchaseReturn]);

  useEffect(() => {
    let elements = Array.from(
      document.getElementsByClassName("react-datepicker-wrapper")
    );
    elements.map((element) => element.classList.add("w-100"));
  }, []);

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
            className="form-control"
            maxLength={10}
            onKeyPress={handleNumberRestriction}
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
      key: "name",
      render: (record) => <span>{record?.units?.name}</span>,
    },
    {
      title: "Rate",
      dataIndex: "sellingPrice",
      render: (text, record) => {
        return (
          <span>
            {currencyData ? currencyData : "$"}
            {calculateRate(record)}
          </span>
        );
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
      render: (text, record) => (
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
                onConfirm={() => handleDelete(record._id, purchaseDelete)}
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
      ),
    },
  ];

  //  For antd Datepicker
  useEffect(() => {
    setValue("credit_note_date", dayjs());
    setValue("due_date", dayjs());
  }, [setValue]);

  const disablePastDate = (current) => {
    return current && current < dayjs().startOf("day");
  };

  const disableFutureDate = (current) => {
    return current && current > dayjs().endOf("day");
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="page-header">
            <div className="content-page-header">
              <h5>Edit Sales Return</h5>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group-item border-0 mb-0">
                  <div className="row align-item-center">
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="form-group input_text">
                        <label>Sales Return Id</label>
                        <Controller
                          name="credit_note_id"
                          type="text"
                          control={control}
                          render={({ field: { value, onChange } }) => {
                            // Add a return statement here

                            return (
                              <input
                                className={`form-control ${
                                  errors?.credit_note_id ? "error-input" : ""
                                }`}
                                type="text"
                                value={value || ""}
                                onChange={onChange}
                                readOnly={true}
                                disabled={true}
                              />
                            );
                          }}
                          // defaultValue=""
                        />

                        <small>{errors?.invoiceNumber?.message}</small>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="form-group">
                        <label>
                          Select Customer<span className="text-danger"> *</span>
                        </label>
                        <ul className="form-group-plus css-equal-heights">
                          <li>
                            <Controller
                              name="customerId"
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <>
                                  <Select
                                    className="w-100"
                                    options={product}
                                    classNamePrefix="select_kanakku"
                                    value={product.find(
                                      (item) => item?.id == value
                                    )}
                                    onChange={(e) => {
                                      onChange(e);
                                      trigger("customerId");
                                    }}
                                  />
                                  {errors.customerId && (
                                    <p className="text-danger">
                                      {errors.customerId.message}
                                    </p>
                                  )}
                                </>
                              )}
                            />
                          </li>
                          <li>
                            <Link
                              className="btn btn-primary form-plus-btn"
                              to="/add-customer"
                            >
                              <FeatherIcon icon="plus-circle" />
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="form-group date-form-group">
                        <label>Sales Return Date</label>

                        {/* For antd Datepicker */}
                        <Controller
                          control={control}
                          name="credit_note_date"
                          render={({ field: { value, onChange, ref } }) => (
                            <DatePickerComponent
                              disabledDate={disableFutureDate}
                              value={value}
                              onChange={(date) => {
                                setStartDate(date);
                                onChange(date);
                              }}
                            />
                          )}
                        ></Controller>
                        {/* For antd Datepicker */}
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="form-group date-form-group">
                        <label>Due Date</label>
                        {/* <DatePicker
                          className="datetimepicker form-control"
                          selected={endDate}
                          minDate={new Date()}
                          onChange={(date) => setEndDate(date)}
                          name="due_date"
                        ></DatePicker> */}
                        <Controller
                          control={control}
                          name="due_date"
                          render={({ field: { value, onChange, ref } }) => (
                            <DatePickerComponent
                              disabledDate={disablePastDate}
                              value={value}
                              onChange={(date) => {
                                setEndDate(date);
                                onChange(date);
                              }}
                            />
                          )}
                        ></Controller>
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
                                    placeholder="Select Products"
                                    className="w-100"
                                    classNamePrefix="select_kanakku"
                                    options={listData}
                                    value={value}
                                    onChange={(e) => {
                                      onChange(e);
                                      trigger("products");
                                      SelectedList(e?.value);
                                    }}
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
                              <FeatherIcon icon="plus-circle" />
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-group-item">
                  <div className="card-table">
                    <div className="card-body">
                      <div className="table-responsive no-pagination edit-quotation category">
                        <Table
                          rowKey={(record) => record?._id}
                          pagination={{
                            showTotal: (total, range) =>
                              `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                            showSizeChanger: true,
                            onShowSizeChange: onShowSizeChange,
                            itemRender: itemRender,
                          }}
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
                                render={({ field: { value, onChange } }) => (
                                  <>
                                    <SelectDropDown
                                      setValue={setValue}
                                      name={"bank"}
                                      placeholder="Select Bank"
                                      id={singlePurchaseReturn?.bank}
                                      module={true}
                                      value={value}
                                      onChange={(val) => {
                                        onChange(val);
                                      }}
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
                                  name="notes"
                                  value={value}
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
                                  value={value}
                                  onChange={(val) => {
                                    onChange(val);
                                    trigger("termsAndCondition");
                                  }}
                                />
                              </>
                            )}
                            defaultValue=""
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
                              <span name="taxableAmount">
                                {currencyData}
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
                                {currencyData}
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
                                {currencyData}
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
                                  defaultValue={false} // Provide an initial value
                                  render={({ field: { value, onChange } }) => {
                                    return (
                                      <>
                                        <input
                                          id="rating_1"
                                          className="check"
                                          type="checkbox"
                                          checked={value} // Use value from field, not 'round'
                                          onChange={(e) => {
                                            onChange(e.target.checked); // Update value with the new checked state
                                            trigger("roundOff");
                                            roundOff(e.target.checked);
                                            setRound(e.target.checked);
                                          }}
                                        />
                                      </>
                                    );
                                  }}
                                />
                                <label
                                  htmlFor="rating_1"
                                  className="checktoggle checkbox-bg"
                                >
                                  checkbox
                                </label>
                              </div>
                              <span>
                                {currencyData}
                                {rounded}
                              </span>
                            </div>
                          </div>
                          <div className="invoice-total-footer">
                            <h4>
                              Total Amount{" "}
                              <span>
                                {currencyData}{" "}
                                {Number(
                                  round
                                    ? Math.round(calculateSum())
                                    : calculateSum()
                                ).toLocaleString("en-IN", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
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
                          data={singlePurchaseReturn}
                          setselectedSign={setselectedSign}
                          selectedSign={selectedSign}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="add-customer-btns text-end">
                  <Link to="/sales-return" className="btn customer-btn-cancel">
                    Cancel
                  </Link>
                  <button type="submit" className="btn customer-btn-save">
                    Update
                  </button>
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
        module={"quotation"}
      />
      <AddBankForm
        bankModalDismiss={bankModalDismiss}
        setBankModalDismiss={setBankModalDismiss}
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
                      onClick={() => handleDelete(purchaseDelete)}
                      data-bs-dismiss="modal"
                      className="btn btn-primary paid-continue-btn"
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

export default EditCredit;
