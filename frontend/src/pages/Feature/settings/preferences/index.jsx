import React from "react";
import Preferences from "./Preferences";
import { PreferencesComponentController } from "./Preferences.control";

const PreferencesComponent = () => {
  return (
    <>
      <PreferencesComponentController>
        <Preferences />
      </PreferencesComponentController>
    </>
  );
};

export default PreferencesComponent;
