/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Select from "react-select";
import "../../../../common/antd.css";
import { Popconfirm, Table } from "antd";
import FeatherIcon from "feather-icons-react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { handleNumberRestriction } from "../../../../constans/globals";
import EditProductForm from "../../modalForm/EditProductForm";
import SelectDropDown from "../../react-Select/SelectDropDown";
import { EditpurchaseContext } from "./EditPurchase.control";
import { commonDatacontext } from "../../../../core/commonData";
import { handleKeyPress } from "../../../../common/helper";
import SignaturePadComponent from "../../../../common/SignaturePadComponent";
import DatePickerComponent from "../../datePicker/DatePicker";
import moment from "moment";
import dayjs from "dayjs";

const EditPurchase = () => {
  const [modalDismiss, setModalDismiss] = useState(false);
  const [bankModalDismiss, setBankModalDismiss] = useState(false);
  const [selectedSign, setselectedSign] = useState("/");
  const location = useLocation();
  const [refer, setRefer] = useState(false);
  const [taxableAmount, setTaxableAmount] = useState();
  const [vat, setVat] = useState();
  const [totalDiscount, setTotalDiscount] = useState();
  const [rounded, setRounded] = useState(0.0);
  const [fromEdit, setFromEdit] = useState(false);
  const [purchaseDelete, setPurchaseDelete] = useState();
  const [editPro, setEditPro] = useState({});
  const [newEdit, setNewEdit] = useState({});

  const {
    editRecord,
    editpurchaseSchema,
    productServiceCopy,
    productService,
    setProductService,
    taxList,
    productOption,
    setProductOption,
    productOptionCopy,
    setProductOptionCopy,
    onSubmit,
    calculateRate,
    calculateDiscountAmount,
    calculateTaxAmount,
    calculateAmount,
    calculateSum,
    calculateDiscount,
    calculateTax,
    fullAmount,
    setStartDate,
    round,
    setRound,
    roundOffAction,
    setRoundOffAction,
    trimmedDataURL,
    setTrimmedDataURL,
    setSignatureData,
  } = useContext(EditpurchaseContext);
  const { currencyData } = useContext(commonDatacontext);

  const {
    handleSubmit,
    control,
    setValue: editSetvalue,
    clearErrors,
    trigger,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(editpurchaseSchema),
  });

  let editstateRecord = location?.state?.rowData;
  useEffect(() => {
    if (editstateRecord) {
      let editData = [];
      setFromEdit(true);
      getQuantity(editData);
      editSetvalue("purchaseId", editstateRecord?.purchaseId);
      editSetvalue("vendorId", editstateRecord?.vendorId?._id);
      editSetvalue("paymentMode", editstateRecord?.paymentMode);
      editSetvalue("referenceNo", editstateRecord?.referenceNo);
      editSetvalue(
        "supplierInvoiceSerialNumber",
        editstateRecord?.supplierInvoiceSerialNumber
      );
      setStartDate(dayjs(editstateRecord?.purchaseDate));

      editSetvalue("purchaseDate", moment(editstateRecord?.purchaseDate));
      editSetvalue("notes", editstateRecord?.notes);
      editSetvalue("termsAndCondition", editstateRecord?.termsAndCondition);
      editSetvalue("roundOff", editstateRecord?.roundOff);
      setRound(editstateRecord?.roundOff);
      setTaxableAmount(editstateRecord?.taxableAmount);
      setTotalDiscount(editstateRecord?.totalDiscount);
      setVat(editstateRecord?.vat);
    } else {
      setFromEdit(false);
    }
  }, []);
  // Set Value while Edit end

  const getQuantity = (dataList) => {
    let newProductList = [];
    if (location?.state?.detail) {
      newProductList = dataList?.map((obj1) => {
        const obj2 = location?.state?.rowData?.items?.find(
          (obj2) => obj2?.productId === obj1.id
        );
        if (obj2) {
          return {
            id: obj1.id,
            text: obj1.name,
            quantity: parseInt(obj2.quantity),
          };
        } else {
          return { id: obj1.id, text: obj1.name, quantity: 1 };
        }
      });

      // if you want to be more clever...
      let result = dataList.filter(
        (o1) =>
          !location?.state?.rowData?.items.some((o2) => o1.id === o2.productId)
      );
      setProductOption(result);
    } else {
      newProductList = dataList?.map((item) => {
        return {
          id: item?.id,
          text: item?.name,
          quantity: 1,
        };
      });
      setProductOption(newProductList);
    }
    setProductOptionCopy(newProductList);
  };

  useEffect(() => {
    roundOff(round);
  }, [roundOffAction, productService]);

  const handleUnitChange = (e, id) => {
    let quantId = productOptionCopy.map((ele) => {
      if (ele.id == id) {
        return { ...ele, quantity: Number(e.target.value) };
      } else {
        return { ...ele };
      }
    });
    setRoundOffAction(!roundOffAction);
    setProductOptionCopy(quantId);
  };

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
      dataIndex: "units",
      render: (record) => <span>{record?.name}</span>,
    },
    {
      title: "Rate",
      key: "sellingPrice",
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
                onConfirm={() => {
                  handleDelete(record._id);
                }}
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

  const handleDelete = (id) => {
    let deleted = productService.filter((ele) => ele._id !== id);
    let addDropDown = productService?.find((ele) => ele._id == id);
    let addDropDownForSelect = {
      id: addDropDown?._id,
      text: addDropDown?.name,
      quantity: 1,
    };
    var copy = productOptionCopy.map((ele) => {
      if (ele?.id == addDropDown._id) {
        return { ...ele, quantity: 1 };
      } else {
        return { ...ele };
      }
    });
    setProductOptionCopy(copy);

    setProductOption([...productOption, addDropDownForSelect]);
    setRoundOffAction(!roundOffAction);
    setProductService(deleted);
  };

  useEffect(() => {
    let elements = Array.from(
      document.getElementsByClassName("react-datepicker-wrapper")
    );
    elements.map((element) => element.classList.add("w-100"));
  }, []);

  const roundOff = (value) => {
    let finalSum = calculateSum();
    if (value) {
      Math.round(calculateSum());
      let off = Math.round(finalSum);
      let finalOff = off - finalSum;
      let numberOff = parseFloat(finalOff);
      setRounded(numberOff.toFixed(2));
    } else {
      setRounded(0.0);
    }
    return
  };

  const SelectedList = (value) => {
    var selectList = productServiceCopy?.find((ele) => ele?._id == value);
    var add = [];
    add.push(selectList);
    let productOptionRemove = JSON.parse(JSON.stringify(productOption));
    let removeFromDropDown = productOptionRemove?.findIndex(
      (ele) => ele.id == value
    );
    productOptionRemove?.splice(removeFromDropDown, 1);
    setProductOption(productOptionRemove);
    try {
      setProductService(
        selectList?._id ? [...productService, selectList] : [...productService]
      );
    } catch (error) {
      /* empty */
    }
  };

  const calculateValue = (input) => {
    const inputValue = String(input);
    if (inputValue.endsWith("%")) {
      const numericValue = parseFloat(inputValue);
      if (!isNaN(numericValue)) {
        const percentage = (
          Number(taxableAmount) +
          Number(vat) -
          (Number(taxableAmount) * numericValue) / 100
        ).toFixed(2);
        return `Percentage: ${percentage}`;
      }
    } else {
      const numericValue = parseFloat(input);
      if (!isNaN(numericValue)) {
        const result = (
          Number(taxableAmount) +
          Number(vat) -
          Number(taxableAmount) -
          numericValue
        ).toFixed(2);

        return `Result: ${result}`;
      }
    }

    return "Invalid input";
  };

  useEffect(() => {
    calculateValue(totalDiscount);
  }, [totalDiscount]);

  const listData = productOption?.map((item) => {
    return { label: item.text, value: item.id, quantity: item.quantity };
  });

  const afterModalSubmit = (modalData) => {
    let Stringified = JSON.parse(JSON.stringify(productService));
    let checkIndex = Stringified?.findIndex(
      (item) => item?.id == modalData?.id
    );
    Stringified.splice(checkIndex, 1, modalData?.record);
    checkIndex && setProductService([...Stringified]);
  };

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
          <div className="content-page-header">
            {fromEdit ? <h5>Edit Purchases</h5> : <h5> Add Purchases </h5>}
          </div>
          <div className="row">
            <div className="col-md-12">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="card-body">
                  <div className="form-group-item border-0 mb-0">
                    <div className="row align-item-center">
                      {fromEdit && (
                        <div className="col-lg-4 col-md-6 col-sm-12">
                          <div className="form-group">
                            <label>Purchases Id</label>
                            <Controller
                              name="purchaseId"
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <>
                                  <input
                                    disabled={true}
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Purchases Id"
                                    value={value || ""}
                                    onChange={(val) => {
                                      onChange(val);
                                      trigger("purchaseId");
                                    }}
                                    {...register("purchaseId")}
                                  />
                                  {errors.purchaseId && (
                                    <p className="text-danger">
                                      {errors.purchaseId.message}
                                    </p>
                                  )}
                                </>
                              )}
                            />
                          </div>
                        </div>
                      )}
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
                                      setValue={editSetvalue}
                                      name={"vendorId"}
                                      placeholder="Select Vendor"
                                      id={editRecord?.vendorId?._id}
                                      value={value || ""}
                                      onChange={(val) => {
                                        onChange(val);
                                        trigger("vendorId");
                                      }}
                                      reference={ref}
                                    />
                                    {errors.vendorId && (
                                      <p className="text-danger">
                                        {errors.vendorId.message}
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
                                <i className="fas fa-plus-circle"></i>
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group date-form-group">
                          <label>Purchases Date</label>

                          <Controller
                            control={control}
                            name="purchaseDate"
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
                                  value={value || ""}
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
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group">
                          <label>Supplier Invoice Serial No</label>
                          <Controller
                            name="supplierInvoiceSerialNumber"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Enter Supplier Invoice Serial Number"
                                  value={value || ""}
                                  onChange={(val) => {
                                    onChange(val);
                                    trigger("supplierInvoiceSerialNumber");
                                  }}
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
                                      // styles={styles}
                                      className="w-100"
                                      options={listData}
                                      value={""}
                                      placeholder="Select Products"
                                      classNamePrefix="select_kanakku"
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
                                <i className="fas fa-plus-circle"></i>
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-group-item">
                    <div className="card-table product-list category">
                      <div className="card-body">
                        <Table
                          rowKey={(record) => record?._id}
                          pagination={false}
                          columns={columns}
                          dataSource={productService}
                        />
                        {}
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
                                  render={({ field: { value, onChange } }) => {
                                    return (
                                      <>
                                        <SelectDropDown
                                          setValue={editSetvalue}
                                          name={"bank"}
                                          placeholder="Select Bank"
                                          id={editRecord?.bank}
                                          module={true}
                                          value={value || ""}
                                          onChange={(val) => {
                                            onChange(val);
                                          }}
                                          goto={refer}
                                        />
                                      </>
                                    );
                                  }}
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
                                    name="notes"
                                    value={value || ""}
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
                                    //defaultValue={""}
                                    value={value || ""}
                                    onChange={(val) => {
                                      onChange(val);
                                      trigger("termsAndCondition");
                                    }}
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
                                Amount
                                <span name="taxableAmount">
                                  {currencyData ? currencyData : "$"}
                                  {Number(calculateSum()).toLocaleString(
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
                                          value={value || ""}
                                          onChange={(val) => {
                                            setRound(val.target.checked);
                                            onChange(val);
                                            trigger("roundOff");
                                            roundOff(val.target.checked);
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
                                  {Number(fullAmount()).toLocaleString(
                                    "en-IN",
                                    {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }
                                  )}
                                </span>
                              </h4>
                            </div>
                            <hr />
                          </div>
                          <SignaturePadComponent
                            setValue={editSetvalue}
                            register={register}
                            trigger={trigger}
                            formcontrol={control}
                            errors={errors}
                            clearErrors={clearErrors}
                            setTrimmedDataURL={setTrimmedDataURL}
                            trimmedDataURL={trimmedDataURL}
                            setSignatureData={setSignatureData}
                            handleKeyPress={handleKeyPress}
                            data={editRecord}
                            setselectedSign={setselectedSign}
                            selectedSign={selectedSign}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-end">
                    <Link
                      to="/purchases"
                      type="reset"
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

export default EditPurchase;
