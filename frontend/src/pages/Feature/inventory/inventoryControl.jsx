/* eslint-disable react/prop-types */
import React, { createContext, useContext, useState } from "react";
import { ApiServiceContext } from "../core/API/api-service";
import { inventoryAddStock, inventoryList } from "../core/core-index";
import { useNavigate } from "react-router-dom";
import { errorToast } from "../../../core/core-index";

const AddInventoryContext = createContext({
  onSubmit: async () => {},
  AddStockDetails: async () => {},
});

const AddInventoryComponentController = ({ children }) => {
  const navigate = useNavigate();
  const { postData, getData } = useContext(ApiServiceContext);
  // eslint-disable-next-line no-unused-vars
  const [inventory, setInventoryEdit] = useState({});

  const onSubmit = async (data) => {
    const obj = {
      name: data?.productId,
      quantity: data?.quantity,
      units: data?.units,
      notes: data?.notes,
    };
    try {
      const response = await postData(inventoryAddStock, obj);
      if (response.code == 200) {
        navigate("/inventory");
      }else{
        errorToast(response?.data?.message)
      }
    } catch {
      return false;
    }
  };

  const AddStockDetails = async (id) => {
    const url = `${inventoryList}/${id}`;
    try {
      const response = await getData(url);
      if (response?.data?.ledger_details) {
        setInventoryEdit(response?.data?.ledger_details);
      }
    } catch {
      return false;
    }
  };

  return (
    <AddInventoryContext.Provider value={{ onSubmit, AddStockDetails }}>
      {children}
    </AddInventoryContext.Provider>
  );
};
export { AddInventoryContext, AddInventoryComponentController };
