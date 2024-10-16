import * as yup from "yup";
export const AccountSettingschema = yup
.object()
.shape({
  firstName: yup.string().required("Enter First name"),
  lastName: yup.string().required("Enter Last name"),
  mobileNumber: yup
    .string()
    .required("Enter Mobile Number")
    .min(10, "Mobile Number Must Be At Least 10 Digits")
    .max(15, "Mobile Number Must Be At Most 15 Digits")
    .matches(/^\+?[1-9]\d*$/, "Invalid phone number"),
  email: yup
    .string()
    .email("Email Must Be a Valid Email")
    .required("Enter Email Address"),
})
.required();