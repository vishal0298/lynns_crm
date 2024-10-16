import * as yup from "yup";
export const Signaturechema = yup
.object({
  signatureName: yup
    .string()
    .required("Enter Signature Name")
    .min(3, "Signature Name Must Be At Least 3 Characters")
    .max(15, "Signature Name Must Be At Most 15 Characters")
    .matches(/^[aA-zZ\s]+$/, "Only Alphabets Are Allowed For This Field ")
    .matches(/^[a-zA-Z0-9 ]*$/, "Special Characters Are Not Allowed"),
  signatureImage: yup
    .mixed()
    .test("required", "Upload Signature Image", (value) => {
      if (value?.length > 0) return true;
      return false;
    })
    .test(
      "fileSize",
      "File size is too large",
      (value) => value && value?.[0]?.size <= 1048576
    )
    .test(
      "fileType",
      "Unsupported file format",
      (value) =>
        value && ["image/jpeg", "image/png"].includes(value?.[0]?.type)
    ),
})
.required();