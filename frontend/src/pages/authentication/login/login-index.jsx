import React from "react";
import Login from "./Login";
import { LoginComponentController } from "./login.control";

const LoginComponent = () => {
  return (
    <>
      <LoginComponentController>
        <Login />
      </LoginComponentController>
    </>
  );
};

export default LoginComponent;
