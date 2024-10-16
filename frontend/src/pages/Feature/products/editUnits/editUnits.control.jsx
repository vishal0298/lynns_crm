/* eslint-disable react/prop-types */
import React, { useState, useEffect, useContext, createContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { unitsApi, viewUnitsApi } from "../../../../constans/apiname";
import { useForm } from "react-hook-form";
import { ApiServiceContext, errorToast, successToast } from "../../../../core/core-index";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

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

const EditUnitsContext = createContext({
  schema: schema,
  onSubmit: () => {},
});

const EditUnitsComponentController = (props) => {
  const {
    // eslint-disable-next-line no-unused-vars
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [unitEdit, setUnitDetails] = useState([]);
  let { id } = useParams();

  const { getData, putData } = useContext(ApiServiceContext);

  const navigate = useNavigate();

  useEffect(() => {
    getUnitsDetails();
  }, []);

  const getUnitsDetails = async () => {
    try {
      const response = await getData(`${unitsApi}`);
      if (response) {
        // eslint-disable-next-line no-undef
        setUnitsData(response?.data);
      }
    } catch {
      return false;
    }
  };

  useEffect(() => {
    getUnitsEditDetails();
  }, [id]);

  const getUnitsEditDetails = async () => {
    const url = `${viewUnitsApi}/${id}`;
    try {
      const response = await getData(url);
      if (response?.data) {
        setUnitDetails(response?.data);
      }
    } catch {
      return false;
    }
  };

  const onSubmit = async (data) => {
    const obj = {
      name: data?.name,
      symbol: data?.symbol,
    };
    try {
      const response = await putData("units" + "/" + unitEdit?._id, obj);
      if (response.code == 200) {
        getUnitsDetails();
        successToast("Units Updated successfully");
        navigate("/units");
      }else{
        errorToast(response?.data?.message)
      }
    } catch {
      return false;
    }
  };
  return (
    <>
      <EditUnitsContext.Provider
        value={{
          schema,
          unitEdit,
          setUnitDetails,
          getUnitsDetails,
          getUnitsEditDetails,
          onSubmit,
        }}
      >
        {props.children}
      </EditUnitsContext.Provider>
    </>
  );
};

export { EditUnitsComponentController, EditUnitsContext };
