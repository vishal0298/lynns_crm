import React, { useContext, useEffect } from "react";
import { EmailSettingsContext } from "./Emailsettings.control";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import SettingSidebar from "../settingSidebar";

const EmailSettings = () => {
  const {
    Emailsettingschema,
    emailSettingsInfo,
    permission,
    admin,
    updateEmailsettingsForm,
  } = useContext(EmailSettingsContext);
  const {
    handleSubmit,
    register,
    setValue,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(Emailsettingschema) });
  const { create } = permission;
  useEffect(() => {
    setValue("provider_type", emailSettingsInfo?.provider_type);
    setValue("nodeFromEmail", emailSettingsInfo.nodeFromEmail);
    setValue("nodeFromName", emailSettingsInfo.nodeFromName);
    setValue("nodeUsername", emailSettingsInfo.nodeUsername);
    setValue("nodePassword", emailSettingsInfo.nodePassword);
    setValue("nodePort", emailSettingsInfo.nodePort);
    setValue("nodeHost", emailSettingsInfo.nodeHost);
    setValue("smtpFromEmail", emailSettingsInfo.smtpFromEmail);
    setValue("smtpFromName", emailSettingsInfo.smtpFromName);
    setValue("smtpUsername", emailSettingsInfo.smtpUsername);
    setValue("smtpPassword", emailSettingsInfo.smtpPassword);
    setValue("smtpPort", emailSettingsInfo.smtpPort);
    setValue("smtpHost", emailSettingsInfo.smtpHost);
  }, [emailSettingsInfo]);

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          {/* Page Header */}
          {/* /Page Header */}
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
                    <h5>Email Settings</h5>
                  </div>
                  <form onSubmit={handleSubmit(updateEmailsettingsForm)}>
                    <div className="row">
                      <h5 className="mail-title">Mail Provider</h5>
                      <div className="col-lg-6 col-12">
                        <div className="form-group input_text">
                          <div className="mail-provider">
                            <h4>Node Mail</h4>
                            <div className="mail-setting">
                              <div className="status-toggle">
                                <input
                                  {...register("provider_type")}
                                  type="radio"
                                  value="NODE"
                                  id="NODE_type"
                                />
                              </div>
                            </div>
                          </div>
                          <small>{errors?.provider_type?.message}</small>
                        </div>
                        <div className="form-group input_text">
                          <label>From Name</label>
                          <Controller
                            name="nodeFromName"
                            type="text"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <input
                                className={`form-control ${
                                  errors?.nodeFromName ? "error-input" : ""
                                }`}
                                type="text"
                                value={value}
                                onChange={onChange}
                                //onKeyPress={handleCharacterRestriction}
                                placeholder="Enter From Name"
                                autoComplete="false"
                              />
                            )}
                            defaultValue=""
                          />
                          <small>{errors?.nodeFromName?.message}</small>
                        </div>
                        <div className="form-group input_text">
                          <label>From Email</label>
                          <Controller
                            name="nodeFromEmail"
                            type="text"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <input
                                className={`form-control ${
                                  errors?.nodeFromEmail ? "error-input" : ""
                                }`}
                                type="text"
                                value={value}
                                onChange={onChange}
                                placeholder="Enter From Email"
                                autoComplete="false"
                              />
                            )}
                            defaultValue=""
                          />
                          <small>{errors?.nodeFromEmail?.message}</small>
                        </div>
                        <div className="form-group input_text">
                          <label>Host</label>
                          <Controller
                            name="nodeHost"
                            type="text"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <input
                                className={`form-control ${
                                  errors?.nodeHost ? "error-input" : ""
                                }`}
                                type="text"
                                value={value}
                                //onKeyPress={handleCharacterRestriction}
                                onChange={onChange}
                                placeholder="Enter Host Name"
                                autoComplete="false"
                              />
                            )}
                            defaultValue=""
                          />
                          <small>{errors?.nodeHost?.message}</small>
                        </div>
                        <div className="form-group input_text">
                          <label>Port</label>
                          <Controller
                            name="nodePort"
                            type="text"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <input
                                className={`form-control ${
                                  errors?.nodePort ? "error-input" : ""
                                }`}
                                type="text"
                                value={value}
                                onChange={onChange}
                                //onKeyPress={handleNumberRestriction}
                                placeholder="Enter Port Number"
                                autoComplete="false"
                              />
                            )}
                            defaultValue=""
                          />
                          <small>{errors?.nodePort?.message}</small>
                        </div>
                        <div className="form-group input_text">
                          <label>Username</label>
                          <Controller
                            name="nodeUsername"
                            type="text"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <input
                                className={`form-control ${
                                  errors?.nodeUsername ? "error-input" : ""
                                }`}
                                type="text"
                                value={value}
                                onChange={onChange}
                                //onKeyPress={handleCharacterRestriction}
                                placeholder="Enter Username"
                                autoComplete="false"
                              />
                            )}
                            defaultValue=""
                          />
                          <small>{errors?.nodeUsername?.message}</small>
                        </div>
                        <div className="form-group input_text">
                          <label>Password</label>
                          <Controller
                            name="nodePassword"
                            type="password"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <input
                                className={`form-control ${
                                  errors?.nodePassword ? "error-input" : ""
                                }`}
                                type="password"
                                value={value}
                                onChange={onChange}
                                placeholder="Enter Email Password"
                                autoComplete="false"
                              />
                            )}
                            defaultValue={false}
                          />
                          <small>{errors?.nodePassword?.message}</small>
                        </div>
                      </div>
                      <div className="col-lg-6 col-12">
                        <div className="form-group">
                          <div className="mail-provider">
                            <h4>SMTP</h4>
                            <div className="mail-setting">
                              <div className="status-toggle">
                                <input
                                  {...register("provider_type")}
                                  type="radio"
                                  value="SMTP"
                                  id="SMTP_type"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="form-group input_text">
                          <label>From Name</label>
                          <Controller
                            name="smtpFromName"
                            type="text"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <input
                                className={`form-control ${
                                  errors?.smtpFromName ? "error-input" : ""
                                }`}
                                type="text"
                                value={value}
                                //onKeyPress={handleCharacterRestriction}
                                onChange={onChange}
                                placeholder="Enter From Name"
                                autoComplete="false"
                              />
                            )}
                            defaultValue=""
                          />
                          <small>{errors?.smtpFromName?.message}</small>
                        </div>
                        <div className="form-group input_text">
                          <label>From Email</label>
                          <Controller
                            name="smtpFromEmail"
                            type="text"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <input
                                className={`form-control ${
                                  errors?.smtpFromEmail ? "error-input" : ""
                                }`}
                                type="text"
                                value={value}
                                onChange={onChange}
                                placeholder="Enter From Email"
                                autoComplete="false"
                              />
                            )}
                            defaultValue=""
                          />
                          <small>{errors?.smtpFromEmail?.message}</small>
                        </div>
                        <div className="form-group input_text">
                          <label>Host</label>
                          <Controller
                            name="smtpHost"
                            type="text"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <input
                                className={`form-control ${
                                  errors?.smtpHost ? "error-input" : ""
                                }`}
                                type="text"
                                value={value}
                                //onKeyPress={handleCharacterRestriction}
                                onChange={onChange}
                                placeholder="Enter Host Name"
                                autoComplete="false"
                              />
                            )}
                            defaultValue=""
                          />
                          <small>{errors?.smtpHost?.message}</small>
                        </div>
                        <div className="form-group input_text">
                          <label>Port</label>
                          <Controller
                            name="smtpPort"
                            type="text"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <input
                                className={`form-control ${
                                  errors?.smtpPort ? "error-input" : ""
                                }`}
                                type="text"
                                value={value}
                                //onKeyPress={handleNumberRestriction}
                                onChange={onChange}
                                placeholder="Enter Port Number"
                                autoComplete="false"
                              />
                            )}
                            defaultValue=""
                          />
                          <small>{errors?.smtpPort?.message}</small>
                        </div>
                        <div className="form-group input_text">
                          <label>Username</label>
                          <Controller
                            name="smtpUsername"
                            type="text"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <input
                                className={`form-control ${
                                  errors?.smtpUsername ? "error-input" : ""
                                }`}
                                type="text"
                                value={value}
                                onChange={onChange}
                                //onKeyPress={handleCharacterRestriction}
                                placeholder="Enter Username"
                                autoComplete="false"
                              />
                            )}
                            defaultValue=""
                          />
                          <small>{errors?.smtpUsername?.message}</small>
                        </div>
                        <div className="form-group input_text">
                          <label>Password</label>
                          <Controller
                            name="smtpPassword"
                            type="password"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <input
                                className={`form-control ${
                                  errors?.smtpPassword ? "error-input" : ""
                                }`}
                                type="password"
                                value={value}
                                onChange={onChange}
                                placeholder="Enter Email Password"
                                autoComplete="false"
                              />
                            )}
                            defaultValue={false}
                          />
                          <small>{errors?.smtpPassword?.message}</small>
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
      <div className="modal custom-modal fade" id="bank_details" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header border-0 pb-0">
              <div className="form-header modal-header-title php-mail-modal text-start mb-0">
                <h4 className="mb-0">PHP Mail</h4>
                <div className="status-toggle">
                  <input
                    id="rating_3"
                    className="check"
                    type="checkbox"
                    defaultChecked="true"
                  />
                  <label htmlFor="rating_3" className="checktoggle checkbox-bg">
                    checkbox
                  </label>
                </div>
              </div>
              <button
                type="button"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span className="align-center" aria-hidden="true">
                  ×
                </span>
              </button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label>Email From Address</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="demo2"
                    />
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label>Email Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="*******"
                    />
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label>Email From Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="John Smith"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <Link
                to="#"
                data-bs-dismiss="modal"
                className="btn btn-primary paid-cancel-btn me-2"
              >
                Cancel
              </Link>
              <Link
                to="#"
                data-bs-dismiss="modal"
                className="btn btn-primary paid-continue-btn"
              >
                Save
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default EmailSettings;
