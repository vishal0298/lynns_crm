/* eslint-disable no-constant-condition */
import React, { useEffect, useContext, useState, useRef } from "react";
import { AddinvoiceContext } from "./Addinvoice.control";
import { BankSettingsContext } from "../../settings/bankSettings/BankSettings.control";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import FeatherIcon from "feather-icons-react";
import { Form, Popconfirm, Table } from "antd";
import { commonDatacontext } from "../../../../core/commonData";
import { amountFormat } from "../../../../common/helper";
import { handleNumberRestriction } from "../../../../constans/globals";
// import SignaturePadComponent from "../../../../common/SignaturePadComponent";
import DatePickerComponent from "../../datePicker/DatePicker";
import dayjs from "dayjs";
import { ApiServiceContext, InvoiceNum } from "../../../../core/core-index";

const EditableContext = React.createContext(null);
const EditableRow = ({ ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};



const AddInvoice = () => {
  const { BankSettingschema } = useContext(BankSettingsContext);
  const { currencyData } = useContext(commonDatacontext);
  // const [selectedSign, setselectedSign] = useState("/");

  const {
    dataSource, setDataSource, handleFieldChange, addInvoiceschema, staffDetails, dicountEditForm, submitaddInvoiceAddForm, handleKeyPress, productData, customersData, bank, tax, taxableAmount, settaxableAmount, totalTax, settotalTax, totalAmount, settotalAmount, totalDiscount, settotalDiscount, roundof, setroundof, addBankSettingsForm, productsCloneData, setproductsCloneData, addbankpocancelModal, rowErr, setrowErr, setisRecurring, ChoosedCustomer, trimmedDataURL, setTrimmedDataURL, 
    // setSignatureData, 
    num, setNum,
  } = useContext(AddinvoiceContext);

  const {
    handleSubmit, register, clearErrors, control, trigger, getValues, setValue: addinvsetValue, formState: { errors },
  } = useForm({ resolver: yupResolver(addInvoiceschema) });

  const {
    handleSubmit: bankHandle,
    control: addBankControl,
    formState: { errors: addBankerrors },
  } = useForm({ resolver: yupResolver(BankSettingschema) });

  const {
    handleSubmit: addTaxratesFormhandle,
    trigger: Edittrigger,
    setValue,
    control: addTaxratesFormControl,
    formState: { errors: addTaxratesFormErr },
  } = useForm({ resolver: yupResolver(dicountEditForm) });

  // eslint-disable-next-line no-empty-pattern
  // eslint-disable-next-line no-unused-vars
  const [paymentmethodsData, setpaymentmethodsData] = useState([
    { label: "Cash", value: "Cash" },
    { label: "UPI", value: "Upi" },
    { label: "Card", value: "Card" },
    { label: "Membership", value: "Membership" },
  ]);

  const [serviceFrom, setServiceFrom] = useState([
    { label: "In-Salon", value: "In-Salon" },
    { label: "Home Service", value: "HomeService" },
  ]);
  

  const [count, setCount] = useState(0);
  let editRowInputs = useRef([]);
  const EditcancelModal = useRef(null);
  const [roundofValue, setroundofValue] = useState(0);
  const { getData } = useContext(ApiServiceContext);

  const changeRoundoff = (val) => {
    setroundof(val);
    if (val == true) {
      let roundValue =
        Math.round(
          Number(taxableAmount) + Number(totalTax) - Number(totalDiscount)
        ) -
        (Number(taxableAmount) + Number(totalTax) - Number(totalDiscount));
      setroundofValue(roundValue.toFixed(2));
      settotalAmount(
        Math.round(
          Number(taxableAmount) + Number(totalTax) - Number(totalDiscount)
        ).toFixed(2)
      );
    } else {
      setroundofValue((0).toFixed(2));
      settotalAmount(
        (
          Number(taxableAmount) +
          Number(totalTax) -
          Number(totalDiscount)
        ).toFixed(2)
      );
    }
  };

  useEffect(() => {
    let discount = dataSource.reduce(function (tot, arr) {
      return Number(tot) + Number(arr.discount);
    }, 0);
    let rate = dataSource.reduce(function (tot, arr) {
      return Number(tot) + Number(arr.rate);
    }, 0);
    let vat = dataSource.reduce(function (tot, arr) {
      return Number(tot) + Number(arr.tax);
    }, 0);
    settaxableAmount(Number(rate).toFixed(2));
    settotalDiscount(Number(discount).toFixed(2));
    settotalTax(Number(vat).toFixed(2));
    settotalAmount((Number(rate) + Number(vat) - Number(discount)).toFixed(2));
  }, [dataSource]);

  useEffect(() => {
    if (Object.keys(ChoosedCustomer).length > 0) {
      addinvsetValue("customerId", ChoosedCustomer);
    }
  }, [ChoosedCustomer]);

  const handleBtnChanges = (value) => {
    setisRecurring(value);
  };

  const editModal = (data) => {
    setValue("tax", data?.form_updated_tax);
    setValue("rate", data?.form_updated_rate);
    setValue("discountType", data.form_updated_discounttype);
    setValue("discount", data.form_updated_discount);
    setValue("keyValue", data.key);
    setValue("productId", data.productId);
    setValue("quantity", data.quantity);
    setValue("taxInfo", data?.taxInfo);
    Edittrigger();
  };

  const addTableRows = (product_id) => {
    if (product_id != "") {
      let selectedProduct;
      selectedProduct = productData.find((prod) => {
        return prod?._id == `${product_id}`;
      });

      let removeSeletctedProd;
      removeSeletctedProd = productsCloneData.filter((prod) => {
        return prod?._id != `${product_id}`;
      });
      setproductsCloneData(removeSeletctedProd);

      const newData = {
        key: count,
        name: selectedProduct?.name,
        productId: selectedProduct?._id,
        units: selectedProduct?.units?.name,
        unit_id: selectedProduct?.units?._id,
        quantity: 1,
        discountType: selectedProduct?.discountType,
        discount: Number(selectedProduct?.discountValue).toFixed(2),
        rate: Number(selectedProduct?.sellingPrice).toFixed(2),
        tax: Number(selectedProduct?.tax?.taxRate).toFixed(2),

        taxInfo: selectedProduct?.tax,

        isRateFormUpadted: false,
        form_updated_discounttype: selectedProduct?.discountType,
        form_updated_discount: Number(selectedProduct?.discountValue).toFixed(
          2
        ),
        form_updated_rate: Number(selectedProduct?.sellingPrice).toFixed(2),
        form_updated_tax: Number(selectedProduct?.tax?.taxRate).toFixed(2),

        amount: 0,
      };

      let Calulateddicount;
      let tdrateVlaue = Number(1 * selectedProduct?.sellingPrice);

      if (selectedProduct?.discountType == "2") {
        Calulateddicount = (
          tdrateVlaue *
          (selectedProduct?.discountValue / 100)
        ).toFixed(2);
      } else {
        Calulateddicount = selectedProduct?.discountValue?.toFixed(2);
      }

      let afterdiscount = (
        Number(tdrateVlaue) - Number(Calulateddicount)
      ).toFixed(2);

      let newDataTax = (
        afterdiscount *
        (Number(selectedProduct?.tax?.taxRate) / 100)
      ).toFixed(2);

      let newDataAmount = (
        Number(selectedProduct?.sellingPrice) -
        Number(Calulateddicount) +
        Number(newDataTax)
      ).toFixed(2);

      newData.tax = newDataTax;
      newData.amount = newDataAmount;
      newData.discount = (tdrateVlaue - afterdiscount).toFixed(2);
      setDataSource([...dataSource, newData]);
      editRowInputs.current[count] = React.createRef();
      setrowErr([
        ...rowErr,
        { field: `qtyInput${count}`, valid: true, key: count },
      ]);
      setCount(count + 1);
    }
  };

//   const addTableRows = (product_id) => {
//     if (product_id !== "") {
//         let selectedProduct;
//         selectedProduct = productData.find((prod) => prod?._id === `${product_id}`);

//         let removeSeletctedProd;
//         removeSeletctedProd = productsCloneData.filter((prod) => prod?._id !== `${product_id}`);
//         setproductsCloneData(removeSeletctedProd);

//         const newData = {
//             key: count,
//             name: selectedProduct?.name,
//             productId: selectedProduct?._id,
//             units: selectedProduct?.units?.name,
//             unit_id: selectedProduct?.units?._id,
//             quantity: 1,
//             discountType: selectedProduct?.discountType,
//             discount: Number(selectedProduct?.discountValue).toFixed(2),
//             rate: Number(selectedProduct?.sellingPrice).toFixed(2),
//             tax: Number(selectedProduct?.tax?.taxRate).toFixed(2),
//             taxInfo: selectedProduct?.tax,

//             isRateFormUpadted: false,
//             form_updated_discounttype: selectedProduct?.discountType,
//             form_updated_discount: Number(selectedProduct?.discountValue).toFixed(2),
//             form_updated_rate: Number(selectedProduct?.sellingPrice).toFixed(2),
//             form_updated_tax: Number(selectedProduct?.tax?.taxRate).toFixed(2),

//             amount: 0,

//             // Add default values for staffName and service_from fields
//             staffName: null,  // Assuming staffName details will be selected from the dropdown
//             service_from: null,  // Assuming service from details will be selected from the dropdown
//         };

//         let Calulateddicount;
//         let tdrateVlaue = Number(1 * selectedProduct?.sellingPrice);

//         if (selectedProduct?.discountType === "2") {
//             Calulateddicount = (tdrateVlaue * (selectedProduct?.discountValue / 100)).toFixed(2);
//         } else {
//             Calulateddicount = selectedProduct?.discountValue?.toFixed(2);
//         }

//         let afterdiscount = (Number(tdrateVlaue) - Number(Calulateddicount)).toFixed(2);
//         let newDataTax = (afterdiscount * (Number(selectedProduct?.tax?.taxRate) / 100)).toFixed(2);
//         let newDataAmount = (Number(selectedProduct?.sellingPrice) - Number(Calulateddicount) + Number(newDataTax)).toFixed(2);

//         newData.tax = newDataTax;
//         newData.amount = newDataAmount;
//         newData.discount = (tdrateVlaue - afterdiscount).toFixed(2);

//         setDataSource([...dataSource, newData]);
//         editRowInputs.current[count] = React.createRef();
//         setrowErr([
//             ...rowErr,
//             { field: `qtyInput${count}`, valid: true, key: count },
//         ]);
//         setCount(count + 1);
//     }
// };

  const handleChanges = (evnt, key) => {
    const { value } = evnt.target;
    const row = dataSource.find((item) => item.key == key);

    // reset start
    let resetRowdataBefore;
    let resetRowdataBeforerate;
    let resetRowdataBeforediscount;
    let resetRowdataBeforetax;
    resetRowdataBefore = productData.find((prod) => {
      return prod?._id == row.productId;
    });

    if (row.isRateFormUpadted) {
      resetRowdataBeforerate = row?.form_updated_rate;
      resetRowdataBeforediscount = row?.form_updated_discount
        ? row?.form_updated_discount
        : 0;
      resetRowdataBeforetax = row?.form_updated_tax ? row?.form_updated_tax : 0;
    } else {
      resetRowdataBeforerate = resetRowdataBefore?.sellingPrice;
      resetRowdataBeforediscount = resetRowdataBefore?.discountValue
        ? resetRowdataBefore?.discountValue
        : 0;
      resetRowdataBeforetax = resetRowdataBefore?.tax?.taxRate
        ? resetRowdataBefore?.tax?.taxRate
        : 0;
    }

    row.rate = resetRowdataBeforerate;
    row.discount = resetRowdataBeforediscount;
    row.tax = resetRowdataBeforetax;
    row.amount = 0;
    const newData = [...dataSource];
    const index = newData.findIndex((item) => key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
    // reset done

    if (value && value != "" && value != 0) {
      let setValidRow = rowErr.find((row) => row?.key == key);
      setValidRow.valid = true;
      const newrowData = [...rowErr];
      const rowindex = newrowData.findIndex((item) => item?.key == key);
      const rowitem = newrowData[rowindex];
      newrowData.splice(rowindex, 1, {
        ...rowitem,
        ...setValidRow,
      });
      setrowErr(newrowData);

      let temp_rate = Number(row.rate);
      let temp_discount = Number(row.discount);
      let temp_tax = Number(row.tax);
      let enteredVlaue = value;
      let enVlaue = Number(enteredVlaue);
      let discountType = Number(row.discountType);

      if (row.isRateFormUpadted) {
        temp_rate = row?.form_updated_rate;
        temp_discount = Number(row?.form_updated_discount);
        temp_tax = row?.form_updated_tax;
      }

      row.rate = (enVlaue * temp_rate).toFixed(2);

      let Calulateddicount;
      let tdrateVlaue = Number(enVlaue * temp_rate);

      if (discountType == "2") {
        Calulateddicount = (tdrateVlaue * (temp_discount / 100)).toFixed(2);
      } else {
        Calulateddicount = temp_discount.toFixed(2);
      }

      row.discount = Number(Calulateddicount).toFixed(2);
      let tdDiscout = tdrateVlaue - Calulateddicount;
      row.tax = (tdDiscout * (Number(temp_tax) / 100)).toFixed(2);

      row.amount = (
        Number(row.rate) +
        Number(row.tax) -
        Number(row.discount)
      ).toFixed(2);
      row.quantity = enteredVlaue;
      const newData = [...dataSource];
      const index = newData.findIndex((item) => key === item.key);
      const item = newData[index];

      newData.splice(index, 1, {
        ...item,
        ...row,
      });
      setDataSource(newData);
    } else {
      let setValidRow = rowErr.find((row) => row?.key == key);
      setValidRow.valid = false;
      const newrowData = [...rowErr];
      const rowindex = newrowData.findIndex((item) => item?.key == key);
      const rowitem = newrowData[rowindex];
      newrowData.splice(rowindex, 1, {
        ...rowitem,
        ...setValidRow,
      });
      setrowErr(newrowData);
      row.rate = Number(0).toFixed(2);
      row.discount = Number(0).toFixed(2);
      row.tax = Number(0).toFixed(2);
      row.amount = Number(0).toFixed(2);
      const newData = [...dataSource];
      const index = newData.findIndex((item) => key === item.key);
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        ...row,
      });
      setDataSource(newData);
    }
  };

  const addTaxratesForm = async (data) => {
    const row = dataSource.find((item) => item.key == data.keyValue);
    let updatedTaxdata = data?.taxInfo;
    let enteredVlaue;
    if (data.quantity && data.quantity != "" && data.quantity != 0) {
      enteredVlaue = Number(data.quantity);
    }

    if (enteredVlaue != undefined) {
      // calc with min qty on suubmit
      let discountType = Number(data.discountType);
      let temp_rate = Number(data.rate);
      let temp_discount = Number(data.discount);
      let temp_tax = Number(updatedTaxdata?.taxRate);

      row.rate = (enteredVlaue * temp_rate).toFixed(2);

      let Calulateddicount;
      let tdrateVlaue = Number(enteredVlaue * temp_rate);

      // eslint-disable-next-line no-unused-vars
      if ((discountType = "2")) {
        Calulateddicount = (tdrateVlaue * (temp_discount / 100)).toFixed(2);
      } else {
        Calulateddicount = temp_discount.toFixed(2);
      }

      row.discount = Number(Calulateddicount).toFixed(2);
      let tdDiscout = tdrateVlaue - Calulateddicount;
      row.tax = (tdDiscout * (Number(temp_tax) / 100)).toFixed(2);
      row.amount = (
        Number(row.rate) +
        Number(row.tax) -
        Number(row.discount)
      ).toFixed(2);
      row.quantity = enteredVlaue;
    } else {
      // calc without min qty on suubmit
      let discountType = Number(data.discountType);
      let temp_rate = Number(data.rate);
      let temp_discount = Number(data.discount);
      let temp_tax = Number(updatedTaxdata?.taxRate);

      row.rate = temp_rate.toFixed(2);

      let Calulateddicount;
      let tdrateVlaue = Number(temp_rate);

      // eslint-disable-next-line no-unused-vars
      if ((discountType = "2")) {
        Calulateddicount = (tdrateVlaue * (temp_discount / 100)).toFixed(2);
      } else {
        Calulateddicount = temp_discount.toFixed(2);
      }

      row.discount = Number(Calulateddicount).toFixed(2);
      let tdDiscout = tdrateVlaue - Calulateddicount;
      row.tax = (tdDiscout * (Number(temp_tax) / 100)).toFixed(2);
      row.amount = (
        Number(row.rate) +
        Number(row.tax) -
        Number(row.discount)
      ).toFixed(2);
      row.quantity = enteredVlaue;
    }

    row.isRateFormUpadted = true;
    row.form_updated_discount = Number(data.discount);
    row.form_updated_rate = Number(data.rate);
    row.form_updated_tax = Number(updatedTaxdata?.taxRate);
    row.taxInfo = data.taxInfo;

    const newData = [...dataSource];
    const index = newData.findIndex((item) => data.keyValue === item.key);
    const item = newData[index];

    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
    EditcancelModal.current.click();
  };

  var removeByAttr = function (arr, attr, value) {
    var i = arr.length;
    while (i--) {
      if (
        arr[i] &&
        // eslint-disable-next-line no-prototype-builtins
        arr[i].hasOwnProperty(attr) &&
        arguments.length > 2 &&
        arr[i][attr] == value
      ) {
        arr.splice(i, 1);
      }
    }
    return arr;
  };

  const handleDelete = (key, productId) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);

    let addDeletedprod;
    addDeletedprod = productData.find((prod) => {
      return prod?._id == `${productId}`;
    });
    setproductsCloneData([...productsCloneData, addDeletedprod]);

    let errorListarray = rowErr;
    let resterrorlists = removeByAttr(errorListarray, "key", key);
    setrowErr([...resterrorlists]);
  };

  const handleKey = (event) => {
    // eslint-disable-next-line no-unused-vars
    const { name, value } = event.target;
    if (event.keyCode === 8 || event.keyCode === 46) {
      let strVlaue = `${event.target.value}`;
      // eslint-disable-next-line no-unused-vars
      let curVal = strVlaue.replace(/:$/, "");
      //event.target.value = curVal;
    }
  };


  const defaultColumns = [
    {
      title: "Product / Service",
      dataIndex: "name",
    },
    {
      title: "Unit",
      dataIndex: "units",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      editable: "true",
      render: (text, record) => (
        <div>
          <div className="d-flex align-items-center">
            <input
              type="text"
              onKeyPress={handleNumberRestriction}
              {...register(`qtyInput${record.key}`)}
              className={`form-control quantity-input`}
              onKeyDown={(e) => {
                handleKey(e);
              }}
              onKeyUp={(e) => {
                handleKey(e);
              }}
              onChange={(e) => {
                handleChanges(e, record.key);
              }}
              defaultValue={record.quantity}
            />
          </div>
        </div>
      ),
    },
    {
      title: `Rate`,
      dataIndex: "rate",
      render: (text, record) => (
        <>
          {currencyData ? currencyData : "$"}
          {record?.rate}
        </>
      ),
    },
    {
      title: `Discount`,
      dataIndex: "discount",
      render: (text, record) => (
        <>
          {currencyData ? currencyData : "$"}
          {record?.discount}
        </>
      ),
    },
    {
      title: `Tax`,
      dataIndex: "tax",
      render: (text, record) => (
        <>
          {currencyData ? currencyData : "$"}
          {record?.tax}
        </>
      ),
    },
    {
      title: `Amount`,
      dataIndex: "amount",
      render: (text, record) => (
        <>
          {currencyData ? currencyData : "$"}
          {record?.amount}
        </>
      ),
    },
    {
      title: "Staff",
      render: (text, record) => (
        <div className="">
          <div className="form-group input_text">
            <label>
              Staff <span className="text-danger"> * </span>
            </label>
            <Select
                  className={`react-selectcomponent form-control ${
                    errors?.[`staffName${record.key}`] ? "error-input" : ""
                  }`}
                  onChange={(value) => handleFieldChange(value.staffName, record.key, "staffName")}
                  getOptionLabel={(option) => `${option.staffName}`}
                  options={staffDetails}
                  isSearchable={true}
                  placeholder={`Select Staff`}
                  classNamePrefix="select_kanakku"
                />
            <small>{errors?.[`staffName_${record.key}`]?.message}</small>
          </div>
        </div>
      ),
    },
    {
      title: "Service From",
      render: (text, record) => (
        <div className="">
          <div className="form-group input_text">
            <label>
              Service From
              <span className="text-danger"> *</span>
            </label>
            
                <Select
                  className={`form-control react-selectcomponent w-100 ${
                    errors?.[`service_from_${record.key}`] ? "error-input" : ""
                  }`}
                  onChange={(value) => handleFieldChange(value, record.key, "service_from")}
                  placeholder="Select Service From"
                  options={serviceFrom}
                  classNamePrefix="select_kanakku"
                />
            <small>{errors?.[`service_from${record.key}`]?.message}</small>
          </div>
        </div>
      ),
    },
    
    {
      title: "Action",
      render: (text, record) => (
        <>
          <div className="d-flex align-items-center">
            <Link
              to="#"
              className="btn-action-icon me-2"
              onClick={() => editModal(record)}
              data-bs-toggle="modal"
              data-bs-target="#add_discount"
            >
              <span>
                <i className="fe fe-edit">
                  <FeatherIcon icon="edit" />
                </i>
              </span>
            </Link>
            <Link to="#" className="btn-action-icon">
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => handleDelete(record.key, record.productId)}
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

  const components = {
    body: {
      row: EditableRow,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataindex: col.dataIndex,
        title: col.title,
        // handleSave,
      }),
    };
  });

  const values = getValues();
  values.totalTax = totalTax;
  values.taxableAmount = taxableAmount;
  values.totalAmount = totalAmount;
  values.trimmedDataURL = trimmedDataURL;
  values.product = dataSource;

  //  For antd Datepicker
  const disablePastDate = (current) => {
    // Disable dates that are before today
    return current && current < dayjs().startOf("day");
  };
  const disableFutureDate = (current) => {
    // Disable dates that are after today
    return current && current > dayjs().endOf("day");
  };
  //  For antd Datepicker

  const getInvoiceNumber = async () => {
    const response = await getData(InvoiceNum);
    setNum(response?.data);
  };

  useEffect(() => {
    getInvoiceNumber();
  }, []);
  const select_Date = "Select Date"
  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="content-page-header">
            <h5>Add Invoice</h5>
          </div>
          <form onSubmit={handleSubmit(submitaddInvoiceAddForm)}>
            <div className="row">
              <div className="col-md-12">
                <div className="card-body">
                  <div className="form-group-item border-0 mb-0">
                    <div className="row align-item-center">
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group input_text">
                          <label>Invoice Number</label>
                          <Controller
                            name="invoiceNumber"
                            type="number"
                            control={control}
                            // eslint-disable-next-line no-unused-vars
                            render={({ field: { value, onChange } }) => (
                              <input
                                className={`form-control ${
                                  errors?.invoiceNumber ? "error-input" : ""
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
                          <small>{errors?.invoiceNumber?.message}</small>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group input_text">
                          <label>
                            Customer Name
                            <span className="text-danger"> *</span>
                          </label>
                          <ul className="form-group-plus css-equal-heights">
                            <li>
                              <Controller
                                name="customerId"
                                control={control}
                                render={({ field }) => (
                                  <Select
                                    {...field}
                                    className={`form-control react-selectcomponent w-100 ${
                                      errors?.customerId ? "error-input" : ""
                                    }`}
                                    placeholder="Select Customer"
                                    getOptionLabel={(option) =>
                                      `${option.name}`
                                    }
                                    getOptionValue={(option) => `${option._id}`}
                                    options={customersData}
                                    classNamePrefix="select_kanakku"
                                    isDisabled={
                                      Object.keys(ChoosedCustomer).length < 1
                                        ? false
                                        : true
                                    }
                                  />
                                )}
                              />
                              <small>{errors?.customerId?._id?.message}</small>
                            </li>
                            <li>
                              {Object.keys(ChoosedCustomer).length < 1 && (
                                <Link
                                  className="btn btn-primary form-plus-btn"
                                  to="/add-customer"
                                >
                                  <i className="fas fa-plus-circle" />
                                </Link>
                              )}
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group date-form-group">
                          <label>
                            Invoice Date<span className="text-danger"> *</span>
                          </label>
                          {/* For antd Datepicker */}
                          <Controller
                            control={control}
                            className={`form-control ${
                              errors?.invoiceDate ? "error-input" : ""
                            }`}
                            name="invoiceDate"
                            render={({ field: { value, onChange } }) => (
                              <>
                                <DatePickerComponent
                                  disabledDate={disableFutureDate}
                                  value={value}
                                  onChange={onChange}
                                />
                                <small>{errors?.invoiceDate?.message}</small>
                              </>
                            )}
                          ></Controller>
                          {/* For antd Datepicker */}
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group date-form-group">
                          <label>
                            Due Date<span className="text-danger"> *</span>
                          </label>
                          <Controller
                            name="dueDate"
                            control={control}
                            className={`form-control ${
                              errors?.dueDate ? "error-input" : ""
                            }`}
                            render={({ field: { value, onChange } }) => (
                              <DatePickerComponent
                                disabledDate={disablePastDate}
                                value={value}
                                onChange={onChange}
                              />
                            )}
                          ></Controller>
                          <small>{errors?.dueDate?.message}</small>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group input_text">
                          <label>Reference Number</label>
                          <Controller
                            name="referenceNo"
                            type="number"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <input
                                className={`form-control ${
                                  errors?.referenceNo ? "error-input" : ""
                                }`}
                                type="text"
                                onKeyPress={handleNumberRestriction}
                                value={value || ""}
                                onChange={onChange}
                                placeholder="Enter Reference Number"
                                autoComplete="false"
                              />
                            )}
                            defaultValue=""
                          />
                          <small>{errors?.referenceNo?.message}</small>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group input_text">
                          <label>
                            Payment Method
                            <span className="text-danger"> *</span>
                          </label>
                          <Controller
                            name="payment_method"
                            control={control}
                            render={({ field }) => (
                              <Select
                                {...field}
                                className={`form-control react-selectcomponent w-100 ${
                                  errors?.payment_method ? "error-input" : ""
                                }`}
                                placeholder="Select Payment Method"
                                options={paymentmethodsData}
                                classNamePrefix="select_kanakku"
                              />
                            )}
                          />
                          <small>
                            {errors?.payment_method?.value?.message}
                          </small>
                        </div>
                      </div>

                      {/* <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group input_text">
                          <label>
                            Staff <span className="text-danger"> * </span>
                          </label>
                          <Controller
                            name="staffName"
                            control={control}
                            render={({ field }) => (
                              <Select
                                {...field}
                                className={`react-selectcomponent form-control ${
                                  errors?.tax ? "error-input" : ""
                                }`}
                                getOptionLabel={(option) =>
                                  `${option.name} (${option.taxRate}%)`
                                }
                                getOptionValue={(option) => `${option._id}`}
                                // options={taxData}
                                isSearchable={true}
                                placeholder={`Select Staff `}
                                classNamePrefix="select_kanakku"
                              />
                            )}
                          />
                          <small>{errors?.tax?._id?.message}</small>
                        </div>
                      </div>

                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group input_text">
                          <label>
                          Service From
                            <span className="text-danger"> *</span>
                          </label>
                          <Controller
                            name="membership_type"
                            control={control}
                            render={({ field }) => (
                              <Select
                                {...field}
                                className={`form-control react-selectcomponent w-100 ${
                                  errors?.payment_method ? "error-input" : ""
                                }`}
                                placeholder="Select Service From"
                                options={serviceFrom}
                                classNamePrefix="select_kanakku"
                              />
                            )}
                          />
                          <small>
                            {errors?.payment_method?.value?.message}
                          </small>
                        </div>
                      </div> */}

                      
                      
                      {/* <div className="col-lg-8 col-md-6 col-sm-12"> */}
                      <div className="col-lg-12">
                        <div className="form-group">
                          <label>
                            Products<span className="text-danger"> *</span>
                          </label>
                          {/* addTableRows */}
                          <ul className="form-group-plus css-equal-heights">
                            <li>
                              <Controller
                                name="products"
                                control={control}
                                render={({ field: { onChange } }) => (
                                  <Select
                                    className={`react-selectcomponent form-control w-100 ${
                                      errors?.products ? "error-input" : ""
                                    }`}
                                    options={productsCloneData}
                                    placeholder="Select Products"
                                    value={""}
                                    type="number"
                                    classNamePrefix="select_kanakku"
                                    onChange={(e) => {
                                      onChange(e);
                                      trigger("products");
                                      addTableRows(e?.value);
                                    }}
                                  />
                                )}
                              />
                              <small className="text-danger">
                                {errors?.products?.value?.message}
                              </small>
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
                  <div className="form-group-item add-invoice-table">
                    <div className="card-table">
                      <div className="card-body product-list category">
                        <div className="table-responsive">
                          <Table
                            components={components}
                            rowClassName={() => "editable-row"}
                            bordered
                            dataSource={dataSource}
                            columns={columns}
                            pagination={{ position: ["none", "none"] }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-group-item border-0 p-0">
                    <div className="row">
                      <div className="col-xl-6 col-lg-12">
                        <div className="form-group-bank">
                          {/* <div className="row align-items-center">
                            <div className="col-md-8">
                              <div className="form-group">
                                <label>Select Bank</label>
                                <Controller
                                  name="bank"
                                  control={control}
                                  render={({ field }) => (
                                    <>
                                      <Select
                                        {...field}
                                       
                                        className={` w-100`}
                                        placeholder="Select Bank"
                                        getOptionLabel={(option) =>
                                          `${option.bankName}`
                                        }
                                        getOptionValue={(option) =>
                                          `${option._id}`
                                        }
                                        options={bank}
                                        classNamePrefix="select_kanakku"
                                      />
                                      <small className="text-danger">
                                        {errors?.bank?._id.message}
                                      </small>
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
                                >
                                  Add Bank
                                </Link>
                              </div>
                            </div>
                          </div> */}
                          <div className="form-group notes-form-group-info">
                            <label>Notes</label>
                            <Controller
                              name="notes"
                              type="text"
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <textarea
                                  className={`form-control ${
                                    errors?.notes ? "error-input" : ""
                                  }`}
                                  type="text"
                                  value={value}
                                  onChange={onChange}
                                  placeholder="Enter Notes"
                                  autoComplete="false"
                                  onKeyPress={handleKeyPress}
                                />
                              )}
                              defaultValue=""
                            />
                            <small className="text-danger">
                              {errors?.notes?.message}
                            </small>
                          </div>
                          {/* <div className="form-group input_text notes-form-group-info mb-0">
                            <label>Terms and Conditions</label>
                            <Controller
                              name="termsAndCondition"
                              type="text"
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <textarea
                                  className={`form-control ${
                                    errors?.termsAndCondition
                                      ? "error-input"
                                      : ""
                                  }`}
                                  type="text"
                                  value={value || ""}
                                  onChange={onChange}
                                  placeholder="Enter Terms and Conditions"
                                  autoComplete="false"
                                  // onKeyPress={handleKeyPress}
                                />
                              )}
                              defaultValue=""
                            />
                            <small className="text-danger">
                              {errors?.termsAndCondition?.message}
                            </small>
                          </div> */}
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
                                  {amountFormat(taxableAmount)}
                                </span>
                              </p>
                              <p>
                                Discount{" "}
                                <span>
                                  {currencyData ? currencyData : "$"}
                                  {amountFormat(totalDiscount)}
                                </span>
                              </p>
                              <p>
                                Tax{" "}
                                <span>
                                  {currencyData ? currencyData : "$"}
                                  {amountFormat(totalTax)}
                                </span>
                              </p>
                              <div className="status-toggle justify-content-between">
                                <div className="d-flex align-center">
                                  <p>Round Off</p>
                                  <Controller
                                    name="roundof"
                                    control={control}
                                    render={({
                                      field: { value, onChange },
                                    }) => (
                                      <>
                                        <input
                                          id="rating_1"
                                          className="check"
                                          type="checkbox"
                                          checked={roundof}
                                          value={value || ""}
                                          onChange={(val) => {
                                            onChange(val);
                                            trigger("roundof");
                                            changeRoundoff(val.target.checked);
                                            setroundof(!roundof);
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
                                  {amountFormat(roundofValue)}
                                </span>
                              </div>
                            </div>
                            <div className="invoice-total-footer">
                              <h4>
                                Total Amount{" "}
                                <span>
                                  {currencyData ? currencyData : "$"}
                                  {amountFormat(totalAmount)}
                                </span>
                              </h4>
                            </div>
                          </div>
                          {/* <SignaturePadComponent
                            setValue={addinvsetValue}
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
                          /> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-end">
                
                  <Link
                    to="/invoice-list"
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
            </div>
            {/* </div> */}
          </form>
        </div>
      </div>

      <div className="modal custom-modal fade" id="add_discount" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <form onSubmit={addTaxratesFormhandle(addTaxratesForm)}>
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <div className="form-header modal-header-title text-start mb-0">
                  <h4 className="mb-0">Add Tax &amp; Discount</h4>
                </div>
                <button
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
              <div className="modal-body">
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group input_text">
                      <label>Rate</label>
                      <Controller
                        name={`keyValue`}
                        type="hidden"
                        control={addTaxratesFormControl}
                        render={({ field: { value } }) => (
                          <input type="hidden" value={value || ""} />
                        )}
                      />
                      <Controller
                        name={`productId`}
                        type="hidden"
                        control={addTaxratesFormControl}
                        render={({ field: { value } }) => (
                          <input type="hidden" value={value || ""} />
                        )}
                      />
                      <Controller
                        name={`quantity`}
                        type="hidden"
                        control={addTaxratesFormControl}
                        render={({ field: { value } }) => (
                          <input type="hidden" value={value || ""} />
                        )}
                      />
                      <Controller
                        name={`discountType`}
                        type="hidden"
                        control={addTaxratesFormControl}
                        render={({ field: { value } }) => (
                          <input type="hidden" value={value || ""} />
                        )}
                      />
                      <Controller
                        name={`tax`}
                        type="hidden"
                        control={addTaxratesFormControl}
                        render={({ field: { value } }) => (
                          <input type="hidden" value={value || ""} />
                        )}
                      />
                      <Controller
                        name={`rate`}
                        type="number"
                        control={addTaxratesFormControl}
                        render={({ field: { value, onChange } }) => (
                          <input
                            className={`form-control ${
                              errors?.rate ? "error-input" : ""
                            }`}
                            type="number"
                            value={value || ""}
                            onChange={onChange}
                            placeholder="Enter Rate"
                            autoComplete="false"
                          />
                        )}
                      />
                      <small>{addTaxratesFormErr?.rate?.message}</small>
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group input_text">
                      <label>Discount Amount</label>
                      <Controller
                        name={`discount`}
                        type="number"
                        control={addTaxratesFormControl}
                        render={({ field: { value, onChange } }) => (
                          <input
                            className={`form-control ${
                              errors?.discount ? "error-input" : ""
                            }`}
                            type="number"
                            value={value || ""}
                            onChange={onChange}
                            placeholder="Enter discount"
                            autoComplete="false"
                          />
                        )}
                      />
                      <small>{addTaxratesFormErr?.discount?.message}</small>
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group mb-0 input_text">
                      <label>Tax</label>
                      <Controller
                        name="taxInfo"
                        control={addTaxratesFormControl}
                        render={({ field }) => (
                          <Select
                            {...field}
                           
                            className={`react-selectcomponent form-control`}
                            placeholder="Select Tax"
                            getOptionLabel={(option) =>
                              `${option.name} (${option.taxRate}%)`
                            }
                            getOptionValue={(option) => `${option._id}`}
                            options={tax}
                            classNamePrefix="select_kanakku"
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <Link
                  to="#"
                  ref={EditcancelModal}
                  data-bs-dismiss="modal"
                  className="btn btn-primary paid-cancel-btn me-2"
                >
                  Back
                </Link>
                <button
                  className="btn btn-primary paid-continue-btn"
                  type="submit"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

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

      <div className="modal custom-modal fade" id="bank_details" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <form onSubmit={bankHandle(addBankSettingsForm)}>
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <div className="form-header modal-header-title text-start mb-0">
                  <h4 className="mb-0">Add Bank Details</h4>
                </div>
                <button
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
              <div className="modal-body">
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group input_text">
                      <label>
                        Bank Name <span className="text-danger">*</span>
                      </label>
                      <Controller
                        name="bankName"
                        type="text"
                        control={addBankControl}
                        render={({ field: { value, onChange } }) => (
                          <input
                            className={`form-control ${
                              addBankerrors?.bankName ? "error-input" : ""
                            }`}
                            type="text"
                            value={value || ""}
                            onChange={onChange}
                            placeholder="Enter Bank Name"
                            autoComplete="false"
                          />
                        )}
                        defaultValue=""
                      />
                      <small>{addBankerrors?.bankName?.message}</small>
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group input_text">
                      <label>
                        Account Number <span className="text-danger">*</span>
                      </label>
                      <Controller
                        name="accountNumber"
                        type="number"
                        control={addBankControl}
                        render={({ field: { value, onChange } }) => (
                          <input
                            className={`form-control ${
                              addBankerrors?.accountNumber ? "error-input" : ""
                            }`}
                            type="number"
                            value={value || ""}
                            onChange={onChange}
                            placeholder="Enter Account Number"
                            autoComplete="false"
                          />
                        )}
                        defaultValue=""
                      />
                      <small>{addBankerrors?.accountNumber?.message}</small>
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group input_text">
                      <label>
                        Account Holder Name{" "}
                        <span className="text-danger">*</span>
                      </label>
                      <Controller
                        name="name"
                        type="text"
                        control={addBankControl}
                        render={({ field: { value, onChange } }) => (
                          <input
                            className={`form-control ${
                              addBankerrors?.name ? "error-input" : ""
                            }`}
                            type="text"
                            value={value || ""}
                            onChange={onChange}
                            placeholder="Enter Account Holder Name"
                            autoComplete="false"
                          />
                        )}
                        defaultValue=""
                      />
                      <small>{addBankerrors?.name?.message}</small>
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group input_text">
                      <label>
                        Branch Name <span className="text-danger">*</span>
                      </label>
                      <Controller
                        name="branch"
                        type="text"
                        control={addBankControl}
                        render={({ field: { value, onChange } }) => (
                          <input
                            className={`form-control ${
                              addBankerrors?.branch ? "error-input" : ""
                            }`}
                            type="text"
                            value={value || ""}
                            onChange={onChange}
                            placeholder="Enter branch Name"
                            autoComplete="false"
                          />
                        )}
                        defaultValue=""
                      />
                      <small>{addBankerrors?.branch?.message}</small>
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group input_text mb-0">
                      <label>
                        IFSC Code <span className="text-danger">*</span>
                      </label>
                      <Controller
                        name="IFSCCode"
                        type="text"
                        control={addBankControl}
                        render={({ field: { value, onChange } }) => (
                          <input
                            className={`form-control ${
                              addBankerrors?.IFSCCode ? "error-input" : ""
                            }`}
                            type="text"
                            value={value || ""}
                            onChange={onChange}
                            placeholder="Enter IFSC Code"
                            autoComplete="false"
                          />
                        )}
                        defaultValue=""
                      />
                      <small>{addBankerrors?.IFSCCode?.message}</small>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <Link
                  to="#"
                  ref={addbankpocancelModal}
                  data-bs-dismiss="modal"
                  className="btn btn-primary paid-cancel-btn me-2"
                >
                  Cancel
                </Link>
                <button
                  className="btn btn-primary paid-continue-btn"
                  type="submit"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
export default AddInvoice;
