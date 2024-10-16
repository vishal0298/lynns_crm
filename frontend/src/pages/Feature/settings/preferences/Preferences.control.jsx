/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { createContext, useEffect, useContext, useState } from "react";
import * as yup from "yup";
import { ApiServiceContext } from "../../../../core/API/api-service";
import {
  preferenceSettingsview,
  preferenceSettingsupdate,
  successToast,
} from "../../../../core/core-index";
import { commonDatacontext } from "../../../../core/commonData";
import { setcommonData } from "../../../../constans/globals";
import { userRolesCheck } from "../../../../common/commonMethods";

const Preferenceschema = yup
  .object({
    currency: yup.object().shape({
      _id: yup.string().required("Choose the currency"),
    }),
  
  })
  .required();

const PreferencesContext = createContext({
  Preferenceschema: Preferenceschema,
  updatePreferencesForm: () => {},
});

const PreferencesComponentController = (props) => {
  const { putData, getData } = useContext(ApiServiceContext);
  const { setcurrencyData } = useContext(commonDatacontext);

  const [menu, setMenu] = useState(false);
  const toggleMobileMenu = () => setMenu(!menu);
  const [Preferences, setPreferencesInfos] = useState([]);
  const [currency, setcurrency] = useState([]);

  // For Roles and Permissions
  const [permission, setPermission] = useState({});
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    getcurrencies();
    getPreferenceseData();
    let findModule = userRolesCheck("preferenceSettings");
    if (findModule == "admin") {
      setAdmin(true);
    } else {
      setPermission(findModule);
    }
  }, []);

  const getcurrencies = async () => {
    try {
      const response = await getData("/currency");
      if (response.code === 200) {
        setcurrency(response.data);
      }
      return response;
    } catch (error) {
      //
    }
  };

  const getPreferenceseData = async () => {
    try {
      const response = await getData(preferenceSettingsview);
      if (response.code === 200) {
        setPreferencesInfos(response.data);
      }
      return response;
    } catch (error) {
      //
    }
  };

  // useEffect(() => {
  //   getcurrencies();
  //   getPreferenceseData();
  // }, []);

  const updatePreferencesForm = async (data) => {
    const formData = {
      _id: Preferences._id,
      currencyId: data?.currency?._id,
     
    };
    try {
      const response = await putData(preferenceSettingsupdate, formData);
      if (response.code === 200) {
        successToast("Preference Settings Updated Successfully");
        setPreferencesInfos(response?.data?.updatedData);
        setcommonData("currencyData", {
          currencySymbol: data.currency?.currency_symbol,
        });
        setcurrencyData(data.currency?.currency_symbol);
      }
      return response;
    } catch (error) {
      /* empty */
    }
  };

  const [language, setLanguage] = useState([
    { id: 1, text: "Select Language" },
    { id: 2, text: "English" },
    { id: 3, text: "French" },
    { id: 3, text: "German" },
    { id: 3, text: "Italian" },
    { id: 3, text: "Spanish" },
  ]);

  const [finacial, setFinicial] = useState([
    { id: 1, text: "Select Financial Year" },
    { id: 2, text: "january-december" },
    { id: 3, text: "february-january" },
    { id: 3, text: "march-february" },
  ]);

  const [time, setTime] = useState([
    { id: 1, text: "Select Date Format" },
    { id: 2, text: "2020 Nov 09" },
    { id: 3, text: "09 Nov 2020" },
    { id: 3, text: "09/11/2020" },
  ]);

  const [zone, setZone] = useState([
    { id: 1, text: "Select Time Format" },
    { id: 2, text: "10:00 AM - 11:00 AM" },
    { id: 3, text: "12:00 PM - 02:00 PM" },
  ]);

  return (
    <PreferencesContext.Provider
      value={{
        Preferenceschema,
        currency,
        language,
        finacial,
        time,
        zone,
        Preferences,
        menu,
        permission,
        admin,
        updatePreferencesForm,
        toggleMobileMenu,
      }}
    >
      {props.children}
    </PreferencesContext.Provider>
  );
};

export { PreferencesContext, PreferencesComponentController };
