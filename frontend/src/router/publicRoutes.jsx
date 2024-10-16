import React, { useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../approuter";

// eslint-disable-next-line react/prop-types
export default function PublicRoute({ children }) {
  const { setloggedin } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const url = location?.pathname;

  useEffect(() => {
    if (url != "/online-payment") {
      if (
        localStorage.getItem("authToken") &&
        localStorage.getItem("authToken") != null &&
        localStorage.getItem("authToken") != undefined
      ) {
        setloggedin(true);
        navigate("/index");
      }
    }
  }, []);

  return <React.Suspense fallback={<>...</>}>{children}</React.Suspense>;
}
