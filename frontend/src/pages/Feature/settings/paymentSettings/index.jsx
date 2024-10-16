import React from "react";
import PaymentSettings from "./Paymentsettings";
import { PaymentSettingsComponentController } from "./Paymentsettings.control";

const PaymentSettingsComponent = () => {
  return (
    <>
      <PaymentSettingsComponentController>
        <PaymentSettings />
      </PaymentSettingsComponentController>
    </>
  );
};

export default PaymentSettingsComponent;
