import * as yup from "yup";
export const addcategoryPageschema = yup.object().shape({
    name: yup
      .string()
      // .max(20, "Maximum Length Exceeded")
      .required("Enter Name")
      .matches(/^[A-Za-z ]+$/, "Only Alphabets Are Allowed"),
    slug: yup
      .string()
      .max(20, "Maximum length exceeded")
      .required("Enter Slug")
      .matches(/^[A-Za-z ]+$/, "Only Alphabets Are Allowed"),
  });