import React from "react";
import { AddpurchaseReturnComponentController } from "./AddpurchaseReturn.control";
import AddPurchaseReturn from "./AddpurchaseReturn";

const AddPurchaseReturnComponent = () => {
  return (
    <>
      <AddpurchaseReturnComponentController>
        <AddPurchaseReturn />
      </AddpurchaseReturnComponentController>
    </>
  );
};

export default AddPurchaseReturnComponent;
