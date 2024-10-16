import React from "react";
import { UserComponentController } from "./user.control";
import UserLogin from "../login/UserLogin";

const UserComponent = () => {
  return (
    <>
      <UserComponentController>
        <UserLogin />
      </UserComponentController>
    </>
  );
};

export default UserComponent;
