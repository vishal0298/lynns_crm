import * as yup from "yup";
export const BankSettingschema = yup
.object({
  name: yup
    .string()
    .required("Enter Account Holder Name")
    .min(3, "Account Holder Name Must Be At Least 3 Characters")
    .max(15, "Account Holder Name Must Be At Most 15 Characters")
    .matches(/^[aA-zZ\s]+$/, "Only Alphabets Are Allowed For This Field ")
    .matches(/^[a-zA-Z0-9 ]*$/, "Special Characters Are Not Allowed"),
  bankName: yup
    .string()
    .required("Enter Bank Name")
    .min(3, "Bank Name Must Be At Least 3 Characters")
    .max(15, "Bank Name Must Be At Most 15 Characters")
    .matches(/^[aA-zZ\s]+$/, "Only Alphabets Are Allowed For This Field ")
    .matches(/^[a-zA-Z0-9 ]*$/, "Special Characters Are Not Allowed"),
  branch: yup
    .string()
    .required("Enter Branch Name")
    .min(3, "Branch Name Must Be At Least 3 Characters")
    .max(15, "Branch Name Must Be At Most 15 Characters")
    .matches(/^[aA-zZ\s]+$/, "Only Alphabets Are Allowed For This Field ")
    .matches(/^[a-zA-Z0-9 ]*$/, "Special Characters Are Not Allowed"),
  accountNumber: yup
    .string()
    .required("Enter Valid Account Number")
    .min(4, "Account Number Must Be At Least 4 Digits")
    .max(15, "Account Number must be at most 15 digits")
    .matches(/^\d+$/, "Input Value Must Contain Only Numbers")
    .matches(/^[a-zA-Z0-9]*$/, "Special Characters Are Not Allowed"),
  IFSCCode: yup
    .string()
    .required("Enter IFSC Code")
    .min(4, "IFSC Must Be At Least 4 Characters")
    .max(15, "IFSC Must Be At Most 15 Characters")
    .matches(/^[a-zA-Z0-9]*$/, "Special Characters Are Not Allowed"),
})
.required();