import React from "react";
import { ListUserController } from "./listUser.control";
import ListUsers from "./listUser";

const ListUserComponent = () => {
  return (
    <>
      <ListUserController>
        <ListUsers />
      </ListUserController>
    </>
  );
};

export default ListUserComponent;
