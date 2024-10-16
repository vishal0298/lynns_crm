import React from "react";
import { AddcategoryComponentController } from "./AddCategory.control";
// import AddCategory from "./AddCategory";
import Addcategory from "./AddCategory";

const AddcategoryComponent = () => {
  return (
    <>
      <AddcategoryComponentController>
        <Addcategory />
      </AddcategoryComponentController>
    </>
  );
};

export default AddcategoryComponent;
