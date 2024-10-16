import React, { useContext, useEffect } from "react";
import { PreferencesContext } from "./Preferences.control";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import SettingSidebar from "../settingSidebar";

const Preferences = () => {
  const {
    Preferenceschema,
    currency,
    permission,
    admin,
    Preferences,
    updatePreferencesForm,
  } = useContext(PreferencesContext);

  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(Preferenceschema) });

  const { create } = permission;

  useEffect(() => {
    if (Preferences?.currencyInfo != undefined)
      setValue("currency", Preferences?.currencyInfo);
    setValue("language", Preferences?.language);
    setValue("timeZone", Preferences?.timeZone);
    setValue("dateFormat", Preferences?.dateFormat);
    setValue("timeFormat", Preferences?.timeFormat);
    setValue("financialYear", Preferences?.financialYear);
  }, [Preferences]);

  // eslint-disable-next-line no-unused-vars
  const colourStyles = {
    option: (styles, { isFocused, isSelected }) => {
      return {
        ...styles,
        backgroundColor: isFocused
          ? isSelected
            ? "green"
            : "orange"
          : isSelected
          ? "red"
          : "white",
        color: "black",
      };
    },
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="row">
            <div className="col-xl-3 col-md-4">
              <div className="card">
                <div className="card-body">
                  {/* Page Header */}
                  <div className="page-header">
                    <div className="content-page-header">
                      <h5>Settings</h5>
                    </div>
                  </div>
                  {/* /Page Header */}
                  {/* Settings Menu */}
                  <SettingSidebar />
                  {/* /Settings Menu */}
                </div>
              </div>
            </div>
            <div className="col-xl-9 col-md-8">
              <div className="card">
                <div className="card-body w-100 preference_setting">
                  <div className="content-page-header">
                    <h5>Preference Settings</h5>
                  </div>
                  <form onSubmit={handleSubmit(updatePreferencesForm)}>
                    <div className="row">
                      <div className="col-lg-6 col-12">
                        <div className="form-group input_type">
                          <label>
                            Currency <span className="text-danger">*</span>
                          </label>
                          <Controller
                            control={control}
                            name="currency"
                            render={({ field }) => (
                              <Select
                                {...field}
                                className={`react-selectcomponent form-control w-100 ${
                                  errors?.currency ? "error-input" : ""
                                }`}
                                placeholder="Choose Currency"
                                getOptionLabel={(option) =>
                                  `${option.country_currency_name} ${option.currency_symbol}`
                                }
                                getOptionValue={(option) => option._id}
                                options={currency}
                                classNamePrefix="select_kanakku"
                                
                              />
                            )}
                          />
                          <small>{errors?.currency?.message}</small>
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
    </>
  );
};
export default Preferences;
