import React from "react";
import Login from "../pages/authentication/login/login-index.jsx";
import Register from "../pages/authentication/Register/Reister-index.jsx";
import ForgotPassword from "../pages/authentication/ForgotPassword";
import ConfirmPassword from "../pages/authentication/ConfirmationPassword";
import Dashboard from "../pages/Feature/dashboard/Index.jsx";
import ProductList from "../pages/Feature/products/productList/index.jsx";
import AddProduct from "../pages/Feature/products/addProduct/index.jsx";
import EditProduct from "../pages/Feature/products/editProduct/index.jsx";
import Settings from "../pages/Feature/settings/accountSettings/index.jsx";
import CompanySettings from "../pages/Feature/settings/companySettings/index.jsx";
import InvoiceSettings from "../pages/Feature/settings/invoiceSettings/index.jsx";
// import Customers from "../pages/Feature/customers/Index.jsx";
// import AddCustomer from "../pages/Feature/customers/AddCustomer";
// import EditCustomer from "../pages/Feature/customers/EditCustomer";
import PaymentSettings from "../pages/Feature/settings/paymentSettings/index.jsx";
import ChangePassword from "../pages/Feature/settings/changePassword/index.jsx";
import BankAccount from "../pages/Feature/settings/bankSettings/index.jsx";
import TaxRates from "../pages/Feature/settings/taxRates/index.jsx";
import Preferences from "../pages/Feature/settings/preferences/index.jsx";
import EmailSettings from "../pages/Feature/settings/emailSettings/index.jsx";
// import AddVendors from "../pages/Feature/vendors/addVendor/index.jsx";
import AddLedger from "../pages/Feature/vendors/addLedger/index.jsx";
// import EditVendorList from "../pages/Feature/vendors/editVendor/index.jsx";
import DeactiveCustomers from "../pages/Feature/customers/deactivateCustomers";
import ActiveCustomers from "../pages/Feature/customers/activeCustomers";
import CustomerDetails from "../pages/Feature/customers/customerDetails";
import Addcategory from "../pages/Feature/products/addCategory/index.jsx";
import Inventory from "../pages/Feature/inventory/inventory";
// import PurchaseOrders from "../pages/Feature/purchaseOrdersLts/purchaseorderList/index.jsx";
// import AddPurchaseOrders from "../pages/Feature/purchaseOrdersLts/addPurchaseOrder/index.jsx";
// import EditPurchaseOrders from "../pages/Feature/purchaseOrdersLts/editPurchaseOrder/index.jsx";
// import ViewPurchaseOrders from "../pages/Feature/purchaseOrdersLts/viewPurchaseOrder/index.jsx";
// import ViewPurchase from "../pages/Feature/purchase/viewPurchase";
import ViewDebitnotes from "../pages/Feature/debitNotes/viewDebitnotes";
import ViewCustomer from "../pages/Feature/customers/viewCustomer";
import ViewDc from "../pages/Feature/deliveryChallans/viewDc";
import CreditNotes from "../pages/Feature/creditNotes/CreditList/index.jsx";
import AddCredit from "../pages/Feature/creditNotes/addCredit/index.jsx";
import EditCredit from "../pages/Feature/creditNotes/editCredit/index.jsx";
import ViewCredit from "../pages/Feature/creditNotes/viewCredit/index.jsx";
import InvoiceList from "../pages/Feature/invoices/invoiceList/index.jsx";
import InvoiceAdd from "../pages/Feature/invoices/addInvoice/index.jsx";
import InvoiceEdit from "../pages/Feature/invoices/editInvoice/index.jsx";
import InvoiceView from "../pages/Feature/invoices/viewInvoice/index.jsx";
import PrintDownload from "../pages/Feature/invoices/printDownload/index.jsx";
import RolePermissions from "../pages/Feature/rolePermission/index.jsx";
import Permissions from "../pages/Feature/rolePermission/permission";
import Payments from "../pages/Feature/payments/Index.jsx";
import Users from "../pages/Feature/manageUser/ListUser/index.jsx";
import AddUser from "../pages/Feature/manageUser/AddUser/index.jsx";
import EditUser from "../pages/Feature/manageUser/EditUser/index.jsx";
import PaymentSummary from "../pages/Feature/paymentSummary/index.jsx";
// import ListPurchases from "../pages/Feature/purchase/ListPurchase/index.jsx";
// import AddPurchase from "../pages/Feature/purchase/addPurchase/index.jsx";
// import EditPurchase from "../pages/Feature/purchase/EditPurchase/index.jsx";
import ListDebitNotes from "../pages/Feature/debitNotes/ListDebitNotes/index.jsx";
// import AddPurchaseReturn from "../pages/Feature/debitNotes/addPurchaseReturn/index.jsx";
// import EditPurchaseReturn from "../pages/Feature/debitNotes/editPurchaseReturn/index.jsx";
import ListDeliveryChallans from "../pages/Feature/deliveryChallans/ListDeliveryChallan/index.jsx";
import AddDeliveyChallan from "../pages/Feature/deliveryChallans/AddDeliveryChallan/index.jsx";
import EditDeliveryChallan from "../pages/Feature/deliveryChallans/EditDeliveryChallan/index.jsx";
import ListExpenses from "../pages/Feature/expenses/ListExpense/index.jsx";
import AddExpense from "../pages/Feature/expenses/AddExpense/index.jsx";
import EditExpense from "../pages/Feature/expenses/EditExpense/index.jsx";
import AddQuotation from "../pages/Feature/quatations/addQuotation/index.jsx";
import EditQuotation from "../pages/Feature/quatations/editQuotation/index.jsx";
import QuotationList from "../pages/Feature/quatations/quotationList/index.jsx";
import ViewQuotations from "../pages/Feature/quatations/viewQuotation/index.jsx";
import AddCustomers from "../pages/Feature/customers/addCustomer/index.jsx";
import EditCustomers from "../pages/Feature/customers/editCustomer/index.jsx";
import ListCustomer from "../pages/Feature/customers/listCustomer/index.jsx";
import EditCategory from "../pages/Feature/products/editCategory/index.jsx";
import ListCategory from "../pages/Feature/products/listCategory/index.jsx";
import AddUnit from "../pages/Feature/products/addUnits/index.jsx";
import EditUnits from "../pages/Feature/products/editUnits/index.jsx";
import Units from "../pages/Feature/products/listUnit/index.jsx";
import Staff from "../pages/Feature/products/listStaff/index.jsx";
// import ListVendors from "../pages/Feature/vendors/vendorList/index.jsx";
import RecurringInvoices from "../pages/Feature/requrringInvoices/requringinvoiceList/index.jsx";
import NotificationSetting from "../pages/Feature/settings/notifications/index.jsx";
import Unauthorised from "../pages/Feature/unauthorised/Unauthorised";
import OnlinePayment from "../pages/Feature/onlinePayments/OnlinePaymnet";
import SignatureList from "../pages/Feature/signatureList";
import SignaturePreviewInvoice from "../pages/Feature/signaturePreview";
import MailPayInvoice from "../pages/Feature/mailPayInvoice";
import AllNotification from "../pages/Feature/notifications";
import InvoiceTemplate from "../pages/Feature/settings/invoiceTemplate/index.jsx";
import AddPreviewInvoice from "../pages/Feature/invoices/addSignPreview";
import EditPreviewInvoice from "../pages/Feature/invoices/editSignPreview";
import AddPreviewSales from "../pages/Feature/creditNotes/addSignPreview";
// import AddPreviewPurchase from "../pages/Feature/purchaseOrdersLts/addSignPreview";
// import EditPreviewPurchase from "../pages/Feature/purchaseOrdersLts/editSignPreview";
import ListOfSignature from "../pages/Feature/settings/signatureLists";
import AdminLogin from "../pages/authentication/login/admin-index.jsx";
import UserLogin from "../pages/authentication/login/user-index.jsx";
// import ViewVendor from "../pages/Feature/vendors/viewVendor/index.jsx";
import ViewExpense from "../pages/Feature/expenses/ViewExpense/index.jsx";
import AddStaff from "../pages/Feature/products/addStaff/addStaff";
import EditStaff from "../pages/Feature/products/editStaff/index.jsx";

export const unAuthRoutes = [
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/admin-login",
    element: <AdminLogin />,
  },
  {
    path: "/user-login",
    element: <UserLogin />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/confirmation-password",
    element: <ConfirmPassword />,
  },
  {
    path: "/online-payment",
    element: <OnlinePayment />,
  },
];

export const authRoutes = [
  {
    path: "",
    element: <Dashboard />,
  },
  {
    path: "/index",
    element: <Dashboard />,
  },
  {
    path: "/customers",
    element: <ListCustomer />,
  },
  {
    path: "/active-customers",
    element: <ActiveCustomers />,
  },
  {
    path: "/deactive-customers",
    element: <DeactiveCustomers />,
  },
  {
    path: `${"/customer-details"}/:id`,
    element: <CustomerDetails />,
  },
  {
    path: "/add-customer",
    element: <AddCustomers />,
  },
  {
    path: `${"/edit-customer"}/:id`,
    element: <EditCustomers />,
  },
  {
    path: "/product-list",
    element: <ProductList />,
  },
  {
    path: "/category",
    element: <ListCategory />,
  },
  {
    path: "/add-categories",
    element: <Addcategory />,
  },
  {
    path: `${"/edit-categories"}/:id`,
    element: <EditCategory />,
  },
  {
    path: "/units",
    element: <Units />,
  },
  {
    path: "/staff",
    element: <Staff />,
  },
  {
    path: "/add-units",
    element: <AddUnit />,
  },
  {
    path: "/add-staff",
    element: <AddStaff />,
  },
  {
    path: `${"/edit-units"}/:id`,
    element: <EditUnits />,
  },
  {
    path: `${"/edit-staff"}/:id`,
    element: <EditStaff />,
  },
  {
    path: "/add-product",
    element: <AddProduct />,
  },
  {
    path: `${"/edit-product"}/:id`,
    element: <EditProduct />,
  },
  // {
  //   path: "/purchases",
  //   element: <ListPurchases />,
  // },
  // {
  //   path: "/add-purchases",
  //   element: <AddPurchase />,
  // },
  // {
  //   path: `${"/purchase-edit"}/:id`,
  //   element: <EditPurchase />,
  // },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/company-settings",
    element: <CompanySettings />,
  },
  {
    path: "/invoice-settings",
    element: <InvoiceSettings />,
  },
  {
    path: "/payments",
    element: <Payments />,
  },
  {
    path: "/payment-settings",
    element: <PaymentSettings />,
  },
  {
    path: "/email-settings",
    element: <EmailSettings />,
  },
  {
    path: "/tax-rates",
    element: <TaxRates />,
  },
  {
    path: "/preferences",
    element: <Preferences />,
  },
  {
    path: "/bank-account",
    element: <BankAccount />,
  },
  // {
  //   path: "/vendors",
  //   element: <Vendors />,
  // },
  // {
  //   path: "/vendors",
  //   element: <ListVendors />,
  // },
  // {
  //   path: "/add-vendors",
  //   element: <AddVendors />,
  // },
  {
    path: `${"/add-ledger"}/:id`,
    element: <AddLedger />,
  },
  {
    path: "/add-quotations",
    element: <AddQuotation />,
  },
  {
    path: "/quotations",
    element: <QuotationList />,
  },

  {
    path: `${"/view-quotations"}/:id`,
    element: <ViewQuotations />,
  },
  // {
  //   path: `${"/view-purchase"}/:id`,
  //   element: <ViewPurchase />,
  // },
  {
    path: `${"/view-debitnotes"}/:id`,
    element: <ViewDebitnotes />,
  },
  {
    path: `${"/view-delivery-challan"}/:id`,
    element: <ViewDc />,
  },
  {
    path: `${"/view-customer"}/:id`,
    element: <ViewCustomer />,
  },
  {
    path: `${"/edit-quotations"}/:id`,
    element: <EditQuotation />,
  },
  // {
  //   path: `${"/edit-quotations"}/:id`,
  //   element: <EditQuotations />,
  // },
  // {
  //   path: `${"/edit-vendors"}/:id`,
  //   element: <EditVendorList />,
  // },
  // {
  //   path: `${"/view-vendor"}/:id`,
  //   element: <ViewVendor />,
  // },
  {
    path: "/inventory",
    element: <Inventory />,
  },
  // {
  //   path: `/purchase-orders`,
  //   element: <PurchaseOrders />,
  // },
  // {
  //   path: `/add-purchases-order`,
  //   element: <AddPurchaseOrders />,
  // },

  {
    path: `/sales-return`,
    element: <CreditNotes />,
  },
  {
    path: `/add-sales-return`,
    element: <AddCredit />,
  },
  {
    path: `${"/edit-sales-return"}/:id`,
    element: <EditCredit />,
  },
  {
    path: `${"/view-sales-return"}/:id`,
    element: <ViewCredit />,
  },
  // {
  //   path: `${"/edit-purchases-order"}/:id`,
  //   element: <EditPurchaseOrders />,
  // },
  // {
  //   path: `${"/view-purchases-order"}/:id`,
  //   element: <ViewPurchaseOrders />,
  // },

  {
    path: `/debit-notes`,
    element: <ListDebitNotes />,
  },
  // {
  //   path: `/add-debit-notes`,
  //   element: <AddPurchaseReturn />,
  // },
  // {
  //   path: `${"/edit-debit-notes"}/:id`,
  //   element: <EditPurchaseReturn />,
  // },
  {
    path: `/expenses`,
    element: <ListExpenses />,
  },
  {
    path: `/add-expenses`,
    element: <AddExpense />,
  },
  {
    path: `${"/edit-expenses"}/:id`,
    element: <EditExpense />,
  },
  {
    path: `${"/view-expenses"}/:id`,
    element: <ViewExpense />,
  },
  {
    path: `/invoice-list`,
    element: <InvoiceList />,
  },
  {
    path: `/add-invoice`,
    element: <InvoiceAdd />,
  },
  {
    path: `${"/edit-invoice"}/:id`,
    element: <InvoiceEdit />,
  },
  {
    path: `${"/view-invoice"}/:id`,
    element: <InvoiceView />,
  },
  {
    path: `${"/print-download-invoice"}/:id`,
    element: <PrintDownload />,
  },
  {
    path: `/roles-permission`,
    element: <RolePermissions />,
  },
  {
    path: `${"/permission"}/:id`,
    element: <Permissions />,
  },
  {
    path: `/delivery-challans`,
    element: <ListDeliveryChallans />,
  },
  {
    path: `/add-delivery-challans`,
    element: <AddDeliveyChallan />,
  },
  {
    path: `${"/edit-delivery-challan"}/:id`,
    element: <EditDeliveryChallan />,
  },
  {
    path: `/users`,
    element: <Users />,
  },
  {
    path: `/add-user`,
    element: <AddUser />,
  },
  {
    path: `${"/edit-user"}/:id`,
    element: <EditUser />,
  },
  {
    path: "/payment-summary",
    element: <PaymentSummary />,
  },
  {
    path: "/password-change",
    element: <ChangePassword />,
  },
  {
    path: "/recurring-invoices",
    element: <RecurringInvoices />,
  },
  {
    path: "/notification-settings",
    element: <NotificationSetting />,
  },
  {
    path: "/unauthorised",
    element: <Unauthorised />,
  },
  {
    path: "/list-of-signature",
    element: <SignatureList />,
  },
  {
    path: "/signature-preview-invoice",
    element: <SignaturePreviewInvoice />,
  },
  {
    path: "/add-signature-preview-invoice",
    element: <AddPreviewInvoice />,
  },
  {
    path: "/add-sales-signature-preview",
    element: <AddPreviewSales />,
  },
  {
    path: "/edit-signature-preview-invoice",
    element: <EditPreviewInvoice />,
  },
  {
    path: "/mail-pay-invoice",
    element: <MailPayInvoice />,
  },
  {
    path: "/all-notifications",
    element: <AllNotification />,
  },
  {
    path: "/invoice-templates",
    element: <InvoiceTemplate />,
  },
  // {
  //   path: "/add-purchase-signature-preview",
  //   element: <AddPreviewPurchase />,
  // },
  // {
  //   path: "/edit-purchase-signature-preview",
  //   element: <EditPreviewPurchase />,
  // },
  {
    // path: "/add-purchase-return-signature-preview",
    // element: <AddPurchaseReturnPreview />,
    path: "/signature-lists",
    element: <ListOfSignature />,
  },
];
