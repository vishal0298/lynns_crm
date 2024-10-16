/* eslint-disable react/prop-types */
import React, { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { addStaffApi } from "../../../../constans/apiname";
import { useForm } from "react-hook-form";
import { ApiServiceContext, errorToast, successToast } from "../../../../core/core-index";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
  name: yup
    .string()
    .required("Enter Name")
    .matches(/^[A-Za-z ]+$/, "Only Alphabets Are Allowed"),
  employeeId: yup
    .string()
    .required("Enter Employee ID")
    .matches(/^[A-Za-z0-9]+$/, "Only Alphanumeric Characters Are Allowed"),
  mobileNumber: yup
    .string()
    .required("Enter Mobile Number")
    .matches(/^[0-9]{10}$/, "Enter a valid 10-digit Mobile Number"),
});

const AddStaffContext = createContext({
  schema: schema,
  _onSubmit: async (data) => {},
});

const AddStaffComponentController = (props) => {
  const {
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();
  const { postData } = useContext(ApiServiceContext);

  const _onSubmit = async (data) => {
    const obj = {
      name: data?.name,
      employeeId: data?.employeeId,
      mobileNumber: data?.mobileNumber,
    };
    try {
      console.log(postData)
      const response = await postData(addStaffApi, obj);
      if (response.code == 200) {
        successToast("Staff Added successfully");
        navigate("/staff");
      } else {
        errorToast(response?.data?.message);
      }
    } catch {
      return false;
    }
  };

  return (
    <AddStaffContext.Provider
      value={{
        schema,
        _onSubmit,
      }}
    >
      {props.children}
    </AddStaffContext.Provider>
  );
};

export { AddStaffContext, AddStaffComponentController };
