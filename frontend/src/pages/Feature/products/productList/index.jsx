import React from "react";
import Listproduct from "./Listproduct";
import { ListproductComponentController } from "./Listproduct.control";

const ListproductComponent = () => {
  return (
    <>
      <ListproductComponentController>
        <Listproduct />
      </ListproductComponentController>
    </>
  );
};

export default ListproductComponent;
