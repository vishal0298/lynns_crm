import React from "react";
import { ListCategoryController } from "./listCategory.control";
import ListCategory from "./listCategory";

const ListCategories = () => {
  return (
    <>
      <ListCategoryController>
        <ListCategory />
      </ListCategoryController>
    </>
  );
};

export default ListCategories;
