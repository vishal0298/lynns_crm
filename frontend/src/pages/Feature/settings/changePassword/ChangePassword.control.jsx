/* eslint-disable react/prop-types */
import React, { createContext, useEffect, useContext, useState } from "react";
import * as yup from "yup";
import { ApiServiceContext } from "../../../../core/API/api-service";
import {
  SpecialCharacters,
  successToast,
  change_password,
  numberRgx,
  lowerCase,
  upperCase,
} from "../../../../core/core-index";
import { userRolesCheck } from "../../../../common/commonMethods";

const passwordSchemaschema = yup.object().shape({
  oldPassword: yup.string().required("Enter old password"),
  newPassword: yup
    .string()
    .required("Enter new password")
    .min(6, "Password Should Be At Least 6 Characters")
    .matches(SpecialCharacters, "At Least One Special Character")
    .matches(numberRgx, "Password Must Contain At Least One Number")
    .matches(lowerCase, "Password Must Contain At Least One Lowercase")
    .matches(upperCase, "Password Must Contain At Least One Uppercase")
    .max(10, "Password Should Be Maximum 10 Characters")
    .trim(),
  confirmPassword: yup
    .string()
    .required("Enter confirm password")
    .oneOf([yup.ref("newPassword")], "Password does not match"),
});

const changePasswordContext = createContext({
  passwordSchemaschema: passwordSchemaschema,
  changePasswordForm: () => {},
});

const ChangePasswordComponentController = (props) => {
  const { postData } = useContext(ApiServiceContext);
  // For Roles and Permissions
  const [permission, setPermission] = useState({});
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    let findModule = userRolesCheck("changePassword");
    if (findModule == "admin") {
      setAdmin(true);
    } else {
      setPermission(findModule);
    }
  }, []);
  // For Roles and Permissions

  const changePasswordForm = async (data) => {
    const formData = {};
    formData.oldPassword = data.oldPassword;
    formData.newPassword = data.newPassword;
    try {
      const response = await postData(`${change_password}`, formData);
      if (response.code === 200) {
        successToast("Password updated Successfully");
      }
      return response;
    } catch (error) {
      /* empty */
    }
  };

  return (
    <changePasswordContext.Provider
      value={{ passwordSchemaschema, changePasswordForm, permission, admin }}
    >
      {props.children}
    </changePasswordContext.Provider>
  );
};

export { changePasswordContext, ChangePasswordComponentController };
