import React from "react";
import EditPurchase from "./EditPurchase";
import { EditpurchaseComponentController } from "./EditPurchase.control";

const EditPurchaseComponent = () => {
  return (
    <>
      <EditpurchaseComponentController>
        <EditPurchase />
      </EditpurchaseComponentController>
    </>
  );
};

export default EditPurchaseComponent;
