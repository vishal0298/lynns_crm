import React from "react";
import AdminLogin from "./AdminLogin";
import { AdminComponentController } from "./admin.control";

const AdminComponent = () => {
  return (
    <>
      <AdminComponentController>
        <AdminLogin />
      </AdminComponentController>
    </>
  );
};

export default AdminComponent;
