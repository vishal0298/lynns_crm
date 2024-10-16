/* eslint-disable react/prop-types */
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ApiServiceContext,
  dropdown_api,
  errorToast,
  successToast,
  usersApi,
} from "../../../../core/core-index";
import { useDropzone } from "react-dropzone";
import { PreviewImg } from "../../../../common/imagepath";
const EditUserContext = createContext({
  onSubmit: () => {},
});
const EditUserComponentController = (props) => {
  const [fileImage, setFileImage] = useState([]);
  const [singleUser, setSingleUser] = useState([]);
  const { getData, putData } = useContext(ApiServiceContext);
  const [previewImage, setPreviewImage] = useState("");
  const { id } = useParams();

  const { getRootProps, getInputProps } = useDropzone({
    maxLength: 4,
    onDrop: (acceptedFile) => {
      setFileImage(acceptedFile);
      getBase64(acceptedFile?.[0]).then((result) => {
        acceptedFile["base64"] = result;
        setPreviewImage(acceptedFile.base64);
      });
    },
  });

  const getBase64 = (file) => {
    return new Promise((resolve) => {
      let baseURL = "";
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        baseURL = reader.result;
        resolve(baseURL);
      };
    });
  };

  const [role, setRole] = useState([]);
  useEffect(() => {
    getUser();
    getRoles();
  }, [id]);

  const getUser = async () => {
    const url = `${usersApi?.View}/${id}`;
    try {
      const response = await getData(url);
      if (response?.data) {
        setSingleUser(response?.data?.user_details);
      }
      // ;
    } catch {
      return false;
    }
  };

  const getRoles = async () => {
    const rolesList = await getData(dropdown_api?.role_api);
    const newList = rolesList?.data
      ?.filter((item) => !(item.roleName?.toLowerCase() == "super admin"))
      ?.map((item) => {
        return prepareLabel(item);
      });
    setRole(newList);
  };
  const prepareLabel = (item) => {
    return { value: item.roleName, label: item.roleName, id: item._id };
  };

  const [status, setStatus] = useState([
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
  ]);

  const navigate = useNavigate();

  const onSubmit = async (submittedData) => {
    const formData = new FormData();
    const image = fileImage?.[0];
    formData.append(
      "image",
      image ? image : fileImage ? singleUser?.image : "remove"
    );
    formData.append("firstName", submittedData?.firstName);
    formData.append("lastName", submittedData?.lastName);
    formData.append("userName", submittedData?.userName);
    formData.append("email", submittedData?.email);
    formData.append(
      "mobileNumber",
      submittedData?.mobileNumber == undefined
        ? ""
        : submittedData?.mobileNumber
    );
    formData.append("role", submittedData?.role?.value);
    formData.append("status", submittedData?.status?.value);

    const successResponse = await putData(
      `${usersApi?.Update}/${id}`,
      formData
    );
    if (successResponse.code == 200) {
      successToast("User Updated Successfully");
      navigate("/users");
    }else{
      errorToast(successResponse?.data?.message)
    }
  };
  const handleImageError = (event) => {
    event.target.src = PreviewImg;
  };

  return (
    <EditUserContext.Provider
      value={{
        fileImage,
        setFileImage,
        previewImage,
        setPreviewImage,
        getRootProps,
        getInputProps,
        getBase64,
        role,
        setRole,
        status,
        setStatus,
        onSubmit,
        getRoles,
        prepareLabel,
        singleUser,
        handleImageError,
      }}
    >
      {props.children}
    </EditUserContext.Provider>
  );
};

export { EditUserContext, EditUserComponentController };
