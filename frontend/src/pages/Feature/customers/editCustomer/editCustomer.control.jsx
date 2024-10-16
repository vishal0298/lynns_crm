import React, { createContext, useContext, useEffect, useState } from "react";
import {
  listcustomerApi,
  updatecustomerApi,
  viewCustomerApi,
} from "../../../../constans/apiname";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { ApiServiceContext, errorToast, successToast } from "../../../../core/core-index";
import { yupResolver } from "@hookform/resolvers/yup";
import { PreviewImg } from "../../../../common/imagepath";
import {editCustomerschema} from './editCustomerschema';


const EditCustomerContext = createContext({
  editCustomerschema: editCustomerschema,
  onSubmit: (data) => {},
});

const EditCustomerComponentController = (props) => {
  const {
    handleSubmit,
    control,
    setValue,
    clearErrors,
    reset,
    trigger,
    formState: { errors },
  } = useForm({ resolver: yupResolver() });

  const { getData, postData, patchData, putData, deleteData } =
    useContext(ApiServiceContext);
  const [fileImage, setFileImage] = useState([]);
  const [customerListData, setCustomerEditlist] = useState("");
  const [file, setFile] = useState(null);

  const navigate = useNavigate();

  let { id } = useParams();
  let _id = id;

  const onSubmit = async (data) => {
    const image = fileImage?.[0];

    const formData = new FormData();
   
    formData.append("image", image ? image : "remove");

    // ;
    const flattenObject = (obj, prefix = "") => {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const propKey = prefix ? `${prefix}[${key}]` : key;
          const value = obj[key];

          if (typeof value === "object" && value !== null) {
            flattenObject(value, propKey);
          } else {
            formData.append(propKey, value);
          }
        }
      }
    };

    formData.append("_id", _id);
    flattenObject(data);
    try {
      const response = await putData(updatecustomerApi, formData);
      if (response.code == 200) {
        successToast("Customer Updated  Successfully");
        navigate("/customers");
      }else{
        errorToast(response?.data?.message)
      }
    } catch {}
  };

  const [currencyOptions, setcurrencyOptions] = useState([
    { id: 1, text: "₹" },
    { id: 2, text: "$" },
    { id: 3, text: "£" },
    { id: 4, text: "€" },
  ]);

  const getBase64 = (file) => {
    return new Promise((resolve) => {
      let fileInfo;
      let baseURL = "";
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        baseURL = reader.result;
        resolve(baseURL);
      };
    });
  };

  const handleImageError = (event) => {
    // event.target.src = "fd81bd24259926e384cfb88c2301d548.png";
    return PreviewImg;
  };
  return (
    <>
      <EditCustomerContext.Provider
        value={{
          editCustomerschema,
          fileImage,
          setFileImage,
          customerListData,
          setCustomerEditlist,
          onSubmit,
          currencyOptions,
          setcurrencyOptions,
          getBase64,
          handleImageError,
          file,
          setFile,
        }}
      >
        {props.children}
      </EditCustomerContext.Provider>
    </>
  );
};
export { EditCustomerComponentController, EditCustomerContext };
