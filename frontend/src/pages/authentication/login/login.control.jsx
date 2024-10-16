/* eslint-disable react/prop-types */
import React, { createContext, useContext, useState, useRef } from "react";
import * as yup from "yup";
import { ApiServiceContext } from "../../../core/API/api-service";
import { commonDatacontext } from "../../../core/commonData";
import { useNavigate } from "react-router-dom";
import { email, loginApi } from "../../../core/core-index";
import { AuthContext } from "../../../approuter";
import {
  setLoginToken,
  setCurrentLoginUser,
  setcommonData,
} from "../../../constans/globals";
import jwt from "jwt-decode";
import { setUserDetails } from "../../../reduxStore/appSlice";
import { useDispatch } from "react-redux";

const loginFormScheme = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .matches(email, "Enter a valid email address")
    .trim(),
  password: yup
    .string()
    .required("Password is required")

    .trim(),
});

const LoginContext = createContext({
  loginFormScheme: loginFormScheme,
  submitLoginForm: () => {},
});

const LoginComponentController = (props) => {
  const { postData } = useContext(ApiServiceContext);
  const { setCompanyData, setProfileData, setCurrencyData, setFavicon } =
    useContext(commonDatacontext);
  // eslint-disable-next-line no-unused-vars
  const [userToken, setUser] = useState({});
  const [eye, seteye] = useState(true);
  const [rememberData, setRememberData] = useState();
  const [emailrememberData, setemailRememberData] = useState();
  // eslint-disable-next-line no-unused-vars
  const [localuser, setLocaluser] = useState();
  // eslint-disable-next-line no-unused-vars
  const [loginUserData, setLoginUserdata] = useState();
  const [rememberme, setrememberme] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const authCtxData = useContext(AuthContext);
  // eslint-disable-next-line no-unused-vars
  const { setToken, setloggedin } = useContext(AuthContext);
  const navigate = useNavigate();
  const emailRem = useRef(null);
  const passwordRem = useRef(null);
  const dispatch = useDispatch();

  const submitLoginForm = async (data) => {
    try {
      let formData = {};
      formData.email = data.email;
      formData.password = data.password;
      formData.fcmToken = localStorage.getItem("fcmToken");
      const response = await postData(loginApi, formData);
      if (response.code === 200) {
        const token = response.data.token;
        const user = jwt(token);
        setUser(user);
        setloggedin(true);
        setLoginToken(response.data.token);
        // setUserDetails(response.data);
        dispatch(setUserDetails(response.data));
        //commondatasetup
        setcommonData("all", response.data);
        setCompanyData(response.data?.companyDetails);
        setFavicon(response.data?.companyDetails?.favicon);
        setProfileData(response.data?.profileDetails);
        setCurrencyData(response.data?.currencySymbol);

        setRememberData(data.email);
        setemailRememberData(data.password);
        setLocaluser(rememberData, emailrememberData);

        let checkbox_value = false;
        if (data.email && data.password) {
          if (data.rememberme == false) {
            checkbox_value = false;
          } else {
            checkbox_value = true;
          }
        } else {
          checkbox_value = false;
        }

        let userDatas = {
          email: data.email,
          password: data.password,
          rememberme: checkbox_value,
        };
        setLoginUserdata(JSON.stringify(userDatas));

        setCurrentLoginUser(JSON.stringify(userDatas));
        navigate("/index");
      }
      return response;
    } catch (error) {
      //
    }
  };

  const handleRemember = () => {};

  const onEyeClick = () => seteye(!eye);

  return (
    <LoginContext.Provider
      value={{
        loginFormScheme,
        emailRem,
        passwordRem,
        submitLoginForm,
        handleRemember,
        onEyeClick,
        eye,
        rememberme,
        setrememberme,
      }}
    >
      {props.children}
    </LoginContext.Provider>
  );
};

export { LoginContext, LoginComponentController };
