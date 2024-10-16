/* eslint-disable react/prop-types */
import React, { createContext, useState } from "react";
import Spinner from "react-bootstrap/Spinner";
export const SpinnerContext = createContext();

const SpinnerProvider = (props) => {
  const [loader, setLoader] = useState(false);

  const changeLoader = (value) => {
    if (value === false) {
      setTimeout(() => {
        setLoader(value);
      }, 1000);
    } else {
      setLoader(value);
    }
  };

  return (
    <SpinnerContext.Provider value={{ showLoading: loader, changeLoader }}>
      {props.children}
      {loader === true && (
        <div className="loading">
          <Spinner animation="border" variant="" />
          {/* <span className="loader"></span> */}
          {/* <div>
            <div className="mesh-loader">
              <div className="set-one">
                <div className="circle"></div>
                <div className="circle"></div>
              </div>
              <div className="set-two">
                <div className="circle"></div>
                <div className="circle"></div>
              </div>
            </div>
          </div> */}
        </div>
      )}
    </SpinnerContext.Provider>
  );
};

export default SpinnerProvider;
