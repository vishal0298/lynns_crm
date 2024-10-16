/* eslint-disable react/prop-types */
import React, { createContext, useContext, useState } from "react";
import { ApiServiceContext } from "../../../../core/API/api-service";

const InvoiceTemplateContext = createContext({});

const InvoiceTemplateComponentController = (props) => {
  const { putData, getData } = useContext(ApiServiceContext);
  const [menu, setMenu] = useState(false);

  return (
    <InvoiceTemplateContext.Provider value={{}}>
      {props.children}
    </InvoiceTemplateContext.Provider>
  );
};

export { InvoiceTemplateContext, InvoiceTemplateComponentController };
