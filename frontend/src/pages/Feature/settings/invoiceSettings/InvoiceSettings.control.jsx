/* eslint-disable react/prop-types */
import React, { createContext, useEffect, useContext, useState } from "react";
import * as yup from "yup";
import { ApiServiceContext } from "../../../../core/API/api-service";
import {
  InvoiceSettingsupdate,
  InvoiceSettingsview,
  successToast,
} from "../../../../core/core-index";
import { useDispatch } from "react-redux";
import { setInvoiceLogo } from "../../../../reduxStore/appSlice";
import { userRolesCheck } from "../../../../common/commonMethods";

const InvoiceSettingschema = yup
  .object({
    invoicePrefix: yup.string().required("Enter Invoice Prefix"),
  })
  .required();

const InvoiceSettingsContext = createContext({
  InvoiceSettingschema: InvoiceSettingschema,
  updateInvoiveSettingsForm: () => {},
});

const InvoiceSettingsComponentController = (props) => {
  const { putData, getData } = useContext(ApiServiceContext);
  const [invoiceSettings, setInvoiveSettingsInfos] = useState([]);
  const [logoImgError, setlogoImgError] = useState("");
  const dispatch = useDispatch();

  // For Roles and Permissions
  const [permission, setPermission] = useState({});
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    getInvoiveSettingseData();
    let findModule = userRolesCheck("invoiceSettings");
    if (findModule == "admin") {
      setAdmin(true);
    } else {
      setPermission(findModule);
    }
  }, []);
  const getInvoiveSettingseData = async () => {
    try {
      const response = await getData(InvoiceSettingsview);
      if (response.code === 200) {
        setInvoiveSettingsInfos(response.data);
      }
      return response;
    } catch (error) {
      //
    }
  };

  // useEffect(() => {
  //   getInvoiveSettingseData();
  // }, []);

  const updateInvoiveSettingsForm = async (data) => {
    const formData = new FormData();
    formData.append("invoicePrefix", data.invoicePrefix);
    formData.append("invoiceLogo", data?.invoiceLogo?.[0]);
    formData.append("_id", invoiceSettings._id);

    try {
      const response = await putData(`${InvoiceSettingsupdate}`, formData);
      if (response.code === 200) {
        successToast("Invoice Settings Updated Successfully");
        dispatch(setInvoiceLogo(response?.data?.updatedData?.invoiceLogo));
      }
      return response;
    } catch (error) {
      /* empty */
    }
  };

  return (
    <InvoiceSettingsContext.Provider
      value={{
        InvoiceSettingschema,
        invoiceSettings,
        updateInvoiveSettingsForm,
        logoImgError,
        setlogoImgError,
        permission,
        admin,
      }}
    >
      {props.children}
    </InvoiceSettingsContext.Provider>
  );
};

export { InvoiceSettingsContext, InvoiceSettingsComponentController };
