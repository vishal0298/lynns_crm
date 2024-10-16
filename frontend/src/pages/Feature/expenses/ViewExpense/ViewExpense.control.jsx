/* eslint-disable react/prop-types */
import React, { useState, useEffect, createContext } from "react";
const ViewExpenseContext = createContext({});

const ViewExpenseComponentController = (props) => {
  const [imgerror, setImgError] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [contentEditor, setContentEditor] = useState("");

  useEffect(() => {
    let elements = Array.from(
      document.getElementsByClassName("react-datepicker-wrapper")
    );
    elements.map((element) => element.classList.add("width-100"));
  }, []);

  return (
    <ViewExpenseContext.Provider
      value={{
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
    </ViewExpenseContext.Provider>
  );
};
export { ViewExpenseContext, ViewExpenseComponentController };
