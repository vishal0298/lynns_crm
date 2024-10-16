import React, { useContext, useEffect, useState } from "react";
import { InvoiceSettingsContext } from "./InvoiceSettings.control";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useFilePreview from "../hooks/useFilePreview";
import { warningToast } from "../../../../core/core-index";
import SettingSidebar from "../settingSidebar";

const InvoiceSettings = () => {
  const {
    InvoiceSettingschema,
    invoiceSettings,
    updateInvoiveSettingsForm,
    logoImgError,
    setlogoImgError,
    permission,
    admin,
  } = useContext(InvoiceSettingsContext);
  const {
    handleSubmit,
    register,
    control,
    setValue,
    watch,
    resetField,
    formState: { errors },
  } = useForm({ resolver: yupResolver(InvoiceSettingschema) });
  const { create } = permission;
  const [invoiceLogostate, setFilelogo] = useState(null);
  const files = watch(["invoiceLogo"]);

  const [invoiceLogoPreview] = useFilePreview(
    files?.[0],
    setlogoImgError,
    "FIRST"
  );

  useEffect(() => {
    if (logoImgError) {
      warningToast(logoImgError);
      resetField("invoiceLogo");
      setlogoImgError("");
    }
  }, [logoImgError]);

  useEffect(() => {
    setFilelogo(invoiceLogoPreview);
  }, [invoiceLogoPreview]);

  useEffect(() => {
    setFilelogo(invoiceSettings?.invoiceLogo);
    setValue("invoicePrefix", invoiceSettings?.invoicePrefix);
  }, [invoiceSettings]);

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
                {/* </div> */}
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
                  <h5>Invoice Settings</h5>
                </div>
                <form onSubmit={handleSubmit(updateInvoiveSettingsForm)}>
                  <div className="row">
                    <div className="col-lg-6 col-12">
                      <div className="form-group input_text">
                        <label>
                          Invoice Prefix <span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="invoicePrefix"
                          type="text"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <input
                              className={`form-control ${
                                errors?.invoicePrefix ? "error-input" : ""
                              }`}
                              type="text"
                              value={value}
                              onChange={onChange}
                              placeholder="Enter Invoice Prefix"
                              autoComplete="false"
                            />
                          )}
                          defaultValue=""
                        />
                        <small>{errors?.invoicePrefix?.message}</small>
                      </div>
                    </div>
                    <div className="col-xl-12">
                      <div className="input-block mb-3">
                        <label>Invoice Logo</label>
                        <div className="input-block service-upload logo-upload mb-0">
                          
                          <div className="drag-drop">
                            <h6 className="drop-browse align-center">
                              <span className="text-info me-1">
                                Click to Replace{" "}
                              </span>{" "}
                              or Drag and Drop
                            </h6>
                            <p className="text-muted">SVG, PNG, JPG </p>
                            <input
                              type="file"
                              multiple=""
                              {...register("invoiceLogo")}
                            />
                            <div id="frames" />
                          </div>
                          {invoiceLogostate && (
                            <div className="position-relative">
                              <FeatherIcon icon="X" />
                              <img
                                className="uploaded-img"
                                style={{
                                  display: "flex",
                                  maxWidth: "200px",
                                  maxHeight: "200px",
                                }}
                                src={invoiceLogostate}
                                alt=""
                              />
                            </div>
                          )}
                        </div>
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
                        {invoiceLogostate && (
                          <Link
                            to="#"
                            className="btn btn-cancel bg-primary-light ms-3"
                            onClick={() => setFilelogo(null)}
                          >
                            Remove Logo
                          </Link>
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
export default InvoiceSettings;
