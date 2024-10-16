/* eslint-disable react/prop-types */
import React, { createContext, useContext, useEffect, useState } from "react";
import { ApiServiceContext } from "../../../../core/API/api-service";
import { viewVendor} from "../../../../core/core-index";
import { useParams } from "react-router-dom";

const EditvendorContext = createContext({});

const ViewvendorComponentController = (props) => {
  const { getData } = useContext(ApiServiceContext);
  const [vendorDetails, setVendorDetails] = useState([]);
  const [radio1, setRadio1] = useState(false);
  const [radio2, setRadio2] = useState(false);

  let { id } = useParams();

  const getVendorDetails = async () => {
    const url = `${viewVendor}/${id}`;
    const response = await getData(url);
    if (response?.data) {
      setVendorDetails(response?.data);
    }
  };

  useEffect(() => { getVendorDetails(); }, []);

  return (
    <EditvendorContext.Provider
      value={{
        vendorDetails,
        radio2,
        radio1,
        setRadio2,
        setRadio1,
      }}
    >
      {props.children}
    </EditvendorContext.Provider>
  );
};

export { EditvendorContext, ViewvendorComponentController };
