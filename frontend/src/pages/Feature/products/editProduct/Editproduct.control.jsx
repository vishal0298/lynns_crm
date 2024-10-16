/* eslint-disable react/prop-types */
import React, { createContext, useEffect, useContext, useState } from "react";
import * as yup from "yup";
import { ApiServiceContext } from "../../../../core/API/api-service";
import {
  productupdateapi,
  dropdown_api,
  productViewapi,
  successToast,
  warningToast,
} from "../../../../core/core-index";
import { useParams, useNavigate } from "react-router-dom";

const EditproductPageschema = yup
  .object()
  .shape({
    discountType: yup.object({
      id: yup.string().required("Choose discount type"),
    }),
    discountValue: yup
      .number()
      .typeError("Discount Value is Required")
      .when(
        ["discountType", "sellingPrice"],
        (discountType, sellingPrice, schema) => {
          if (discountType.text === "Percentage") {
            return schema.max(99, "Discount Value Must Be Less Than 100");
          } else if (discountType.text === "Fixed") {
            return schema.lessThan(
              sellingPrice,
              "Discount Value Must Be Less Than The Selling Price"
            );
          }
          return schema;
        }
      ),
    tax: yup.object({
      _id: yup.string().required("Enter Tax"),
    }),
    units: yup.object({
      _id: yup.string().required("Choose Unit"),
    }),
    category: yup.object({
      _id: yup.string().required("Choose Category"),
    }),
    type: yup.string().typeError("Choose Any Type"),
    name: yup.string().required("Enter Product Name"),
    sku: yup.number().typeError("SKU Must Be a Number"),
    sellingPrice: yup
      .number()
      .test(
        (value) => typeof value === "number" && !/[eE+-]/.test(value.toString())
      )
      .positive("Selling Price Must Be a Positive Number")
      .integer("Selling Price Must Be a Integer")
      .typeError("Enter Valid Selling Price")
      .required("Selling price is required")
      .moreThan(
        yup.ref("purchasePrice"),
        "Selling Price Must Be Greater Than The Purchase Price"
      ),
    purchasePrice: yup
      .number()
      .test(
        (value) => typeof value === "number" && !/[eE+-]/.test(value.toString())
      )
      .positive("Purchase Price Must Be a Positive Number")
      .integer("Purchase Price Must Be a Integer")
      .typeError("Enter valid Purchase Price"),
    // barcode: yup.number().typeError("Enter Barcode"),
    alertQuantity: yup
      .number()
      .typeError("Enter Alert Quantity")
      .positive("Alert Quantity Mst Be a Positive Number")
      .integer("Alert Quantity Must Be a Integer"),
  })
  .required();

const EditproductContext = createContext({
  EditproductPageschema: EditproductPageschema,
  UpdateForm: () => {},
});

const EditproductComponentController = (props) => {
  const { getData, putData } = useContext(ApiServiceContext);
  const [menu, setMenu] = useState(false);
  const [contentEditor, setContentEditor] = useState("");
  const navigate = useNavigate();
  const [productValues, setProductvalues] = useState([]);
  const [skuNumber, setskuNumber] = useState("");
  const [categoryData, setCategory] = useState([]);
  const toggleMobileMenu = () => setMenu(!menu);
  const [imgerror, setImgError] = useState("");
  const { id } = useParams();

  const getskuCode = async () => {
    try {
      const skuCoderes = await getData("/products/generateSKU", false);
      if (skuCoderes.code === 200) {
        setskuNumber(skuCoderes.data);
      }
    } catch (error) {
      //
    }
  };

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

  const getProductDetails = async () => {
    const url = `${productViewapi}/${id}`;
    try {
      const response = await getData(url);
      if (response.code === 200) {
        setProductvalues(response?.data);
        setContentEditor(response?.data?.productDescription);
      }
    } catch {
      return false;
    }
  };

  useEffect(() => {
    getProductDetails();
    getmasterDetails();
  }, []);

  const UpdateForm = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("type", data.type);
    formData.append("sku", data.sku);
    formData.append("discountValue", data.discountValue);
    formData.append("barcode", data.barcode);
    formData.append("units", data.units?._id);
    formData.append("category", data.category?._id);
    formData.append("sellingPrice", data.sellingPrice);
    formData.append("purchasePrice", data.purchasePrice);
    formData.append("discountType", data.discountType?.id);
    formData.append("alertQuantity", data.alertQuantity);
    formData.append("tax", data.tax?._id == undefined ? "" : data.tax?._id);
    formData.append("productDescription", contentEditor);
    formData.append(
      "images",
      data.images?.[0] == undefined ? "" : data.images?.[0]
    );
    formData.append("_id", id);

    try {
      const response = await putData(`${productupdateapi}/${id}`, formData);
      if (response.code == 200) {
        successToast("Product Updated Successfully");
        navigate("/product-list");
      }
    } catch (err) {
      //
    }
  };

  const handleKeyPress = (event) => {
    const keyCode = event.keyCode || event.which;
    const keyValue = String.fromCharCode(keyCode);

    if (!/^[a-zA-Z]+$/.test(keyValue)) {
      event.preventDefault();
    }
  };

  useEffect(() => {
    if (imgerror) {
      warningToast(imgerror);
      setImgError("");
    }
  }, [imgerror]);

  const [taxData, setTax] = useState([]);

  const [units, setUnits] = useState([]);

  // eslint-disable-next-line no-unused-vars
  const [discount, setDiscount] = useState([
    { id: 2, text: "Percentage" },
    { id: 3, text: "Fixed" },
  ]);

  return (
    <EditproductContext.Provider
      value={{
        EditproductPageschema,
        getskuCode,
        setskuNumber,
        skuNumber,
        productValues,
        contentEditor,
        setContentEditor,
        menu,
        UpdateForm,
        handleKeyPress,
        toggleMobileMenu,
        discount,
        units,
        taxData,
        categoryData,
        imgerror,
        setImgError,
      }}
    >
      {props.children}
    </EditproductContext.Provider>
  );
};

export { EditproductContext, EditproductComponentController };
