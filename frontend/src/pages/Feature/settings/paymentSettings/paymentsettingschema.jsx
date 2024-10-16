import * as yup from "yup";
export const PaymentSettingschema = yup
.object({
  stripe_account_type: yup
    .string()
    .nullable()
    .required("Choose paymnet account mode"),
  paypal_account_type: yup
    .string()
    .nullable()
    .required("Choose paymnet account mode"),
  stripepublishKey: yup
    .string()
    .nullable()
    .required("Enter the stripe Publish Key"),
  stripeSecretKey: yup
    .string()
    .nullable()
    .required("Enter the Stripe Secret"),
  paypalClientId: yup.string().nullable().required("Enter the Paypal Client"),
  paypalSecret: yup.string().nullable().required("Enter the Paypal Secret"),
  sandbox_paypalClientId: yup
    .string()
    .nullable()
    .required("Enter the Paypal Client"),
  sandbox_paypalSecret: yup
    .string()
    .nullable()
    .required("Enter the Paypal Secret"),
  sandbox_stripepublishKey: yup
    .string()
    .nullable()
    .required("Enter the Stripe Key"),
  sandbox_stripeSecretKey: yup
    .string()
    .nullable()
    .required("Enter the Stripe Secret"),
})
.required();