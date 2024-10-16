import * as yup from "yup";
import {
  SpecialCharacters,
  numberRgx,
  lowerCase,
  upperCase,
} from "../core/core-index";

const fileExtensions = ['jpg', 'jpeg', 'png', 'gif'];
export const schema = yup.object().shape({
  name: yup.string().required("Please enter your name"),
  phone: yup
    .string()
    .required("Please enter your phone number")
    .min(10, "Phone Number Must Be At Least 10 Digits"),

  email: yup.string().email().required("Please enter your email"),
  image: yup
    .mixed()
    .test(
      'fileType',
      'Only JPG, JPEG, PNG, or GIF files are allowed',
      (value) => {
        if (!value) return true; // Allow empty file (optional)
  
        const fileExtension = value.name.split('.').pop().toLowerCase();
        return fileExtensions.includes(fileExtension);
      }
    ),
  billingAddress: yup.object().shape({
    name: yup.string().required("Enter Name"),
    addressLine1: yup.string().required("Enter Address Line 1"),
    addressLine2: yup.string().required("Enter Address Line 2"),
    country: yup.string().required("Enter Country"),
    city: yup.string().required("Enter City"),
    state: yup.string().required("Enter State"),
    pincode: yup.string().required("Enter Pincode"),
  }),

  shippingAddress: yup.object().shape({
    name: yup.string().required("Enter Name"),
    addressLine1: yup.string().required("Enter Address Line 1"),
    addressLine2: yup.string().required("Enter Address Line 2"),
    country: yup.string().required("Enter Country"),
    city: yup.string().required("Enter City"),
    state: yup.string().required("Enter State"),
    pincode: yup.string().required("Enter Pincode"),
  }),
  // billingAddress: yup.object().shape({
  //   name: yup.string().required("Please enter name"),
  //   addressLine1: yup.string().required("Please enter address line1"),
  //   // addressLine2: yup.string().required("Please enter address line2"),
  //   city: yup
  //     .string()
  //     .required("Please enter your city")
  //     .matches(/^[A-Za-z ]+$/, "Only alphabets are allowed"),
  //   state: yup
  //     .string()
  //     .required("Please enter your state")
  //     .matches(/^[A-Za-z ]+$/, "Only alphabets are allowed"),
  //   pincode: yup.string().required("Please enter your pincode"),
  //   country: yup
  //     .string()
  //     .required("Please enter your country")
  //     .matches(/^[A-Za-z ]+$/, "Only alphabets are allowed"),
  // }),
  // shippingAddress: yup.object().shape({
  //   name: yup.string().required("Please enter name"),
  //   addressLine1: yup.string().required("Please enter address line1"),
  //   // addressLine2: yup.string().required("Please enter address line2"),
  //   city: yup
  //     .string()
  //     .required("Please enter your city")
  //     .matches(/^[A-Za-z ]+$/, "Only alphabets are allowed"),
  //   state: yup
  //     .string()
  //     .required("Please enter your state")
  //     .matches(/^[A-Za-z ]+$/, "Only alphabets are allowed"),
  //   pincode: yup.string().required("Please enter your pincode"),
  //   country: yup
  //     .string()
  //     .required("Please enter your country")
  //     .matches(/^[A-Za-z ]+$/, "Only alphabets are allowed"),
  // }),
  // bankDetails: yup.object().shape({
  //   // bankName: yup.string().required("Please enter Bankname"),
  //   // branch: yup.string().required("Please enter Branch"),
  //   accountHolderName: yup
  //     .string()
  //     // .matches(/^[A-Za-z]+$/, "Only alphabets are allowed")
  //     .matches(/^[a-zA-Z ]*$/, "Only alphabets are allowed")
  //     .optional(),
  //   accountNumber: yup
  //     .string()
  //     .required("Please enter your Account number")
  //     .optional(),
  //   IFSC: yup
  //     .string()
  //     .matches(/^[a-zA-Z0-9]*$/, "Special characters not allowed")
  //     .optional(),
  // }),
  // image: yup
  //   .mixed()
  //   .test("required", "signature Image is required", (value) => {
  //     if (value.length > 0) return true;
  //     return false;
  //   })
  //   .test(
  //     "fileSize",
  //     "File size is too large",
  //     (value) => value && value?.[0]?.size <= 1048576
  //   ) // 1MB
  //   .test(
  //     "fileType",
  //     "Unsupported file format",
  //     (value) =>
  //       value &&
  //       ["image/jpeg", "image/png", "image/svg+xml"].includes(value?.[0]?.type)
  //   ),
});

export const purchaseSchema = yup.object().shape({
  referenceNo: yup.string().required("Enter Reference No"),
  vendorId: yup.object().required("Choose Any Vendor"),
  supplierInvoiceSerialNumber: yup.string().required("Enter Invoice Serial No"),
  notes: yup.string().required("Enter Notes"),
  bank: yup.object().required("Choose Any bank"),
  termsAndCondition: yup.string().required("Enter Terms And Condition"),
  signatureName: yup.string().when("sign_type", (sign_type) => {
    if (sign_type == "eSignature") {
      return yup.string().nullable().required("Enter Signature Name");
    } else {
      return yup.string().notRequired();
    }
  }),
  signatureData: yup.string().when("sign_type", (sign_type) => {
    if (sign_type == "eSignature") {
      return yup
        .string()
        .test(
          "is-eSignature",
          `Draw The Signature`,
          async (value) => value == "true"
        );
    } else {
      return yup.string().notRequired();
    }
  }),
  signatureId: yup.string().when("sign_type", (sign_type) => {
    if (sign_type == "manualSignature") {
      return yup.object().shape({
        value: yup.string().required("Choose Signature Name"),
      });
    } else {
      return yup.string().notRequired();
    }
  }),
});

export const editPurchaseSchema = yup.object().shape({
  referenceNo: yup.string().required("Enter Reference No"),
  vendorId: yup.object().required("Choose Any Vendor"),
  supplierInvoiceSerialNumber: yup.string().required("Enter Invoice Serial No"),
  notes: yup.string().required("Enter Notes"),
  bank: yup.object().required("Choose Any Bank"),
  termsAndCondition: yup.string().required("Enter Terms And Condition"),
  sign_type: yup.string().typeError("Choose Signature Type"),
  signatureName: yup.string().when("sign_type", (sign_type) => {
    if (sign_type == "eSignature") {
      return yup.string().nullable().required("Enter Signature Name");
    } else {
      return yup.string().notRequired();
    }
  }),
  signatureData: yup.string().when("sign_type", (sign_type) => {
    if (sign_type == "eSignature") {
      return yup
        .string()
        .test(
          "is-eSignature",
          `Draw The Signature`,
          async (value) => value == "true"
        );
    } else {
      return yup.string().notRequired();
    }
  }),
  signatureId: yup.string().when("sign_type", (sign_type) => {
    if (sign_type == "manualSignature") {
      return yup.object().shape({
        value: yup.string().required("Choose Signature Name"),
      });
    } else {
      return yup.string().notRequired();
    }
  }),
});

export const expenseSchema = yup.object().shape({
  // reference: yup.string().required("Enter Reference Number"),
  amount: yup.string().required("Enter Amount"),
  expenseDate: yup.string().required("Enter Date").nullable(),
  // description: yup.string().required("Enter description"),
  paymentMode: yup.object().required("Choose Any Payment Mode"),
  status: yup.object().required("Choose Any Payment Status"),
  // description: yup.string().required("Enter Description"),
  // attachment: yup.mixed().test("required", "Image is Required", (value) => {
  //   if (value.length > 0) return true;
  //   return false;
  // }),
});

export const editExpenseSchema = yup.object().shape({
  expenseId: yup.string().required("Enter Expense Id"),
  // reference: yup.string().required("Enter Reference Number"),
  amount: yup.string().required("Enter Amount"),
  // description: yup.string().required("Enter Description"),
  paymentMode: yup.object().required("Choose Any Payment Mode"),
  status: yup.object().required("Choose Any Payment Status"),
});

export const userSchema = yup.object().shape({
  // image: yup
  //   .mixed()
  //   .required("Please select an image file.")
  //   .test(
  //     "fileFormat",
  //     "Invalid file format. Please select a valid image file.",
  //     (value) => {
  //       if (!value) return false;
  //       const allowedFormats = ["image/jpeg", "image/png", "image/gif"];
  //       return allowedFormats.includes(value.type);
  //     }
  //   ),
  firstName: yup.string().required("Enter First Name"),
  lastName: yup.string().required("Enter Last Name"),
  email: yup.string().email("Enter Valid Email").required("Enter Email"),
  // mobileNumber: yup
  //   .string()
  //   .required("Enter Mobile Number")
  //   .min(10, "Mobile number must be at least 10 digits")
  //   .max(10, "Mobile number must be at most 10 digits")
  //   .matches(/^\+?[1-9]\d*$/, "Invalid phone number"),
  role: yup.object().required("Choose any Role"),
  // status: yup.object().required("Choose Any Status"),
  password: yup
    .string()
    .required("Enter new password")
    .min(6, "Password should be at least 6 characters")
    .matches(upperCase, "Password must contain at least one uppercase")
    .matches(lowerCase, "Password must contain at least one lowercase")
    .matches(numberRgx, "Password must contain at least one number")
    .matches(SpecialCharacters, "At Least one special character")
    .max(10, "Password should be maximum 10 characters")
    .trim(),
  userName: yup
    .string().test("is-alphabets-only", "Only alphabets are allowed", function (value) {
      if (!value) return true;
      return /^[A-Za-z ]+$/.test(value);
    }).optional().required("Enter User Name"),
  confirm_password: yup
    .string()
    .required("Enter Confirm Password")
    .oneOf([yup.ref("password")], "Password does not match"),
});

export const edituserSchema =(hasPreviewImage)=>{
  let imageValidation = yup.mixed();
  if (!hasPreviewImage) {
    imageValidation = imageValidation
      .required("Please select an image file.")
      .test(
        "fileFormat",
        "Invalid file format. Please select a valid image file.",
        (value) => {
          if (!value) return false;
          const allowedFormats = ["image/jpeg", "image/png", "image/gif"];
          return allowedFormats.includes(value.type);
        }
      );
  }
 return yup.object().shape({
  image: imageValidation,
    
    firstName: yup
      .string()
      .required("Enter First Names")
      .matches(/^[A-Za-z ]+$/, "Only alphabets are allowed"),
    lastName: yup
      .string()
      .required("Enter Last Name")
      .matches(/^[A-Za-z ]+$/, "Only alphabets are allowed"),
    userName: yup
      .string()
      // .matches(/^[A-Za-z ]+$/, "Only alphabets are allowed")
      .test("is-alphabets-only", "Only alphabets are allowed", function (value) {
        if (!value) return true;
        return /^[A-Za-z ]+$/.test(value);
      })
      .optional(),
    email: yup.string().email("Enter valid email").required("Enter Email"),

  });

}

export const debitSchema = yup.object().shape({
  vendorId: yup.object().required("Choose Any Vendor"),
  bank: yup.object().required("Choose Any Bank"),
  signatureName: yup.string().nullable().required("Enter Signature Name"),
  signatureImage: yup
    .mixed()
    .test("required", "Upload Signature Image", (value) => {
      if (value.length > 0) return true;
      return false;
    })
    .test(
      "fileSize",
      "File size is too large",
      (value) => value && value?.[0]?.size <= 1048576
    ) // 1MB
    .test(
      "fileType",
      "Unsupported file format",
      (value) =>
        value &&
        ["image/jpeg", "image/png", "image/svg+xml"].includes(value?.[0]?.type)
    ),
});

export const editdebitSchema = yup.object().shape({
  // bank: yup.object().required("Choose Any Bank"),
  // signatureName: yup.string().nullable().required("Enter Signature Name"),
  sign_type: yup.string().typeError("Choose Signature Type"),
  // eslint-disable-next-line no-dupe-keys
  signatureName: yup.string().when("sign_type", (sign_type) => {
    if (sign_type == "eSignature") {
      return yup.string().nullable().required("Enter Signature Name");
    } else {
      return yup.string().nullable().notRequired();
    }
  }),
  signatureData: yup.string().when("sign_type", (sign_type) => {
    if (sign_type == "eSignature") {
      return yup
        .string()
        .test(
          "is-eSignature",
          `Draw The Signature`,
          async (value) => value == "true"
        );
    } else {
      return yup.string().notRequired();
    }
  }),
  signatureId: yup.string().when("sign_type", (sign_type) => {
    if (sign_type == "manualSignature") {
      return yup.object().shape({
        value: yup.string().required("Choose Signature Name"),
      });
    } else {
      return yup.object().notRequired();
    }
  }),
});

export const quotationSchema = yup.object().shape({
  // purchaseId: yup.string().required("Please enter Vendor name"),
  reference_no: yup.string().required("Please enter Reference No"),
  customerId: yup.string().required("Please select any Customer"),
  // listData: yup.string().required("Please select atleast one product"),
  // bank: yup.object().required("Please choose Bank"),
  notes: yup.string().required("Please enter your notes"),
  // bank: yup.object().shape({
  //   _id: yup.string().required("Choose the bank"),
  // }),
  bank: yup.object().required("Choose the bank"),
  termsAndCondition: yup.string().required("Enter the termsAndCondition"),
  signature_name: yup.string().required("Enter the signatureName"),
});

export const creditNoteSchema = yup.object().shape({
  // purchaseId: yup.string().required("Please enter Vendor name"),
  reference_no: yup.string().required(" Enter Reference No"),
  customerId: yup.string().required("Choose Any Customer"),
  // listData: yup.string().required("Please select atleast one product"),
  // bank: yup.object().required("Please choose Bank"),
  // notes: yup.string().required("Enter Notes"),
  // bank: yup.object().required("Choose Any Bank"),
  // bank: yup.object().shape({
  //   _id: yup.string().required("Choose the bank"),
  // }),
  // termsAndCondition: yup.string().required("Enter Terms And Conditions"),
  signature_name: yup.string().nullable().required("Enter Signature Name"),
  signatureImage: yup
    .mixed()
    .test("required", "Upload Signature Image", (value) => {
      if (value.length > 0) return true;
      return false;
    })
    .test(
      "fileSize",
      "File size is too large",
      (value) => value && value?.[0]?.size <= 1048576
    ) // 1MB
    .test(
      "fileType",
      "Unsupported file format",
      (value) =>
        value &&
        ["image/jpeg", "image/png", "image/svg+xml"].includes(value?.[0]?.type)
    ),
});
export const creditNoteEditSchema = yup.object().shape({
  // purchaseId: yup.string().required("Please enter Vendor name"),
  // customerId: yup.string().required("Please select any Customer"),
  // listData: yup.string().required("Please select atleast one product"),
  // bank: yup.object().required("Please choose Bank"),
  // bank: yup.object().required("Choose Any Bank"),
  // bank: yup.object().shape({
  //   _id: yup.string().required("Choose the bank"),
  // }),
  signature_name: yup.string().nullable().required("Enter Signature Name"),
});

export const DeliveryChallanSchema = yup.object().shape({
  // purchaseId: yup.string().required("Please enter Vendor name"),
  // referenceNo: yup.string().required("Please enter Reference No"),
  customerId: yup.object().required("Choose Any Customer"),
  // listData: yup.string().required("Please select atleast one product"),
  bank: yup.object().required("Choose Any Bank"),
  notes: yup.string().required("Enter Notes"),
  // bank: yup.string().required("Choose the bank"),

  termsAndCondition: yup.string().required("Enter Terms And Condition"),
  signatureName: yup.string().nullable().required("Enter Signature Name"),
  signatureImage: yup
    .mixed()
    .test("required", "Upload Signature Image", (value) => {
      if (value.length > 0) return true;
      return false;
    })
    .test(
      "fileSize",
      "File size is too large",
      (value) => value && value?.[0]?.size <= 1048576
    ) // 1MB
    .test(
      "fileType",
      "Unsupported file format",
      (value) =>
        value &&
        ["image/jpeg", "image/png", "image/svg+xml"].includes(value?.[0]?.type)
    ),
});

export const EditDeliveryChallanSchema = yup.object().shape({
  // purchaseId: yup.string().required("Please enter Vendor name"),
  // referenceNo: yup.string().required("Please enter Reference No"),
  customerId: yup.object().required("Choose Any Customer"),
  address: yup.string().required("Add Shipping Address").trim(),
  // listData: yup.string().required("Please select atleast one product"),
  // bank: yup.object().required("choose Any Bank"),
  // bank: yup.string().required("Choose the bank"),

  // signatureName: yup.string().nullable().required("Enter Signature Name"),
});
