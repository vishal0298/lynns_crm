/* eslint-disable react/prop-types */
import React, { createContext, useContext } from "react";
import { AxiosContext } from "../interceptor/interceptor";
export const ApiServiceContext = createContext();

const ApiServiceProvider = (props) => {
  const { axiosInstance, axiosInstancewithoutloader } =
    useContext(AxiosContext);

  const postData = (url, data) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(url, data)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const getData = (url, loader = true) => {
    return new Promise((resolve, reject) => {
      let apiInstance =
        loader == false ? axiosInstancewithoutloader : axiosInstance;
      apiInstance
        .get(url)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const patchData = (url) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .patch(url)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const putData = (url, data) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .put(url, data)
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  const deleteData = (url, data) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .delete(url, { data: data })
        .then((res) => {
          resolve(res.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  return (
    <ApiServiceContext.Provider
      value={{ getData, postData, patchData, putData, deleteData }}
    >
      {props.children}
    </ApiServiceContext.Provider>
  );
};

export default ApiServiceProvider;
