import React, { useState, useEffect, useContext } from "react";
import { AdminContext } from "./admin.control";
import { Link } from "react-router-dom";
import { AlterFavIcon, Logo } from "../../../common/imagepath";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Helmet } from "react-helmet";
import { ApiServiceContext } from "../../../core/core-index";

const AdminLogin = () => {
  const { getData } = useContext(ApiServiceContext);

  const {
    loginFormScheme,
    submitLoginForm,
    handleRemember,
    onEyeClick,
    eye,
    rememberme,
  } = useContext(AdminContext);

  const {
    handleSubmit,
    control,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginFormScheme),
    defaultValues: {
      email: "lynns@roshnroys.com",
      password: " Lynns123@#",
    },
  });

  const [faviconurl, setfaviconurl] = useState(null);
  const [companyLogourl, setcompanyLogourl] = useState(null);
  const [companyTitle, setcompanyTitle] = useState(null);

  useEffect(() => {
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
                                value={value || ""}
                                onChange={onChange}
                                autoComplete="false"
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
                                        // setrememberme(!rememberme);
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
                      <button
                        className="btn btn-lg btn-block w-100 btn-primary w-100"
                        type="submit"
                      >
                        Login
                      </button>
                    </form>
                    {/* <div className="login-or">
                      <span className="or-line" />
                      <span className="span-or">or</span>
                    </div> */}
                    {/* Social Login */}
                    {/* <div className="social-login mb-3">
                      <span>Login with</span>
                      <Link to="#" className="facebook">
                        <i className="fab fa-facebook-f" />
                      </Link>
                      <Link to="#" className="google">
                        <i className="fab fa-google" />
                      </Link>
                    </div> */}
                    {/* /Social Login */}
                    {/* <div className="text-center dont-have">
                      Don't have an account yet?{" "}
                      <Link to="/register">Register</Link>
                    </div> */}
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
export default AdminLogin;
