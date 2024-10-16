/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import { InvoiceLogo1 } from "../../../../common/imagepath";
import { Link } from "react-router-dom";
import { Table } from "antd";
import { amountFormat, toTitleCase } from "../../../../common/helper";
import AmountToWords from "../../../../common/AmountToWords";
import moment from "moment";

const InvoiceFourprint = ({ data, invoiceLogo, currencyData, companyData }) => {
  useEffect(() => {
    document.body.classList.add("darktheme");

    return () => {
      document.body.classList.remove("darktheme");
    };
  }, []);

  const dataSources = data.items;

  const columns = [
    {
      title: "#",
      dataIndex: "Id",
      render: (value, item, index) => index + 1,
    },
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
    },
    {
      title: "Price",
      dataIndex: "rate",
      render: (text, record) => (
        <>
          {currencyData ? currencyData : "$"}
          {Number(record?.rate).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </>
      ),
    },
    {
      title: "Staff",
      dataIndex: "staff",
    },{
      title: "Service From",
      dataIndex: "service_from",
    },
    {
      title: "Discount",
      dataIndex: "discount",
      render: (text, record) => (
        <>
          {currencyData ? currencyData : "$"}
          {amountFormat(record?.discount)}
        </>
      ),
    },
    {
      title: "Total",
      dataIndex: "amount",
      render: (text, record) => (
        <>
          {currencyData ? currencyData : "$"}
          {Number((record?.amount || 0) - (record?.tax || 0)).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </>
      ),
    },
  ];
  return (
    <>
      <div className="main-wrapper" id="element-to-download-as-pdf">
        <div className="container">
          <div className="invoice-wrapper index-four">
            <div className="inv-content">
              <div className="invoicenine-header">
                <div className="invoice-header">
                  <div className="inv-header-left">
                    <Link to="#">
                      <img
                        src={invoiceLogo}
                        onError={(event) => {
                          event.target.src = InvoiceLogo1;
                        }}
                        alt="Logo"
                      />
                    </Link>
                  </div>
                  <div className="inv-header-right">
                    <div className="invoice-title">TAX INVOICE</div>
                    <span>original for recipient</span>
                  </div>
                </div>
                <div className="company-details">
                  <span className="company-name invoice-title ">
                    {toTitleCase(companyData?.companyName)}
                  </span>
                  <div className="company-content">
                    <div className="company-content-left">
                      <div className="company-info">
                       
                        <div className="gst-details me-0">
                          Mobile: <span>{data?.customerId?.phone}</span>
                        </div>
                      </div>
                      <div className="gst-details company-address mb-0 me-0">
                        Address:
                        <span>
                          {companyData?.companyAddress
                            ? companyData?.companyAddress
                            : "" || companyData?.addressLine1
                            ? companyData?.addressLine1
                            : ""}
                        </span>
                      </div>
                    </div>
                    <div className="inv-header-right">
                      <div className="inv-details">
                        <div className="inv-date">
                          Invoice No: <span>{data?.invoiceNumber}</span>
                        </div>
                        <div className="inv-date mb-0">
                          Date:
                          <span>
                            {moment(data?.invoiceDate).format("DD-MM-YYYY")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="invoice-address">
                <div className="invoice-to">
                  <span>Bill To:</span>
                  <div className="inv-to-address">
                    {data?.customerId?.name ? data?.customerId?.name : ""}
                    <br />
                    Adress : {data?.customerId?.address ? data?.customerId?.address : ""}
                    <br />
                    {data?.customerId?.email ? data?.customerId?.email : ""}
                    <br />
                    {data?.customerId?.phone ? data?.customerId?.phone : ""}
                  </div>
                </div>
                <div className="invoice-to">
                  <span>Ship To:</span>
                  <div className="inv-to-address">
                    {companyData?.companyName ? companyData?.companyName : ""}
                    <br />
                    {companyData?.companyAddress
                      ? companyData?.companyAddress
                      : "" || companyData?.addressLine1
                      ? companyData?.addressLine1
                      : ""}
                    {","}
                    {companyData?.city ? companyData?.city : ""}
                    <br />
                    {companyData?.country ? companyData?.country : ""}.
                    <br />
                    {companyData?.email ? companyData?.email : ""}
                    <br />
                    {companyData?.phone ? companyData?.phone : ""}
                  </div>
                </div>
              </div>
              <div className="invoice-table">
                <div className="table-responsive">
                  <Table
                    bordered
                    dataSource={dataSources}
                    columns={columns}
                    pagination={{
                      position: ["none", "none"],
                    }}
                    rowKey={(record) => record?.productId}
                  />
                </div>
              </div>
              <div className="invoice-table-footer">
                <div className="table-footer-left notes">
                  <span>Important Note:</span>
                  <div className="delivery-notes">{data?.notes}</div>
                </div>
                <div className="text-end table-footer-right">
                  <table>
                    <tbody>
                      <tr>
                        <td>Amount</td>
                        <td>
                          {currencyData ? currencyData : "$"}
                          {amountFormat((data?.TotalAmount || 0)- (data?.vat || 0))}
                        </td>
                      </tr>
                     
                      <tr>
                        <td>Tax % </td>
                        <td>
                          {currencyData ? currencyData : "$"}
                          {amountFormat(data?.vat)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="invoice-table-footer totalamount-footer">
                <div className="table-footer-left">
                  <p className="total-info">
                    Total Items / Qty : {dataSources?.length} /
                    {amountFormat(data?.TotalAmount)}
                  </p>
                </div>
                <div className="table-footer-right">
                  <table className="totalamt-table">
                    <tbody>
                      <tr>
                        <td>Total</td>
                        <td>
                          {currencyData ? currencyData : "$"}
                          {amountFormat(data?.TotalAmount)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="table-footer-right">
                <table className="totalamt-table">
                  <tbody>
                    <tr>
                      <td>Total</td>
                      <td>
                        {currencyData ? currencyData : "$"}
                        {amountFormat(data?.TotalAmount)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="total-amountdetails">
              <p>
                Total amount ( in words):
                <AmountToWords amount={amountFormat(data?.TotalAmount)} />
              </p>
            </div>
            <div className="terms-condition">
              <span>Terms and Conditions:</span>
              <p>{toTitleCase(data?.termsAndCondition)}</p>
            </div>
            <div className="thanks-msg text-center">
              Thanks for your Business
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceFourprint;
