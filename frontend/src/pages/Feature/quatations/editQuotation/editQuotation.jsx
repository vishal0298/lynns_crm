/* eslint-disable no-undef */
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../../../common/antd.css";
import { Popconfirm, Table } from "antd";
import FeatherIcon from "feather-icons-react";
import {
  onShowSizeChange,
  itemRender,
} from "../../../../common/paginationfunction";
import Select from "react-select";
import AddBankForm from "../../modalForm/AddBankForm";
import EditProductForm from "../../modalForm/EditProductForm";
import { Controller, useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { yupResolver } from "@hookform/resolvers/yup";
import SelectDropDown from "../../react-Select/SelectDropDown";
import useFilePreview from "../../hooks/useFilePreview";
import { EditQuotationContext } from "./editQuotation.control";
import { commonDatacontext } from "../../../../core/commonData";
import { warningToast } from "../../../../core/core-index";
import { handleNumberRestriction } from "../../../../constans/globals";
import SignaturePadComponent from "../../../../common/SignaturePadComponent";
import { handleKeyPress } from "../../../../common/helper";
import moment from "moment";
import dayjs from "dayjs";
import DatePickerComponent from "../../datePicker/DatePicker";

const EditQuotation = () => {
  const {
    product,
    singlePurchaseReturn,
    getProductList,
    getBankList,
    handleUnitChange,
    onSubmit,
    calculateRate,
    calculateDiscountAmount,
    calculateTaxAmount,
    calculateAmount,
    calculateSum,
    calculateDiscount,
    calculateTax,
    handleDelete,
    roundOff,
    SelectedList,
    listData,
    afterModalSubmit,
    quotationSchema,
    setStartDate,
    setEndDate,
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
    setFile,
    imgerror,
    setImgError,
    prepare,
    calculateTaxableSum,
    trimmedDataURL,
    setTrimmedDataURL,
    setSignatureData,
  } = useContext(EditQuotationContext);

  const {
    handleSubmit,
    control,
    setValue,
    trigger,
    clearErrors,
    register,
    resetField,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(quotationSchema),
  });
  const [refer, setRefer] = useState(false);
  const [selectedSign, setselectedSign] = useState("/");

  const { currencyData } = useContext(commonDatacontext);
  const file = watch("signatureImage");
  const [filePreview] = useFilePreview(file, setImgError);
  useEffect(() => {
    if (imgerror) {
      warningToast(imgerror);
      resetField("signatureImage");
      setImgError("");
    }
  }, [imgerror]);

  useEffect(() => {
    if (filePreview) setFile(filePreview);
  }, [filePreview]);

  useEffect(() => {
    setFile(filePreview);
  }, [filePreview]);

  const [previewImage, setPreviewImage] = useState("");

  const { getRootProps, getInputProps } = useDropzone({
    maxLength: 4,
    onDrop: (acceptedFile) => {
      getBase64(acceptedFile?.[0]).then((result) => {
        acceptedFile["base64"] = result;
        setPreviewImage(acceptedFile.base64);
      });
    },
  });

  const setInitial = () => {
    setValue("quotationId", singlePurchaseReturn?.quotation_id);
    listData?.filter((item) => {
      item?.value == singlePurchaseReturn?.items?.[0]?.productId &&
        setValue("products", item);
    });
    listData?.filter((item) => {
      item?.value == singlePurchaseReturn?.items?.[0]?.productId &&
        SelectedList(item?.value);
    });
    setValue("reference_no", singlePurchaseReturn?.reference_no);
    setValue("signature_name", singlePurchaseReturn?.signature_name);

    setStartDate(dayjs(singlePurchaseReturn?.quotation_date));
    setEndDate(dayjs(singlePurchaseReturn?.due_date));

    setValue("quotation_date", moment(singlePurchaseReturn?.quotation_date));
    setValue("due_date", moment(singlePurchaseReturn?.due_date));
    setValue("notes", singlePurchaseReturn?.notes);
    setValue("termsAndCondition", singlePurchaseReturn?.termsAndCondition);
    setTaxableAmount(singlePurchaseReturn?.taxableAmount);
    setTotalDiscount(singlePurchaseReturn?.totalDiscount);
    setVat(singlePurchaseReturn?.vat);
    setRound(singlePurchaseReturn?.roundOff);
    setValue("roundOff", singlePurchaseReturn?.roundOff);
    setTotalAmount(singlePurchaseReturn?.TotalAmount);
    setFile(singlePurchaseReturn?.signatureImage);

    let incomingCustomer = product.find(
      (item) => item?.id == singlePurchaseReturn?.customerId?._id
    );
    setValue("customerId", incomingCustomer);
  };
  useEffect(() => {
    if (singlePurchaseReturn?.id) getProductList();
    setInitial();
  }, [singlePurchaseReturn, product]);

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
      key: "purchasePrice",
      render: (record) => {
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

  useEffect(() => {
    setValue("purchaseOrderDate", dayjs());
    setValue("dueDate", dayjs());
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
              <h5>Edit Quotations</h5>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="quotation-card">
                  <div className="card-body">
                    <div className="form-group-item border-0 mb-0">
                      <div className="row align-item-center">
                        <div className="col-lg-4 col-md-6 col-sm-12">
                          <div className="form-group">
                            <label>Quotation Id</label>

                            <Controller
                              name="quotationId"
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Purchases Id"
                                    value={value}
                                    onChange={(val) => {
                                      onChange(val);
                                      trigger("quotationId");
                                    }}
                                  />
                                  {errors.quotationId && (
                                    <p className="text-danger">
                                      {errors.quotationId.message}
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
                              Select Customer
                              <span className="text-danger"> *</span>
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
                                        placeholder="Select Customer"
                                        value={value}
                                        classNamePrefix="select_kanakku"
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
                                  <i className="fas fa-plus-circle" />
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-12">
                          <div className="form-group date-form-group">
                            <label>Quotation Date</label>
                            
                            <Controller
                              control={control}
                              name="quotation_date"
                              render={({ field: { value, onChange } }) => (
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
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-12">
                          <div className="form-group date-form-group">
                            <label>Due Date</label>

                            <Controller
                              control={control}
                              name="due_date"
                              render={({ field: { value, onChange } }) => (
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
                        <div className="col-lg-4 col-md-6 col-sm-12">
                          <div className="form-group">
                            <label>Reference No</label>

                            <Controller
                              name="reference_no"
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={value}
                                    placeholder="Enter Reference No"
                                    onKeyPress={handleNumberRestriction}
                                    onChange={(val) => {
                                      onChange(val);
                                      trigger("reference_no");
                                    }}
                                  />
                                </>
                              )}
                              defaultValue=""
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
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
                                        placeholder="Select Products"
                                        className="w-100"
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
                        <div className="card-body editInvoice edit-quotation category">
                          <div className="table-responsive no-pagination table-hover">
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
                                    render={({
                                      field: { value, onChange },
                                    }) => (
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
                                  Amount
                                  <span name="taxableAmount">
                                    {currencyData ? currencyData : "$"}
                                    {Number(
                                      calculateTaxableSum()
                                    ).toLocaleString("en-IN", {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })}
                                  </span>
                                </p>
                                <p>
                                  Discount{" "}
                                  <span>
                                    {currencyData ? currencyData : "$"}
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
                                      defaultValue={false}
                                      render={({
                                        field: { value, onChange },
                                      }) => (
                                        <input
                                          id="rating_1"
                                          className="check"
                                          type="checkbox"
                                          checked={value} // Use value from field to control the input
                                          onChange={(e) => {
                                            onChange(e.target.checked); // Update value with the new checked state
                                            trigger("roundOff");
                                            roundOff(e.target.checked);
                                            setRound(!round);
                                          }}
                                        />
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
                  </div>
                  <div className="text-end">
                    <Link
                      to="/quotations"
                      className="btn btn-primary cancel me-2"
                    >
                      Cancel
                    </Link>
                    <button type="submit" className="btn btn-primary">
                      Update
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
                      onClick={() => handleDelete(purchaseDelete)}
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

export default EditQuotation;
