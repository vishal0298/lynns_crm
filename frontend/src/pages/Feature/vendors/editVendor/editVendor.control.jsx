/* eslint-disable react/prop-types */
import React, { createContext, useContext, useEffect, useState } from "react";
import * as yup from "yup";
import { ApiServiceContext } from "../../../../core/API/api-service";
import { viewVendor, updateVendor, successToast, errorToast } from "../../../../core/core-index";
import { useNavigate, useParams } from "react-router-dom";

const editvendorPageschema = yup.object().shape({
  vendor_name: yup.string().required("Enter Vendor Name"),
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
});

const EditvendorContext = createContext({
  editvendorPageschema: editvendorPageschema,

  EditSubmitForm: () => {},
});

const EditvendorComponentController = (props) => {
  const { getData, putData } = useContext(ApiServiceContext);
  const [vendorDetails, setVendorDetails] = useState([]);
  const navigate = useNavigate();
  const [radio1, setRadio1] = useState(false);
  const [radio2, setRadio2] = useState(false);

  let { id } = useParams();

  const getVendorDetails = async () => {
    const url = `${viewVendor}/${id}`;
    const response = await getData(url);
    if (response?.data) {
      setVendorDetails(response?.data);
    }
  };

  const EditSubmitForm = async (data) => {
    const obj = {
      vendor_name: data?.vendor_name,
      vendor_email: data?.vendor_email,
      vendor_phone: data?.vendor_phone,
      balance: data?.balance ? data?.balance : 0,
      balanceType: data?.balanceType,
    };
    const url = `${updateVendor}/${vendorDetails?._id}`;
    const response = await putData(url, obj);
    if (response.code == 200) {
      successToast("Vendor edited successfully");
      getVendorDetails();
      navigate("/vendors");
    }else{
      errorToast(response?.data?.message)
    }
  };

  useEffect(() => {
    getVendorDetails();
  }, []);

  return (
    <EditvendorContext.Provider
      value={{
        editvendorPageschema,
        vendorDetails,
        EditSubmitForm,
        radio2,
        radio1,
        setRadio2,
        setRadio1,
      }}
    >
      {props.children}
    </EditvendorContext.Provider>
  );
};

export { EditvendorContext, EditvendorComponentController };
