/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React, { useState, useMemo, useContext, useRef } from "react";
import { ApiServiceContext, errorToast } from "../../core-index";
const flatted = require("flatted");
import useResponsiveFontSize from "./useResponsivefontsize";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
} from "@stripe/react-stripe-js";
import { amountFormat } from "../../../common/helper";

const useOptions = () => {
  const fontSize = useResponsiveFontSize();
  const options = useMemo(
    () => ({
      style: {
        base: {
          fontSize,
          color: "#424770",
          letterSpacing: "0.025em",
          fontFamily: "Source Code Pro, monospace",
          "::placeholder": {
            color: "#aab7c4",
          },
        },
        invalid: {
          color: "#9e2146",
        },
      },
    }),
    [fontSize]
  );

  return options;
};

const PaymentForm = ({ amount, invoiceId, currency, currencySymbol }) => {
  const stripe = useStripe();
  const elements = useElements();
  const options = useOptions();

  const modalRef = useRef(null);
  const errormodalRef = useRef(null);

  const { postData } = useContext(ApiServiceContext);
  const [paybuttonsts, setpaybuttonsts] = useState(false);
  const [errormsg, setErrormsg] = useState("Something Wrong !");
  const [noErrors, setNoErrors] = useState(false);

  const handleClose = async () => {
    window.close();
  };
  const handleClosefail = async () => {
    setpaybuttonsts(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardNumberElement);
    const cardNumberElement = elements.getElement(CardNumberElement);
    const cardCvcElement = elements.getElement(CardCvcElement);
    const cardExpiryElement = elements.getElement(CardExpiryElement);

    cardElement.on("change", function (event) {
      var displayError = document.getElementById("card-errors-number");
      if (event.error) {
        setNoErrors(false);
        displayError.textContent = event.error.message;
      } else {
        setNoErrors(true);
        displayError.textContent = "";
      }
    });

    cardNumberElement.on("change", function (event) {
      var displayError = document.getElementById("card-errors-number");
      if (event.error) {
        setNoErrors(false);
        displayError.textContent = event.error.message;
      } else {
        setNoErrors(true);
        displayError.textContent = "";
      }
    });

    cardCvcElement.on("change", function (event) {
      var displayError = document.getElementById("card-errors-cvc");
      if (event.error) {
        setNoErrors(false);
        displayError.textContent = event.error.message;
      } else {
        setNoErrors(true);
        displayError.textContent = "";
      }
    });

    cardExpiryElement.on("change", function (event) {
      var displayError = document.getElementById("card-errors-exp");
      if (event.error) {
        setNoErrors(false);
        displayError.textContent = event.error.message;
      } else {
        setNoErrors(true);
        displayError.textContent = "";
      }
    });

    if (noErrors) setpaybuttonsts(true);

    if (
      cardElement &&
      cardNumberElement &&
      cardCvcElement &&
      cardExpiryElement
    ) {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        setNoErrors(false);
        errorToast(error.message);
      } else {
        const response = await postData("/stripe/stripePayment", {
          paymentMethodId: paymentMethod.id,
          invoiceId: invoiceId,

          amount: Math.round(amount),

          currency: currency,
        });

        if (response.code == 200) {
          await stripe
            .confirmCardPayment(
              `${response.data}`,
              {
                payment_method: { card: cardElement },
                return_url: `${process.env.REACT_APP_url}/online-payment`,
              },
              // Disable the default next action handling.
              { handleActions: true }
            )
            .then(async function (result) {
              cardNumberElement.clear();
              cardCvcElement.clear();
              cardExpiryElement.clear();

              if (result?.paymentIntent) {
                if (result?.paymentIntent?.status == "succeeded") {
                  const intent = result?.paymentIntent;

                  // Make an API call with payment intent data
                  const response = await postData("/stripe/webhookPayment", {
                    data: intent,
                  });

                  // Check the response from the API call
                  if (response.code == 200) {
                    // API call was successful, show success modal or perform any other actions
                    if (modalRef.current) {
                      const modal = new window.bootstrap.Modal(
                        modalRef.current
                      );
                      modal.show();
                    }
                  } else {
                    // API call failed, show error modal or handle accordingly
                    if (errormodalRef.current) {
                      const modal = new window.bootstrap.Modal(
                        errormodalRef.current
                      );
                      modal.show();
                    }
                  }
                } else if (result?.paymentIntent?.status === "canceled") {
                  // Handle the case where payment is canceled
                  if (errormodalRef.current) {
                    const modal = new window.bootstrap.Modal(
                      errormodalRef.current
                    );
                    modal.show();
                  }
                } else {
                  // Handle other cases if needed
                  // ...
                }
              } else if (result?.error) {
                if (result?.error?.type == "api_error") {
                  if (errormodalRef.current) {
                    setErrormsg(result?.error?.message);
                    const modal = new window.bootstrap.Modal(
                      errormodalRef.current
                    );
                    modal.show();
                  }
                } else if (result?.error?.type == "card_error") {
                  if (errormodalRef.current) {
                    setErrormsg(result?.error?.message);
                    const modal = new window.bootstrap.Modal(
                      errormodalRef.current
                    );
                    modal.show();
                  }
                } else if (result?.error?.type == "idempotency_error") {
                  if (errormodalRef.current) {
                    setErrormsg(result?.error?.message);
                    const modal = new window.bootstrap.Modal(
                      errormodalRef.current
                    );
                    modal.show();
                  }
                } else if (result?.error?.type == "invalid_request_error") {
                  if (errormodalRef.current) {
                    setErrormsg(result?.error?.message);
                    const modal = new window.bootstrap.Modal(
                      errormodalRef.current
                    );
                    modal.show();
                  }
                } else {
                  if (errormodalRef.current) {
                    setErrormsg(result?.error?.message || "Something Wrong !");
                    const modal = new window.bootstrap.Modal(
                      errormodalRef.current
                    );
                    modal.show();
                  }
                }
              } else {
                //
              }
            });
        } else {
          ///
        }
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-lg-12 col-sm-12">
            <div className="input-block mb-3">
              <CardNumberElement options={options} />
              <span className="card-errors" id="card-errors-number"></span>
            </div>
          </div>
          <div className="col-lg-6 col-sm-6">
            <div className="input-block mb-3">
              <CardExpiryElement options={options} />
              <span className="card-errors" id="card-errors-exp"></span>
            </div>
          </div>
          <div className="col-lg-6 col-sm-6">
            <div className="input-block mb-3">
              <CardCvcElement options={options} />
              <span className="card-errors" id="card-errors-cvc"></span>
            </div>
          </div>
        </div>

        <div className="add-customer-btns payment-btns text-end">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={paybuttonsts}
          >
            Pay {currencySymbol}
            {amountFormat(amount)}
          </button>
        </div>
      </form>
      <div
        ref={modalRef}
        className="modal custom-modal fade signature-success-modal"
        id="payment_succeed_modal"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-body">
              <div className="form-header">
                <div className="mb-2">
                  <i className="feather-check-circle" />
                </div>
                <h3>Payment Successful </h3>
                <p>You will receive an email on the payment you have made.</p>
              </div>
              <div className="modal-btn delete-action text-center">
                <button
                  onClick={handleClose}
                  type="reset"
                  data-bs-dismiss="modal"
                  className="btn btn-primary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        ref={errormodalRef}
        className="modal custom-modal fade signature-success-modal"
        id="payment_succeed_modal"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-body">
              <div className="form-header">
                <div className="mb-2">
                  <i className="feather-check-circle" />
                </div>
                <h3>Payment Failed </h3>
                <p>{errormsg}</p>
              </div>
              <div className="modal-btn delete-action text-center">
                <button
                  onClick={handleClosefail}
                  type="reset"
                  data-bs-dismiss="modal"
                  className="btn btn-primary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentForm;
