import React, { useState, useEffect, useContext } from "react";
import { AlterFavIcon, Logo } from "../../common/imagepath";
import { useForm } from "react-hook-form";
import { emailvalidMessage } from "../../constans";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../approuter";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import {
  ApiServiceContext,
  forgotpassword,
  successToast,
} from "../../core/core-index";

const ForgotPassword = () => {
  const { getData, postData } = useContext(ApiServiceContext);
  const { setloggedin } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    trigger,
  } = useForm();
  let navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await postData(forgotpassword, data);
      if (response.code == 200) {
        successToast("Mail sent Success");
        navigate("/login");
        reset();
      }
    } catch {
      return false;
    }
  };

  const [faviconurl, setfaviconurl] = useState(null);
  const [companyLogourl, setcompanyLogourl] = useState(null);
  const [companyTitle, setcompanyTitle] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem("authToken")) setloggedin(false);
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
                  <h1>Forgot Password?</h1>
                  <p className="account-subtitle">
                    Enter your email to get a password reset link
                  </p>

                  {/* Form */}
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                      <label className="form-control-label">
                        Email Address
                      </label>
                      <input
                        className="form-control"
                        type="text"
                        {...register("email", {
                          required: "Email is Required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: emailvalidMessage,
                          },
                        })}
                        onKeyUp={() => {
                          trigger("email");
                        }}
                      />
                      {errors.email && (
                        <p className="text-danger">{errors.email.message}</p>
                      )}
                    </div>

                    <div className="form-group mb-0">
                      {/* <button className="btn btn-lg btn-block w-100 btn-primary w-100" type="submit" disabled={isloading}>{isloading ? 'Loading..' : 'Reset Password'}</button> */}
                      <button
                        className="btn btn-lg btn-block w-100 btn-primary w-100"
                        type="submit"
                      >
                        {" "}
                        Reset Password
                      </button>
                    </div>
                  </form>
                  {/* /Form */}

                  <div className="text-center dont-have">
                    Remember your password? <Link to="/login">Login</Link>
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
export default ForgotPassword;
