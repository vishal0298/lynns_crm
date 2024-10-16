import React, { useContext, useEffect, useState } from "react";
import {
  PayPalScriptProvider,
  PayPalButtons,
  FUNDING,
} from "@paypal/react-paypal-js";
import { successToast } from "../../core-index";

function PaypalComponent({
  secretKey,
  amount,
  invoiceId,
  currency,
  currencySymbol,
}) {
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentamount, setpaymentamount] = useState(amount);
  const [paymentinvoiceId, setpaymentinvoiceId] = useState(invoiceId);
  const [paymenticurrency, setpaymenticurrency] = useState(currency);

  useEffect(() => {
  }, []);

  useEffect(() => {
    if (paymentStatus != "") {
      successToast(paymentStatus);
    }
  }, [paymentStatus]);

  const FUNDING_SOURCES = [FUNDING.PAYPAL, FUNDING.CARD];

  const initialOptions = {
    "client-id": secretKey,
    currency: "USD",
  };

  return (
    <div className="App">
      <PayPalScriptProvider options={initialOptions}>
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          {FUNDING_SOURCES.map((fundingSource) => {
            return (
              <div key={fundingSource} style={{ flex: 1, padding: "5px" }}>
                <PayPalButtons
                  fundingSource={fundingSource}
                  key={fundingSource}
                  style={{
                    layout: "vertical",
                    shape: "rect",
                    color: fundingSource === FUNDING.PAYPAL ? "blue" : "",
                    height: 50,
                    tagline: false,
                  }}
                  createOrder={(data, actions) => {
                    return actions.order
                      .create({
                        purchase_units: [
                          {
                            amount: {
                              currency_code: "USD",
                              value: paymentamount,
                            },
                            invoiceId: paymentinvoiceId,
                          },
                        ],
                        shipping: {
                          name: {
                            full_name: "Test",
                          },
                          address: {
                            address_line_1: "123 Main Street",
                            address_line_2: "Apt 4",
                            admin_area_2: "Anytown",
                            admin_area_1: "CA",
                            postal_code: "12345",
                            country_code: "US",
                          },
                        },
                        contingencies: ["SCA_ALWAYS"], //["SCA_WHEN_REQUIRED"],
                      })
                      .catch((error) => {
                        // Handle the error here
                        console.error("Error while creating the order:", error);
                        // You can show an error message to the user if needed
                        // setPaymentStatus('Sorry, there was an error processing your transaction.');
                      });
                  }}
                  onApprove={async (data, actions) => {
                    actions.order.capture().then((details) => {
                      // Payment is successful
                      // 'details' contains the transaction information, including liabilityShift

                      // Check the liabilityShift
                      // if (details.liability_shift_status === "POSSIBLE") {
                      //   // Liability shift is possible, indicating 3D Secure authentication was successful
                      // } else {
                      //   // Liability shift is not possible, indicating 3D Secure authentication was not successful
                      // }

                      // You can use the 'details' object to get more transaction information if needed
                      const errorDetail =
                        Array.isArray(details.details) && details.details[0];

                      if (
                        errorDetail &&
                        errorDetail.issue === "INSTRUMENT_DECLINED"
                      ) {
                        return actions.restart();
                      }

                      if (errorDetail) {
                        let msg =
                          "Sorry, your transaction could not be processed.";
                        msg += errorDetail.description
                          ? " " + errorDetail.description
                          : "";
                        msg += details.debug_id
                          ? " (" + details.debug_id + ")"
                          : "";
                        setPaymentStatus(msg);
                      }

                      setPaymentStatus(details.status);
                    });
                  }}
                />
              </div>
            );
          })}
        </div>
      </PayPalScriptProvider>
    </div>
  );
}

export default PaypalComponent;
