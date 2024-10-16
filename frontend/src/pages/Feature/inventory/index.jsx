import React from "react";
// import AddLedgerComponentController from "./addControl";
import { AddInventoryComponentController } from "./inventoryControl";
import Inventory from "./inventory";

const InventoryComponent = () => {
  return (
    <>
      <AddInventoryComponentController>
        <Inventory />
      </AddInventoryComponentController>
    </>
  );
};

export default InventoryComponent;
