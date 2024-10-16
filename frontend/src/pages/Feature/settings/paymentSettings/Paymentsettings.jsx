import React, { useContext, useEffect, useState } from "react";
import { PaymentSettingsContext } from "./Paymentsettings.control";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { successToast } from "../../../../core/core-index";
import SettingSidebar from "../settingSidebar";

const PaymentSettings = () => {
  const [isCopied, setIsCopied] = useState(false);
  const {
    PaymentSettingschema,
    paymentSettingsInfos,
    updatePaymentSettingsForm,
    isStripe,
    isPaypal,
    setisStripe,
    setisPaypal,
    permission,
    admin,
  } = useContext(PaymentSettingsContext);

  const {
    handleSubmit,
    control,
    setValue,
    register,
    formState: { errors },
  } = useForm({ resolver: yupResolver(PaymentSettingschema) });
  const { create } = permission;
  const handlestripe = () => setisStripe(isStripe == true ? false : true);
  const handlepaypal = () => setisPaypal(isPaypal == true ? false : true);

  useEffect(() => {
    setisStripe(
      paymentSettingsInfos?.isStripe ? paymentSettingsInfos?.isStripe : false
    );
    setisPaypal(
      paymentSettingsInfos?.isPaypal ? paymentSettingsInfos?.isPaypal : false
    );
    setValue("stripepublishKey", paymentSettingsInfos?.stripepublishKey);
    setValue("stripeSecretKey", paymentSettingsInfos?.stripeSecretKey);
    setValue("paypalClientId", paymentSettingsInfos?.paypalClientId);
    setValue("paypalSecret", paymentSettingsInfos?.paypalSecret);
    setValue(
      "sandbox_stripepublishKey",
      paymentSettingsInfos?.sandbox_stripepublishKey
    );
    setValue(
      "sandbox_stripeSecretKey",
      paymentSettingsInfos?.sandbox_stripeSecretKey
    );
    setValue(
      "sandbox_paypalClientId",
      paymentSettingsInfos?.sandbox_paypalClientId
    );
    setValue(
      "sandbox_paypalSecret",
      paymentSettingsInfos?.sandbox_paypalSecret
    );
    setValue("stripe_webhook_url", paymentSettingsInfos?.stripe_webhook_url);
    setValue(
      "sandbox_stripe_hookurl",
      paymentSettingsInfos?.sandbox_stripe_hookurl
    );
    setValue("paypal_webhook_url", paymentSettingsInfos?.paypal_webhook_url);
    setValue(
      "sandbox_paypal_hookurl",
      paymentSettingsInfos?.sandbox_paypal_hookurl
    );
    setValue("stripe_account_type", paymentSettingsInfos?.stripe_account_type);
    setValue("paypal_account_type", paymentSettingsInfos?.paypal_account_type);
  }, [paymentSettingsInfos]);

  const handleCopyToClipboard = () => setIsCopied(true);

  useEffect(() => {
    if (isCopied) {
      successToast("Copied !");
      setIsCopied(false);
    }
  }, [isCopied]);

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
            <div className="content w-100 pt-0">
              <div className="content-page-header">
                <h5>Payment Settings</h5>
              </div>
              
              <form onSubmit={handleSubmit(updatePaymentSettingsForm)}>
                <div className="form-group-item">
                  <h4>Stripe Details</h4>
                  <div className="row mt-3">
                    <div className="form-group input_text">
                      <div className="payment-provider justify-content-between">
                        <div className="d-flex">
                          <div className="payment-provider-items row-reverses me-2">
                            <h4>Live</h4>
                            <div className="mail-setting">
                              <div>
                                <ul className="d-flex align-items-center">
                                  <li>
                                    <label className="custom_radio me-4 mb-0 ">
                                      <input
                                        {...register("stripe_account_type")}
                                        type="radio"
                                        value="LIVE"
                                        className="form-control"
                                        id="LIVE_type"
                                      />
                                      <span className="checkmark"></span>
                                    </label>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          <div className="payment-provider-items row-reverses">
                            <h4>Sandbox</h4>
                            <div className="mail-setting">
                              <div>
                                <ul className="d-flex align-items-center">
                                  <li>
                                    <label className="custom_radio me-4 mb-0 ">
                                      <input
                                        {...register("stripe_account_type")}
                                        type="radio"
                                        value="SANDBOX"
                                        id="SANDBOX_type"
                                        className="form-control"
                                      />
                                      <span className="checkmark"></span>
                                    </label>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="payment-provider-items">
                          <h4>Stripe</h4>
                          <div className="mail-setting">
                            <div className="status-toggle">
                              
                              <input
                                {...register("isStripe")}
                                className="check"
                                type="checkbox"
                                id="isStripe"
                                checked={isStripe} // Use the state variable to control the input
                                onChange={(e) => {
                                  setisStripe(e.target.checked); 
                                }}
                              />
                              <label
                                htmlFor="rating_1"
                                className="checktoggle checkbox-bg"
                                onClick={() => {
                                  handlestripe();
                                }}
                              >
                                checkbox
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <small>{errors?.stripe_account_type?.message}</small>
                    </div>
                    <div className="row">
                      <div className="col-lg-6 col-12 live">
                        <div className="col-lg-12 col-12">
                          <div className="form-group input_text">
                            <label>Stripe Publish Key</label>
                            <Controller
                              name="stripepublishKey"
                              type="text"
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <input
                                  className={`form-control ${
                                    errors?.stripepublishKey
                                      ? "error-input"
                                      : ""
                                  }`}
                                  type="text"
                                  value={value ? value : ""}
                                  onChange={onChange}
                                  placeholder="Enter Stripe Publish Key"
                                  autoComplete="false"
                                />
                              )}
                              defaultValue=""
                            />
                            <small>{errors?.stripepublishKey?.message}</small>
                          </div>
                        </div>
                        <div className="col-lg-12 col-12">
                          <div className="form-group input_text">
                            <label>Stripe Secret Key</label>
                            <Controller
                              name="stripeSecretKey"
                              type="text"
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <input
                                  className={`form-control ${
                                    errors?.stripeSecretKey ? "error-input" : ""
                                  }`}
                                  type="text"
                                  value={value ? value : ""}
                                  onChange={onChange}
                                  placeholder="Enter Stripe Secret Key"
                                  autoComplete="false"
                                />
                              )}
                              defaultValue=""
                            />
                            <small>{errors?.stripeSecretKey?.message}</small>
                          </div>
                        </div>
                        <div className="col-12 col-12">
                          <div className="form-group input_text">
                            <label>WebHook Url</label>
                            <div className="input-group">
                              {" "}
                              <Controller
                                name="stripe_webhook_url"
                                type="text"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <input
                                    disabled={true}
                                    className={`form-control ${
                                      errors?.stripe_webhook_url
                                        ? "error-input"
                                        : ""
                                    }`}
                                    type="text"
                                    value={value ? value : ""}
                                    onChange={onChange}
                                  />
                                )}
                                defaultValue=""
                              />
                              <div className="input-group-append">
                                <CopyToClipboard
                                  onCopy={handleCopyToClipboard}
                                  text={
                                    paymentSettingsInfos?.stripe_webhook_url
                                  }
                                >
                                  <button
                                    type="button"
                                    className="btn btn-outline-secondary hookcopybtn"
                                  >
                                    Copy
                                  </button>
                                </CopyToClipboard>
                              </div>
                            </div>
                            <small>{errors?.stripe_webhook_url?.message}</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 col-12 sandbox">
                        <div className="col-lg-12 col-12">
                          <div className="form-group input_text">
                            <label>Sandbox Stripe Publish Key</label>
                            <Controller
                              name="sandbox_stripepublishKey"
                              type="text"
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <input
                                  className={`form-control ${
                                    errors?.sandbox_stripepublishKey
                                      ? "error-input"
                                      : ""
                                  }`}
                                  type="text"
                                  value={value ? value : ""}
                                  onChange={onChange}
                                  placeholder="Enter Stripe Publish Key"
                                  autoComplete="false"
                                />
                              )}
                              defaultValue=""
                            />
                            <small>
                              {errors?.sandbox_stripepublishKey?.message}
                            </small>
                          </div>
                        </div>
                        <div className="col-lg-12 col-12">
                          <div className="form-group input_text">
                            <label>Sandbox Stripe Secret Key</label>
                            <Controller
                              name="sandbox_stripeSecretKey"
                              type="text"
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <input
                                  className={`form-control ${
                                    errors?.sandbox_stripeSecretKey
                                      ? "error-input"
                                      : ""
                                  }`}
                                  type="text"
                                  value={value ? value : ""}
                                  onChange={onChange}
                                  placeholder="Enter Stripe Secret Key"
                                  autoComplete="false"
                                />
                              )}
                              defaultValue=""
                            />
                            <small>
                              {errors?.sandbox_stripeSecretKey?.message}
                            </small>
                          </div>
                        </div>
                        <div className="col-lg-12 col-12">
                          <div className="form-group input_text">
                            <label>Sandbox WebHook Url</label>
                            <div className="input-group">
                              {" "}
                              <Controller
                                name="sandbox_stripe_hookurl"
                                type="text"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <input
                                    disabled={true}
                                    className={`form-control ${
                                      errors?.stripe_webhook_url
                                        ? "error-input"
                                        : ""
                                    }`}
                                    type="text"
                                    value={value ? value : ""}
                                    onChange={onChange}
                                  />
                                )}
                                defaultValue=""
                              />
                              <div className="input-group-append">
                                <CopyToClipboard
                                  onCopy={handleCopyToClipboard}
                                  text={
                                    paymentSettingsInfos?.sandbox_stripe_hookurl
                                  }
                                >
                                  <button
                                    type="button"
                                    className="btn btn-outline-secondary hookcopybtn"
                                  >
                                    Copy
                                  </button>
                                </CopyToClipboard>
                              </div>
                            </div>
                            <small>{errors?.stripe_webhook_url?.message}</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <hr></hr>
                  <h4>Paypal Details</h4>
                  <div className="row mt-3">
                    <div className="form-group input_text">
                      <div className="payment-provider justify-content-between">
                        <div className="d-flex">
                          <div className="payment-provider-items row-reverses me-2">
                            <h4>Live</h4>
                            <div className="mail-setting">
                              <label className="custom_radio me-4 mb-0 ">
                                <input
                                  {...register("paypal_account_type")}
                                  type="radio"
                                  value="LIVE"
                                  id="LIVE_type"
                                  defaultChecked={false}
                                />
                                <span className="checkmark"></span>
                              </label>
                              
                            </div>
                          </div>
                          <div className="payment-provider-items row-reverses">
                            <h4>Sandbox</h4>
                            <div className="mail-setting">
                              <div>
                                <ul className="d-flex align-items-center">
                                  <li>
                                    <label className="custom_radio me-4 mb-0 ">
                                      <input
                                        {...register("paypal_account_type")}
                                        type="radio"
                                        value="SANDBOX"
                                        id="SANDBOX_type"
                                        defaultChecked={false}
                                      />
                                      <span className="checkmark"></span>
                                    </label>
                                  </li>
                                </ul>
                              </div>
                             
                            </div>
                          </div>
                        </div>
                        <div className="payment-provider-items">
                          <h4>Paypal</h4>
                          <div className="mail-setting">
                            <div className="status-toggle">
                        
                              <input
                                {...register("isPaypal")}
                                className="check"
                                type="checkbox"
                                id="isPaypal"
                                checked={isPaypal} // Use the state variable to control the input
                                onChange={(e) => {
                                  setisPaypal(e.target.checked); 
                                }}
                              />
                              <label
                                htmlFor="rating_1"
                                className="checktoggle checkbox-bg"
                                onClick={() => {
                                  handlepaypal();
                                }}
                              >
                                checkbox
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <small>{errors?.paypal_account_type?.message}</small>
                    </div>
                    <div className="row">
                      <div className="col-lg-6 col-12 live">
                        <div className="col-lg-12 col-12">
                          <div className="form-group input_text">
                            <label>Paypal Client</label>
                            <Controller
                              name="paypalClientId"
                              type="text"
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <input
                                  className={`form-control ${
                                    errors?.paypalClientId ? "error-input" : ""
                                  }`}
                                  type="text"
                                  value={value ? value : ""}
                                  onChange={onChange}
                                  placeholder="Enter Paypal Client"
                                  autoComplete="false"
                                />
                              )}
                              defaultValue=""
                            />
                            <small>{errors?.paypalClientId?.message}</small>
                          </div>
                        </div>
                        <div className="col-lg-12 col-12">
                          <div className="form-group input_text">
                            <label>Paypal Secret</label>
                            <Controller
                              name="paypalSecret"
                              type="text"
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <input
                                  className={`form-control ${
                                    errors?.paypalSecret ? "error-input" : ""
                                  }`}
                                  type="text"
                                  value={value ? value : ""}
                                  onChange={onChange}
                                  placeholder="Enter Paypal Secret"
                                  autoComplete="false"
                                />
                              )}
                              defaultValue=""
                            />
                            <small>{errors?.paypalSecret?.message}</small>
                          </div>
                        </div>
                        <div className="col-12 col-12">
                          <div className="form-group input_text">
                            <label>WebHook Url</label>
                            <div className="input-group">
                              {" "}
                              <Controller
                                name="paypal_webhook_url"
                                type="text"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <input
                                    disabled={true}
                                    className={`form-control ${
                                      errors?.paypal_webhook_url
                                        ? "error-input"
                                        : ""
                                    }`}
                                    type="text"
                                    value={value ? value : ""}
                                    onChange={onChange}
                                  />
                                )}
                                defaultValue=""
                              />
                              <div className="input-group-append">
                                <CopyToClipboard
                                  onCopy={handleCopyToClipboard}
                                  text={
                                    paymentSettingsInfos?.paypal_webhook_url
                                  }
                                >
                                  <button
                                    type="button"
                                    className="btn btn-outline-secondary hookcopybtn"
                                  >
                                    Copy
                                  </button>
                                </CopyToClipboard>
                              </div>
                            </div>
                            <small>{errors?.paypal_webhook_url?.message}</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 col-12 sandbox">
                        <div className="col-lg-12 col-12">
                          <div className="form-group input_text">
                            <label>Sandbox Paypal Client</label>
                            <Controller
                              name="sandbox_paypalClientId"
                              type="text"
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <input
                                  className={`form-control ${
                                    errors?.sandbox_paypalClientId
                                      ? "error-input"
                                      : ""
                                  }`}
                                  type="text"
                                  value={value ? value : ""}
                                  onChange={onChange}
                                  placeholder="Enter Paypal Client"
                                  autoComplete="false"
                                />
                              )}
                              defaultValue=""
                            />
                            <small>
                              {errors?.sandbox_paypalClientId?.message}
                            </small>
                          </div>
                        </div>
                        <div className="col-lg-12 col-12">
                          <div className="form-group input_text">
                            <label>Sandbox Paypal Secret</label>
                            <Controller
                              name="sandbox_paypalSecret"
                              type="text"
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <input
                                  className={`form-control ${
                                    errors?.sandbox_paypalSecret
                                      ? "error-input"
                                      : ""
                                  }`}
                                  type="text"
                                  value={value ? value : ""}
                                  onChange={onChange}
                                  placeholder="Enter Paypal Secret"
                                  autoComplete="false"
                                />
                              )}
                              defaultValue=""
                            />
                            <small>
                              {errors?.sandbox_paypalSecret?.message}
                            </small>
                          </div>
                        </div>
                        <div className="col-12 col-12">
                          <div className="form-group input_text">
                            <label>Sandbox WebHook Url</label>
                            <div className="input-group">
                              {" "}
                              {/* Wrap the input and icon inside an input-group */}
                              <Controller
                                name="sandbox_paypal_hookurl"
                                type="text"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <input
                                    disabled={true}
                                    className={`form-control ${
                                      errors?.sandbox_paypal_hookurl
                                        ? "error-input"
                                        : ""
                                    }`}
                                    type="text"
                                    value={value ? value : ""}
                                    onChange={onChange}
                                  />
                                )}
                                defaultValue=""
                              />
                              <div className="input-group-append">
                                <CopyToClipboard
                                  onCopy={handleCopyToClipboard}
                                  text={
                                    paymentSettingsInfos?.sandbox_paypal_hookurl
                                  }
                                >
                                  <button
                                    type="button"
                                    className="btn btn-outline-secondary hookcopybtn"
                                  >
                                    Copy
                                  </button>
                                </CopyToClipboard>
                              </div>
                            </div>
                            <small>
                              {errors?.sandbox_paypal_hookurl?.message}
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="btn-path">
                      <Link
                        to={-1}
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
  );
};
export default PaymentSettings;
