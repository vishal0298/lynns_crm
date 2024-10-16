import React from "react";
import { Link } from "react-router-dom";
import { InvoiceLogo1, signature } from "../../../common/imagepath";

const SignaturePreviewInvoice = () => {
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
                  <div className="invoice-title">TAX INVOICE</div>
                  <div className="inv-details">
                    <div className="inv-date">
                      Date: <span>5/12/2022</span>
                    </div>
                    <div className="inv-date">
                      Invoice No: <span>00001</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="invoice-address">
                <div className="invoice-to">
                  <span>Invoice To:</span>
                  <div className="inv-to-address">
                    Walter Roberson
                    <br />
                    299 Star Trek Drive, Panama City, <br />
                    Florida, 32405, USA.
                    <br />
                    walter@example.com <br />
                    +45 5421 4523
                  </div>
                </div>
                <div className="invoice-to">
                  <span>Pay To:</span>
                  <div className="inv-to-address">
                    Lowell H. Dominguez
                    <br /> 84 Spilman Street, London
                    <br />
                    United King
                    <br />
                    domlowell@example.com
                    <br />
                    +45 5421 2154
                  </div>
                </div>
                <div className="company-details">
                  <span className="company-name">Dreamguys</span>
                  <div className="gst-details">
                    GST IN: <span>22AABCU9603R1ZX</span>
                  </div>
                  <div className="gst-details">
                    Address:{" "}
                    <span>
                      5 Hodges Mews, High Wycombe HP12 3JL, United Kingdom
                    </span>
                  </div>
                  <div className="gst-details mb-0">
                    Mobile: <span>+ 91 98765 43210</span>
                  </div>
                </div>
              </div>
              <div className="invoice-table">
                <div className="table-responsive">
                  <table>
                    <thead>
                      <tr>
                        <th className="table_width_1">#</th>
                        <th className="table_width_2">Item</th>
                        <th className="table_width_3">Tax Value</th>
                        <th className="table_width_1 text-center">Qty</th>
                        <th className="table_width_4 text-end">Price</th>
                        <th className="table_width_4 text-end">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td className=""> Website Design</td>
                        <td className="table-description">
                          Four plus web pages design and two rivision
                        </td>
                        <td className="text-center">1</td>
                        <td className="text-end">$350</td>
                        <td className="text-end">$350</td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td className="table-description">Web Development</td>
                        <td className="">Dynamic frontend design</td>
                        <td className="text-center">1</td>
                        <td className="text-end">$600</td>
                        <td className="text-end">$600</td>
                      </tr>
                      <tr>
                        <td>3</td>
                        <td className="">App Development</td>
                        <td className="table-description">
                          Android and Ios App design
                        </td>
                        <td className="text-center">2</td>
                        <td className="text-end">$200</td>
                        <td className="text-end">$400</td>
                      </tr>
                      <tr>
                        <td>4</td>
                        <td className="">Digital Marketing</td>
                        <td className="table-description">
                          Facebook and instagram marketing
                        </td>
                        <td className="text-center">3</td>
                        <td className="text-end">$100</td>
                        <td className="text-end">$300</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="invoice-table-footer">
                <div className="table-footer-left" />
                <div className="text-end table-footer-right">
                  <table>
                    <tbody>
                      <tr>
                        <td>Taxable Amount</td>
                        <td>$1650</td>
                      </tr>
                      <tr>
                        <td>GST 18.0% </td>
                        <td>$165</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="invoice-table-footer">
                <div className="table-footer-left">
                  <p className="total-info">Total Items / Qty : 4 / 4.00</p>
                </div>
                <div className="table-footer-right">
                  <table className="totalamt-table">
                    <tbody>
                      <tr>
                        <td>Total</td>
                        <td>$1650</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="total-amountdetails">
                <p>
                  Total amount ( in words):{" "}
                  <span>$ One Thousand Six Hundred Fifteen Only.</span>
                </p>
              </div>
              <div className="bank-details">
                <div className="account-info">
                  <span className="bank-title">Bank Details</span>
                  <div className="account-details">
                    Bank : <span>YES Bank</span>
                  </div>
                  <div className="account-details">
                    Account # :<span> 6677889944551 </span>
                  </div>
                  <div className="account-details">
                    IFSC : <span>YESBBIN4567</span>
                  </div>
                  <div className="account-details">
                    BRANCH : <span>Newyork</span>
                  </div>
                </div>
                <div className="company-sign">
                  <span>For Dreamguys</span>
                  <img src={signature} alt="signature-img" />
                </div>
              </div>
              <div className="terms-condition">
                <span>Terms and Conditions:</span>
                <ol>
                  <li> Goods Once sold cannot be taken back or exchanged</li>
                  <li>
                    {" "}
                    We are not the manufactures, company will stand for warrenty
                    as per their terms and conditions.
                  </li>
                </ol>
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

export default SignaturePreviewInvoice;
