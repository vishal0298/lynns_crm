/* eslint-disable react/prop-types */
import React, { createContext, useContext, useState } from "react";
import * as yup from "yup";
import { useNavigate } from "react-router";
import { ApiServiceContext } from "../../../../core/API/api-service";
import { addVendor, errorToast, successToast } from "../../../../core/core-index";

const addvendorPageschema = yup
  .object()
  .shape({
    vendor_name: yup
      .string()
      .notOneOf(
        ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
        "Name cannot Contain Numbers"
      )
      .required("Enter Vendor Name"),
    vendor_email: yup
      .string()
      .email("Email Must Be a Valid Email")
      .required("Enter Vendor Email ID"),
    vendor_phone: yup
      .string()
      .required("Enter Phone number")
      .min(10, "Phone Number Must Be At Least 10 Digits")
      .max(15, "Phone Number Must Be At Most 15 Digits")
      .matches(/^\+?[1-9]\d*$/, "Invalid phone number"),
    balance: yup.string(),
    balanceType: yup.string().when("balance", {
      is: (balance) => balance && balance.trim() !== "",
      then: yup.string().required("Mode is Required"),
      otherwise: yup.string(),
    }),
  })
  .required();

const AddvendorContext = createContext({
  addvendorPageschema: addvendorPageschema,

  SubmitVendorForm: () => {},
});

const AddvendorComponentController = (props) => {
  const { postData } = useContext(ApiServiceContext);
  const navigate = useNavigate();
  const [radio1, setRadio1] = useState(false);
  const [radio2, setRadio2] = useState(false);

  const SubmitVendorForm = async (data) => {
    const obj = {
      vendor_name: data?.vendor_name,
      vendor_email: data?.vendor_email,
      vendor_phone: data?.vendor_phone,
      balance: data?.balance ? data?.balance : 0,
      balanceType: data?.balanceType,
    };
    try {
      const response = await postData(addVendor, obj);
      if (response.code == 200) {
        successToast("Vendor Added successfully");
        setRadio1(false);
        setRadio2(false);
        navigate("/vendors");
      }else{
        errorToast(response?.data?.message)
      }
    } catch {
      /* empty */
    } finally {
      /* empty */
    }
  };

  return (
    <AddvendorContext.Provider
      value={{
        addvendorPageschema,
        SubmitVendorForm,
        radio2,
        radio1,
        setRadio2,
        setRadio1,
      }}
    >
      {props.children}
    </AddvendorContext.Provider>
  );
};

export { AddvendorContext, AddvendorComponentController };
