import React from "react";
import { AddUserComponentController } from "./AddUser.control";
import AddUser from "./AddUser";

const AddUserComponent = () => {
  return (
    <>
      <AddUserComponentController>
        <AddUser />
      </AddUserComponentController>
    </>
  );
};

export default AddUserComponent;
