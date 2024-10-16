/* eslint-disable react/prop-types */
import React, { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ApiServiceContext } from "../../../../core/API/api-service";
import { purchase_orders as purchase_orders_api } from "../../../../core/core-index";
const ViewpurchaseOrderContext = createContext({});

const ViewproductComponentController = (props) => {
  const { getData } = useContext(ApiServiceContext);
  const { View } = purchase_orders_api;
  const [menu, setMenu] = useState(false);
  const toggleMobileMenu = () => setMenu(!menu);
  const [dataSource, setDataSource] = useState([]);
  const [poData, setPurchaseOorderdata] = useState([]);
  const { id } = useParams();

  const getViewDetails = async () => {
    try {
      const viewPodata = await getData(`${View}/${id}`);
      if (viewPodata.code === 200) {
        setPurchaseOorderdata(viewPodata?.data);
        setDataSource(viewPodata?.data?.items);
      }
    } catch (error) {
      //
    }
  };

  useEffect(() => {
    getViewDetails();
  }, []);

  return (
    <ViewpurchaseOrderContext.Provider
      value={{ dataSource, menu, toggleMobileMenu, poData }}
    >
      {props.children}
    </ViewpurchaseOrderContext.Provider>
  );
};

export { ViewpurchaseOrderContext, ViewproductComponentController };
