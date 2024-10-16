/* eslint-disable react/prop-types */
import React, { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "config";
import { AuthContext } from "../../approuter";
import { fielderrorToast, errorToast } from "../core-index";
import { SpinnerContext } from "../spinner/spinner";
import { getLoginToken, setCurrentLoginUser } from "../../constans/globals";

export const AxiosContext = createContext();

const AxiosProvider = (props) => {
  const navigate = useNavigate();
  const { changeLoader } = useContext(SpinnerContext);
  const { setloggedin } = useContext(AuthContext);
  const [axiosInstance] = useState(() =>
    axios.create({ baseURL: config.API_URL })
  );
  const [axiosInstancewithoutloader] = useState(() =>
    axios.create({ baseURL: config.API_URL })
  );

  axiosInstance.interceptors.request.use(
    (config) => {
      changeLoader(true);
      //config.headers['application/x-www-form-urlencoded'] = "application/json";
      // config.headers['Access-Control-Max-Age' ]= -1;
      config.headers.Accept = "application/json";
      config.headers.token = getLoginToken();
      return config;
    },
    (error) => {
      changeLoader(false);
      Promise.reject(error);
    },
    () => {
      changeLoader(false);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      changeLoader(false);
      return response;
    },
    async (error) => {
      changeLoader(false);
      return Promise.reject(error?.response?.data);
    }
  );

  //Add a response interceptor
  axiosInstance.interceptors.response.use(
    function (res) {
      return res;
    },
    function (err) {
      if (err) {
        if (err.code == 403) {
          let errRes = err?.data?.message;
          if (Array.isArray(errRes)) {
            errRes.forEach((msg) => {
              fielderrorToast(msg, err?.message, err?.message);
            });
          } else {
            errorToast(err?.data?.message, err?.message);
          }
        }
        if (err.code == 401) {
          errorToast(err?.message);
          let rebembermedata = localStorage.getItem("rebemberme");
          localStorage.clear();
          if (rebembermedata != "undefined" && rebembermedata != null) {
            setCurrentLoginUser(rebembermedata);
          }
          setloggedin(false);
          navigate("/login");
        }
        if (err.code == 500) {
          errorToast(err?.message);
        }
      }
      return Promise.reject(err);
    }
  );

  axiosInstancewithoutloader.interceptors.request.use(
    (config) => {
      config.headers.Accept = "application/json";
      config.headers.token = getLoginToken();
      return config;
    },
    (error) => {
      Promise.reject(error);
    },
    () => {}
  );

  axiosInstancewithoutloader.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      return Promise.reject(error?.response?.data);
    }
  );

  //Add a response interceptor
  axiosInstancewithoutloader.interceptors.response.use(
    function (res) {
      return res;
    },
    function (err) {
      if (err) {
        if (err.code == 403) {
          let errRes = err?.data?.message;
          if (Array.isArray(errRes)) {
            errRes.forEach((msg) => {
              fielderrorToast(msg, err?.message, err?.message);
            });
          } else {
            errorToast(err?.data?.message, err?.message);
          }
        }
        if (err.code == 401) {
          errorToast(err?.message);
          let rebembermedata = localStorage.getItem("rebemberme");
          localStorage.clear();
          if (rebembermedata != "undefined" && rebembermedata != null) {
            setCurrentLoginUser(rebembermedata);
          }
          setloggedin(false);
          navigate("/login");
        }
        if (err.code == 500) {
          errorToast(err?.message);
        }
      }
      return Promise.reject(err);
    }
  );

  return (
    <AxiosContext.Provider
      value={{ axiosInstance, axiosInstancewithoutloader }}
    >
      {props.children}
    </AxiosContext.Provider>
  );
};

export default AxiosProvider;
