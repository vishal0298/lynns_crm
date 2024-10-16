/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import CryptoJS from "crypto-js";
import { Result, Table } from "antd";
import { Paypal, Stripe } from "../../../common/imagepath";
import StripeComponent from "../../../core/paymentgateways/stripe/StripeComponent";
import { amountFormat, toTitleCase } from "../../../common/helper";
import { ApiServiceContext } from "../../../core/core-index";
import PaypalComponent from "../../../core/paymentgateways/paypal/paypal";
import moment from "moment";

const OnlinePayment = () => {
  const { getData } = useContext(ApiServiceContext);
  const [data, setdata] = useState({});
  const [dataSource, setdataSource] = useState([]);
  const [paymentData, setPaymentdata] = useState({});
  const [stripeSecret, setStripeSecret] = useState(
    "pk_test_51NQljRSBAcimcltbvDzGviJgZTeKMJ0hlHkPNkXlAU7gALzyc7RnWv4QzMiqiXp1NXd4ht5xLBnHKNdGGeIVMwyz00KDMlAUQk"
  );
  const [paypalSecret, setPaypalSecret] = useState(
    "AZ4Ht_ZjYMfj7O_0mj0oMiNoghvlHc8AEDby4uDPqQACHAy2rvLDo_Aa68l4HZkCdMceP-JBF_OI0NeU"
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const [encodeError, setencodeError] = useState(null);
  const [paidStatus, setPaidStatus] = useState("DRAFTED");
  const [selectedPayment, setselectedPayment] = useState("stripe");

  function decryptData(encryptedData) {
    try {
      setencodeError(false);
      const cleanedData = encryptedData.replace(/ /g, "+").replace(/%2B/g, "+");
      const decryptedBytes = CryptoJS.AES.decrypt(
        cleanedData,
        // eslint-disable-next-line no-undef
        `${process.env.REACT_APP_paymentsecretkey}`
      );
      const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
      return decryptedData;
    } catch (error) {
      setencodeError(true);
      return null; // Handle the error or return a default value
    }
  }

  const handlePaymentChange = (e) => {
    setselectedPayment(e.target.value);
  };

  const getPaymentinfos = async () => {
    try {
      const response = await getData(`/unauthorized/paymentSettingsDetails`);
      setPaymentdata(response?.data);

     
      setStripeSecret(response?.data?.stripeInfo?.publishKey);
      setPaypalSecret(response?.data?.paypalInfo?.clientId);
    } catch (error) {
      return null;
    }
  };

  const setInvoiceinfos = async (invoiceId) => {
    try {
      const response = await getData(
        `/unauthorized/viewInvoice?invoiceId=${invoiceId}`
      );
      setdata(response?.data);
      setPaidStatus(response?.data?.status);
      setdataSource(response?.data?.items);
    } catch (error) {
      setencodeError(true);
      return null; // Handle the error or return a default value
    }
  };

  useEffect(() => {
    getPaymentinfos();
    const encryptedData = searchParams.get("key");
    if (encryptedData) {
      const decrypted = decryptData(encryptedData);
      if (decrypted) {
        try {
          setencodeError(false);
          const decryptedData = JSON.parse(decrypted);
          setInvoiceinfos(decryptedData);
        } catch (error) {
          setencodeError(true);
        }
      } else {
        setencodeError(true);
      }
    } else {
      setencodeError(true);
    }
  }, []);

  const columns = [
    {
      title: "Product / Service",
      dataIndex: "name",
      render: (text, record) => toTitleCase(record?.name),
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
      title: `Rate (${data?.currencySymbol})`,
      dataIndex: "rate",
    },
    {
      title: `Discount (${data?.currencySymbol})`,
      dataIndex: "discount",
    },
    {
      title: `Tax (${data?.currencySymbol})`,
      dataIndex: "tax",
    },
    {
      title: `Amount (${data?.currencySymbol})`,
      dataIndex: "amount",
    },
  ];

  return (
    <div>
      {encodeError ? (
        <Result
          status="404"
          title="Invalid Link !"
          subTitle="Sorry, you are not authorized to access this page."
        />
      ) : (
        <>
          {paidStatus == "PAID" ? (
            <Result
              status="success"
              title="Already Paid"
              subTitle="You have already paid for this invoice."
            />
          ) : (
            <div className="main-wrapper">
              <div className="container">
                <div className="invoice-wrapper download_section pay-online-recipt">
                  <div className="inv-content">
                    <div className="invoice-header">
                      <div className="inv-header-left">
                        <h4>
                          {data?.currencySymbol}
                          {amountFormat(data?.balance)}
                        </h4>
                        <p>
                          Due Date :{" "}
                          <span>
                            {moment(data?.dueDate).format("DD-MM-YYYY")}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="invoice-address">
                      <div className="invoice-to">
                        <ul className="pay-online-list">
                          <li>
                            <h6>Invoice To </h6>{" "}
                            <span>
                              {" "}
                              : {toTitleCase(data?.customerId?.name)}
                            </span>
                          </li>
                          <li>
                            <h6>From </h6>{" "}
                            <span> : {toTitleCase(data?.companyName)}</span>
                          </li>
                          <li>
                            <h6>Notes </h6>{" "}
                            <span> : {toTitleCase(data?.notes)}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="invoice-table">
                      <h4>Invoice Items</h4>
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

                    <div
                      className="pay-method-group"
                      style={{ padding: "0px 30px 1px 24px" }}
                    >
                      <div className="tab-content">
                        <div className="card-information">
                          <h6>
                            RoundOff :{" "}
                            {data?.roundOff
                              ? (
                                  Math.round(Number(data?.TotalAmount)) -
                                  Number(data?.TotalAmount)
                                ).toFixed(2)
                              : "0.00"}{" "}
                          </h6>
                        </div>
                      </div>
                    </div>

                    <div className="pay-method-group">
                      {!paymentData?.isStripe && !paymentData?.isPaypal ? (
                        <Result
                          status="403"
                          title="Something went Wrong !"
                          subTitle="Please contact Your administrator."
                        />
                      ) : (
                        <>
                          <h6>Select a Payment Method</h6>
                          <ul
                            className="nav nav-pills row"
                            id="pills-tab"
                            role="tablist"
                          >
                            {paymentData?.isStripe && (
                              <li
                                className="nav-item col-12 col-sm-6"
                                role="presentation"
                              >
                                <label
                                  className="custom_radio me-4 mb-0 active"
                                  id="home-tab"
                                  data-bs-toggle="tab"
                                  data-bs-target="#home"
                                  type="button"
                                  role="tab"
                                  aria-controls="home"
                                  aria-selected="true"
                                >
                                  <input
                                    type="radio"
                                    className="form-control"
                                    name="payment"
                                    value="stripe"
                                    checked={selectedPayment == "stripe"}
                                    onChange={handlePaymentChange}
                                  />
                                  <span className="checkmark" /> {"  "} Stripe
                                  <img
                                    src={Stripe}
                                    alt="img"
                                    style={{ width: "40px", height: "40px" }}
                                  />
                                </label>
                              </li>
                            )}
                            {paymentData?.isPaypal && (
                              <li
                                className="nav-item col-12 col-sm-6"
                                role="presentation"
                              >
                                <label
                                  className="custom_radio me-2 mb-0"
                                  id="profile-tab"
                                  data-bs-toggle="tab"
                                  data-bs-target="#profile"
                                  type="button"
                                  role="tab"
                                  aria-controls="profile"
                                  aria-selected="false"
                                >
                                  <input
                                    type="radio"
                                    className="form-control"
                                    name="payment"
                                    value="paypal"
                                    checked={selectedPayment == "paypal"}
                                    onChange={handlePaymentChange}
                                  />
                                  <span className="checkmark" /> Paypal
                                  <img src={Paypal} alt="img" />
                                </label>
                              </li>
                            )}
                          </ul>
                          <div className="tab-content">
                            {paymentData?.isStripe && (
                              <div
                                className="card-information tab-pane fade show active"
                                id="home"
                                role="tabpanel"
                                aria-labelledby="home-tab"
                              >
                                <h6>Stripe Card Information</h6>
                                {selectedPayment == "stripe" && (
                                  <StripeComponent
                                    secretKey={stripeSecret}
                                    amount={data?.balance}
                                    invoiceId={data?._id}
                                    currency={data?.currencyCode}
                                    currencySymbol={data?.currencySymbol}
                                  />
                                )}
                              </div>
                            )}
                            {paymentData?.isPaypal == true && (
                              <div
                                className="card-information tab-pane fade"
                                id="profile"
                                role="tabpanel"
                                aria-labelledby="profile-tab"
                              >
                                <h6>Paypal Payment Information</h6>
                                {selectedPayment == "paypal" && (
                                  <PaypalComponent
                                    secretKey={paypalSecret}
                                    amount={data?.balance}
                                    invoiceId={data?._id}
                                    currency={data?.currencyCode}
                                    currencySymbol={data?.currencySymbol}
                                  />
                                )}
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OnlinePayment;
