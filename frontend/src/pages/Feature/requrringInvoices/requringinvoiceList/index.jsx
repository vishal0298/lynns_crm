import React from "react";
import Listrqinvoice from "./Listrqinvoice";
import { ListrqinvoiceComponentController } from "./Listrqinvoice.control";

const ListrqinvoiceComponent = () => {
  return (
    <>
      <ListrqinvoiceComponentController>
        <Listrqinvoice />
      </ListrqinvoiceComponentController>
    </>
  );
};

export default ListrqinvoiceComponent;
