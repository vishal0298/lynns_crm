import * as yup from "yup";
export const addproductPageschema = yup
.object()
.shape({
  discountType: yup.object({
    id: yup.string().required("Choose Discount Type"),
  }),
  discountValue: yup
    .number()
    .typeError("Discount Value is Required")
    .when(
      ["discountType", "sellingPrice"],
      (discountType, sellingPrice, schema) => {
        if (discountType.text === "Percentage") {
          return schema.max(99, "Discount Value Must Be Less Than 100");
        } else if (discountType.text === "Fixed") {
          return schema.lessThan(
            sellingPrice,
            "Discount Value Must Be Less Than The Selling Price"
          );
        }
        return schema;
      }
    ),
  tax: yup.object({
    _id: yup.string().required("Enter Tax"),
  }),
  units: yup.object({
    _id: yup.string().required("Choose Unit"),
  }),
  category: yup.object({
    _id: yup.string().required("Choose Category"),
  }),

  type: yup.string().typeError("Choose Any Type"),
  name: yup.string().required("Enter Product Name"),
  sku: yup.number().typeError("SKU Must Be a Number"),

  sellingPrice: yup.number().when("purchasePrice", {
    is: (ContactNumber) => isNaN(ContactNumber),
    then: yup
      .number()
      .test(
        (value) =>
          typeof value === "number" && !/[eE+-]/.test(value.toString())
      )
      .positive("Selling Price Must Be a Positive Number")
      .integer("Selling Price Must Be a Integer")
      .typeError("Enter Valid Selling Price")
      .required("Selling Price is Required"),
    otherwise: yup
      .number()
      .test(
        (value) =>
          typeof value === "number" && !/[eE+-]/.test(value.toString())
      )
      .positive("Selling Price Must Be a Positive Number")
      .integer("Selling Price Must Be a Integer")
      .typeError("Enter Valid Selling Price")
      .required("Selling Price is Required")
      .moreThan(
        yup.ref("purchasePrice"),
        "Selling Price Must Be Greater Than The Purchase Price"
      ),
  }),
  purchasePrice: yup
    .number()
    .test(
      (value) => typeof value === "number" && !/[eE+-]/.test(value.toString())
    )
    .positive("Purchase Price Must Be a Positive Number")
    .integer("Purchase Price Must Be a Integer")
    .typeError("Enter Valid Purchase Price"),
  
  alertQuantity: yup
    .number()
    .typeError("Enter Alert quantity")
    .positive("Alert Quantity Must Be a Positive Number")
    .integer("Alert Quantity Must Be a Integer"),
})
.required();