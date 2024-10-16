/* eslint-disable react/prop-types */
import React, { createContext, useEffect, useContext, useState } from "react";
import * as yup from "yup";
import { ApiServiceContext } from "../../../../core/API/api-service";
import {
  email,
  EmailSettingsview,
  EmailSettingsupdate,
  successToast,
} from "../../../../core/core-index";
import { userRolesCheck } from "../../../../common/commonMethods";

const Emailsettingschema = yup
  .object({
    provider_type: yup.string().required("Choose Any One Mail Provider"),

    nodeFromName: yup
      .string()
      .when("provider_type", (provider_type, schema) => {
        if (provider_type === "NODE") {
          return (
            schema
              .required("Enter the from name")
              .min(3, "From Name must be at least 3 characters")
          );
        }
        if (provider_type === "SMTP") {
          return (
            schema
              .nullable(true)
              .transform((value, originalValue) =>
                originalValue === "" ? null : value
              )
          );

          
        }
        return schema;
      }),

    nodeFromEmail: yup
      .string()
      .when("provider_type", (provider_type, schema) => {
        if (provider_type === "NODE") {
          return schema
            .required("Enter the Email")
            .matches(email, "Enter a valid email address")
            .trim();
        }
        if (provider_type === "SMTP") {
          return schema
            .matches(email, "Enter a valid email address")
            .nullable(true)
            .transform((value, originalValue) =>
              originalValue === "" ? null : value
            );
        }
        return schema;
      }),

    nodeHost: yup.string().when("provider_type", (provider_type, schema) => {
      if (provider_type === "NODE") {
        return (
          schema
            .required("Enter the Host")
            .min(4, "Host must be at least 4 characters")
        );
      }
      return schema;
    }),

    nodePort: yup.string().when("provider_type", (provider_type, schema) => {
      if (provider_type === "NODE") {
        return (
          schema
            .required("Enter the Port")
            .min(2, "Port must be at least 2 Digits")
        );
      }
      return schema;
    }),

    nodeUsername: yup
      .string()
      .when("provider_type", (provider_type, schema) => {
        if (provider_type === "NODE") {
          return (
            schema
              .required("Enter the Username")
              .min(4, "Username must be at least 4 characters")
          );
        }
        return schema;
      }),

    nodePassword: yup
      .string()
      .when("provider_type", (provider_type, schema) => {
        if (provider_type === "NODE") {
          return schema
            .required("Enter the Password")
            .min(4, "Password must be at least 4 characters");
        }
        if (provider_type === "SMTP") {
          return schema
            .nullable(true)
            .transform((value, originalValue) =>
              originalValue === "" ? null : value
            );
        }
        return schema;
      }),

    smtpFromName: yup
      .string()
      .when("provider_type", (provider_type, schema) => {
        if (provider_type === "SMTP") {
          return (
            schema
              .required("Enter the From Name")
              .min(3, "From Name must be at least 3 characters")
          );
        }
        if (provider_type === "NODE") {
          return (
            schema

            .nullable(true)
              .transform((value, originalValue) =>
                originalValue === "" ? null : value
              )
          );
          
        }
        return schema;
      }),

    smtpFromEmail: yup
      .string()
      .when("provider_type", (provider_type, schema) => {
        if (provider_type === "SMTP") {
          return schema
            .required("Enter the Email")
            .matches(email, "Enter a valid email address")
            .trim();
        }
        if (provider_type === "NODE") {
          return schema
            .matches(email, "Enter a valid email address")
            .nullable(true)
            .transform((value, originalValue) =>
              originalValue === "" ? null : value
            );
        }
        return schema;
      }),

    smtpHost: yup.string().when("provider_type", (provider_type, schema) => {
      if (provider_type === "SMTP") {
        return (
          schema
            .required("Enter the Host")
            .min(4, "Host must be at least 4 characters")
        );
      }
      return schema;
    }),

    smtpPort: yup.string().when("provider_type", (provider_type, schema) => {
      if (provider_type === "SMTP") {
        return (
          schema
            .required("Enter the Port")
            .min(2, "Port must be at least 2 Digits")
        );
      }
      return schema;
    }),

    smtpUsername: yup
      .string()
      .when("provider_type", (provider_type, schema) => {
        if (provider_type === "SMTP") {
          return (
            schema
              .required("Enter the Username")
              .min(4, "Username must be at least 4 characters")
          );
        }
        return schema;
      }),

    smtpPassword: yup
      .string()
      .when("provider_type", (provider_type, schema) => {
        if (provider_type === "SMTP") {
          return schema
            .required("Enter the Password")
            .min(4, "Password must be at least 4 characters");
        }
        if (provider_type === "NODE") {
          return schema
            .nullable(true)
            .transform((value, originalValue) =>
              originalValue === "" ? null : value
            );
        }
        return schema;
      }),
  })
  .required();

const EmailSettingsContext = createContext({
  Emailsettingschema: Emailsettingschema,
  updateEmailsettingsForm: () => {},
});

const EmailSettingsComponentController = (props) => {
  const { putData, getData } = useContext(ApiServiceContext);
  const [menu, setMenu] = useState(false);
  const toggleMobileMenu = () => setMenu(!menu);
  const [emailSettingsInfo, setEmailSettingsInfos] = useState([]);

  // For Roles and Permissions
  const [permission, setPermission] = useState({});
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    getEmailsettingsData();
    let findModule = userRolesCheck("emailSettings");
    if (findModule == "admin") {
      setAdmin(true);
    } else {
      setPermission(findModule);
    }
  }, []);

  const getEmailsettingsData = async () => {
    try {
      const response = await getData(EmailSettingsview);
      if (response.code === 200) {
        setEmailSettingsInfos(response.data);
      }
      return response;
    } catch (error) {
      //
    }
  };

  // useEffect(() => {
  // getEmailsettingsData();  
  // }, []);

  const updateEmailsettingsForm = async (data) => {
    try {
      const response = await putData(EmailSettingsupdate, data);
      if (response.code === 200) {
        successToast("Email Settings Updated Successfully");
      }
      return response;
    } catch (error) {
      /* empty */
    }
  };

  return (
    <EmailSettingsContext.Provider
      value={{
        Emailsettingschema,
        emailSettingsInfo,
        menu,
        updateEmailsettingsForm,
        toggleMobileMenu,
        permission,
        admin,
      }}
    >
      {props.children}
    </EmailSettingsContext.Provider>
  );
};

export { EmailSettingsContext, EmailSettingsComponentController };
