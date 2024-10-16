/* eslint-disable react/prop-types */
import React, { createContext, useEffect, useContext, useState } from "react";
import * as yup from "yup";
import { ApiServiceContext } from "../../../../core/API/api-service";
import {
  CompanysettingUpdate,
  CompanysettingView,
  successToast,
} from "../../../../core/core-index";
import { commonDatacontext } from "../../../../core/commonData";
import { setcommonData } from "../../../../constans/globals";
import { userRolesCheck } from "../../../../common/commonMethods";
import { CompanySettingschema } from './CompanySettingschema'

const CompanySettingsContext = createContext({
  CompanySettingschema: CompanySettingschema,
  updateCompanySettingsForm: () => {},
});

const CompanySettingsComponentController = (props) => {
  const { putData, getData } = useContext(ApiServiceContext);
  const {
    setcompanyData,
    setfavicon,
    setcompanyLogo,
    setcompanyTitle,
    setcompanyIcon,
  } = useContext(commonDatacontext);

  const [menu, setMenu] = useState(false);
  const toggleMobileMenu = () => setMenu(!menu);
  const [CompanySettings, setCompanySettingsInfos] = useState([]);
  const [imgerror, setImgError] = useState("");
  const [logoImgError, setlogoImgError] = useState("");

  const [imageError, setImageError] = useState("");
  const [binaryFile, setBinaryFile] = useState();
  const [iconError, setIconError] = useState("");
  const [binaryFavIcon, setBinaryFavIcon] = useState();
  const [fileImg, setFileImg] = useState(null);
  const [favIcon, setFavIcon] = useState(null);

  const [companyIcon, setCompanyIcon] = useState(null);
  const [companyIconError, setCompanyIconError] = useState("");
  const [companyError, setCompanyError] = useState("");
  const [binaryIcon, setBinaryIcon] = useState();

  // For Roles and Permissions
  const [permission, setPermission] = useState({});
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    getCompanySettingseData();
    let findModule = userRolesCheck("companySettings");
    if (findModule == "admin") {
      setAdmin(true);
    } else {
      setPermission(findModule);
    }
  }, []);
  // For Roles and Permissions

  const getCompanySettingseData = async () => {
    try {
      const response = await getData(CompanysettingView);
      if (response.code === 200) {
        setCompanySettingsInfos(response.data);
      }
      return response;
    } catch (error) {
      /* empty */
    }
  };

  // useEffect(() => {
  //   getCompanySettingseData();
  // }, []);
  const updateCompanySettingsForm = async (data) => {
   
    
    const formData = new FormData();
    // formData.append("companyAddress", data.companyAddress);
    formData.append("companyName", data.companyName);
    formData.append("addressLine1", data.addressLine1);
    formData.append("addressLine2", data.addressLine2);
    formData.append("city", data.city);
    formData.append("state", data.state);
    formData.append("country", data.country);
    formData.append("pincode", data.pincode);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    // formData.append(
    //   "siteLogo",
    //   data?.siteLogo?.[0] == undefined ? "" : data?.siteLogo?.[0]
    // );
    formData.append("siteLogo", binaryFile ? binaryFile : "");
    formData.append("favicon", binaryFavIcon ? binaryFavIcon : "");
    formData.append("companyLogo", binaryIcon ? binaryIcon : "");

    // formData.append(
    //   "favicon",
    //   data?.faviconLogo?.[0] == undefined ? "" : data?.faviconLogo?.[0]
    // );
    // formData.append("_id", CompanySettings?._id);

    try {
      const response = await putData(`${CompanysettingUpdate}`, formData);
      if (response.code === 200) {
        successToast("Company Details Updated Successfully");
        setCompanySettingsInfos(response?.data?.updatedData);
        setcommonData("companyData", {
          companyDetails: response?.data?.updatedData,
        });
        setcompanyData(response?.data?.updatedData);
        setfavicon(response?.data?.updatedData?.favicon);
        setcompanyLogo(response?.data?.updatedData?.siteLogo);
        setcompanyIcon(response?.data?.updatedData?.companyLogo);
        setcompanyTitle(response?.data?.updatedData?.companyName);
        //getCompanySettingseData()
      }
      return response;
    } catch (error) {
      /* empty */
    }
  };

  return (
    <CompanySettingsContext.Provider
      value={{
        CompanySettingschema,
        CompanySettings,
        menu,
        updateCompanySettingsForm,
        toggleMobileMenu,
        imgerror,
        setImgError,
        logoImgError,
        setlogoImgError,
        imageError,
        setImageError,
        binaryFile,
        setBinaryFile,
        iconError,
        setIconError,
        binaryFavIcon,
        setBinaryFavIcon,
        fileImg,
        setFileImg,
        favIcon,
        setFavIcon,
        companyIcon,
        setCompanyIcon,
        setCompanyIconError,
        companyIconError,
        companyError,
        setCompanyError,
        binaryIcon,
        setBinaryIcon,
        permission,
        admin,
      }}
    >
      {props.children}
    </CompanySettingsContext.Provider>
  );
};

export { CompanySettingsContext, CompanySettingsComponentController };
