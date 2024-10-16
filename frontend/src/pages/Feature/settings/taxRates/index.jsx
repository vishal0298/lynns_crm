import React from "react";
import TaxRateComponent from "./TaxRates";
import { TaxRatesComponentController } from "./TaxRates.control";

const TaxRatesComponent = () => {
  return (
    <>
      <TaxRatesComponentController>
        <TaxRateComponent />
      </TaxRatesComponentController>
    </>
  );
};

export default TaxRatesComponent;
