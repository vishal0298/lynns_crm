import React from "react";
import EditVendorList from "./editVendors";
import { EditvendorComponentController } from "./editVendor.control";

const EditvendorComponent = () => {
  return (
    <>
      <EditvendorComponentController>
        <EditVendorList />
      </EditvendorComponentController>
    </>
  );
};

export default EditvendorComponent;
