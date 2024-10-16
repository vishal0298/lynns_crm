import React, { useContext } from "react";
import { changePasswordContext } from "./ChangePassword.control";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import SettingSidebar from "../settingSidebar";

const ChangePassword = () => {
  const { passwordSchemaschema, changePasswordForm, permission, admin } =
    useContext(changePasswordContext);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(passwordSchemaschema) });
  const { create } = permission;
  return (
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
                  <h5>Change Password</h5>
                </div>
                <form onSubmit={handleSubmit(changePasswordForm)}>
                  <div className="row">
                    <div className="col-lg-4 col-md-4 col-12">
                      <div className="form-group input_text">
                        <label>
                          Old Password <span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="oldPassword"
                          type="password"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <input
                              className={`form-control ${
                                errors?.oldPassword ? "error-input" : ""
                              }`}
                              type="password"
                              value={value}
                              onChange={onChange}
                              placeholder="Enter the old password"
                              autoComplete="false"
                            />
                          )}
                        />
                        <small>{errors?.oldPassword?.message}</small>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-4 col-12">
                      <div className="form-group input_text">
                        <label>
                          New Password <span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="newPassword"
                          type="password"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <input
                              className={`form-control ${
                                errors?.newPassword ? "error-input" : ""
                              }`}
                              type="password"
                              value={value}
                              onChange={onChange}
                              placeholder="Enter the New password"
                              autoComplete="false"
                            />
                          )}
                        />
                        <small>{errors?.newPassword?.message}</small>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-4 col-12">
                      <div className="form-group input_text">
                        <label>
                          Confirm Password{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="confirmPassword"
                          type="password"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <input
                              className={`form-control ${
                                errors?.confirmPassword ? "error-input" : ""
                              }`}
                              type="password"
                              value={value}
                              onChange={onChange}
                              placeholder="Enter the Confirm password"
                              autoComplete="false"
                            />
                          )}
                          defaultValue=""
                        />
                        <small>{errors?.confirmPassword?.message}</small>
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
export default ChangePassword;
