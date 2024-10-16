import React from "react";
import BankComponent from "./BankSettings";
import { BankSettingsComponentController } from "./BankSettings.control";

const BankSettingsComponent = () => {
  return (
    <>
      <BankSettingsComponentController>
        <BankComponent />
      </BankSettingsComponentController>
    </>
  );
};

export default BankSettingsComponent;
