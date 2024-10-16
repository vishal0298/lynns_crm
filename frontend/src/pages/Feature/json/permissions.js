const permissions = [
  {
    module: "dashboard",
    permissions: {
      create: true,
      update: false,
      view: true,
      delete: false,
      all: false,
    },
  },
  {
    module: "customer",
    permissions: {
      create: false,
      update: false,
      view: false,
      delete: true,
      all: true,
    },
  },
  {
    module: "vendor",
    permissions: {
      create: false,
      update: false,
      view: false,
      delete: false,
      all: false,
    },
  },
  {
    module: "ledger",
    permissions: {
      create: true,
      update: false,
      view: true,
      delete: false,
      all: false,
    },
  },
  {
    module: "productsOrServices",
    permissions: {
      create: false,
      update: false,
      view: true,
      delete: true,
      all: false,
    },
  },
  {
    module: "category",
    permissions: {
      create: false,
      update: false,
      view: true,
      delete: true,
      all: false,
    },
  },
  {
    module: "unit",
    permissions: {
      create: true,
      update: false,
      view: false,
      delete: false,
      all: true,
    },
  },
  {
    module: "staff",
    permissions: {
      create: true,
      update: false,
      view: false,
      delete: false,
      all: true,
    },
  },
  {
    module: "inventory",
    permissions: {
      create: true,
      update: true,
      view: false,
      delete: true,
      all: false,
    },
  },
  {
    module: "invoice",
    permissions: {
      create: false,
      update: false,
      view: false,
      delete: false,
      all: false,
    },
  },
  {
    module: "salesreturn",
    permissions: {
      create: true,
      update: true,
      view: true,
      delete: true,
      all: true,
    },
  },
  {
    module: "purchase",
    permissions: {
      create: false,
      update: false,
      view: false,
      delete: false,
      all: false,
    },
  },
  {
    module: "purchaseOrder",
    permissions: {
      create: true,
      update: false,
      view: true,
      delete: false,
      all: true,
    },
  },
  {
    module: "purchasereturn",
    permissions: {
      create: false,
      update: false,
      view: false,
      delete: false,
      all: false,
    },
  },
  {
    module: "expense",
    permissions: {
      create: false,
      update: false,
      view: false,
      delete: false,
      all: false,
    },
  },
  {
    module: "payment",
    permissions: {
      create: false,
      update: false,
      view: false,
      delete: false,
      all: false,
    },
  },
  {
    module: "quotation",
    permissions: {
      create: false,
      update: false,
      view: false,
      delete: false,
      all: false,
    },
  },
  {
    module: "deliveryChallan",
    permissions: {
      create: false,
      update: false,
      view: false,
      delete: false,
      all: false,
    },
  },
  {
    module: "quotationReport",
    permissions: {
      create: false,
      update: false,
      view: false,
      delete: false,
      all: false,
    },
  },
  {
    module: "paymentSummaryReport",
    permissions: {
      create: false,
      update: false,
      view: false,
      delete: false,
      all: false,
    },
  },
  {
    module: "user",
    permissions: {
      create: false,
      update: false,
      view: false,
      delete: false,
      all: false,
    },
  },
  {
    module: "role",
    permissions: {
      create: false,
      update: false,
      view: false,
      delete: false,
      all: false,
    },
  },
  {
    module: "deleteAccountRequest",
    permissions: {
      create: false,
      update: false,
      view: false,
      delete: false,
      all: false,
    },
  },
  {
    module: "membership",
    permissions: {
      create: false,
      update: false,
      view: false,
      delete: false,
      all: false,
    },
  },
  {
    module: "accountSettings",
    permissions: {
      create: false,
      update: false,
      view: false,
      delete: false,
      all: false,
    },
  },
  {
    module: "companySettings",
    permissions: {
      create: false,
      update: false,
      view: false,
      delete: false,
      all: false,
    },
  },
  {
    module: "invoiceSettings",
    permissions: {
      create: false,
      update: false,
      view: false,
      delete: false,
      all: false,
    },
  },
  {
    module: "paymentSettings",
    permissions: {
      create: false,
      update: false,
      view: false,
      delete: false,
      all: false,
    },
  },
  {
    module: "bankSettings",
    permissions: {
      create: false,
      update: false,
      view: false,
      delete: false,
      all: false,
    },
  },
  {
    module: "taxSettings",
    permissions: {
      create: false,
      update: false,
      view: false,
      delete: false,
      all: false,
    },
  },
  {
    module: "emailSettings",
    permissions: {
      create: false,
      update: false,
      view: false,
      delete: false,
      all: false,
    },
  },
  {
    module: "preferenceSettings",
    permissions: {
      create: false,
      update: false,
      view: false,
      delete: false,
      all: false,
    },
  },
];
export default permissions;
