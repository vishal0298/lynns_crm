import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { InvoiceLogo1, signature } from "../../common/imagepath";
import { commonDatacontext } from "../../core/commonData";
import { Table } from "antd";

const AddPurchaseReturnPreview = (props) => {
  const [dataSource, setDataSource] = useState();
  const previewValues = useLocation();

  const { rowData } = previewValues?.state;
  const { companyData, currencyData } = useContext(commonDatacontext);

  useEffect(() => {
    setDataSource(rowData.productService);
  }, [rowData]);

  const columns = [
    {
      title: "#",
      dataIndex: "Id",
      render: (value, item, index) => index + 1,
    },
    {
      title: "Item",
      dataIndex: "name",
    },
   
    {
      title: "Qty",
      dataIndex: "quantity",
    },
    {
      title: `${"Price"} (${currencyData})`,
      dataIndex: "rate",
      render: (text, record) => (
        <>
          {Number(text).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </>
      ),
    },
    {
      title: `${"Total"} (${currencyData})`,
      dataIndex: "amount",
      render: (text, record) => (
        <>
          {Number(text).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </>
      ),
    },
  ];

  return (
    <>
      <div className="main-wrapper">
        <div className="container">
          <div className="invoice-wrapper download_section signature-preview-page">
            <div className="inv-content">
              <div className="invoice-header">
                <div className="inv-header-left">
                  <Link to="#">
                    <img src={InvoiceLogo1} alt="Logo" />
                  </Link>
                  <span>Orginal For Receipient</span>
                </div>
                <div className="inv-header-right">
                  <div className="invoice-title">TAX INVOICES</div>
                  <div className="inv-details">
                    <div className="inv-date">
                      Date:
                      <span>{rowData?.invoiceDate}</span>
                    </div>

                  </div>
                </div>
              </div>
              <div className="invoice-address">
                <div className="invoice-to">
                  <span>Invoice To:</span>
                  <div className="inv-to-address">
                    {rowData?.customerId?.name}
                    <br />
                    {rowData?.customerId?.billingAddress?.addressLine1},
                    {rowData?.customerId?.billingAddress?.city},
                    <br />
                    {rowData?.customerId?.billingAddress?.state},
                    {rowData?.customerId?.billingAddress?.pincode},
                    {rowData?.customerId?.billingAddress?.country}.
                    <br />
                    {rowData?.customerId?.email} <br />
                    {rowData?.customerId?.phone}
                  </div>
                </div>
                <div className="invoice-to">
                  <span>Pay To:</span>
                  <div className="inv-to-address">
                    {companyData?.companyAddress || companyData?.addressLine1},
                    {companyData?.city},<br />
                    {companyData?.country}.
                    <br />
                    {companyData?.email}
                    <br />
                  </div>
                </div>
                <div className="company-details">
                  <span className="company-name">
                    {companyData?.companyName}
                  </span>
                
                  <div className="gst-details mb-0">
                    Mobile: <span>{companyData?.phone}</span>
                  </div>
                </div>
              </div>
              <div className="invoice-table">
                <div className="table-responsive">
                  <Table
                    bordered
                    dataSource={dataSource}
                    columns={columns}
                    pagination={{
                      position: ["none", "none"],
                    }}
                  />
                </div>
              </div>
              <div className="invoice-table-footer">
                <div className="table-footer-left" />
                <div className="text-end table-footer-right">
                  <table>
                    <tbody>
                      <tr>
                        <td>Taxable Amount</td>
                        <td>
                          {currencyData}
                          {Number(rowData?.taxableAmount).toLocaleString(
                            "en-IN",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>Tax</td>
                        <td>
                          {/* {rowData?.totalTax} */}
                          {currencyData}
                          {Number(rowData?.totalTax).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="invoice-table-footer">
                <div className="table-footer-left">
                  <p className="total-info">
                    Total Items / Qty : {dataSource?.length}
                  </p>
                </div>
                <div className="table-footer-right">
                  <table className="totalamt-table">
                    <tbody>
                      <tr>
                        <td>Amount</td>
                        <td>
                          {currencyData}
                          {Number(rowData?.totalAmount).toLocaleString(
                            "en-IN",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="bank-details">
                <div className="account-info">
                  <span className="bank-title">Bank Details</span>
                  <div className="account-details">
                    Bank : <span>{rowData?.bank?.bankName}</span>
                  </div>
                  <div className="account-details">
                    Account # :<span> {rowData?.bank?.accountNumber} </span>
                  </div>
                  <div className="account-details">
                    IFSC : <span>{rowData?.bank?.IFSCCode}</span>
                  </div>
                  <div className="account-details">
                    BRANCH : <span>{rowData?.bank?.branch}</span>
                  </div>
                </div>
                <div className="company-sign">
                  <span>For Dreamguys</span>
                  <img
                    src={rowData?.trimmedDataURL}
                    className="uploaded-imgs signature_sigImage"
                    style={{
                      display: "flex",
                      maxWidth: "200px",
                      maxHeight: "400px",
                    }}
                    alt="signature-img"
                  />
                </div>
              </div>
              <div className="terms-condition">
                <span>Terms and Conditions:</span>
                <p>{rowData?.termsAndCondition}</p>
              </div>
              <div className="thanks-msg text-center">
                Thanks for your Business
              </div>
              <div className="add-customer-btns text-end">
                <Link to="#" className="btn btn-primary cancel me-2">
                  Save
                </Link>
                <Link to="/mail-pay-invoice" className="btn btn-primary">
                  Save &amp; Send
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddPurchaseReturnPreview;
