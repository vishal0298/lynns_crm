/* eslint-disable react/prop-types */
import React, { createContext, useContext, useState } from "react";
import { ApiServiceContext } from "../../../../core/API/api-service";
import { categoryApi, successToast } from "../../../../core/core-index";
import * as yup from "yup";
import { useNavigate } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import {addcategoryPageschema} from './AddCategoryschema'

const AddcategoryContext = createContext({
  addcategoryPageschema: addcategoryPageschema,

  SubmitCategoryForm: () => {},
});

const AddcategoryComponentController = (props) => {
  const { postData } = useContext(ApiServiceContext);
  const [menu, setMenu] = useState(false);
  const [fileImage, setFileImage] = useState([]);
  const [img, setImg] = useState("");

  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMenu(!menu);
  };
  const {
    handleSubmit,
    control,
    setValue,
    clearErrors,
    reset,
    watch,
    trigger,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addcategoryPageschema),
  });
  const UploadImagefiles = fileImage.map((file, i) => (
    <div key={file?.path}>
      <label>{file?.name ? file?.name : file?.filename}</label>
    </div>
  ));

  const SubmitCategoryForm = async (data) => {
    const { name, slug, image } = data;
   
    const finalImage = fileImage?.[0];

    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("image", image?.[0] == undefined ? "" : image?.[0]);
    formData.append("type", "product");
    try {
      
      const response = await postData(categoryApi, formData);
      reset();
      successToast("Category Added successfully");
      navigate("/category");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AddcategoryContext.Provider
      value={{
        addcategoryPageschema,
        SubmitCategoryForm,
        fileImage,
        menu,
        setFileImage,
        toggleMobileMenu,
        watch,
        img,
        setImg,
        UploadImagefiles,
        handleSubmit,
        control,
        setValue,
        clearErrors,
        reset,
        trigger,
        register,
        formState: { errors },
      }}
    >
      {props.children}
    </AddcategoryContext.Provider>
  );
};

export { AddcategoryContext, AddcategoryComponentController };
