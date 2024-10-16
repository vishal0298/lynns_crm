import React, { useContext, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../../common/imagepath";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginApi } from "../../constans/apiname";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { postData } from "../../services/apiservice";
import { setLoginToken, setCurrentLoginUser } from "../../constans/globals";
import { AuthContext } from "../../approuter";
import jwt from "jwt-decode";
import { passwordRegex, passwordValidMessage, emailRgx } from "../../constans";

const schema = yup
  .object({
    email: yup
      .string()
      .matches(emailRgx, "Please Enter valid Email")
      .required("Email is required")
      .trim(),
    password: yup
      .string()
      .matches(passwordRegex, passwordValidMessage)
      .required("Password is Required")
      .trim(),
  })
  .required();

const Login = (props) => {
  const [isloading, setIsloading] = useState(false);
  const [userToken, setUser] = useState({});
  const [rememberData, setRememberData] = useState();
  const [emailrememberData, setemailRememberData] = useState();
  const [localuser, setLocaluser] = useState();
  const [loginUserData, setLoginUserdata] = useState();

  const authCtxData = useContext(AuthContext);
  const setToken = authCtxData?.setToken;
  const navigate = useNavigate();
  const emailRem = useRef(null);
  const passwordRem = useRef(null);

  const [eye, seteye] = useState(true);

  const {
    handleSubmit,
    control,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsloading(true);
    try {
      const response = await postData(loginApi, data);

      if (response.code == 200) {
        navigate("/index");
        const token = response.data.token;
        const user = jwt(token);

        setUser(user);
        setTimeout(() => {
          setIsloading(false);
          setLoginToken(response.data.token);
          setCurrentLoginUser(loginUserData);
        }, 600);
        reset();
      }
    } catch {
      setIsloading(false);
    }
  };
 
  const handleRemember = () => {
    setRememberData(emailRem.current.value);
    setemailRememberData(passwordRem.current.value);
    setLocaluser(rememberData, emailrememberData);
    let userDatas = {
      email: emailRem.current.value,
      password: passwordRem.current.value,
    };
    setLoginUserdata(JSON.stringify(userDatas));
  };
  const onEyeClick = () => {
    seteye(!eye);
  };

  return (
    <>
      <div className="main-wrapper login-body">
        <div className="login-wrapper">
          <div className="container">
            <img className="img-fluid logo-dark mb-2" src={Logo} alt="Logo" />
            <div className="loginbox">
              <div className="login-right">
                <div className="login-right-wrap">
                  <h1>Login</h1>
                  <p className="account-subtitle">Access to our dashboard</p>
                  <div>
                    <form onSubmit={handleSubmit(onSubmit)}>
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
                              value={value}
                              onChange={onChange}
                              autoComplete="false"
                              ref={emailRem}
                            />
                          )}
                          defaultValue=""
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
                                value={value}
                                onChange={onChange}
                                autoComplete="false"
                                ref={passwordRem}
                              />
                              <span
                                onClick={onEyeClick}
                                className={`fa toggle-password" ${
                                  eye ? "fa-eye-slash" : "fa-eye"
                                }`}
                              />
                            </div>
                          )}
                          defaultValue=""
                        />

                        <small>{errors?.password?.message}</small>
                      </div>
                      <div className="form-group">
                        <div className="row">
                          <div className="col-6">
                            <div className="custom-control custom-checkbox">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                id="cb1"
                                onClick={() => handleRemember()}
                              />
                              <label
                                className="custom-control-label ms-1"
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
                        disabled={isloading}
                      >
                        {isloading ? "Loading.." : "Sign In"}
                      </button>
                    </form>
                    <div className="login-or">
                      <span className="or-line" />
                      <span className="span-or">or</span>
                    </div>
                    {/* Social Login */}
                    <div className="social-login mb-3">
                      <span>Login with</span>
                      <Link to="#" className="facebook">
                        <i className="fab fa-facebook-f" />
                      </Link>
                      <Link to="#" className="google">
                        <i className="fab fa-google" />
                      </Link>
                    </div>
                    {/* /Social Login */}
                    <div className="text-center dont-have">
                      Don't have an account yet?{" "}
                      <Link to="/register">Register</Link>
                    </div>
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
