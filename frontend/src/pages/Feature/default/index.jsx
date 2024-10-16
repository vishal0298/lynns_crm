import React, { useEffect, useContext } from "react";
import { AuthContext } from "../approuter";
import { getLoginToken } from "../constans/globals";
import { useNavigate, useLocation } from "react-router-dom";

const DefaultPage = () => {
  const authCtxData = useContext(AuthContext);
  const setToken = authCtxData?.setToken;
  // eslint-disable-next-line no-unused-vars
  const isToken = authCtxData?.isToken;

  const getToken = getLoginToken();
  const isAuth = !!getToken;
  const navigate = useNavigate();
  const location = useLocation();

  const withoutAuth = [
    "/login",
    "/register",
    "/forgot-password",
    "/confirmation-password",
  ];

  const getPathname = () => {
    let isPresent = [];
    var path;
    withoutAuth.map((item) => {
      if (item === location.pathname) {
        isPresent("1");
      }
      return
    });

    if (isPresent?.length == 0) {
      if (!isAuth) {
        path = "/login";
      } else {
        path = location.pathname;
      }
    } else {
      
      if (!isAuth) {
        path = location.pathname;
      } else {
        path = "/index";
      }
    }
    return path;
  };

  useEffect(() => {
    setToken(getToken);
    navigate(getPathname());
  }, [getToken]);

  return <></>;
};

export default DefaultPage;
