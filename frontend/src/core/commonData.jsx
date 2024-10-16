/* eslint-disable react-hooks/rules-of-hooks */
import React, { createContext, useEffect, useState } from "react";

export const commonDatacontext = createContext();

const commonDataProvider = (props) => {
  
  const [favicon, setFavicon] = useState(null);
  const [companyLogo, setCompanyLogo] = useState(null);
  const [companyIcon, setCompanyIcon] = useState(null);
  const [companyTitle, setCompanyTitle] = useState("ROSH & ROY'S SALON");
  const [companyData, setCompanyData] = useState([]);
  const [profileData, setProfileData] = useState([]);
  const [currencyData, setCurrencyData] = useState("");


  useEffect(() => {
    if (
      localStorage.getItem("companyData") &&
      localStorage.getItem("companyData") != null &&
      localStorage.getItem("companyData") != undefined
    ) {
      setCompanyData(JSON.parse(localStorage.getItem("companyData")));
    }

    if (
      localStorage.getItem("favicon") &&
      localStorage.getItem("favicon") != null &&
      localStorage.getItem("favicon") != undefined
    ) {
      setFavicon(localStorage.getItem("favicon"));
    }

    if (
      localStorage.getItem("companyLogo") &&
      localStorage.getItem("companyLogo") != null &&
      localStorage.getItem("companyLogo") != undefined
    ) {
      setCompanyLogo(localStorage.getItem("companyLogo"));
    }

    if (
      localStorage.getItem("companyIcon") &&
      localStorage.getItem("companyIcon") != null &&
      localStorage.getItem("companyIcon") != undefined
    ) {
      setCompanyIcon();
    }

    if (
      localStorage.getItem("companyTitle") &&
      localStorage.getItem("companyTitle") != null &&
      localStorage.getItem("companyTitle") != undefined
    ) {
      setCompanyTitle("ROSH & ROY'S SALON");
    }

    if (
      localStorage.getItem("profileData") &&
      localStorage.getItem("profileData") != null &&
      localStorage.getItem("profileData") != undefined
    ) {
      setProfileData(JSON.parse(localStorage.getItem("profileData")));
    }
    if (
      localStorage.getItem("currencyData") &&
      localStorage.getItem("currencyData") != null &&
      localStorage.getItem("currencyData") != undefined
    ) {
      setCurrencyData(localStorage.getItem("currencyData"));
    }
  }, []);

  return (
    <commonDatacontext.Provider
      value={{
        companyData,
        setCompanyData,
        profileData,
        setProfileData,
        currencyData,
        setCurrencyData,
        favicon,
        setFavicon,
        companyLogo,
        setCompanyLogo,
        companyTitle,
        setCompanyTitle,
        companyIcon,
        setCompanyIcon,
      }}
    >
      {props.children}
    </commonDatacontext.Provider>
  );
};

export default commonDataProvider;

