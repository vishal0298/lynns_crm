/* eslint-disable react/prop-types */
import React, { useState, useEffect, useContext, createContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ApiServiceContext,
  errorToast,
  expenses,
  successToast,
} from "../../../../core/core-index";
const EditExpenseContext = createContext({
  onSubmit: () => {},
});

const EditExpenseComponentController = (props) => {
  const [imgerror, setImgError] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const { putData } = useContext(ApiServiceContext);
  const navigate = useNavigate();
  const urlId = useParams();
  const [date, setDate] = useState(new Date());
  const [contentEditor, setContentEditor] = useState("");

  const onSubmit = async (submittedData) => {
    const formData = new FormData();
    formData.append("_id", urlId?.id);
    formData.append("reference", submittedData?.reference);
    formData.append("amount", submittedData?.amount);
    formData.append("paymentMode", submittedData?.paymentMode?.value);
    formData.append("expenseDate", startDate);
    formData.append("description", submittedData?.description);
    formData.append("status", submittedData?.status?.value);
    formData.append(
      "attachment",
      submittedData?.attachment?.[0] == undefined
        ? ""
        : submittedData?.attachment?.[0]
    );
    const url = `${expenses?.Update}/${urlId?.id}`;
    const successResponse = await putData(url, formData);
    if (successResponse.code == 200) {
      navigate("/expenses");
      successToast("Expenses Updated Successfully");
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
    <EditExpenseContext.Provider
      value={{
        onSubmit,
        contentEditor,
        setContentEditor,
        date,
        setDate,
        imgerror,
        setImgError,
        startDate,
        setStartDate,
      }}
    >
      {props.children}
    </EditExpenseContext.Provider>
  );
};
export { EditExpenseContext, EditExpenseComponentController };
