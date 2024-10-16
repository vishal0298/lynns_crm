import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PreviewImg } from "../../../../common/imagepath";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userSchema } from "../../../../common/schema";
import {
  handleCharacterRestriction,
  handleNumberRestriction,
} from "../../../../constans/globals";
import { AddUserContext } from "./AddUser.control";

const AddUser = () => {
  const {
    handleSubmit,
    control,
    trigger,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userSchema),
  });

  const {
    setFileImage,
    previewImage,
    setPreviewImage,
    getRootProps,
    getInputProps,
    role,
    status,
    fileImage,
    onSubmit,
  } = useContext(AddUserContext);

  const [eye, seteye] = useState(true);
  const [confirmPwd, setConfirmPwd] = useState(true);

  const onEyeClick = () => seteye(!eye);

  const onEyeClickPwd = () => setConfirmPwd(!confirmPwd);
  useEffect(() => {}, [errors, getValues]);
  useEffect(() => {
    const image = fileImage?.[0];
    setValue("image", image);
    image && trigger("image");
  }, [previewImage, fileImage]);
  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="content-page-header">
            <h5>Add User</h5>
          </div>
          <div className="row">
            <div className="col-md-12">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="card-body">
                  <div className="form-group-item">
                    <h5 className="form-title">Profile Picture</h5>
                    <div className="profile-picture">
                      <div
                        className="upload-profile"
                        {...getRootProps({
                          className: "dropzone dz-clickable",
                        })}
                      >
                        <div className="upload-profile">
                          <div className="profile-img">
                            <img
                              id="blah"
                              className="avatar"
                              src={previewImage ? previewImage : PreviewImg}
                              alt=""
                            />
                          </div>
                          <div className="add-profile">
                            <h5>Upload a New Photo</h5>
                          </div>
                        </div>
                      </div>

                      <div className="img-upload">
                        <label className="btn btn-primary">
                          Upload{" "}
                          <input
                            type="file"
                            name="image"
                            accept="image/*"
                            {...getInputProps({
                              accept: "image/jpeg, image/png", // Specify allowed image formats
                            })}
                          />
                        </label>
                        <Link
                          className="btn btn-remove"
                          onClick={() => {
                            setPreviewImage(PreviewImg);
                            setFileImage(null);
                          }}
                        >
                          {" "}
                          Remove
                        </Link>
                      </div>
                      {errors.image && (
                        <p className="text-danger">{errors.image.message}</p>
                      )}
                    </div>
                    <div className="row">
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group">
                          <label>
                            First Name <span className="text-danger">*</span>
                          </label>
                          <Controller
                            name="firstName"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <>
                                <input
                                  type="text"
                                  // maxLength={15}
                                  className="form-control"
                                  placeholder="Enter First Name"
                                  onKeyPress={handleCharacterRestriction}
                                  value={value || ""}
                                  onChange={(val) => {
                                    onChange(val);
                                    trigger("firstName");
                                  }}
                                />

                                {errors.firstName && (
                                  <p className="text-danger">
                                    {errors.firstName.message}
                                  </p>
                                )}
                              </>
                            )}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group">
                          <label>
                            Last Name <span className="text-danger">*</span>
                          </label>
                          <Controller
                            name="lastName"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <>
                                <input
                                  type="text"
                                  // maxLength={15}
                                  className="form-control"
                                  placeholder="Enter Last Name"
                                  onKeyPress={handleCharacterRestriction}
                                  value={value || ""}
                                  onChange={(val) => {
                                    onChange(val);
                                    trigger("lastName");
                                  }}
                                />

                                {errors.lastName && (
                                  <p className="text-danger">
                                    {errors.lastName.message}
                                  </p>
                                )}
                              </>
                            )}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group">
                          <label>User Name<span className="text-danger">*</span></label>
                          <Controller
                            name="userName"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <>
                                <input
                                  type="text"
                                  // maxLength={20}
                                  className="form-control"
                                  placeholder="Enter User Name"
                                  value={value || ""}
                                  onChange={(val) => {
                                    onChange(val);
                                    trigger("userName");
                                  }}
                                />

                                {errors.userName && (
                                  <p className="text-danger">
                                    {errors.userName.message}
                                  </p>
                                )}
                              </>
                            )}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group">
                          <label>
                            Email <span className="text-danger">*</span>
                          </label>
                          <Controller
                            name="email"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <>
                                <input
                                  type="email"
                                  className="form-control"
                                  placeholder="Enter Email Address"
                                  value={value || ""}
                                  onChange={(val) => {
                                    onChange(val);
                                    // trigger("email");
                                  }}
                                />

                                {errors.email && (
                                  <p className="text-danger">
                                    {errors.email.message}
                                  </p>
                                )}
                              </>
                            )}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group">
                          <label>Phone Number</label>
                          <Controller
                            name="mobileNumber"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <>
                                <input
                                  maxLength={15}
                                  type="text"
                                  onKeyPress={handleNumberRestriction}
                                  className="form-control"
                                  placeholder="Enter Phone Number"
                                  value={value || ""}
                                  onChange={(val) => {
                                    onChange(val);
                                    trigger("mobileNumber");
                                  }}
                                />

                              
                              </>
                            )}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group">
                          <label>
                            Role <span className="text-danger">*</span>
                          </label>
                          <Controller
                            name="role"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <>
                                <Select
                                  // styles={styles}
                                  placeholder="Select Role"
                                  className="w-100"
                                  options={role}
                                  value={value}
                                  classNamePrefix="select_kanakku"
                                  onChange={(e) => {
                                    onChange(e);
                                    trigger("role");
                                  }}
                                />
                                {errors.role && (
                                  <p className="text-danger">
                                    {errors.role.message}
                                  </p>
                                )}
                              </>
                            )}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div
                          className="pass-group manage-user"
                          id="passwordInput1"
                        >
                          <div className="form-group mb-0">
                            <label>
                              Password <span className="text-danger">*</span>
                            </label>
                            <Controller
                              name="password"
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <>
                                  <input
                                    // type="password"
                                    type={eye ? "password" : "text"}
                                    className="form-control"
                                    placeholder="Enter Password"
                                    value={value || ""}
                                    onChange={(val) => {
                                      onChange(val);
                                      trigger("password");
                                    }}
                                  />
                                  <span
                                    onClick={onEyeClick}
                                    className={`fa toggle-password user-eye ${
                                      eye ? "fa-eye-slash" : "fa-eye"
                                    }`}
                                  />
                                </>
                              )}
                            />
                          </div>
                        </div>
                        <small>{errors?.password?.message}</small>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div
                          className="pass-group manage-user"
                          id="passwordInput2"
                        >
                          <div className="form-group mb-0">
                            <label>
                              Confirm Password{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <Controller
                              name="confirm_password"
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <>
                                  <input
                                    type={confirmPwd ? "password" : "text"}
                                    className="form-control"
                                    placeholder="Enter Password"
                                    value={value || ""}
                                    onChange={(val) => {
                                      onChange(val);
                                      trigger("confirm_password");
                                    }}
                                  />
                                  <span
                                    onClick={onEyeClickPwd}
                                    className={`fa toggle-password user-eye ${
                                      confirmPwd ? "fa-eye-slash" : "fa-eye"
                                    }`}
                                  />
                                </>
                              )}
                            />
                          </div>
                        </div>
                        <small>{errors?.confirm_password?.message}</small>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group">
                          <label>
                            Status <span className="text-danger">*</span>
                          </label>
                          <Controller
                            name="status"
                            control={control}
                            defaultValue={status && status[0]}
                            render={({ field: { value, onChange } }) => (
                              <>
                                <Select
                                  // styles={styles}
                                  className="w-100"
                                  options={status}
                                  placeholder="Select Status"
                                  classNamePrefix="select_kanakku"
                                  value={value || ""}
                                  onChange={(e) => {
                                    // onChange(e);
                                    if (!e && status) {
                                      // No changes made, use the initial value
                                      onChange(status[0]);
                                    } else {
                                      onChange(e);
                                    }
                                    trigger("status");
                                  }}
                                />
                                {errors.status && (
                                  <p className="text-danger">
                                    {errors.status.message}
                                  </p>
                                )}
                              </>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-end">
                    <Link
                      // type="reset"
                      to="/users"
                      className="btn btn-primary cancel me-2"
                    >
                      Cancel
                    </Link>
                    <button type="submit" className="btn btn-primary">
                      Add User
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddUser;
