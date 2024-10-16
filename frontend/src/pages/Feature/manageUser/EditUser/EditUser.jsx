import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { PreviewImg } from "../../../../common/imagepath";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { edituserSchema } from "../../../../common/schema";
import { handleNumberRestriction } from "../../../../constans/globals";
import { EditUserContext } from "./EditUser.control";

const EditUser = () => {
  const {
    setFileImage,
    previewImage,
    setPreviewImage,
    getRootProps,
    getInputProps,
    role,
    status,
    onSubmit,
    singleUser,
    fileImage,
    handleImageError,
  } = useContext(EditUserContext);

  const {
    handleSubmit,
    control,
    setValue,
    trigger,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(edituserSchema(!previewImage)),
  });

  useEffect(() => {
    setValue("firstName", singleUser?.firstName);
    setValue("lastName", singleUser?.lastName);
    setValue("userName", singleUser?.userName);
    setValue("email", singleUser?.email);
    setValue("mobileNumber", singleUser?.mobileNumber);
    setValue(
      "role",
      role.find((item) => item?.value == singleUser?.role)
    );
    setValue(
      "status",
      status.find((item) => item?.value == singleUser?.status)
    );
  }, [singleUser, role]);
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
            <h5>Edit User</h5>
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
                              onError={handleImageError}
                              src={
                                previewImage ? previewImage : singleUser?.image
                              }
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
                          Upload <input type="file" {...getInputProps()} />
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
                                  value={value}
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
                            defaultValue=""
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
                                  className="form-control"
                                  placeholder="Enter Last Name"
                                  value={value}
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
                            defaultValue=""
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group">
                          <label>User Name</label>
                          <Controller
                            name="userName"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <>
                                <input
                                  type="text"
                                  // maxLength={15}
                                  className="form-control"
                                  placeholder="Enter User Name"
                                  value={value}
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
                            defaultValue=""
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
                                  value={value}
                                  onChange={(val) => {
                                    onChange(val);
                                    trigger("email");
                                  }}
                                />

                                {errors.email && (
                                  <p className="text-danger">
                                    {errors.email.message}
                                  </p>
                                )}
                              </>
                            )}
                            defaultValue=""
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
                                  value={value}
                                  onChange={(val) => {
                                    onChange(val);
                                    trigger("mobileNumber");
                                  }}
                                />
                              </>
                            )}
                            defaultValue=""
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group">
                          <label>Role</label>
                          <Controller
                            name="role"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <>
                                <Select
                                  // styles={styles}
                                  classNamePrefix="select_kanakku"
                                  className="w-100"
                                  options={role}
                                  value={value}
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
                        <div className="form-group">
                          <label>
                            Status <span className="text-danger">*</span>
                          </label>
                          <Controller
                            name="status"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <>
                                <Select
                                  classNamePrefix="select_kanakku"
                                  className="w-100"
                                  options={status}
                                  value={value}
                                  onChange={(e) => {
                                    onChange(e);
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
                    <Link to="/users" className="btn btn-primary cancel me-2">
                      Cancel
                    </Link>
                    <button type="submit" className="btn btn-primary">
                      Update
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

export default EditUser;
