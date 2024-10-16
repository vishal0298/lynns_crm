import React from "react";
import Register from "../Register";
import { RegisterComponentController } from "./Register.control";

const RegisterComponent = () => {
  return (
    <>
      <RegisterComponentController>
        <Register />
      </RegisterComponentController>
    </>
  );
};

export default RegisterComponent;
