import React, { useContext, useEffect } from "react";
import { Route, Routes } from "react-router-dom";

import PublicRoute from "./router/publicRoutes";
import AuthenticateRoute from "./router/authenticateroute";

import { authRoutes, unAuthRoutes } from "./router/routes";
import RootComponent from "././pages/Feature/RootComponent";
import { AuthContext } from "./approuter";
import { useSelector } from "react-redux";

const AppContainer = () => {
  // eslint-disable-next-line no-unused-vars
  const { permissionRes } = useSelector((state) => state.app.userDetails);
  // eslint-disable-next-line no-unused-vars
  const { setloggedin } = useContext(AuthContext);

  const isDirectLoad =
    window.performance && window.performance.navigation.type === 0;
  useEffect(() => {}, [isDirectLoad]);

  return (
    <>
      <Routes>
        {unAuthRoutes?.map((route, idx) => (
          <Route
            key={idx}
            path={route?.path}
            element={<PublicRoute>{route?.element}</PublicRoute>}
          />
        ))}
        <Route element={<RootComponent />}>
          {authRoutes?.map((route, idx) => (
            <Route
              key={idx}
              path={route?.path}
              element={<AuthenticateRoute>{route?.element}</AuthenticateRoute>}
            />
          ))}
        </Route>
      </Routes>
    </>
  );
};

export default AppContainer;
