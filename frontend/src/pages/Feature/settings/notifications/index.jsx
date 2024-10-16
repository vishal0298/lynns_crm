import React from "react";
import NotificationSetting from "./NotificationSetting";
import { NotificationSettingComponentController } from "./NotificationSetting.control";

const NotificationSettingComponent = () => {
  return (
    <>
      <NotificationSettingComponentController>
        <NotificationSetting />
      </NotificationSettingComponentController>
    </>
  );
};

export default NotificationSettingComponent;
