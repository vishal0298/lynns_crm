/* eslint-disable react/prop-types */
import React, { createContext, useContext, useEffect, useState } from "react";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { ApiServiceContext } from "../../../../core/API/api-service";
import {
  addproductApi,
  successToast,
  dropdown_api,
} from "../../../../core/core-index";
import {addproductPageschema} from './Addproductschema'

const AddproductContext = createContext({
  addproductPageschema: addproductPageschema,
  submitaddProductForm: () => {},
});

const AddproductComponentController = (props) => {
  const { postData, getData } = useContext(ApiServiceContext);
  const [menu, setMenu] = useState(false);

  const [contentEditor, setContentEditor] = useState("");
  const toggleMobileMenu = () => setMenu(!menu);

  const navigate = useNavigate();

  const submitaddProductForm = async (data) => {
    const formData = new FormData();
    formData.append("type", data.type);
    formData.append("name", data.name);
    formData.append("sku", data.sku);
    formData.append(
      "discountValue",
      data.discountValue ? data.discountValue : 0
    );
    formData.append("barcode", data.barcode);
    formData.append("units", data.units?._id);
    formData.append("category", data.category?._id);
    formData.append("sellingPrice", data.sellingPrice);
    formData.append("purchasePrice", data.purchasePrice);
    formData.append("units", data.units);
    formData.append(
      "discountType",
      data.discountType?.id == undefined ? "" : data.discountType?.id
    );
    formData.append("alertQuantity", data.alertQuantity);
    formData.append("tax", data.tax?._id == undefined ? "" : data.tax?._id);
    formData.append("productDescription", contentEditor);
    formData.append(
      "images",
      data.images[0] == undefined ? "" : data.images[0]
    );
    try {
      const response = await postData(addproductApi, formData);
      if (response.code === 200) {
        successToast("Product Added successfully");
        navigate("/product-list");
      }
      return response;
    } catch (error) {
      return false;
    }
  };

  const handleKeyPress = (event) => {
    const keyCode = event.keyCode || event.which;
    const keyValue = String.fromCharCode(keyCode);
    if (!/^[a-zA-Z]+$/.test(keyValue)) {
      event.preventDefault();
    }
  };

  const [taxData, setTax] = useState([]);
  const [units, setUnits] = useState([]);
  const [categoryData, setCategory] = useState([]);
  const [discount, setDiscount] = useState([
    { id: 2, text: "Percentage" },
    { id: 3, text: "Fixed" },
  ]);

  const getmasterDetails = async () => {
    try {
      const Unitresponse = await getData(dropdown_api.unit_api);
      if (Unitresponse.code === 200) {
        setUnits(Unitresponse?.data);
      }

      const categoryRes = await getData(dropdown_api.category_api);
      if (categoryRes.code === 200) {
        setCategory(categoryRes?.data);
      }

      const Taxresponse = await getData(dropdown_api.tax_api);
      if (Taxresponse.code === 200) {
        setTax(Taxresponse?.data);
      }
    } catch (error) {
      //
    }
  };

  useEffect(() => {
    getmasterDetails();
  }, []);

  return (
    <AddproductContext.Provider
      value={{
        addproductPageschema,
        setContentEditor,
        contentEditor,
        menu,
        submitaddProductForm,
        handleKeyPress,
        toggleMobileMenu,
        discount,
        units,
        taxData,
        categoryData,
      }}
    >
      {props.children}
    </AddproductContext.Provider>
  );
};

export { AddproductContext, AddproductComponentController };
