import React from "react";
import CompanySettings from "./CompanySettings";
import { CompanySettingsComponentController } from "./CompanySettings.control";

const CompanySettingsComponent = () => {
  return (
    <>
      <CompanySettingsComponentController>
        <CompanySettings />
      </CompanySettingsComponentController>
    </>
  );
};

export default CompanySettingsComponent;
