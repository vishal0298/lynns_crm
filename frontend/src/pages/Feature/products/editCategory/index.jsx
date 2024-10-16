import React from "react";
import { EditCategoryComponentController } from "./editCategory.control";
import EditCategory from "./editCategory";

const AddcategoryComponent = () => {
  return (
    <>
      <EditCategoryComponentController>
        <EditCategory />
      </EditCategoryComponentController>
    </>
  );
};

export default AddcategoryComponent;
