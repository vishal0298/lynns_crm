import React, { useContext, useEffect } from "react";
import { AccountSettingsContext } from "./Accountsettings.control";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import useFilePreview from "../hooks/useFilePreview";
import SettingSidebar from "../settingSidebar";
import {
  handleCharacterRestriction,
  handleNumberRestriction,
} from "../../../../constans/globals";
import DatePickerComponent from "../../datePicker/DatePicker";
import dayjs from "dayjs";
import { warningToast } from "../../../../core/core-index";
import { PreviewImg } from "../../../../common/imagepath";

const AccountSettings = () => {
  const {
    AccountSettingschema,
    gender,
    accountSettings,
    updateAccsettingsForm,
    imageError,
    setImageError,
    setBinaryFile,
    fileImg,
    setFileImg,
    permission,
    admin,
  } = useContext(AccountSettingsContext);
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(AccountSettingschema) });
  const { create } = permission;
  const files = watch("image");
  // eslint-disable-next-line no-unused-vars
  const [imageData] = useFilePreview(files);

  useEffect(() => {
    let selectedgenderObj = gender.find(
      (obj) => obj.id == accountSettings?.gender
    );

    setFileImg(accountSettings?.image);
    setValue("firstName", accountSettings?.firstName);
    setValue("lastName", accountSettings?.lastName);
    setValue("email", accountSettings?.email);
    setValue("mobileNumber", accountSettings?.mobileNumber);
    setValue("DOB", accountSettings?.DOB);
    setValue("gender", selectedgenderObj);
  }, [accountSettings]);
  // eslint-disable-next-line no-unused-vars
  const excludeDates = [new Date()];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        if (
          (img.width === 150 && img.height === 150) ||
          (img.width >= 150 && img.height >= 150)
        ) {
          setFileImg(reader.result);
          setBinaryFile(file);
          setImageError("");
        } else {
          setImageError("Profile Pic should be minimum 150 * 150");
        }
      };
      img.onerror = () => {
        setImageError("Only PNG, JPG, and JPEG file types are supported.");
      };
      img.src = reader.result;
    };

    if (file) {
      if (/\.(jpe?g|png)$/i.test(file.name)) {
        reader.readAsDataURL(file);
      } else {
        setImageError("Only PNG, JPG, and JPEG file types are supported.");
      }
    }
  };

  const handleImageError = () => {
    setFileImg(null);
    setImageError("");
  };

  
  const isEighteenOrOlder = (date) => {
    const eighteenYearsAgo = dayjs().subtract(18, "year");
    return date.isBefore(eighteenYearsAgo, "day");
  };

  // Handle date change
  const handleDateChange = (date) => {
    if (isEighteenOrOlder(dayjs(date))) {
      setValue("DOB", date);
    } else {
      warningToast("You must be 18 years or older.");
    }
  };

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
                  <h5>Account Settings</h5>
                </div>
                <form onSubmit={handleSubmit(updateAccsettingsForm)}>
                  <div className="row">
                    <div className="profile-picture">
                      <div className="upload-profile me-2">
                        <div className="profile-img">
                          <img
                            id="blah"
                            className="avatar"
                            src={fileImg ? fileImg : PreviewImg}
                            alt=""
                            onError={handleImageError}
                          />
                        </div>
                      </div>
                      <div className="img-upload">
                        <label className="btn btn-primary">
                          Upload new picture{" "}
                          <input
                            type="file"
                            multiple={false}
                            onChange={handleFileUpload}
                          />
                        </label>
                        <p className="mt-1">
                          Profile Picture should be minimum 150 * 150. Supported
                          file formats: JPG, PNG, JPEG.
                        </p>
                        {imageError && (
                          <p className="text-danger">{imageError}</p>
                        )}
                      </div>
                    </div>

                    <div className="col-lg-12">
                      <div className="form-title">
                        <h5>General Information</h5>
                      </div>
                    </div>
                    <div className="col-lg-6 col-12">
                      <div className="form-group input_text">
                        <label>
                          First Name <span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="firstName"
                          type="text"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <input
                              className={`form-control ${
                                errors?.firstName ? "error-input" : ""
                              }`}
                              type="text"
                              value={value}
                              onKeyPress={handleCharacterRestriction}
                              onChange={onChange}
                              placeholder="Enter First Name"
                              autoComplete="false"
                            />
                          )}
                          defaultValue=""
                        />
                        <small>{errors?.firstName?.message}</small>
                      </div>
                    </div>
                    <div className="col-lg-6 col-12">
                      <div className="form-group input_text">
                        <label>
                          Last Name <span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="lastName"
                          type="text"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <input
                              className={`form-control ${
                                errors?.lastName ? "error-input" : ""
                              }`}
                              type="text"
                              value={value}
                              onKeyPress={handleCharacterRestriction}
                              onChange={onChange}
                              placeholder="Enter Last Name"
                              autoComplete="false"
                            />
                          )}
                          defaultValue=""
                        />
                        <small>{errors?.lastName?.message}</small>
                      </div>
                    </div>
                    <div className="col-lg-6 col-12">
                      <div className="form-group input_text">
                        <label>
                          Email <span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="email"
                          type="text"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <input
                              className={`form-control ${
                                errors?.email ? "error-input" : ""
                              }`}
                              type="text"
                              value={value}
                              onChange={onChange}
                              placeholder="Enter Email Address"
                              autoComplete="false"
                            />
                          )}
                          defaultValue=""
                        />
                        <small>{errors?.email?.message}</small>
                      </div>
                    </div>
                    <div className="col-lg-6 col-12">
                      <div className="form-group input_text">
                        <label>
                          Mobile Number <span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="mobileNumber"
                          type="number"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <input
                              className={`form-control ${
                                errors?.mobileNumber ? "error-input" : ""
                              }`}
                              maxLength={15}
                              onKeyPress={handleNumberRestriction}
                              value={value}
                              onChange={onChange}
                              placeholder="Enter Mobile Number"
                              autoComplete="false"
                            />
                          )}
                          defaultValue=""
                        />
                        <small>{errors?.mobileNumber?.message}</small>
                      </div>
                    </div>
                    <div className="col-lg-6 col-12">
                      <div className="form-group input_text mb-0 account-settings">
                        <label>Gender</label>
                        <Controller
                          control={control}
                          name="gender"
                          render={({ field }) => (
                            <Select
                              {...field}
                              className={`react-selectcomponent form-control w-100 ${
                                errors?.gender ? "error-input" : ""
                              }`}
                              placeholder="Choose Gender"
                              getOptionLabel={(option) => option.text}
                              getOptionValue={(option) => option.id}
                              options={gender}
                              classNamePrefix="select_kanakku"
                            />
                          )}
                        />
                        <small>{errors?.gender?.message}</small>
                      </div>
                    </div>
                    <div className="col-lg-6 col-12">
                      <div className="form-group input_text">
                        <label>Date of Birth</label>
                        <div className="cal-icon cal-icon-info">
                        
                          {/* For antd Datepicker */}
                          <Controller
                            control={control}
                            name="DOB"
                            render={({ field: { value } }) => (
                              <DatePickerComponent
                                classNamePrefix="account-setting"
                                value={value}
                                onChange={handleDateChange}
                                //onChange={handleDateChange}
                              />
                            )}
                          ></Controller>
                          {/* For antd Datepicker */}
                        </div>

                        <small>{errors?.DOB?.message}</small>
                      </div>
                    </div>

                    <div className="col-lg-12">
                      <div className="btn-path text-end">
                        <Link
                          to="/index"
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
export default AccountSettings;
