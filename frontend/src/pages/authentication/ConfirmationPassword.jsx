import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../../common/imagepath";
import { useNavigate } from "react-router-dom";
//import { postData } from '../services/apiservice';
import { useForm } from "react-hook-form";
import {
  passwordRequired,
  passwordRegex,
  SpecialCharacters,
  passwordValidMessage,
  successToast,
} from "../../core/core-index";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ApiServiceContext } from "../../core/API/api-service";

const formSchema = yup.object().shape({
  password: yup
    .string()
    .required(passwordRequired)
    .min(6, "Password should be at least 6 characters")
    .matches(SpecialCharacters, "At least one special character")
    .matches(passwordRegex, "At least one uppercase & lowercase")
    .max(10, "Password should be maximum 10 characters")
    .trim(),
  confimPassword: yup
    .string()
    .required("Password is mendatory")
    .oneOf([yup.ref("password")], "Passwords does not match"),
});

const ConfirmationPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
  } = useForm({ resolver: yupResolver(formSchema) });
  const { postData } = useContext(ApiServiceContext);
  const [eye, seteye] = useState(true);
  let navigate = useNavigate();
  const onEyeClick = () => seteye(!eye);
  const onSubmit = async (data) => {
    const content = window.location.href.split("=")[1].split("&")[0];
    const iv = window.location.href.split("=")[2];
    const value = {
      new_password: data.password,
      content: content,
      iv: iv,
    };
    try {
      const response = await postData("/auth/reset_password", value);
      if (response.code === 200) {
        successToast("Password Updated");
        reset();
        navigate("/login");
      }
    } catch (error) {
      //
    }
  };

  return (
    <div className="main-wrapper login-body">
      <div className="login-wrapper">
        <div className="container">
          <img className="img-fluid logo-dark mb-2" src={Logo} alt="Logo" />

          <div className="loginbox">
            <div className="login-right">
              <div className="login-right-wrap">
                <h1>Forgot Password?</h1>
                <p className="account-subtitle">Enter your Newpassword</p>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="form-group">
                    <label className="form-control-label">New Password</label>
                    <input
                      type="password"
                      className="form-control pass-input"
                      placeholder="New Password"
                      {...register("password", {
                        // required: "Confirm password is Required",
                        // minLength: {
                        //     value: 6,
                        //     message:
                        //         "Password must be at least 6 characters",
                        // },
                        // maxLength: {
                        //     value: 10,
                        //     message:
                        //         "Password maximum allowed 10 characters",
                        // },
                        pattern: {
                          value: passwordRegex,
                          message: passwordValidMessage,
                        },
                      })}
                      onKeyUp={() => {
                        trigger("password");
                      }}
                    />
                    {errors.password && (
                      <p className="text-danger">{errors.password.message}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-control-label">
                      Confirm Password
                    </label>
                    <div className="pass-group">
                      <input
                        type={eye ? "password" : "text"}
                        className="form-control pass-input"
                        autoComplete="off"
                        placeholder="Confirm Password"
                        {...register("confimPassword", {
                          pattern: {
                            value: passwordRegex,
                            message: passwordValidMessage,
                          },
                        })}
                        onKeyUp={() => {
                          trigger("confimPassword");
                        }}
                      />
                      <span
                        onClick={onEyeClick}
                        className={`fa toggle-password ${
                          eye ? "fa-eye-slash" : "fa-eye"
                        }`}
                      />
                    </div>

                    {errors.confimPassword && (
                      <p className="text-danger">
                        {errors.confimPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="form-group mb-0">
                    <button className="btn btn-primary btn-sign" type="submit">
                      Update
                    </button>
                  </div>
                </form>
                {/* /Form */}

                <div className="text-center dont-have">
                  Back to <Link to="/register">Sign In</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ConfirmationPassword;
