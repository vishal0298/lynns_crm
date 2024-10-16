import * as yup from "yup";
import {
  fieldRgx,
  SpecialCharactersErrorMsg,
  mobileRgx,
  emailRgx,
} from "../constans";

export const AddCustomerSchema = yup
  .object()
  .shape({
    vendor_name: yup
      .string()
      .required("Name is Required")
      .matches(fieldRgx, SpecialCharactersErrorMsg)
      .trim(),
    vendor_email: yup
      .string()
      .required("Email is Required")
      .trim()
      .matches(emailRgx, "Please Enter valid Email"),
    vendor_phone: yup
      .required("Mobile Number is Required")
      .trim()
      .matches(mobileRgx, "Please Enter valid Mobile number"),
    balance: yup.required("Balance is Required").trim(),
  })
  .required();

export const filterSchema = yup
  .object({
    customerName: yup.string().trim(),
    phoneNumber: yup.string().trim(),
    email: yup.string().trim(),
  })
  .required();
