import React from "react";
import Listinvoice from "./Listinvoice";
import { ListinvoiceComponentController } from "./Listinvoice.control";
//import { Route } from "react-router-dom";

const ListinvoiceComponent = () => {
  return (
    <>
      <ListinvoiceComponentController>
        <Listinvoice />
      </ListinvoiceComponentController>
    </>
  );
};

export default ListinvoiceComponent;
