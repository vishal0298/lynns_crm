import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import { useSelector } from "react-redux";
import { settingsModules } from "../../../common/allModules";

const SettingSidebar = () => {
  const location = useLocation();
  const path = location?.pathname;
  const { userDetails } = useSelector((state) => state.app);
  const [settingSidebar, setSettingSidebar] = useState([]);
  useEffect(() => {
    if (userDetails?.permissionRes?.modules) {
      const requiredModules = userDetails?.permissionRes?.modules
        .filter(
          (user) =>
            (user.permissions.create ||
              user.permissions.update ||
              user.permissions.delete ||
              user.permissions.view) &&
            user.permissions.view
        )
        .map((user) => user.module);

      
      const settingSidebarNames = requiredModules?.filter((item) =>
        item?.includes("Settings")
      );
      setSettingSidebar(settingSidebarNames);
    } else {
      setSettingSidebar(settingsModules);
    }
  }, []);

  const showHide = (module) => {
    let removed = settingSidebar?.includes(module);
    return !removed;
  };
  return (
    <div className="widget settings-menu mb-0">
      <ul>
        <li className="nav-item">
          <Link
            to="/settings"
            className={path == "/settings" ? "nav-link active" : "nav-link"}
          >
            <FeatherIcon icon="user" className="me-3" />
            <span>Account Settings</span>
          </Link>
        </li>
        <li
          className="nav-item"
          style={{
            display: showHide("companySettings") ? "none" : "block",
          }}
        >
          <Link
            to="/company-settings"
            className={
              path == "/company-settings" ? "nav-link active" : "nav-link"
            }
          >
          
            <FeatherIcon icon="settings" className="me-3" />
            <span>Company Settings</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/password-change"
            className={
              path == "/password-change" ? "nav-link active" : "nav-link"
            }
          >
            <FeatherIcon icon="tool" className="me-3" />
            <span>Change Password</span>
          </Link>
        </li>
        <li
          className="nav-item"
          style={{
            display: showHide("notificationSettings") ? "none" : "block",
          }}
        >
          <Link
            to="/notification-settings"
            className={
              path == "/notification-settings" ? "nav-link active" : "nav-link"
            }
          >
            <FeatherIcon icon="bell" className="me-3" />
            <span>Notifications</span>
          </Link>
        </li>

        <li
          className="nav-item"
          
        >
          <Link
            to="/invoice-templates"
            className={
              path == "/invoice-templates" ? "nav-link active" : "nav-link"
            }
          >
          
            <FeatherIcon icon="layers" className="me-3" />
            <span>Invoice Templates</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/signature-lists"
            className={
              path == "/signature-lists" ? "nav-link active" : "nav-link"
            }
          >
            <FeatherIcon icon="zap" className="me-3" />
            <span>List of Signature</span>
          </Link>
        </li>
        <li
          className="nav-item"
          style={{
            display: showHide("invoiceSettings") ? "none" : "block",
          }}
        >
          <Link
            to="/invoice-settings"
            className={
              path == "/invoice-settings" ? "nav-link active" : "nav-link"
            }
          >
           
            <FeatherIcon icon="file" className="me-3" />
            <span>Invoice Settings</span>
          </Link>
        </li>
        <li className="nav-item  active">
          <Link
            to="/payment-settings"
            className={
              path == "/payment-settings" ? "nav-link active" : "nav-link"
            }
          >
            <FeatherIcon icon="credit-card" className="me-3" />
            <span>Payment Settings</span>
          </Link>
        </li>
        <li
          className="nav-item"
          style={{
            display: showHide("bankSettings") ? "none" : "block",
          }}
        >
          <Link
            to="/bank-account"
            className={path == "/bank-account" ? "nav-link active" : "nav-link"}
          >
           
            <FeatherIcon icon="aperture" className="me-3" />
            <span>Bank Settings</span>
          </Link>
        </li>
        <li
          className="nav-item"
          style={{
            display: showHide("taxSettings") ? "none" : "block",
          }}
        >
          <Link
            to="/tax-rates"
            className={path == "/tax-rates" ? "nav-link active" : "nav-link"}
          >
            <FeatherIcon icon="file-text" className="me-3" />
            <span>Tax Rates</span>
          </Link>
        </li>
        <li
          className="nav-item"
          style={{
            display: showHide("emailSettings") ? "none" : "block",
          }}
        >
          <Link
            to="/email-settings"
            className={
              path == "/email-settings" ? "nav-link active" : "nav-link"
            }
          >
            <FeatherIcon icon="mail" className="me-3" />
            <span>Email Settings</span>
          </Link>
        </li>
        <li
          className="nav-item"
          style={{
            display: showHide("preferenceSettings") ? "none" : "block",
          }}
        >
          <Link
            to="/preferences"
            className={path == "/preferences" ? "nav-link active" : "nav-link"}
          >
           
            <FeatherIcon icon="settings" className="me-3" />
            <span>Preference Settings</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default SettingSidebar;
