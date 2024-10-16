import React from "react";
import { AddStaffComponentController } from "./addStaff.control";
import AddStaff from "./addStaff";

const AddStaffComponent = () => {
  return (
    <>
      <AddStaffComponentController>
        <AddStaff />
      </AddStaffComponentController>
    </>
  );
};

export default AddStaffComponent;
