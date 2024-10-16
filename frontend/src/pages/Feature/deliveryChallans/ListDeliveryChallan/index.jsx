import React from "react";
import { ListChallanComponentController } from "./listChallan.control";
import ListChallans from "./listChallan";

const ListChallanComponent = () => {
  return (
    <>
      <ListChallanComponentController>
        <ListChallans />
      </ListChallanComponentController>
    </>
  );
};

export default ListChallanComponent;
