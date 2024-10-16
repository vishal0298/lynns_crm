import * as yup from "yup";
export const CompanySettingschema = yup
.object({
  companyName: yup.string().required("Enter Company Name"),
  email: yup
    .string()
    .email("Email must be a valid email")
    .required("Enter Company Email"),
  phone: yup
    .string()
    .required("Enter Phone number")
    .min(10, "Phone Number Must Be At Least 10 Digits")
    .max(10, "Phone Number Must Be At Most 10 Digits")
    .matches(/^\+?[1-9]\d*$/, "Invalid phone number"),
  addressLine1: yup
    .string()
    .required("Enter Address Line 1")
    .min(4, "Address Line 1 Must Be At Least 6 Characters")
    .max(30, "Address Line 1 Must Be At Most 30 Characters"),
  country: yup.string().required("Enter Country Name"),
  state: yup.string().required("Enter State Name"),
  city: yup.string().required("Enter City Name"),
})
.required();