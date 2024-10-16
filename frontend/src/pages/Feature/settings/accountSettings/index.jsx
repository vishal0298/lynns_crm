import React from "react";
import AccountSettings from "./Accountsettings";
import { AccountSettingsComponentController } from "./Accountsettings.control";

const AccountSettingsComponent = () => {
  return (
    <>
      <AccountSettingsComponentController>
        <AccountSettings />
      </AccountSettingsComponentController>
    </>
  );
};

export default AccountSettingsComponent;
