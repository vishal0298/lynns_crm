import React from "react";
import { ListStaffController } from "./listStaff.control";
import Staff from "./listStaff";

const ListUnit = () => {
  return (
    <>
      <ListStaffController>
        <Staff />
      </ListStaffController>
    </>
  );
};

export default ListUnit;
