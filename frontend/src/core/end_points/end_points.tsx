export const loginApi = `/auth/login`;
export const signupApi = `/auth/signup`;
export const forgotpassword = `/auth/forgot_password`;
export const change_password = `/auth/change_password`;
export const serviceApi = `/services`;

export const productApi = `/products`;
export const addproductApi = `products/addProduct`;
export const productListapi = `/products/listProduct`;
export const productupdateapi = `/products/updateProduct`;
export const productViewapi = `/products/viewProduct`;
export const productDelapi = `/products/deleteProduct`;

export const BankSettings = {
  Add: "/bankSettings/addBank",
  Upadte: "/bankSettings/updateBank",
  List: "/bankSettings/listBanks",
  View: "/bankSettings/viewBank",
  Delete: "/bankSettings/deleteBank",
};

export const TaxRateAPI = {
  Add: "/tax/addTax",
  List: "/tax/listTaxes",
  Delete: "/tax/deleteTax",
  Upadte: "/tax/updateTax",
  View: "/tax/viewTax",
};

export const CompanysettingView = `/companySettings/viewCompanySetting`;
export const CompanysettingUpdate = `/CompanySettings/updateCompanySetting`;

export const AccountSettingsview = `/users/profile`;
export const AccountSettingsupdate = `/users/updateProfile`;

export const InvoiceSettingsview = `/invoiceSettings/viewInvoiceSetting`;
export const InvoiceSettingsupdate = `/invoiceSettings/updateInvoiceSetting`;

export const EmailSettingsview = `/emailSettings/viewEmail`;
export const EmailSettingsupdate = `/emailSettings/updateEmail`;

export const preferenceSettingsview = `/preferenceSettings/viewPreference`;
export const preferenceSettingsupdate = `/preferenceSettings/updatePrefernce`;

export const paymentSettingsview = `/paymentSettings/viewPaymentSetting`;
export const paymentSettingsupdate = `/paymentSettings/updatePaymentSettings`;

export const customerApi = `/customers/addCustomer`;
export const listcustomerApi = `/customers/listCustomers`;
export const deletecustomerApi = `/customers/deleteCustomer`;
export const vendorApi = `/vendor`;
export const invoiceApi = `/invoice`;
export const userDetailsApi = `/users/profile`;
export const currencyApi = `/currency?country=ind`;
export const unitsApi = `/units/unitList`;
export const staffApi = `/staff/staffList`;
export const taxListApi = `/tax/listTaxes`;
export const estimatetApi = `/estimates`;
export const itemListApi = `/invoice/prodcutorservice`;
export const categoryApi = `/category`;

// export const addVendor = "vendor/addVendor";

export const addLedger = "/ledger/addData";
export const getLedger = "/ledger/getAllData";
export const viewLedger = "/ledger/getById";
export const updateLedger = "/ledger";
export const deletedLedger = "/ledger";
export const addVendor = "/vendor/addVendor";
export const listVendor = "/vendor/listVendor";
export const deleteVendor = "vendor/deleteVendor";
export const updateVendor = "vendor/updateVendor";
export const viewVendor = "vendor/viewVendor";
export const inventoryAddStock = "/inventory/addStock";
export const inventoryList = "/inventory/inventoryList";
export const quotationFilter = "/quotation/filterQuotation";
export const creditNoteFilter = "/credit_note/filterCreditNote";
export const expenseFilter = "/expense/filterExpenses";
export const dcFilter = "/delivery_challans/filterDeliverychallans";
export const PayemntSummaryFilter = "/payment/filterPayment";
export const userFilter = "/users/filterByFullName";

export const InvoiceNum = "invoice/getInvoiceNumber";
export const CreditNum = "credit_note/getcreditNoteNumber";
export const DebitNum = "debit_note/getDebitNoteNumber";
export const PurchaseOrderNum = "purchase_orders/getPurchaseOrderNumber";
export const DeliveryChallanNum = "delivery_challans/getDeliveryChallanNumber";
export const QuotationNum = "quotation/getQuotationNumber";
export const ExpenseNum = "expense/getExpenseNumber";

export const purchase_orders = {
  Add: "/purchase_orders/addPurchaseOrder",
  Upadte: "/purchase_orders",
  List: "/purchase_orders/getAllData",
  View: "/purchase_orders",
  Delete: "/purchase_orders",
};

export const debit_note = {
  Add: "/debit_note/addData",
  Update: "/debit_note",
  List: "/debit_note",
  View: "/debit_note",
  clone: "/debit_note",
};
export const expenses = {
  Add: "/expense/addExpense",
  Update: "/expense/updateExpense",
  List: "/expense/listExpenses",
  View: "/expense/viewExpense",
  Delete: "/expense/deleteExpense",
};

export const downloadImageURL = "http://localhost:7004";
// export const downloadImageURL = "http://37.60.255.54:7004";
// export const downloadImageURL = "http://82.180.147.10:7004";
// export const downloadImageURL = "https://adarsh.roshnroys.com/api/";

export const quotation = {
  Add: "/quotation/addQuotation",
  Update: "/quotation",
  List: "/quotation/quotationList",
  View: "/quotation/viewQuotation",
  clone: "/quotation/cloneQuotation",
  delete: "/quotation/deleteQuotation",
  convert: "/quotation/convertInvoice",
};
export const credit_note = {
  Add: "/credit_note/addCreditNote",
  delete: "/credit_note/deleteCreditNote",
  List: "/credit_note/creditNoteList",
  View: "/credit_note/viewCreditNote",
  Update: "/credit_note/updateCreditNote",
  // clone: "/debit_note",
};
export const delivery_challans = {
  Add: "/delivery_challans/addDeliverychallan",
  delete: "/delivery_challans/deleteDeliverychallan",
  List: "/delivery_challans/listDeliverychallans",
  View: "/delivery_challans/viewDeliverychallan",
  Update: "/delivery_challans/updateDeliverychallan",
  clone: "/delivery_challans",
};

export const invoice = {
  Base: "/invoice",
  CardCounts: "/invoice/invoiceCard",
  Filter: "/invoice/invoicefilter",
  Update: "/invoice/updateInvoice",
};

export const usersApi = {
  List: "manage_users/listUsers",
  Add: "/manage_users/create",
  View: "manage_users/viewUser",
  Update: "/manage_users",
  Delete: "/manage_users",
};

export const rolesApi = {
  Add: "/roles/addRole",
  Update: "/roles/updateRole",
  Get: "/roles/getRoles",
};

export const paymentList = {
  List: "/payment/paymentList",
};

export const customer = {
  View: "customers/viewCustomer",
};

export const purchase = {
  List: "purchases/listPurchases",
};

export const dropdown_api = {
  customer_api: "/drop_down/customer",
  vendor_api: "/drop_down/vendor",
  category_api: "/drop_down/category",
  unit_api: "/drop_down/unit",
  staff_api: "/drop_down/staff",
  product_api: "/drop_down/product",
  tax_api: "/drop_down/tax",
  bank_api: "/drop_down/bank",
  role_api: "/drop_down/role",
};

export const invoiceTemplate = {
  view: "/invoiceTemplate/viewDefaultInvoiceTemplate",
  update: "/invoiceTemplate/setDefaultInvoiceTemplate",
};

export const paypal = "/unauthorized/paypal";
export const paypalApi = "/paypal/addPayment";
export const clientToken = "/paypal/generateClientToken";

export const signatures_api = {
  Add: "/signature/addSignature",
  Upadte: "/signature/updateSignature",
  List: "/signature/list",
  setdefault: "/signature/list",
  Delete: "/signature/deleteSignature",
  statusUpdate: "/signature/update_status",
};
export const payPalCreatePayment = "/paypal/createPayment";
export const payPalExecutePayment = "/paypal/executePayment";
