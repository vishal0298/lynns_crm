import React from "react";
import SignatureComponent from "./SignatureList";
import { SignatureComponentController } from "./SignatureList.control";

const SignatureListsComponent = () => {
  return (
    <>
      <SignatureComponentController>
        <SignatureComponent />
      </SignatureComponentController>
    </>
  );
};

export default SignatureListsComponent;
