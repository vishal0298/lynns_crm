/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useContext, createContext } from "react";
import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { expenseSchema } from "../../../../common/schema";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  ApiServiceContext,
  errorToast,
  expenses,
  successToast,
} from "../../../../core/core-index";
import dayjs from "dayjs";

const AddExpenseContext = createContext({
  onSubmit: () => {},
});

const AddExpenseComponentController = (props) => {
  const { postData } = useContext(ApiServiceContext);
  const [num, setNum] = useState("");
  const navigate = useNavigate();

  const [contentEditor, setContentEditor] = useState("");

  const {
    formState: { errors },
  } = useForm({
    resolver: yupResolver(expenseSchema),
  });

  const onSubmit = async (submittedData) => {
    const formData = new FormData();
    formData.append(
      "reference",
      submittedData?.reference == undefined ? "" : submittedData?.reference
    );
    formData.append("amount", submittedData?.amount);
    formData.append("expenseId", num);
    formData.append("paymentMode", submittedData?.paymentMode?.value);
    formData.append("expenseDate", dayjs(submittedData?.expenseDate).toDate());
    formData.append("status", submittedData?.status?.value);
    formData.append(
      "attachment",
      submittedData?.attachment?.[0] == undefined
        ? ""
        : submittedData?.attachment?.[0]
    );
    formData.append("description", submittedData?.description);

    const successResponse = await postData(expenses?.Add, formData);
    if (successResponse.code == 200) {
      successToast("Expenses added Successfully");
      navigate("/expenses");
    }else{
      errorToast(successResponse?.data?.message)
    }
  };

  useEffect(() => {
    let elements = Array.from(
      document.getElementsByClassName("react-datepicker-wrapper")
    );
    elements.map((element) => element.classList.add("width-100"));
  }, []);

  return (
    <AddExpenseContext.Provider
      value={{
        onSubmit,
        contentEditor,
        setContentEditor,
        num,
        setNum,
      }}
    >
      {props.children}
    </AddExpenseContext.Provider>
  );
};
export { AddExpenseContext, AddExpenseComponentController };
