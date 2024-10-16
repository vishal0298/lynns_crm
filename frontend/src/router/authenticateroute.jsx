import React from "react";
import { Navigate } from "react-router-dom";
import { handleRememberData } from "../constans/globals";
import jwt_decode from "jwt-decode";
import { errorToast } from "../core/core-index";

// eslint-disable-next-line react/prop-types
export default function AuthenticateRoute({ children }) {
  const current_time = Date.now() / 1000;
  try {
    const authToken = localStorage.getItem("authToken");
    const { exp } = jwt_decode(authToken);
    if (exp < current_time) {
      handleRememberData();
      errorToast("Session Expired !");
      return <Navigate to="/login" replace />;
    }
  } catch (err) {
    handleRememberData();
    return <Navigate to="/login" replace />;
  }

  return <React.Suspense fallback={<>...</>}>{children}</React.Suspense>;
}
