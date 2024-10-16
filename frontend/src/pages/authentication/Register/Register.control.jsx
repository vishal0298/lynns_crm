/* eslint-disable react/prop-types */
/* eslint-disable no-mixed-spaces-and-tabs */
import React, { createContext, useContext, useState } from "react";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { ApiServiceContext } from "../../../core/API/api-service";
import {
  fullnameRequired,
  emailRequired,
  passwordRequired,
  emailvalidMessage,
  emailRgx,
  SpecialCharacters,
  passwordRegex,
  signupApi,
  successToast,
} from "../../../core/core-index";

const RegisterFormschema = yup
  .object({
    fullname: yup.string().required(fullnameRequired).nullable(),
    email: yup
      .string()
      .required(emailRequired)
      .matches(emailRgx, emailvalidMessage)
      .required(emailRequired)
      .max(64)
      .trim(),
    password: yup
      .string()
      .required(passwordRequired)
      .min(6, "Password should be at least 6 characters")
      .max(10, "Password should be maximum 10 characters")
      .matches(SpecialCharacters, "At least one special character")
      .matches(passwordRegex, "At least one uppercase & lowercase")
      .trim(),
    confirmPassword: yup
      .string()
      .required("Enter the confirm password")
      .oneOf([yup.ref("password"), null], "Passwords must match"),
  })
  .required();

const RegisterContext = createContext({
  RegisterFormschema: RegisterFormschema,
  submitRegisterForm: () => {},
});

const RegisterComponentController = (props) => {
  const { postData } = useContext(ApiServiceContext);
  const [eye, seteye] = useState(true);
  const navigate = useNavigate();

  const submitRegisterForm = async (data) => {
    try {
      const response = await postData(signupApi, data);
      if (response.code === 200) {
        successToast("RegisterSuccessfully");
        navigate("/login");
      }
      return response;
    } catch (error) {
      return false;
    }
  };

  const handleKeyPress = (event) => {
    const keyCode = event.keyCode || event.which;
    const keyValue = String.fromCharCode(keyCode);
    if (/^\d+$/.test(keyValue)) {
      event.preventDefault();
    }
  };

  const onEyeClick = () => seteye(!eye);

  return (
    <RegisterContext.Provider
      value={{
        RegisterFormschema,
        submitRegisterForm,
        handleKeyPress,
        onEyeClick,
        eye,
      }}
    >
      {props.children}
    </RegisterContext.Provider>
  );
};

export { RegisterContext, RegisterComponentController };
