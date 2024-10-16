/* eslint-disable no-undef */
import axios from "axios";
// import ToastMessage from '../components/commoncomponents/toast'
import config from "config";
import { getLoginToken } from "../constans/globals";

const token = getLoginToken();
// eslint-disable-next-line react-hooks/rules-of-hooks

const instance = axios.create({
  baseURL: config.apiUrl,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "application/json",
    token: token ? token : "",
  },
});

instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(undefined, function (err) {
  if (!err.response) {
    ToastMessage(
      "error",
      "Please check your internet connection or wait until servers are back online"
    );
  } else {
    if (
      err.response.data &&
      (err.response.statusText === "Unauthenticated" ||
        err.response.data === " Unauthenticated")
    ) {
      // Unauthorized and log out

      ToastMessage(
        "error",
        err.response.data.message ? err.response.data.message : "Unauthorized"
      );
    } else if (
      err.response.data &&
      (err.response.statusText === "Service Unavailable" ||
        err.response.data === " Service Unavailable")
    ) {
      // Unauthorized and log out

      ToastMessage(
        "error",
        err.response.data.error
          ? err.response.data.error
          : "Service Unavailable"
      );
    } else if (err.response.data.errors) {
      // Show a notification per error
      const errors = JSON.parse(JSON.stringify(err.response.data.errors));
      for (const i in errors) {
        ToastMessage("error", "Error" + i);
      }
    } else {
      // Unknown error
      if (err.response.data.data.message) {
        ToastMessage("error", err.response.data.data.message);
      }
    }
  }
  return Promise.reject(err);
});

export default instance;
