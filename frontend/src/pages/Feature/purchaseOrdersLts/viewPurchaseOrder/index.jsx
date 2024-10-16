import React from "react";
import ViewPurchaseOrder from "./ViewpurchaseOrder";
import { ViewproductComponentController } from "./ViewpurchaseOrder.control";

const ViewproductComponent = () => {
  return (
    <>
      <ViewproductComponentController>
        <ViewPurchaseOrder />
      </ViewproductComponentController>
    </>
  );
};

export default ViewproductComponent;
