import React from "react";
import InvoiceSettings from "./InvoiceSettings";
import { InvoiceSettingsComponentController } from "./InvoiceSettings.control";

const InvoiceSettingsComponent = () => {
  return (
    <>
      <InvoiceSettingsComponentController>
        <InvoiceSettings />
      </InvoiceSettingsComponentController>
    </>
  );
};

export default InvoiceSettingsComponent;
