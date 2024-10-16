import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "../../common/imagepath";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { postData } from "../../services/apiservice";
import { signupApi } from "../../constans/apiname";
import {
  fullnameRequired,
  emailRequired,
  passwordRequired,
  emailvalidMessage,
  emailRgx,
  passwordRegex,
  passwordValidMessage,
} from "../../constans";

const schema = yup
  .object({
    fullname: yup.string("Only char").required(fullnameRequired).nullable(),
    email: yup
      .string()
      .required(emailRequired)
      .matches(emailRgx, emailvalidMessage)
      .required(emailRequired)
      .max(64)
      .trim(),
    password: yup
      .string()
      .required(passwordRequired)
      .matches(passwordRegex, passwordValidMessage)
      .min(6, "Password should be at least 6 characters")
      .trim(),
  })
  .required();

const Register = (props) => {
  const [eye, seteye] = useState(true);
  const [isloading, setIsloading] = useState(false);
  const navigate = useNavigate();
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
      const response = await postData(signupApi, data);

      if (response.code == 200) navigate("/login");
      setTimeout(() => {
        setIsloading(false);
        reset();
      }, 500);
    } catch {
      setIsloading(false);
    }
  };
  const handleKeyPress = (event) => {
    const keyCode = event.keyCode || event.which;
    const keyValue = String.fromCharCode(keyCode);
    if (/^\d+$/.test(keyValue)) {
      event.preventDefault();
    }
  };
  const onEyeClick = () => {
    seteye(!eye);
  };

  return (
    <div className="main-wrapper  login-body">
      <div className="login-wrapper">
        <div className="container">
          <img className="img-fluid logo-dark mb-2" src={Logo} alt="Logo" />

          <div className="loginbox">
            <div className="login-right">
              <div className="login-right-wrap">
                <h1>Register</h1>
                <p className="account-subtitle">Access to our dashboard</p>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="form-group input_text">
                    <label className="form-control-label">Name</label>
                    <Controller
                      name="fullname"
                      type="text"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <input
                          className={`form-control ${
                            errors?.fullname ? "error-input" : ""
                          }`}
                          type="text"
                          value={value}
                          onChange={onChange}
                          autoComplete="false"
                          onKeyPress={handleKeyPress}
                        />
                      )}
                      defaultValue=""
                    />

                    <small>{errors?.fullname?.message}</small>
                  </div>
                  <div className="form-group input_text">
                    <label className="form-control-label">Email Address</label>
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
                  {/* <div className="form-group">
										<label className="form-control-label">Confirm Password</label>
										<Controller
											name="confirmPassword"
											control={control}
											render={({ field: { value, onChange } }) => (
												<input   className={`form-control  ${errors?.confirmPassword ? "error-input" : "" }`} type="text" value={value} onChange={onChange} autoComplete="false"  />

											)}
											defaultValue=""
											/>
											
									<small>{errors?.confirmPassword?.message}</small>
										
									</div> */}
                  <button
                    className="btn btn-lg btn-block w-100 btn-primary w-100"
                    type="submit"
                    disabled={isloading}
                  >
                    {isloading ? "Loading.." : "Register"}
                  </button>
                </form>
                {/* /Form */}

                <div className="login-or">
                  <span className="or-line"></span>
                  <span className="span-or">or</span>
                </div>
                {/* Social Login */}
                <div className="social-login">
                  <span>Register with</span>
                  <Link to="#" className="facebook">
                    <i className="fab fa-facebook-f"></i>
                  </Link>
                  <Link to="#" className="google">
                    <i className="fab fa-google"></i>
                  </Link>
                </div>
                {/* /Social Login */}
                <div className="text-center dont-have">
                  Already have an account? <Link to="/login">Login</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Register;
