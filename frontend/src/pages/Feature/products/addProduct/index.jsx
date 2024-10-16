import React from "react";
import Addproduct from "./Addproduct";
import { AddproductComponentController } from "./Addproduct.control";

const AddproductComponent = () => {
  return (
    <>
      <AddproductComponentController>
        <Addproduct />
      </AddproductComponentController>
    </>
  );
};

export default AddproductComponent;
