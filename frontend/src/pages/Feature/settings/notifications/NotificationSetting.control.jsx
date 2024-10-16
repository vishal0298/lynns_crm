/* eslint-disable react/prop-types */
import React, { createContext, useEffect, useContext, useState } from "react";
import * as yup from "yup";
import { ApiServiceContext } from "../../../../core/API/api-service";
import { successToast } from "../../../../core/core-index";
import { userRolesCheck } from "../../../../common/commonMethods";

const notificationSchemaschema = yup.object().shape({
  senderId: yup.string().required("Enter Sender Id"),
  serverKey: yup
    .string()
    .required("Enter Server key")
    .min(6, "Server Key Should Be At Least 6 Characters")
    .trim(),
});

const NotificationSettingContext = createContext({
  notificationSchemaschema: notificationSchemaschema,
  notificationSettingForm: () => {},
});

const NotificationSettingComponentController = (props) => {
  const { putData, getData } = useContext(ApiServiceContext);
  const [NotificationSettingdata, setNotificationSettingdata] = useState([]);

  // For Roles and Permissions
  const [permission, setPermission] = useState({});
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    getnotificationSettingData();
    let findModule = userRolesCheck("notificationSettings");
    if (findModule == "admin") {
      setAdmin(true);
    } else {
      setPermission(findModule);
    }
  }, []);

  const getnotificationSettingData = async () => {
    try {
      const response = await getData(
        `/notificationSettings/viewNotificationSettings`
      );
      if (response.code === 200) {
        setNotificationSettingdata(response.data);
      }
      return response;
    } catch (error) {
      /* empty */
    }
  };

  // useEffect(() => {
  //   getnotificationSettingData();
  // }, []);

  const notificationSettingForm = async (data) => {
    const formData = {};
    formData.senderId = data.senderId;
    formData.serverKey = data.serverKey;
    try {
      const response = await putData(
        `/notificationSettings/updateNotificationSettings`,
        formData
      );
      if (response.code === 200) {
        setNotificationSettingdata(formData);
        successToast("Notification Details updatedSuccessfully");
      }
      return response;
    } catch (error) {
      /* empty */
    }
  };

  return (
    <NotificationSettingContext.Provider
      value={{
        notificationSchemaschema,
        notificationSettingForm,
        NotificationSettingdata,
        permission,
        admin,
      }}
    >
      {props.children}
    </NotificationSettingContext.Provider>
  );
};

export { NotificationSettingContext, NotificationSettingComponentController };
