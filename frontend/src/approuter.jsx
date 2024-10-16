import React, { createContext, useState, useEffect } from "react";
import AppContainer from "./appcontainer.jsx";
import SpinnerProvider from "./core/spinner/spinner.jsx";
import AxiosProvider from "./core/interceptor/interceptor.jsx";
import CommonDataProvider from "./core/commonData.jsx";
import ApiServiceProvider from "./core/API/api-service.jsx";
import { BrowserRouter } from "react-router-dom";
import { getToken, onMessageListener } from "./firebaseinit.jsx";
import config from "config";
import store from "./reduxStore/store.js";
import { Provider } from "react-redux";

export const AuthContext = createContext(null);

const AppRouter = () => {
  const [loggedin, setloggedin] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isTokenFound, setTokenFound] = useState(false);
  const [notificationFlag, setnotificationFlag] = useState(false);

  useEffect(() => {
    if (
      localStorage.getItem("authToken") != undefined &&
      localStorage.getItem("authToken") != null
    ) {
      setloggedin(true);
    }

    getToken(setTokenFound);
    onMessageListener().then((payload) => {
      if (payload?.notification) {
        setnotificationFlag(true);
      }
    });
  }, []);

  onMessageListener().then((payload) => {
    if (payload?.notification) {
      setnotificationFlag(true);
    }
  });

  useEffect(() => {
    if (!loggedin) getToken(setTokenFound);
  }, [loggedin]);

  return (
    <>
      <SpinnerProvider>
        <Provider store={store}>
          <BrowserRouter basename={`${config.publicPath}`}>
            <AuthContext.Provider
              value={{
                loggedin,
                setloggedin,
                setnotificationFlag,
                notificationFlag,
              }}
            >
              <AxiosProvider>
                <ApiServiceProvider>
                  {/* <Route render={(props) => <AppContainer {...props} />} /> */}
                  <CommonDataProvider>
                    <AppContainer />
                  </CommonDataProvider>
                </ApiServiceProvider>
              </AxiosProvider>
            </AuthContext.Provider>
          </BrowserRouter>
        </Provider>
      </SpinnerProvider>
    </>
  );
};

export default AppRouter;
