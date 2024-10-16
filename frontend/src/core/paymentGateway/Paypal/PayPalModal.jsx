/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { Button } from "reactstrap";
import { DropIcon } from "../../../common/imagepath";
import dropin from "braintree-web-drop-in";
import { ApiServiceContext, paypalApi, successToast } from "../../core-index";

const PayPalModal = ({ amount }) => {
  const [braintreeInstance, setBraintreeInstance] = useState(null);
  const [isPayPalButtonAvailable, setIsPayPalButtonAvailable] = useState(false);
  const [paymentResponse, setPaymentResponse] = useState({});
  const { postData } = useContext(ApiServiceContext);
  const onBrainTreePaymentComplete = (paymentMethodNonce) => {
    gotoPayment(paymentMethodNonce);
  };
  // For Braintree

  const gotoPayment = async (nonce) => {
    let obj = {
      nonce: nonce,
      amount: 25,
    };

    try {
      const response = await postData(paypalApi, obj);

      if (response) {
        successToast("Paypal payment done Successfully");
      }
    } catch {
      return false;
    }
  };
  useEffect(() => {
    const initializeBraintree = () =>
      dropin.create(
        {
          authorization: "sandbox_q7zkkn9r_j5zy397yf6st8bbh",
          container: "#braintree-drop-in-div",
          amount: amount,
        },
        function (error, instance) {
          if (error) console.error(error);
          else {
            setBraintreeInstance(instance);
            setIsPayPalButtonAvailable(instance.isPaymentMethodRequestable());
          }
        }
      );

    if (braintreeInstance) {
      braintreeInstance.teardown().then(() => {
        initializeBraintree();
      });
    } else {
      initializeBraintree();
    }
  }, []);
  return (
    <div className="modal-content doctor-profile">
      <div className="modal-header border-bottom-0 justify-content-between"></div>
      <div className="modal-body pt-0">
        <div>
          <div id={"braintree-drop-in-div"} />
          <Button
            className={"braintreePayButton"}
            disabled={!braintreeInstance}
            onClick={() => {
              if (braintreeInstance) {
                braintreeInstance.requestPaymentMethod(
                  {
                    amount: amount,
                  },
                  (error, response) => {
                    if (error) {
                      console.error(error);
                    } else {
                      const paymentMethodNonce = response.nonce;

                      setPaymentResponse(response);
                      onBrainTreePaymentComplete(paymentMethodNonce);
                    }
                  }
                );
              }
            }}
          >
            {"Add"}
          </Button>
          {isPayPalButtonAvailable && <div id="paypal-button"></div>}
        </div>
      </div>
    </div>
  );
};

export default PayPalModal;
