import React, { useContext } from "react";
import { RegisterContext } from "./Register.control";
import { Link } from "react-router-dom";
import { Logo } from "../../../common/imagepath";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const Register = () => {
  const {
    submitRegisterForm,
    RegisterFormschema,
    handleKeyPress,
    eye,
    onEyeClick,
  } = useContext(RegisterContext);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ resolver: yupResolver(RegisterFormschema) });

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
                <form onSubmit={handleSubmit(submitRegisterForm)}>
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
                            className={`fa toggle-password ${
                              eye ? "fa-eye-slash" : "fa-eye"
                            }`}
                          />
                        </div>
                      )}
                      defaultValue=""
                    />

                    <small>{errors?.password?.message}</small>
                  </div>
                  <div className="form-group input_text">
                    <label className="form-control-label">
                      Confirm Password
                    </label>
                    <Controller
                      name="confirmPassword"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <input
                          className={`form-control  ${
                            errors?.confirmPassword ? "error-input" : ""
                          }`}
                          type="text"
                          value={value}
                          onChange={onChange}
                          autoComplete="false"
                        />
                      )}
                      defaultValue=""
                    />
                    <small>{errors?.confirmPassword?.message}</small>
                  </div>
                  <button
                    className="btn btn-lg btn-block w-100 btn-primary w-100"
                    type="submit"
                  >
                    Register
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
