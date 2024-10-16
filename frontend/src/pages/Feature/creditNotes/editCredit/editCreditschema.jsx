import * as yup from "yup";
export const creditNoteEditSchema = yup
.object({
  sign_type: yup.string().typeError("Choose Signature Type"),
  signatureName: yup.string().when("sign_type", (sign_type, schema) => {
    if (sign_type == "eSignature") {
      return yup.string().nullable().required("Enter Signature Name");
    } else {
      return yup.string().nullable().notRequired();
    }
  }),
  signatureData: yup.string().when("sign_type", (sign_type, schema) => {
    if (sign_type == "eSignature") {
      return yup
        .string()
        .test(
          "is-eSignature",
          `Draw The Signature`,
          async (value, testContext) => value == "true"
        );
    } else {
      return yup.string().notRequired();
    }
  }),
  signatureId: yup.string().when("sign_type", (sign_type, schema) => {
    if (sign_type == "manualSignature") {
      return yup.object().shape({
        value: yup.string().required("Choose Signature Name"),
      });
    } else {
      return yup.object().notRequired();
    }
  }),
})
.required();