/* eslint-disable react/prop-types */
import React, { createContext, useEffect, useContext, useState } from "react";
import * as yup from "yup";
import { ApiServiceContext } from "../../../../core/API/api-service";
import {
  AccountSettingsview,
  AccountSettingsupdate,
  successToast,
} from "../../../../core/core-index";
import { commonDatacontext } from "../../../../core/commonData";
import { setcommonData } from "../../../../constans/globals";
import dayjs from "dayjs";
import { userRolesCheck } from "../../../../common/commonMethods";
import {AccountSettingschema} from './Accountsettingschema'

const AccountSettingsContext = createContext({
  AccountSettingschema: AccountSettingschema,
  updateAccsettingsForm: () => {},
});

const AccountSettingsComponentController = (props) => {
  const { getData, putData } = useContext(ApiServiceContext);
  const { setprofileData, profileData } = useContext(commonDatacontext);

  const [menu, setMenu] = useState(false);
  const toggleMobileMenu = () => setMenu(!menu);
  const [dobDate, setdobDate] = useState();
  const [accountSettings, setAccountSettingsInfos] = useState([]);
  const [imageError, setImageError] = useState("");
  const [binaryFile, setBinaryFile] = useState();
  const [fileImg, setFileImg] = useState(null);
  // For Roles and Permissions
  const [permission, setPermission] = useState({});
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    let findModule = userRolesCheck("accountSettings");
    if (findModule == "admin") {
      setAdmin(true);
    } else {
      setPermission(findModule);
    }
  }, []);
  // For Roles and Permissions
  const getAccountSettingData = async () => {
    try {
      const response = await getData(AccountSettingsview);
      if (response.code === 200) {
        setAccountSettingsInfos(response?.data);
      }
      return response;
    } catch (error) {
      /* empty */
    }
  };

  useEffect(() => {
    getAccountSettingData();
    let elements = Array.from(
      document.getElementsByClassName("react-datepicker-wrapper")
    );
    elements.map((element) => element.classList.add("w-100"));
  }, []);

  // eslint-disable-next-line no-unused-vars
  const [gender, setGender] = useState([
    { id: 2, text: "Male" },
    { id: 3, text: "Female" },
  ]);

  const updateAccsettingsForm = async (data) => {
    if (fileImg == null) {
      setImageError("Profile Image is required");
      return false;
    }
    if (!imageError) {
      const formData = new FormData();
      formData.append("firstName", data?.firstName);
      formData.append("lastName", data?.lastName);
      formData.append("email", data?.email);
      formData.append("mobileNumber", data?.mobileNumber);
      formData.append(
        "gender",
        data?.gender?.id == undefined ? "" : data?.gender?.id
      );
      formData.append("DOB", data?.DOB ? dayjs(data?.DOB).toDate() : "");
      
      formData.append("image", binaryFile ? binaryFile : "");

      try {
        const response = await putData(AccountSettingsupdate, formData);
        if (response.code === 200) {
          successToast("Account Settings Updated Successfully");

          setAccountSettingsInfos(response?.data?.updatedData);
        

          let cmnprofileData = { ...profileData };
          cmnprofileData.firstName = response?.data?.updatedData?.firstName;
          cmnprofileData.lastName = response?.data?.updatedData?.lastName;
          cmnprofileData.image = response?.data?.updatedData?.image;
          setcommonData("profileData", { profileDetails: cmnprofileData });
          setprofileData(cmnprofileData);
        }
        return response;
      } catch (error) {
        /* empty */
      }
    }
  };

  const handleKeyPress = (event) => {
    const keyCode = event.keyCode || event.which;
    const keyValue = String.fromCharCode(keyCode);
    if (/^\d+$/.test(keyValue)) {
      event.preventDefault();
    }
  };

  return (
    <AccountSettingsContext.Provider
      value={{
        AccountSettingschema,
        gender,
        dobDate,
        accountSettings,
        setdobDate,
        menu,
        updateAccsettingsForm,
        toggleMobileMenu,
        handleKeyPress,
        imageError,
        setImageError,
        binaryFile,
        setBinaryFile,
        fileImg,
        setFileImg,
        permission,
        admin,
      }}
    >
      {props.children}
    </AccountSettingsContext.Provider>
  );
};

export { AccountSettingsContext, AccountSettingsComponentController };
