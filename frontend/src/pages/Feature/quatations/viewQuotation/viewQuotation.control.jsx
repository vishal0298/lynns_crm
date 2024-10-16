/* eslint-disable react/prop-types */
import React, { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ApiServiceContext,
  productListapi,
  quotation,
  unitsApi,
} from "../../../../core/core-index";

const ViewQuotationContext = createContext({});

const ViewQuotationComponentController = (props) => {
  const { getData } = useContext(ApiServiceContext);
  const { View } = quotation;
  const [dataSource, setDataSource] = useState([]);
  const [poData, setPurchaseOorderdata] = useState([]);
  const [unitsList, setUnitsList] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const { id } = useParams();

  const getViewDetails = async () => {
    try {
      const viewPodata = await getData(`${View}/${id}`);
      if (viewPodata.code === 200) {
        setPurchaseOorderdata(viewPodata?.data);
        setDataSource(viewPodata?.data?.items);
      }
    } catch (error) {
      /* empty */
    }
  };

  useEffect(() => {
    getViewDetails();
    getUnitsList();
    getProductsList();
  }, []);

  const getUnitsList = async () => {
    try {
      const response = await getData(`${unitsApi}`);
      if (response) {
        setUnitsList(response?.data);
      }
    } catch {
      /* empty */
    }
  };

  const getProductsList = async () => {
    try {
      const response = await getData(`${productListapi}`);
      if (response) {
        setProductsList(response?.data);
      }
    } catch {
      /* empty */
    }
  };

  return (
    <ViewQuotationContext.Provider
      value={{
        dataSource,
        poData,
        setDataSource,
        setPurchaseOorderdata,
        unitsList,
        setUnitsList,
        getUnitsList,
        getViewDetails,
        getProductsList,
        productsList,
      }}
    >
      {props.children}
    </ViewQuotationContext.Provider>
  );
};

export { ViewQuotationContext, ViewQuotationComponentController };
