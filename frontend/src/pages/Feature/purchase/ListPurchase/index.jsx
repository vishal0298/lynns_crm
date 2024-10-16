import React from "react";
import { ListPurchaseComponentController } from "./listPurchase.control";
import ListPurchase from "./listPurchase";

const ListPurchaseComponent = () => {
  return (
    <>
      <ListPurchaseComponentController>
        <ListPurchase />
      </ListPurchaseComponentController>
    </>
  );
};

export default ListPurchaseComponent;
