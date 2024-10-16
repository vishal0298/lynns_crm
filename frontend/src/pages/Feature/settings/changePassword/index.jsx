import React from "react";
import ChangePassword from "./ChangePassword";
import { ChangePasswordComponentController } from "./ChangePassword.control";

const ChangePasswordComponent = () => {
  return (
    <>
      <ChangePasswordComponentController>
        <ChangePassword />
      </ChangePasswordComponentController>
    </>
  );
};

export default ChangePasswordComponent;
