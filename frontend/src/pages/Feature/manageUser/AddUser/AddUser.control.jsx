/* eslint-disable react/prop-types */
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  ApiServiceContext,
  dropdown_api,
  errorToast,
  successToast,
  usersApi,
} from "../../../../core/core-index";
import { useDropzone } from "react-dropzone";
import { userSchema } from "../../../../common/schema";

const AddUserContext = createContext({
  onSubmit: () => {},
});
const AddUserComponentController = (props) => {
  const [menu, setMenu] = useState(false);

  const [fileImage, setFileImage] = useState([]);

  const [previewImage, setPreviewImage] = useState("");

  const { getRootProps, getInputProps } = useDropzone({
    maxLength: 4,
    onDrop: (acceptedFile) => {
      // setValue("images", acceptedFile)
      setFileImage(acceptedFile);
      getBase64(acceptedFile?.[0]).then((result) => {
        acceptedFile["base64"] = result;
        setPreviewImage(acceptedFile.base64);
      });
    },
  });

  const getBase64 = (file) => {
    return new Promise((resolve) => {
      // eslint-disable-next-line no-unused-vars
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

  const {
    // eslint-disable-next-line no-unused-vars
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userSchema),
  });

  const [role, setRole] = useState([]);

  const [status, setStatus] = useState([
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
  ]);

  const { postData, getData } = useContext(ApiServiceContext);
  const navigate = useNavigate();

  const onSubmit = async (submittedData) => {
    const formData = new FormData();
    // formData.append("expenseId", "234");
    const image = fileImage?.[0];
    formData.append("image", image ? image : "");
    formData.append("firstName", submittedData?.firstName);
    formData.append("lastName", submittedData?.lastName);
    formData.append(
      "userName",
      submittedData?.userName ? submittedData?.userName : ""
    );
    formData.append("email", submittedData?.email);
    formData.append(
      "mobileNumber",
      submittedData?.mobileNumber?.length > 0 ? submittedData?.mobileNumber : ""
    );
    formData.append("role", submittedData?.role?.value);
    formData.append("password", submittedData?.password);
    formData.append("status", submittedData?.status?.value);

    const successResponse = await postData(usersApi?.Add, formData);
    if (successResponse.code == 200) {
      successToast("User added Successfully");
      navigate("/users");
    }else{
      errorToast(successResponse?.data?.message)
    }

  };

 
  useEffect(() => {
    getRoles();
  }, []);

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

  return (
    <AddUserContext.Provider
      value={{
        menu,
        setMenu,
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
      }}
    >
      {props.children}
    </AddUserContext.Provider>
  );
};
export { AddUserContext, AddUserComponentController };
