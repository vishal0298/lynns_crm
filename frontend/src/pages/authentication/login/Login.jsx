import React, { useState, useEffect, useContext } from "react";
import { LoginContext } from "./login.control";
import { Link } from "react-router-dom";
import { AlterFavIcon, Logo } from "../../../common/imagepath";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AuthContext } from "../../../approuter";
import { Helmet } from "react-helmet";
import { ApiServiceContext } from "../../../core/core-index";

const Login = () => {
  const { getData } = useContext(ApiServiceContext);
  const { setloggedin } = useContext(AuthContext);

  const {
    loginFormScheme,
    emailRem,
    passwordRem,
    submitLoginForm,
    handleRemember,
    onEyeClick,
    eye,
    rememberme,
    setrememberme,
  } = useContext(LoginContext);

  const {
    handleSubmit,
    control,
    trigger,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginFormScheme),
  });

  const [faviconurl, setfaviconurl] = useState(null);
  const [companyLogourl, setcompanyLogourl] = useState(null);
  const [companyTitle, setcompanyTitle] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem("authToken")) setloggedin(false);
    let rebembermedata = localStorage.getItem("rebemberme");
    if (rebembermedata != "undefined" && rebembermedata != null) {
      let rebembermedataParsed = JSON.parse(rebembermedata);
      if (rebembermedataParsed?.rememberme) {
        setValue("email", rebembermedataParsed?.email);
        setValue("password", rebembermedataParsed?.password);
        setrememberme(rebembermedataParsed?.rememberme);
      }
    }

    const getcompanyImages = async () => {
      try {
        const response = await getData(`/unauthorized/companysettings`, false);
        if (response?.code == 200) {
          setfaviconurl(response.data?.favicon);
          setcompanyLogourl(response.data?.siteLogo);
          setcompanyTitle(response.data?.companyName);
          localStorage.setItem("favicon", response.data?.favicon);
          localStorage.setItem("companyLogo", response.data?.siteLogo);
          localStorage.setItem("companyTitle", response.data?.companyName);
        }
      } catch (err) {
        return false;
      }
    };
    getcompanyImages();
  }, []);

  return (
    <>
      <Helmet>
        <title>{companyTitle || "Lynns Salon"}</title>
        <link rel="icon" href={faviconurl ? faviconurl : AlterFavIcon}></link>
      </Helmet>
      <div className="main-wrapper login-body">
        <div className="login-wrapper">
          <div className="container">
            {/* <img className="img-fluid logo-dark mb-2" src={Logo} alt="Logo" /> */}
            <img
              className="img-fluid logo-dark mb-2"
              src={companyLogourl ? companyLogourl : Logo}
              onError={(event) => {
                event.target.src = Logo;
              }}
              alt="Logo"
            />
            <div className="loginbox">
              <div className="login-right">
                <div className="login-right-wrap">
                  <h1>Login</h1>
                  <p className="account-subtitle">Access to our dashboard </p>
                  <div>
                    <form onSubmit={handleSubmit(submitLoginForm)}>
                      <div className="form-group input_text">
                        <label className="form-control-label">
                          Email Address
                        </label>
                        <Controller
                          name="email"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <input
                              className={`form-control  ${
                                errors?.email ? "error-input" : ""
                              }`}
                              type="text"
                              value={value || ""}
                              onChange={onChange}
                              autoComplete="false"
                              ref={emailRem}
                            />
                          )}
                        />

                        <small>{errors?.email?.message}</small>
                      </div>
                      <div className="form-group input_text">
                        <label className="form-control-label">Password</label>
                        <Controller
                          name="password"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <div className="pass-group">
                              <input
                                type={eye ? "password" : "text"}
                                className={`form-control  ${
                                  errors?.password ? "error-input" : ""
                                }`}
                                style={{
                                  paddingRight : "36px"
                                }}
                                value={value || ""}
                                onChange={onChange}
                                autoComplete="false"
                                ref={passwordRem}
                              />
                              <span
                                onClick={onEyeClick}
                                className={`fa toggle-password ${
                                  eye ? "fa-eye-slash" : "fa-eye"
                                }`}
                              />
                            </div>
                          )}
                        />

                        <small>{errors?.password?.message}</small>
                      </div>
                      <div className="form-group">
                        <div className="row">
                          <div className="col-6">
                            <div className="custom-control custom-checkbox d-flex">
                              {/* <input
                                type="checkbox"
                                className="form-check-input"
                                id="cb1"
                                onClick={() => handleRemember()}
                              /> */}
                              <Controller
                                name="rememberme"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <>
                                    <input
                                      id="cb1"
                                      className="form-check-input p-0"
                                      type="checkbox"
                                      checked={rememberme}
                                      value={value}
                                      onClick={() => handleRemember()}
                                      onChange={(val) => {
                                        onChange(val);
                                        trigger("rememberme");
                                        setrememberme(!rememberme);
                                      }}
                                    />
                                  </>
                                )}
                              />
                              <label
                                className="custom-control-label ms-1 mb-0"
                                htmlFor="cb1"
                              >
                                Remember me
                              </label>
                            </div>
                          </div>
                          <div className="col-6 text-end">
                            <Link className="forgot-link" to="/forgot-password">
                              {" "}
                              Forgot Password ?{" "}
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between">
                        <Link
                          className="btn btn-lg btn-block w-40 btn-primary w-100 mt-3 mb-3 me-1"
                          to="#"
                          onClick={() => {
                            // setValue("email", "admin@lynnstechnologies.com");
                            // setValue("password", "Demo123$");
                            setValue("email", "lynns@roshnroys.com");
                            setValue("password", " Lynns123@#");
                          }}
                        >
                          {" "}
                          Admin Login{" "}
                        </Link>
                      </div>
                      <button
                        className="btn btn-lg btn-block w-100 btn-primary w-100"
                        type="submit"
                      >
                        Login
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Login;
