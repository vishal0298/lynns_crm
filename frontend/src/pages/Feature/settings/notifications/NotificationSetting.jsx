import React, { useContext, useEffect } from "react";
import { NotificationSettingContext } from "./NotificationSetting.control";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import SettingSidebar from "../settingSidebar";

const NotificationSetting = () => {
  const {
    notificationSchemaschema,
    notificationSettingForm,
    NotificationSettingdata,
    permission,
    admin,
  } = useContext(NotificationSettingContext);
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(notificationSchemaschema) });
  const { create } = permission;
  useEffect(() => {
    setValue("senderId", NotificationSettingdata?.senderId);
    setValue("serverKey", NotificationSettingdata?.serverKey);
  }, [NotificationSettingdata]);

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="row">
          <div className="col-xl-3 col-md-4">
            <div className="card">
              <div className="card-body">
                <div className="page-header">
                  <div className="content-page-header">
                    <h5>Settings</h5>
                  </div>
                </div>
                {/* Settings Menu */}
                <SettingSidebar />
                {/* /Settings Menu */}
              </div>
            </div>
          </div>
          <div className="col-xl-9 col-md-8">
            <div className="card">
              <div className="card-body w-100">
                <div className="content-page-header">
                  <h5>Notification Settings</h5>
                </div>
                <form onSubmit={handleSubmit(notificationSettingForm)}>
                  <div className="row">
                    <div className="col-lg-4 col-md-4 col-12">
                      <div className="form-group input_text">
                        <label>
                          Firebase Sender Id{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="senderId"
                          type="text"
                          defaultValue=""
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <input
                              className={`form-control ${
                                errors?.senderId ? "error-input" : ""
                              }`}
                              type="text"
                              value={value}
                              onChange={onChange}
                              placeholder="Enter the Sender Id"
                              autoComplete="false"
                            />
                          )}
                        />
                        <small>{errors?.senderId?.message}</small>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-4 col-12">
                      <div className="form-group input_text">
                        <label>
                          Firebase Server Key{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="serverKey"
                          type="text"
                          defaultValue=""
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <input
                              className={`form-control ${
                                errors?.serverKey ? "error-input" : ""
                              }`}
                              type="text"
                              value={value}
                              onChange={onChange}
                              placeholder="Enter Server Key"
                              autoComplete="false"
                            />
                          )}
                        />
                        <small>{errors?.serverKey?.message}</small>
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="btn-path">
                        <Link
                          to="/settings"
                          className="btn btn-cancel bg-primary-light me-3"
                        >
                          Cancel
                        </Link>
                        {(create || admin) && (
                          <button className="btn btn-primary" type="submit">
                            Save Changes
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default NotificationSetting;
