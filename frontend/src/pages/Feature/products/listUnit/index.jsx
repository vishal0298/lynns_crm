import React from "react";
import { ListUnitController } from "./listUnit.control";
import Units from "./listUnit";

const ListUnit = () => {
  return (
    <>
      <ListUnitController>
        <Units />
      </ListUnitController>
    </>
  );
};

export default ListUnit;
