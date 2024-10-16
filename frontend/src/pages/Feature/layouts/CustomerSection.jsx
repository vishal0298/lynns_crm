/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import { useSelector } from "react-redux";

const CustomerSection = ({ pathName }) => {
  // From Redux
  const { userDetails } = useSelector((state) => state.app);
  // From Redux
  const [modules, setModules] = useState({});

  useEffect(() => {
    setModules(userDetails?.permissionRes?.modules?.[1]?.permissions);
  }, [userDetails]);

  return (
    <ul>
      <li className="menu-title">
        <span>Customers</span>
      </li>
      <li
        className={`${
          "/customers" === pathName ||
          "/active-customers" === pathName ||
          "/deactive-customers" === pathName ||
          pathName.includes("/edit-customer/") ||
          pathName.includes("/view-customer/") ||
          "/add-customer" === pathName
            ? "active"
            : ""
        }`}
      >
        <Link to="/customers">
          <FeatherIcon icon="users" />
          <span>Customers</span>
        </Link>
      </li>
      <li
        className={`${
          "/vendors" === pathName ||
          "/add-ledger" === pathName ||
          pathName.includes("/edit-vendors/")
            ? "active"
            : ""
        }`}
      >
        <Link to="/vendors">
          <FeatherIcon icon="user" /> <span>Vendors</span>
        </Link>
      </li>
    </ul>
  );
};

export default CustomerSection;
