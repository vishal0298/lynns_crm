import React from "react";
import { EditUserComponentController } from "./EditUser.control";
import EditUser from "./EditUser";

const EditUserComponent = () => {
  return (
    <>
      <EditUserComponentController>
        <EditUser />
      </EditUserComponentController>
    </>
  );
};

export default EditUserComponent;
