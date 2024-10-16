/* eslint-disable react/prop-types */
import React, { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { addUnitsApi } from "../../../../constans/apiname";
import { useForm } from "react-hook-form";
import { ApiServiceContext, errorToast, successToast } from "../../../../core/core-index";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
  name: yup
    .string()
    .required("Enter Name")
    .matches(/^[A-Za-z ]+$/, "Only Alphabets Are Allowed"),
  symbol: yup
    .string()
    .required("Enter Symbol")
    .matches(/^[A-Za-z ]+$/, "Only Alphabets Are Allowed"),

});

const AddUnitsContext = createContext({
  schema: schema,
  onSubmit: () => {},
});

const AddUnitsComponentController = (props) => {
  const {
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();
  const { postData } = useContext(ApiServiceContext);

  const onSubmit = async (data) => {
    const obj = {
      name: data?.name,
      symbol: data?.symbol,
    };
    try {
      const response = await postData(addUnitsApi, obj);
      if (response.code == 200) {
        successToast("Units Added successfully");
        navigate("/units");
      }else{
        errorToast(response?.data?.message)
      }
    } catch {
      return false;
    }
  };

  return (
    <AddUnitsContext.Provider
      value={{
        schema,
        onSubmit,
      }}
    >
      {props.children}
    </AddUnitsContext.Provider>
  );
};

export { AddUnitsContext, AddUnitsComponentController };
