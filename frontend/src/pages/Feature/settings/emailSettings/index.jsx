import React from "react";
import EmailSettings from "./Emailsettings";
import { EmailSettingsComponentController } from "./Emailsettings.control";

const EmailSettingsComponent = () => {
  return (
    <>
      <EmailSettingsComponentController>
        <EmailSettings />
      </EmailSettingsComponentController>
    </>
  );
};

export default EmailSettingsComponent;
