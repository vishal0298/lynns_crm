/* eslint-disable react/prop-types */
import React, { createContext, useEffect, useContext, useState } from "react";
import * as yup from "yup";
import { ApiServiceContext } from "../../../../core/API/api-service";
import {
  paymentSettingsview,
  paymentSettingsupdate,
  successToast,
} from "../../../../core/core-index";
import { userRolesCheck } from "../../../../common/commonMethods";
import {PaymentSettingschema} from './paymentsettingschema'

const PaymentSettingsContext = createContext({
  PaymentSettingschema: PaymentSettingschema,
  updatePaymentSettingsForm: () => {},
});

const PaymentSettingsComponentController = (props) => {
  const { putData, getData } = useContext(ApiServiceContext);
  const [menu, setMenu] = useState(false);
  const toggleMobileMenu = () => setMenu(!menu);
  const [paymentSettingsInfos, setpaymentSettingsInfos] = useState([]);
  const [isStripe, setisStripe] = useState(true);
  const [isPaypal, setisPaypal] = useState(false);

  // For Roles and Permissions
  const [permission, setPermission] = useState({});
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    getPaymentSettingData();
    let findModule = userRolesCheck("paymentSettings");
    if (findModule == "admin") {
      setAdmin(true);
    } else {
      setPermission(findModule);
    }
  }, []);
  // For Roles and Permissions

  const getPaymentSettingData = async () => {
    try {
      const response = await getData(paymentSettingsview);
      if (response.code === 200) {
        setpaymentSettingsInfos(response.data);
      }
      return response;
    } catch (error) {
      //
    }
  };

  // useEffect(() => {
  //   getPaymentSettingData();
  // }, []);

  const updatePaymentSettingsForm = async (data) => {
    const formData = {
      isStripe: isStripe,
      isPaypal: isPaypal,
      stripepublishKey: data.stripepublishKey,
      stripeSecretKey: data.stripeSecretKey,
      paypalClientId: data.paypalClientId,
      paypalSecret: data.paypalSecret,
      sandbox_paypalClientId: data.sandbox_paypalClientId,
      sandbox_paypalSecret: data.sandbox_paypalSecret,
      sandbox_stripepublishKey: data.sandbox_stripepublishKey,
      sandbox_stripeSecretKey: data.sandbox_stripeSecretKey,
      paypal_account_type: data.paypal_account_type,
      stripe_account_type: data.stripe_account_type,
      _id: paymentSettingsInfos?._id,
    };

    try {
      const response = await putData(paymentSettingsupdate, formData);
      if (response.code === 200) {
        successToast("Payment Settings Updated Successfully");
        getPaymentSettingData();
      }
      return response;
    } catch (error) {
      //
    }
  };

  return (
    <PaymentSettingsContext.Provider
      value={{
        PaymentSettingschema,
        isStripe,
        isPaypal,
        setisStripe,
        setisPaypal,
        paymentSettingsInfos,
        updatePaymentSettingsForm,
        toggleMobileMenu,
        menu,
        permission,
        admin,
      }}
    >
      {props.children}
    </PaymentSettingsContext.Provider>
  );
};

export { PaymentSettingsContext, PaymentSettingsComponentController };
