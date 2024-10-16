/* eslint-disable react/prop-types */
import React, { useState, useEffect, useContext, createContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ApiServiceContext, errorToast, successToast } from "../../../../core/core-index";
import { staffApi, viewStaffApi } from "../../../../constans/apiname"; // Updated API paths

// Updated schema for staff details
const schema = yup.object().shape({
name: yup
    .string()
    .required("Enter Staff Name")
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

const EditStaffContext = createContext({
  schema: schema,
  onSubmit: () => {},
});

const EditStaffComponentController = (props) => {
  const {
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [staffEdit, setStaffDetails] = useState([]);
  let { id } = useParams();

  const { getData, putData } = useContext(ApiServiceContext);

  const navigate = useNavigate();

  useEffect(() => {
    console.log('hello');
    getStaffDetails();
  }, []);

  const getStaffDetails = async () => {
    try {
      const response = await getData(`${staffApi}`);
      console.log(response?.data[0])
      if (response) {
        // eslint-disable-next-line no-undef
        setStaffDetails(response?.data[0]);
      }
    } catch {
      return false;
    }
  };

  useEffect(() => {
    getStaffEditDetails();
  }, [id]);

  const getStaffEditDetails = async () => {
    const url = `${viewStaffApi}/${id}`;
    try {
      const response = await getData(url);
      if (response?.data) {
        setStaffDetails(response?.data?.staff_details);
      }

      console.log(response?.data?.staff_details)
    } catch {
      return false;
    }
  };

  const onSubmit = async (data) => {
    const obj = {
      staffName: data?.staffName,
      employeeId: data?.employeeId,
      mobileNumber: data?.mobileNumber,
    };
    try {
      const response = await putData("staff" + "/" + staffEdit?._id, obj);
      if (response.code == 200) {
        getStaffDetails();
        successToast("Staff details updated successfully");
        navigate("/staff");
      } else {
        errorToast(response?.data?.message);
      }
    } catch {
      return false;
    }
  };

  return (
    <>
      <EditStaffContext.Provider
        value={{
          schema,
          staffEdit,
          setStaffDetails,
          getStaffDetails,
          getStaffEditDetails,
          onSubmit,
        }}
      >
        {props.children}
      </EditStaffContext.Provider>
    </>
  );
};

export { EditStaffComponentController, EditStaffContext };
