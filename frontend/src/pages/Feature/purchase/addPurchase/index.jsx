import React from "react";
import AddPurchase from "./AddPurchase";
import { AddpurchaseComponentController } from "./AddPurchase.control";

const AddpurchaseComponent = () => {
  return (
    <>
      <AddpurchaseComponentController>
        <AddPurchase />
      </AddpurchaseComponentController>
    </>
  );
};

export default AddpurchaseComponent;
