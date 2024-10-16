import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import { AuthContext } from "../../../approuter";
import { commonDatacontext } from "../../../core/commonData";
import { Scrollbars } from "react-custom-scrollbars-2";
import { Logo, LogoImg, LogoSmallImg } from "../../../common/imagepath";
import { useSelector } from "react-redux";
import { setCurrentLoginUser, setcommonData } from "../../../constans/globals";

const Sidebar = () => {
  const { setloggedin } = useContext(AuthContext);
  const { companyData } = useContext(commonDatacontext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isSideMenu, setSideMenu] = useState("");
  const [curdropdown, setcurdropdown] = useState("");
  const [sidebar, setSidebar] = useState([]);
  const { userDetails } = useSelector((state) => state.app);

  const toggleSidebar = (value) => {
    setSideMenu(value);
    if (value != "") {
      setcurdropdown(value);
    }
  };

  useEffect(()=>{
    if("/manage-user" === pathName ||
    "/add-user" === pathName 
    ||
    "/users" === pathName){
      setSideMenu('manage-user');
    }
    if(
    "/product-list" === pathName ||
    "/add-product" === pathName ||
    pathName.includes("/edit-product") ||
    "/category" === pathName ||
    "/add-category" === pathName ||
    pathName.includes("/edit-categories") ||
    pathName.includes("/edit-units") ||
    "/add-units" === pathName ||
    "/units" === pathName
     ){
      setSideMenu("product-service")
     }
  },[])
  
  let pathName = location.pathname;

  useEffect(() => {
    function handleMouseOver(e) {
      e.stopPropagation();
      if (
        document.body.classList.contains("mini-sidebar") &&
        document.querySelector("#toggle_btn").offsetParent !== null
      ) {
        var targ = e.target.closest(".sidebar");
        if (targ) {
          setSideMenu(curdropdown);
          document.body.classList.add("expand-menu");
          document
            .querySelectorAll(".subdrop + ul")
            .forEach((ul) => (ul.style.display = "block"));
        } else {
          setSideMenu("");
          document.body.classList.remove("expand-menu");
          document
            .querySelectorAll(".subdrop + ul")
            .forEach((ul) => (ul.style.display = "none"));
        }
        return false;
      }
    }
    document.addEventListener("mouseover", handleMouseOver);
    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  const logoutPage = () => {
    let rebembermedata = localStorage.getItem("rebemberme");
    localStorage.clear();
    if (rebembermedata != "undefined" && rebembermedata != null) {
      setCurrentLoginUser(rebembermedata);
    }
    setcommonData("logout");
    setloggedin(false);
    navigate("/login");
  };

  const handleImageError = (event) => {
    event.target.src = LogoImg;
  };
  const handleImageErrorss = (event) => {
    event.target.src = LogoSmallImg;
  };

  //;

  // For Hiding Sidebar

  useEffect(() => {
    if (userDetails?.permissionRes?.modules?.length > 0) {
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

      setSidebar(requiredModules);
    }
  }, []);

  const showHide = (module) => {
    if (sidebar?.length > 0) {
      let removed = sidebar?.includes(module);
      return !removed;
    }
  };

  return (
    <>
      <div className="sidebar" id="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Link to="/index">
              <img
                src={companyData?.siteLogo ? companyData?.siteLogo : Logo}
                onError={handleImageError}
                className="img-fluid logo"
                alt=""
              />
            </Link>
            <Link to="/index">
              <img
                src={
                  companyData?.companyLogo
                    ? companyData?.companyLogo
                    : LogoSmallImg
                }
                onError={handleImageErrorss}
                className="img-fluid logo-small"
                alt=""
              />
            </Link>
          </div>
        </div>
        <Scrollbars
          autoHide
          autoHideTimeout={1000}
          autoHideDuration={200}
          autoHeight
          autoHeightMin={0}
          autoHeightMax="95vh"
          thumbMinSize={30}
          universal={false}
          hideTracksWhenNotNeeded={true}
        >
          <div className="sidebar-inner slimscroll">
            <div id="sidebar-menu" className="sidebar-menu">
              {/* Main */}
              <ul>
                <li className="menu-title">
                  <span>Main</span>
                </li>
                <li
                  className={`${
                    "/index" === pathName || "/" === pathName ? "active" : ""
                  }`}
                >
                  <Link to="/index" onClick={() => toggleSidebar("")}>
                    <FeatherIcon icon="home" />
                    <span>Dashboard</span>
                  </Link>
                </li>
              </ul>
              {/* /Main */}

              {/* Customers */}
              <ul
                style={{
                  display:
                    showHide("customer") 
                    // && showHide("vendor")
                      ? "none"
                      : "block",
                }}
              >
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
                  style={{ display: showHide("customer") ? "none" : "block" }}
                >
                  <Link to="/customers">
                    <FeatherIcon icon="users" />
                    <span>Customers</span>
                  </Link>
                </li>
                {/* <li
                  className={`${
                    "/vendors" === pathName ||
                    "/add-vendors" === pathName ||
                    "/add-ledger" === pathName ||
                    pathName.includes("/edit-vendors/")
                      ? "active"
                      : ""
                  }`}
                  style={{ display: showHide("vendor") ? "none" : "block" }}
                >
                  <Link to="/vendors">
                    <FeatherIcon icon="user" /> <span>Vendors</span>
                  </Link>
                </li> */}
              </ul>
              {/* /Customers */}

              {/* Inventory */}
              <ul
                style={{
                  display:
                    showHide("productsOrServices") &&
                    showHide("category") &&
                    showHide("unit") &&
                    showHide("staff") &&
                    showHide("inventory")
                      ? "none"
                      : "block",
                }}
              >
                <li className="menu-title">
                  <span>Inventory</span>
                </li>
                <li
                  className={`${
                    "/product-list" === pathName ||
                    "/add-product" === pathName ||
                    pathName.includes("/edit-product") ||
                    "/category" === pathName ||
                    "/add-category" === pathName ||
                    pathName.includes("/edit-categories") ||
                    pathName.includes("/edit-units") ||
                    "/add-units" === pathName ||
                    "/units" === pathName
                      ? "active submenu"
                      : "submenu"
                  }`}
                >
                  <Link
                    to="#"
                    // className={isSideMenu == "product-service" ? "subdrop" : ""}
                    className={
                      isSideMenu == "product-service" ||
                      "/product-list" === pathName ||
                      "/add-product" === pathName ||
                      pathName.includes("/edit-product") ||
                      "/category" === pathName ||
                      "/add-category" === pathName ||
                      pathName.includes("/edit-categories") ||
                      pathName.includes("/edit-units") ||
                      "/add-units" === pathName ||
                      "/units" === pathName
                        ? "subdrop"
                        : ""
                    }
                    onClick={() =>
                     {
                      toggleSidebar(
                        isSideMenu == "product-service" ? "" : "product-service"
                      )
                     }
                    }
                    style={{
                      display:
                        showHide("productsOrServices") &&
                        showHide("category") &&
                        showHide("unit") &&
                        showHide("staff")
                          ? "none"
                          : "block",
                    }}
                  >
                    <FeatherIcon icon="package" />{" "}
                    <span> Product / Services</span>{" "}
                    <span className="menu-arrow"></span>
                  </Link>

                  <ul
                    className={
                      isSideMenu == "product-service" 
                        ? "d-block"
                        : "d-none"
                    }
                  >
                    <li
                      style={{
                        display: showHide("productsOrServices")
                          ? "none"
                          : "block",
                      }}
                    >
                      <Link
                        to="/product-list"
                        className={`${
                          "/product-list" === pathName ? "active" : ""
                        }`}
                      >
                        Product List
                      </Link>
                    </li>
                    <li
                      style={{
                        display: showHide("category") ? "none" : "block",
                      }}
                    >
                      <Link
                        to="/category"
                        className={`${
                          "/category" === pathName ? "active" : ""
                        }`}
                      >
                        Category
                      </Link>
                    </li>
                    <li
                      style={{
                        display: showHide("unit") ? "none" : "block",
                      }}
                    >
                      <Link
                        to="/units"
                        className={`${"/units" === pathName ? "active" : ""}`}
                      >
                        Units
                      </Link>
                      <Link
                        to="/staff"
                        className={`${"/units" === pathName ? "active" : ""}`}
                      >
                        Staff
                      </Link>
                    </li>
                  </ul>
                </li>
                <li
                  className={`${
                    "/inventory" === pathName
                      ? "active"
                      : ""
                  }`}
                  style={{
                    display: showHide("inventory") ? "none" : "block",
                  }}
                >
                  <Link to="/inventory" onClick={() => toggleSidebar("")}>
                    <FeatherIcon icon="user" /> <span>Inventory</span>
                  </Link>
                </li>
              </ul>
              {/* /Inventory */}

              {/* Sales */}
              <ul
              // style={{
              //   display:
              //     showHide("invoice") && showHide("creditNote")
              //       ? "none"
              //       : "block",
              // }}
              // style={{
              //   display:
              //     showHide("invoice") || showHide("creditNote")
              //       ? "none"
              //       : "block",
              // }}
              >
                <li className="menu-title">
                  <span>Sales</span>
                </li>
                <li
                  className={`${
                    "/invoice-list" === pathName ||
                    "/add-invoice" === pathName ||
                    pathName.includes("/edit-invoice") ||
                    pathName.includes("/view-invoice")
                      ? "active"
                      : ""
                  }`}
                  style={{
                    display: showHide("invoice") ? "none" : "block",
                  }}
                >
                  <Link to="/invoice-list" onClick={() => toggleSidebar("")}>
                    <FeatherIcon icon="file" /> <span>Invoice</span>
                  </Link>
                </li>

                {/* <li
                  className={`${
                    "/sales-return" === pathName ||
                    "/add-sales-return" === pathName ||
                    "/credit-notes-pending" === pathName ||
                    "/credit-notes-overdue" === pathName ||
                    "/credit-notes-draft" === pathName ||
                    "/credit-notes-recurring" === pathName ||
                    pathName.includes("/edit-sales-return") ||
                    pathName.includes("/view-sales-return") ||
                    "/credit-notes-cancelled" === pathName
                      ? "active"
                      : ""
                  }`}
                  style={{
                    display: showHide("salesreturn") ? "none" : "block",
                  }}
                >
                  <Link to="/sales-return" onClick={() => toggleSidebar("")}>
                    <FeatherIcon icon="edit" /> <span>Sales Return</span>
                  </Link>
                </li> */}
              </ul>
              {/* /Sales */}

              {/* Purchases */}
              {/* <ul
                style={{
                  display:
                    showHide("purchase") &&
                    showHide("purchaseOrder") &&
                    showHide("purchasereturn")
                      ? "none"
                      : "block",
                }}
              >
                <li className="menu-title">
                  <span>Purchases</span>
                </li>
                <li
                  className={`${
                    "/purchase-orders" === pathName ||
                    pathName.includes("/edit-purchases-order") ||
                    pathName.includes("/view-purchases-order")
                      ? "active"
                      : ""
                  }`}
                  style={{
                    display: showHide("purchaseOrder") ? "none" : "block",
                  }}
                >
                  <Link to="/purchase-orders" onClick={() => toggleSidebar("")}>
                    <FeatherIcon icon="shopping-cart" />{" "}
                    <span>Purchase Orders</span>
                  </Link>
                </li>
                <li
                  className={`${
                    "/purchases" === pathName ||
                    "/add-purchases" === pathName ||
                    "/add-purchase-return" === pathName ||
                    pathName.includes("/purchase-edit") ||
                    pathName.includes("/view-purchase") ||
                    "/purchases-details" === pathName
                      ? "active"
                      : ""
                  }`}
                  style={{
                    display: showHide("purchase") ? "none" : "block",
                  }}
                >
                  <Link to="/purchases" onClick={() => toggleSidebar("")}>
                    <FeatherIcon icon="shopping-bag" /> <span>Purchases</span>
                  </Link>
                </li>
                <li
                  className={`${
                    "/debit-notes" === pathName ||
                    "/add-debit-notes" === pathName ||
                    pathName.includes("/edit-debit-notes/") ||
                    pathName.includes("/edit-purchases-return") ||
                    pathName.includes("/view-debitnotes")
                      ? "active"
                      : ""
                  }`}
                  style={{
                    display: showHide("purchasereturn") ? "none" : "block",
                  }}
                >
                  <Link to="/debit-notes" onClick={() => toggleSidebar("")}>
                    <FeatherIcon icon="file-text" />{" "}
                    <span>Purchase Return</span>
                  </Link>
                </li>
              </ul> */}
              {/* /Purchases */}

              {/* Finance & Accounts */}
              <ul
                style={{
                  display:
                    showHide("expense") && showHide("payment")
                      ? "none"
                      : "block",
                }}
              >
                <li className="menu-title">
                  <span>Finance &amp; Accounts</span>
                </li>
                <li
                  className={`${
                    "/expenses" === pathName ||
                    "/add-expenses" === pathName ||
                    pathName.includes("/edit-expenses/")
                      ? "active"
                      : ""
                  }`}
                  style={{
                    display: showHide("expense") ? "none" : "block",
                  }}
                >
                  <Link to="/expenses" onClick={() => toggleSidebar("")}>
                    <FeatherIcon icon="file-plus" /> <span>Expenses</span>
                  </Link>
                </li>
                <li
                  className={`${"/payments" === pathName ? "active" : ""}`}
                  style={{
                    display: showHide("payment") ? "none" : "block",
                  }}
                >
                  <Link to="/payments" onClick={() => toggleSidebar("")}>
                    <FeatherIcon icon="credit-card" /> <span>Payments</span>
                  </Link>
                </li>
              </ul>
              {/* /Finance & Accounts */}

              {/* Quotations */}
              {/* <ul
                style={{
                  display:
                    showHide("quotation") && showHide("deliveryChallan")
                      ? "none"
                      : "block",
                }}
              >
                <li className="menu-title">
                  <span>Quotations</span>
                </li>
                <li
                  className={`${
                    "/quotations" === pathName ||
                    "/add-quotations" === pathName ||
                    pathName.includes("/edit-quotations/")
                      ? "active"
                      : ""
                  }`}
                  style={{
                    display: showHide("quotation") ? "none" : "block",
                  }}
                >
                  <Link to="/quotations" onClick={() => toggleSidebar("")}>
                    <FeatherIcon icon="clipboard" /> <span>Quotations</span>
                  </Link>
                </li>
                <li
                  className={`${
                    "/delivery-challans" === pathName ||
                    "/add-delivery-challans" === pathName ||
                    pathName.includes("/edit-delivery-challan/")
                      ? "active"
                      : ""
                  }`}
                  style={{
                    display: showHide("deliveryChallan") ? "none" : "block",
                  }}
                >
                  <Link
                    to="/delivery-challans"
                    onClick={() => toggleSidebar("")}
                  >
                    <FeatherIcon icon="book-open" />{" "}
                    <span>Delivery Challans</span>
                  </Link>
                </li>
              </ul> */}
              {/* /Quotations */}

              {/* Reports */}
              <ul
                style={{
                  display: showHide("paymentSummaryReport") ? "none" : "block",
                }}
              >
                <li className="menu-title">
                  <span>Reports</span>
                </li>
                <li
                  className={`${
                    "/payment-summary" === pathName ? "active" : ""
                  }`}
                  style={{
                    display: showHide("paymentSummaryReport")
                      ? "none"
                      : "block",
                  }}
                >
                  <Link to="/payment-summary" onClick={() => toggleSidebar("")}>
                    <FeatherIcon icon="credit-card" />{" "}
                    <span>Payment Summary</span>
                  </Link>
                </li>
              </ul>
              {/* /Reports */}

              <ul
                className="settings"
                style={{
                  display:
                    showHide("accountSettings") &&
                    showHide("companySettings") &&
                    showHide("invoiceSettings") &&
                    showHide("bankSettings") &&
                    showHide("taxSettings") &&
                    showHide("emailSettings") &&
                    showHide("preferenceSettings")
                      ? "none"
                      : "block",
                }}
              >
                <li className="menu-title">
                  <span>Settings</span>
                </li>
                <li
                  className={`${
                    "/settings" === pathName ||
                    "/company-settings" === pathName ||
                    "/payment-settings" === pathName ||
                    "/bank-account" === pathName ||
                    "/tax-rates" === pathName ||
                    "/email-settings" === pathName ||
                    "/preferences" === pathName ||
                    "/password-change" === pathName ||
                    "/notification-settings" === pathName ||
                    "/signature-lists" === pathName ||
                    "/invoice-settings" === pathName
                      ? "active"
                      : ""
                  }`}
                >
                  <Link to="/settings" onClick={() => toggleSidebar("")}>
                    <FeatherIcon icon="settings" /> <span>Settings</span>
                  </Link>
                </li>
              </ul>
              {/* User Management */}
              <ul
                className="user-management"
                style={{
                  display: showHide("user") ? "none" : "block",
                }}
              >
                <li className="menu-title">
                  <span>User Management</span>
                </li>
                <li
                  className={`${
                    "/manage-user" === pathName ||
                    "/add-user" === pathName ||
                    "/users" === pathName
                      ? "active submenu"
                      : "submenu"
                  }`}
                  style={{
                    display: showHide("user") ? "none" : "block",
                  }}
                >
                  <Link
                    to="#"
                    // className={isSideMenu == "manage-user" ? "subdrop" : ""}
                    className={
                      isSideMenu == "manage-user" ||
                      "/manage-user" === pathName ||
                      "/add-user" === pathName ||
                      "/users" === pathName
                        ? "subdrop"
                        : ""
                    }
                    onClick={() =>
                      toggleSidebar(
                        isSideMenu == "manage-user" ? "" : "manage-user"
                      )
                    }
                  >
                    <FeatherIcon icon="user" /> <span>Manage Users </span>
                    <span className="menu-arrow"></span>
                  </Link>

                  <ul
                    className={
                      isSideMenu == "manage-user" ? "d-block"
                        : "d-none"
                    }
                    style={{
                      display: showHide("user") ? "none" : "block",
                    }}
                  >
                    <li
                      style={{
                        display: showHide("user") ? "none" : "block",
                      }}
                    >
                      <Link
                        to="/users"
                        className={`${"/users" === pathName ? "active" : ""}`}
                      >
                        Users
                      </Link>
                    </li>
                  </ul>
                </li>
                <li
                  className={`${
                    "/roles-permission" === pathName ||
                    pathName.includes("/permission/")
                      ? "active"
                      : ""
                  }`}
                  style={{
                    display: showHide("role") ? "none" : "block",
                  }}
                >
                  <Link
                    to="/roles-permission"
                    onClick={() => toggleSidebar("")}
                  >
                    <FeatherIcon icon="clipboard" />{" "}
                    <span>Roles &amp; Permission</span>
                  </Link>
                </li>

                <li
                  style={{ cursor: "pointer", alignItems: "center" }}
                  onClick={() => logoutPage()}
                >
                  <Link to="/login" onClick={() => toggleSidebar("")}>
                    <FeatherIcon icon="lock" />
                    {"  "}
                    <span> Logout</span>
                  </Link>
                </li>
              </ul>
              {/* /User Management */}
            </div>
          </div>
        </Scrollbars>
      </div>
    </>
  );
};
export default Sidebar;
