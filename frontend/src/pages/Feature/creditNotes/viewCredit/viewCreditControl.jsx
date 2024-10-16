/* eslint-disable react/prop-types */
import React, { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ApiServiceContext } from "../../../../core/API/api-service";
import { productListapi, credit_note, unitsApi } from "../../../../core/core-index";
import { userRolesCheck } from "../../../../common/commonMethods";
const ViewCreditNotesContext = createContext({});

const ViewCreditNotesComponentController = (props) => {
  const { getData } = useContext(ApiServiceContext);
  const { View } = credit_note;
  const [dataSource, setDataSource] = useState([]);
  const [poData, setPurchaseOorderdata] = useState([]);
  const [unitsList, setUnitsList] = useState([]);
  const [productList, setProductList] = useState([]);
  const { id } = useParams();
  // For Roles and Permissions
  const [permission, setPermission] = useState({});
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    let findModule = userRolesCheck("purchaseOrder");

    if (findModule == "admin") {
      setAdmin(true);
    } else {
      setPermission(findModule);
    }
    getViewDetails();
    getUnitsList();
    getProductList();
  }, []);
  // For Roles and Permissions
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

  // useEffect(() => {
  //   getViewDetails();
  //   getUnitsList();
  //   getProductList();
  // }, []);

  const getUnitsList = async () => {
    try {
      const response = await getData(`${unitsApi}`);

      if (response) {
        setUnitsList(response?.data);
      }
    } catch {
      return false;
    }
  };
  const getProductList = async () => {
    try {
      const response = await getData(`${productListapi}`);

      if (response) {
        setProductList(response?.data);
      }
    } catch {
      return false;
    }
  };

  return (
    <ViewCreditNotesContext.Provider
      value={{
        dataSource,
        setDataSource,
        poData,
        unitsList,
        setUnitsList,
        setPurchaseOorderdata,
        admin,
        permission,
        setProductList,
        productList,
      }}
    >
      {props.children}
    </ViewCreditNotesContext.Provider>
  );
};

export { ViewCreditNotesContext, ViewCreditNotesComponentController };
