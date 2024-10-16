import React from "react";
import Editproduct from "./Editproduct";
import { EditproductComponentController } from "./Editproduct.control";

const EditproductComponent = () => {
  return (
    <>
      <EditproductComponentController>
        <Editproduct />
      </EditproductComponentController>
    </>
  );
};

export default EditproductComponent;
