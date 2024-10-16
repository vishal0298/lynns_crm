import React, { useContext, useEffect } from "react";
import { CompanySettingsContext } from "./CompanySettings.control";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { warningToast } from "../../../../core/core-index";
import SettingSidebar from "../settingSidebar";
import {
  handleCharacterRestriction,
  handleNumberRestriction,
} from "../../../../constans/globals";
import { handleKeyDown } from "../../../../constans/globals";

const CompanySettings = () => {
  const {
    CompanySettingschema,
    CompanySettings,
    updateCompanySettingsForm,
    imgerror,
    setImgError,
    logoImgError,
    setlogoImgError,
    setImageError,
    setBinaryFile,
    iconError,
    setIconError,
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
    setBinaryIcon,
    permission,
    admin,
  } = useContext(CompanySettingsContext);

  const {
    handleSubmit,
    register,
    control,
    setValue,
    resetField,
    formState: { errors },
  } = useForm({ resolver: yupResolver(CompanySettingschema) });
  const { create } = permission || {};

  // const { update } = permission;
  const handleFileUpload = (event, width, height) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        if (
          (img.width === width && img.height === height) ||
          (img.width <= width && img.height <= height)
        ) {
          setFileImg(reader.result);
          setBinaryFile(file);
          setImageError("");
        } else {
          setImageError("Site Logo cannot be more than 800x400px");
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
  // FavIconError
  const handleFavIconUpload = (event, width, height) => {
    const icon = event.target.files[0];
    const iconReader = new FileReader();
    iconReader.onloadend = () => {
      const fav = new Image();
      fav.onload = () => {
        if (
          (fav.width === width && fav.height === height) ||
          (fav.width <= width && fav.height <= height)
        ) {
          setFavIcon(iconReader.result);
          setBinaryFavIcon(icon);
          setIconError("");
        } else {
          setIconError("FavIcon cannot be more than 35x35px");
        }
      };
      fav.onerror = () => {
        setIconError("Only PNG, JPG, and JPEG file types are supported.");
      };
      fav.src = iconReader.result;
    };

    if (icon) {
      if (/\.(jpe?g|png)$/i.test(icon.name)) {
        iconReader.readAsDataURL(icon);
      } else {
        setIconError("Only PNG, JPG, and JPEG file types are supported.");
      }
    }
  };

  const handleCompanyIconUpload = (event, width, height) => {
    const Companyfile = event.target.files[0];
    const companyReader = new FileReader();
    companyReader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        if (
          (img.width === width && img.height === height) ||
          (img.width <= width && img.height <= height)
        ) {
          setCompanyIcon(companyReader.result);
          setBinaryIcon(Companyfile);
          setCompanyIconError("");
        } else {
          setCompanyIconError("Site Logo cannot be more than 100x100px");
        }
      };
      img.onerror = () => {
        setCompanyIconError(
          "Only PNG, JPG, and JPEG file types are supported."
        );
      };
      img.src = companyReader.result;
    };

    if (Companyfile) {
      if (/\.(jpe?g|png)$/i.test(Companyfile.name)) {
        companyReader.readAsDataURL(Companyfile);
      } else {
        setCompanyIconError(
          "Only PNG, JPG, and JPEG file types are supported."
        );
      }
    }
  };

  const handleImageError = () => {
    setFileImg(null);
    setImageError("");
  };
  const handleIconError = () => {
    setFavIcon(null);
    setIconError("");
  };
  const handleLogoError = () => {
    setCompanyIcon(null);
    setCompanyIconError("");
  };

  useEffect(() => {
    if (logoImgError) {
      warningToast(logoImgError);
      resetField("siteLogo");
      setlogoImgError("");
    }
    if (imgerror) {
      warningToast(imgerror);
      resetField("faviconLogo");
      setImgError("");
    }
    if (companyError) {
      warningToast(companyError);
      resetField("faviconLogo");
      setCompanyError("");
    }
  }, [imgerror, logoImgError, companyError]);

  useEffect(() => {
    setValue("companyName", CompanySettings?.companyName);
    setValue("email", CompanySettings?.email);
    setValue("phone", CompanySettings?.phone);
    setValue("addressLine1", CompanySettings?.addressLine1);
    setValue("addressLine2", CompanySettings?.addressLine2);
    setValue("city", CompanySettings?.city);
    setValue("state", CompanySettings?.state);
    setValue("country", CompanySettings?.country);
    setValue("pincode", CompanySettings?.pincode);
    setFileImg(CompanySettings?.siteLogo);
    setFavIcon(CompanySettings?.favicon);
    setCompanyIcon(CompanySettings?.companyLogo);
    setValue("_id", CompanySettings?._id);
  }, [CompanySettings]);

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
            <div className="card company-settings-new">
              <div className="card-body w-100">
                <div className="content-page-header">
                  <h5>Company Settings</h5>
                </div>
                <form onSubmit={handleSubmit(updateCompanySettingsForm)}>
                  <div className="row">
                    <div className="col-lg-6 col-12">
                      <div className="form-group input_text">
                        <label>
                          Company Name <span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="companyName"
                          type="text"
                          defaultValue="" // Initialize with an empty string
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <input
                              className={`form-control ${
                                errors?.companyName ? "error-input" : ""
                              }`}
                              type="text"
                              value={value}
                              onKeyPress={handleCharacterRestriction}
                              onChange={onChange}
                              placeholder="Enter Company Name"
                              autoComplete="false"
                            />
                          )}
                        />
                        <small>{errors?.companyName?.message}</small>
                      </div>
                    </div>
                    <div className="col-lg-6 col-12">
                      <div className="form-group input_text">
                        <label>
                          Company Email <span className="text-danger">*</span>
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
                              type="email"
                              value={value}
                              onChange={onChange}
                              placeholder="Enter company Email"
                              autoComplete="false"
                            />
                          )}
                          defaultValue=""
                        />
                        <small>{errors?.email?.message}</small>
                      </div>
                    </div>
                    <div className="col-lg-12 col-12">
                      <div className="form-group input_text">
                        <label>
                          Phone <span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="phone"
                          type="text"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <input
                              className={`form-control ${
                                errors?.phone ? "error-input" : ""
                              }`}
                              type="text"
                              maxLength={15}
                              onKeyPress={handleNumberRestriction}
                              value={value}
                              id="myInput"
                              onKeyDown={(e) => handleKeyDown(e)}
                              onChange={onChange}
                              placeholder="Enter Number"
                              autoComplete="false"
                            />
                          )}
                          defaultValue=""
                        />
                        <small>{errors?.phone?.message}</small>
                      </div>
                    </div>
                    <div className="col-lg-6 col-12">
                      <div className="form-group input_text">
                        <label>
                          Address Line 1 <span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="addressLine1"
                          type="text"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <input
                              className={`form-control ${
                                errors?.addressLine1 ? "error-input" : ""
                              }`}
                              type="text"
                              value={value}
                              onChange={onChange}
                              placeholder="Enter Address 1"
                              autoComplete="false"
                            />
                          )}
                          defaultValue=""
                        />
                        <small>{errors?.addressLine1?.message}</small>
                      </div>
                    </div>
                    <div className="col-lg-6 col-12">
                      <div className="form-group input_text">
                        <label>Address Line 2</label>
                        <Controller
                          name="addressLine2"
                          type="text"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <input
                              className={`form-control ${
                                errors?.addressLine2 ? "error-input" : ""
                              }`}
                              type="text"
                              value={value}
                              onChange={onChange}
                              placeholder="Enter Address 2"
                              autoComplete="false"
                            />
                          )}
                          defaultValue=""
                        />
                        <small>{errors?.addressLine2?.message}</small>
                      </div>
                    </div>
                    <div className="col-lg-6 col-12">
                      <div className="form-group input_text">
                        <label>
                          {" "}
                          City <span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="city"
                          type="text"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <input
                              className={`form-control ${
                                errors?.city ? "error-input" : ""
                              }`}
                              type="text"
                              value={value}
                              onChange={onChange}
                              onKeyPress={handleCharacterRestriction}
                              placeholder="Enter City"
                              autoComplete="false"
                            />
                          )}
                          defaultValue=""
                        />
                        <small>{errors?.city?.message}</small>
                      </div>
                    </div>
                    <div className="col-lg-6 col-12">
                      <div className="form-group input_text">
                        <label>
                          {" "}
                          State <span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="state"
                          type="text"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <input
                              className={`form-control ${
                                errors?.state ? "error-input" : ""
                              }`}
                              type="text"
                              value={value}
                              onChange={onChange}
                              onKeyPress={handleCharacterRestriction}
                              placeholder="Enter State"
                              autoComplete="false"
                            />
                          )}
                          defaultValue=""
                        />
                        <small>{errors?.state?.message}</small>
                      </div>
                    </div>
                    <div className="col-lg-6 col-12">
                      <div className="form-group input_text">
                        <label>
                          Country <span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="country"
                          type="text"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <input
                              className={`form-control ${
                                errors?.country ? "error-input" : ""
                              }`}
                              type="text"
                              value={value}
                              onChange={onChange}
                              onKeyPress={handleCharacterRestriction}
                              placeholder="Enter Country"
                              autoComplete="false"
                            />
                          )}
                          defaultValue=""
                        />
                        <small>{errors?.country?.message}</small>
                      </div>
                    </div>
                    <div className="col-lg-6 col-12">
                      <div className="form-group input_text">
                        <label>
                          {" "}
                          Pincode <span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="pincode"
                          type="number"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <input
                              className="form-control"
                              type="text"
                              value={value}
                              onChange={onChange}
                              onKeyPress={handleNumberRestriction}
                              placeholder="Enter Pincode"
                              autoComplete="false"
                            />
                          )}
                          defaultValue=""
                        />
                      </div>
                    </div>
                    <div className="col-lg-12 col-12">
                      <div className="input-block mb-3">
                        <label>Site Logo</label>
                        <div className="input-block service-upload logo-upload mb-0">
                          <div className="drag-drop">
                            <h6 className="drop-browse align-center">
                              <span className="text-info me-1">
                                Click to Replace{" "}
                              </span>{" "}
                              or Drag and Drop
                            </h6>
                            <p className="text-muted">
                              JPEG, PNG, JPG (Max 800*400px)
                            </p>

                            <input
                              type="file"
                              {...register("siteLogo")}
                              onChange={(e) => handleFileUpload(e, 800, 400)}
                            />
                            <div id="frames" />
                          </div>

                          {fileImg && (
                            <img
                              className="uploaded-img"
                              style={{
                                display: "flex",
                                maxWidth: "200px",
                                maxHeight: "200px",
                              }}
                              src={fileImg}
                              alt="Selected"
                              onError={handleImageError}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-12">
                      <div className="input-block">
                        <label>Favicon</label>
                        <div className="input-block service-upload logo-upload mb-0">
                          <div className="drag-drop">
                            <h6 className="drop-browse align-center">
                              <span className="text-info me-1">
                                Click to Replace{" "}
                              </span>{" "}
                              or Drag and Drop
                            </h6>
                            <p className="text-muted">
                              JPEG, PNG, JPG (Max 35*35px)
                            </p>
                            <input
                              type="file"
                              {...register("faviconLogo")}
                              onChange={(e) => handleFavIconUpload(e, 35, 35)}
                            />
                            <div id="frames" />
                          </div>
                          
                          {iconError && (
                            <p className="text-danger">{iconError}</p>
                          )}
                          {favIcon && (
                            <img
                              className="uploaded-img"
                              style={{
                                display: "flex",
                                // border: "2px solid tomato",
                                maxWidth: "200px",
                                maxHeight: "200px",
                              }}
                              src={favIcon}
                              alt="Selected"
                              onError={handleIconError}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-12">
                      <div className="input-block">
                        <label>Company icon</label>
                        <div className="input-block service-upload logo-upload mb-0">
                          <div className="drag-drop">
                            <h6 className="drop-browse align-center">
                              <span className="text-info me-1">
                                Click To Replace{" "}
                              </span>{" "}
                              or Drag and Drop
                            </h6>
                            <p className="text-muted">
                              SVG, PNG, JPG (Max 100*100px)
                            </p>
                            <input
                              type="file"
                              {...register("companyLogo")}
                              onChange={(e) =>
                                handleCompanyIconUpload(e, 100, 100)
                              }
                            />
                          </div>
                         
                          {companyIconError && (
                            <p className="text-danger">{companyIconError}</p>
                          )}

                          {companyIcon && (
                            <img
                              className="uploaded-img max-img-upload"
                              style={{
                                display: "flex",
                                maxWidth: "200px",
                                maxHeight: "200px",
                              }}
                              src={companyIcon}
                              alt="Selected"
                              onError={handleLogoError}
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-12">
                      <div className="btn-path text-end">
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
export default CompanySettings;
