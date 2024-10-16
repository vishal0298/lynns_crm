import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Popconfirm, Table } from "antd";
import FeatherIcon from "feather-icons-react";
import {
  onShowSizeChange,
  itemRender,
} from "../../../../common/paginationfunction";
import { Controller, useForm } from "react-hook-form";
import SelectDropDown from "../../react-Select/SelectDropDown";
import EditProductForm from "../../modalForm/EditProductForm";
import AddBankForm from "../../modalForm/AddBankForm";
import Select from "react-select";
import useFilePreview from "../../hooks/useFilePreview";
import { AddQuotationContext } from "./addQuotation.control";
import { yupResolver } from "@hookform/resolvers/yup";
import { commonDatacontext } from "../../../../core/commonData";
import { handleNumberRestriction } from "../../../../constans/globals";
import { handleKeyPress } from "../../../../common/helper";
import SignaturePadComponent from "../../../../common/SignaturePadComponent";
import dayjs from "dayjs";
import DatePickerComponent from "../../datePicker/DatePicker";
import { ApiServiceContext, QuotationNum } from "../../../../core/core-index";

const AddQuotation = () => {
  const [selectedSign, setselectedSign] = useState("/");
  const {
    product,
    rounded,
    round,
    setRound,
    productService,
    productOptionCopy,
    editPro,
    setEditPro,
    newEdit,
    setNewEdit,
    modalDismiss,
    setModalDismiss,
    taxList,
    bankModalDismiss,
    setBankModalDismiss,
    purchaseDelete,
    quotationSchema,
    onSubmitQuotation,
    getBankList,
    handleDelete,
    afterModalSubmit,
    prepare,
    SelectedList,
    handleUnitChange,
    calculateDiscount,
    calculateDiscountAmount,
    calculateSum,
    calculateAmount,
    calculateTax,
    calculateTaxAmount,
    roundOff,
    listData,
    calculateRate,
    calculateTaxableSum,
    trimmedDataURL,
    setTrimmedDataURL,
    setSignatureData,
    num,
    setNum,
  } = useContext(AddQuotationContext);

  const {
    handleSubmit,
    setValue,
    clearErrors,
    control,
    trigger,
    register,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(quotationSchema),
  });

  const { currencyData } = useContext(commonDatacontext);
  const { getData } = useContext(ApiServiceContext);
  const [refer, setRefer] = useState(false);

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
      dataIndex: "units",
      render: (record) => <span>{record?.name}</span>,
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

  const [imgerror, setImgError] = useState("");
  const file = watch("signatureImage");
  const [filePreview] = useFilePreview(file, setImgError);

  const disablePastDate = (current) => {
    return current && current < dayjs().startOf("day");
  };

  const disableFutureDate = (current) => {
    return current && current > dayjs().endOf("day");
  };
 

  const getQuotationNumber = async () => {
    const response = await getData(QuotationNum);
    setNum(response?.data);
  };

  useEffect(() => {
    getQuotationNumber();
  }, []);

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="page-header">
            <div className="content-page-header">
              <h5>Add Quotations</h5>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <form onSubmit={handleSubmit(onSubmitQuotation)}>
                <div className="quotation-card">
                  <div className="card-body">
                    <div className="form-group-item border-0 mb-0">
                      <div className="row align-item-center">
                        <div className="col-lg-4 col-md-6 col-sm-12">
                          <div className="form-group input_text">
                            <label>Quptation Id</label>
                            <Controller
                              name="quotation_id"
                              type="number"
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <input
                                  className={`form-control ${
                                    errors?.quotation_id ? "error-input" : ""
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
                            <small>{errors?.quotation_id?.message}</small>
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
                                        classNamePrefix="select_kanakku"
                                        value={value}
                                        onChange={(val) => {
                                          onChange(val);
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

                            {/* For antd Datepicker */}
                            <Controller
                              control={control}
                              name="quotation_date"
                              render={({ field: { value, onChange } }) => (
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
                              name="due_date"
                              render={({ field: { value, onChange } }) => (
                                <DatePickerComponent
                                  disabledDate={disablePastDate}
                                  value={value}
                                  onChange={onChange}
                                />
                              )}
                            ></Controller>
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
                                  render={({ field: { onChange } }) => (
                                    <>
                                      <Select
                                        placeholder="Select Products"
                                        className="w-100"
                                        classNamePrefix="select_kanakku"
                                        options={listData}
                                        onChange={(e) => {
                                          onChange(e);
                                          trigger("products");
                                          SelectedList(e?.value);
                                        }}
                                      />
                                      {errors.listData && (
                                        <p className="text-danger">
                                          {errors.listData.message}
                                        </p>
                                      )}
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
                        <div className="card-body edit-quotation category">
                          <div className="table-responsive no-pagination table-hover">
                            <Table
                              pagination={{
                                total: productService.length,
                                showTotal: (total, range) =>
                                  `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                                showSizeChanger: true,
                                onShowSizeChange: onShowSizeChange,
                                itemRender: itemRender,
                              }}
                              columns={columns}
                              dataSource={productService}
                              rowKey={(record) => record?._id}
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
                                          placeholder="Select Bank"
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
                                              setRound(!round);
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
                              selectedSign={selectedSign}
                              setselectedSign={setselectedSign}
                              data={{}}
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

export default AddQuotation;
