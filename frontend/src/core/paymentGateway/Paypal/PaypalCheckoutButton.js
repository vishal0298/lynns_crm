import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import React, { useState, useEffect, useContext } from "react";
import { ApiServiceContext, payPalCreatePayment } from "../../core-index";

const PaypalCheckoutButton = ({ product, invoiceId }) => {
  const [paidFor, setPaidFor] = useState(false);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paypalAmount, setPaypalAmount] = useState();
  const { postData } = useContext(ApiServiceContext);
  useEffect(() => {
    if (product) {
      setPaypalAmount(product?.price?.toString());
    }
  }, [product]);

  // const handleApprove = (data, actions) => {
  //   setIsProcessing(true);
  //   const order = actions.order.capture();
  //   return actions.order.capture().then((details) => {
  //     setPaidFor(true);
  //     setIsProcessing(false);
  //     clearAmount();
  //   });
  // };
  const handleApprove = (orderId, order) => {
    // Call backend function to fulfill order
    // If Response is true

    setPaidFor(true);
    gotoPayment(order);
    // refresh user account or status
    // If Response is error
    // alert("Unable to fulfill");
    // if (paidFor) {
    //   alert("Success");
    // }

    if (error) {
      alert("Error while approve");
    }
  };

  const gotoPayment = async (order) => {
    let obj = {
      paymentResponse: order?.purchase_units,
      invoiceId: invoiceId,
      amount: Number(order?.purchase_units?.[0]?.amount?.value),
      status: order?.status,
    };

    try {
      const response = await postData(payPalCreatePayment, obj);

      if (response) {
        successToast("Paypal payment done Successfully");
      }
    } catch {}
  };

  const handleOnError = (err) => {
    clearAmount();
    setError(err);
    setIsProcessing(false);
  };

  const handleClick = (data, actions) => {
    if (isProcessing) {
      return;
    }

    if (currency !== "USD") {
      alert("This seller only accepts payments in USD.");
      return;
    }

    const hasAlready = false;
    if (hasAlready) {
      alert("Already bought");
      setError("Already Bought");
      actions.reject();
    } else {
      setError(null);
      actions.resolve();
    }
  };

  const handleCancel = () => {
    alert("Cancelled");
    clearAmount();
  };

  const clearAmount = () => {
    setProduct({ price: null });
    setPaypalAmount("");
  };
  // if (paidFor) {
  //   alert("Thank you for your purchase");
  // }

  if (error) {
    alert(error);
  }

  return (
    <>
      {/* {!isProcessing && paypalAmount && (
        <PayPalScriptProvider
          options={{
            "client-id":
              "Ab61i1QGjcF5mz_Gjqcl4SvXvlIjbrjXk6oiwoA7CM3nGaAEER9Mu8Ig79vb3d5Ce8-0usWlO6TUkTR7",
            currency: "USD",
          }}
        >
          <PayPalButtons
            style={{
              color: "silver",
              height: 48,
              tagline: false,
              shape: "pill",
            }}
            onClick={handleClick}
            createOrder={async (data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      currency_code: "USD",
                      value: paypalAmount,
                    },
                  },
                ],
              });
            }}
            onApprove={handleApprove}
            onError={handleOnError}
            onCancel={handleCancel}
            disableFunding="credit,card" // Disable PayPal funding sources
          />
        </PayPalScriptProvider>
      )} */}
      <div
      // style={{ width: "150px" }}
      >
        <PayPalScriptProvider
          options={{
            clientId:
              "Ab61i1QGjcF5mz_Gjqcl4SvXvlIjbrjXk6oiwoA7CM3nGaAEER9Mu8Ig79vb3d5Ce8-0usWlO6TUkTR7",
          }}
        >
          <PayPalButtons
            style={{
              color: "silver",
              shape: "pill",
              label: "checkout",
              layout: "horizontal",
            }}
            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      currency_code: "USD",
                      // value: product.amount,
                      value: paypalAmount,
                    },
                  },
                ],
                experience_profile_id:
                  "Ab61i1QGjcF5mz_Gjqcl4SvXvlIjbrjXk6oiwoA7CM3nGaAEER9Mu8Ig79vb3d5Ce8-0usWlO6TUkTR7",
                contingencies: ["SCA_WHEN_REQUIRED"],
              });
            }}
            onApprove={async (data, actions) => {
              const order = await actions.order.capture();

              handleApprove(data.orderID, order);
              // Close the PayPal modal after successful transaction
              // actions.close();
            }}
            onCancel={(data, actions) => {}}
            onError={(err) => {
              setError(err);
            }}
          />
        </PayPalScriptProvider>
      </div>
    </>
  );
};

export default PaypalCheckoutButton;
