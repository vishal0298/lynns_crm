import { message as toaster } from "antd";

// const heading = "Lynns Salon";
// const toastPosition = "top-center";

const infoToast = (message) => {
  toaster.info({ content: message, className: "toaster" });
};

const successToast = (message) => {
  toaster.success({ content: message, className: "toaster" });
};

const errorToast = (message) => {
  toaster.error({ content: message, className: "toaster" });
};

const fielderrorToast = (message) => {
  toaster.error({ content: message, className: "toaster" });
};

const customerrorToast = (message) => {
  toaster.error({ content: message, className: "toaster" });
};

const warningToast = (message) => {
  toaster.warn({ content: message, className: "toaster" });
};

const loadingToast = () => {
  toaster.loading("Loading Content", {}).then(() => {});
};

export {
  infoToast,
  successToast,
  errorToast,
  warningToast,
  loadingToast,
  customerrorToast,
  fielderrorToast,
};
