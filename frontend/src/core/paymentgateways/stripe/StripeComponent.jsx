import React,{useState,useEffect} from "react";
import { Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import PaymentForm from "./PaymentForm";


// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
//const stripePromise = loadStripe('pk_test_51NQljRSBAcimcltbvDzGviJgZTeKMJ0hlHkPNkXlAU7gALzyc7RnWv4QzMiqiXp1NXd4ht5xLBnHKNdGGeIVMwyz00KDMlAUQk');


const StripeComponent = ({secretKey,amount,invoiceId,currency,currencySymbol}) => {

  const [stripePromise, setStripePromise] = useState(null);
  
  useEffect(() => {
    const setLoadStripe = async () => {
      let value =  await loadStripe(secretKey)
      setStripePromise(value);
    }
   setLoadStripe();
  }, []);
  
  return (
    <>
    {stripePromise ? (
      <Elements stripe={stripePromise} >
        <PaymentForm amount={amount} invoiceId={invoiceId} currency={currency} currencySymbol={currencySymbol} />
      </Elements>
      ) : (
        <p>Loading ...</p>
      )}
    </>
  );
};

export default StripeComponent;
