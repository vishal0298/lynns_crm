/* eslint-disable react/prop-types */
import React, { useState, useEffect, useContext, createContext } from "react";
import { categoryApi } from "../../../../constans/apiname";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ApiServiceContext, successToast } from "../../../../core/core-index";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useImageUploader } from "../../hooks/useImageUploader";

const addcategoryPageschema = yup.object().shape({
  name: yup
    .string()
    .required("Enter Name"),
  slug: yup.string().max(20, "Maximum length exceeded").required("Enter Slug"),
});

const EditCategoryContext = createContext({
  addcategoryPageschema: addcategoryPageschema,
  onSubmit: () => {},
});

const EditCategoryComponentController = (props) => {
  const {
    // eslint-disable-next-line no-unused-vars
    formState: { errors },
  } = useForm({ resolver: yupResolver(addcategoryPageschema) });

  const [categoryDeatil, setCategoryDetail] = useState([]);
  const [fileImage, setFileImage] = useState([]);
  const [img, setImg] = useState("");
  const { selectedImage, handleImageUpload } = useImageUploader();
  const [newImg, setNewImg] = useState("");

  const { getData, putData } = useContext(ApiServiceContext);

  let { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getCategoryDetails();
  }, [id]);

  const getCategoryDetails = async () => {
    const url = `${categoryApi}/${id}`;
    try {
      const response = await getData(url);
      if (response?.data?.category_details) {
        setCategoryDetail(response?.data?.category_details);
      }
    } catch {
      return false;
    }
  };

  const onSubmit = async (data) => {
    const { name, slug, image } = data;
    // eslint-disable-next-line no-unused-vars
    const finalImage = fileImage?.[0];

    const formData = new FormData();
    formData.append("name", name);
    // formData.append("parent_Category", parent_Category);
    formData.append("slug", slug);
    // formData.append("image", newImg);
    formData.append("image", image?.[0] ? image?.[0] : categoryDeatil?.image);
    formData.append("type", "product");

    try {
      const response = await putData(
        "category" + "/" + categoryDeatil?._id,
        formData
      );
      if (response) {
        getCategoryDetails();
        // reset();
        successToast("Category Updated successfully");
        navigate("/category");
      }
    } catch {
      return false;
    }
  };
  return (
    <>
      <EditCategoryContext.Provider
        value={{
          addcategoryPageschema,
          categoryDeatil,
          setCategoryDetail,
          fileImage,
          setFileImage,
          img,
          setImg,
          selectedImage,
          handleImageUpload,
          newImg,
          setNewImg,
          getCategoryDetails,
          onSubmit,
        }}
      >
        {props.children}
      </EditCategoryContext.Provider>
    </>
  );
};

export { EditCategoryComponentController, EditCategoryContext };
