import React from "react";
import ViewVendor from "./viewVendors";
import { ViewvendorComponentController } from "./viewVendor.control";

const ViewvendorComponent = () => {
  return (
    <>
      <ViewvendorComponentController>
        <ViewVendor />
      </ViewvendorComponentController>
    </>
  );
};

export default ViewvendorComponent;
