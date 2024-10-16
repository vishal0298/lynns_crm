import React, { useState, Suspense } from "react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Outlet, useLocation } from "react-router-dom";
const Header = React.lazy(() => import("./layouts/Header"));
const Sidebar = React.lazy(() => import("./layouts/Sidebar"));

export default function RootComponent() {
  const [menu, setMenu] = useState(false);
  const toggleMobileMenu = () => {
    setMenu(!menu);
  };

  const location = useLocation();
  const url = location?.pathname;

  let urlCondition =
    url === "/online-payment" ||
    url === "/signature-preview-invoice" ||
    url === "/add-signature-preview-invoice" ||
    url === "/add-purchase-signature-preview" ||
    url === "/edit-purchase-signature-preview" ||
    url === "/edit-signature-preview-invoice" ||
    url.includes("/print-download-invoice/") ||
    url === "/mail-pay-invoice";
  return (
    <>
      <PayPalScriptProvider
        options={{
          clientId:
            "Ab61i1QGjcF5mz_Gjqcl4SvXvlIjbrjXk6oiwoA7CM3nGaAEER9Mu8Ig79vb3d5Ce8-0usWlO6TUkTR7",
        }}
      >
        <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
          <Suspense fallback={<div>Loading...</div>}>
            {!urlCondition && <Sidebar />}
            {!urlCondition && <Header onMenuClick={() => toggleMobileMenu()} />}
            <Outlet />
          </Suspense>
        </div>
      </PayPalScriptProvider>
    </>
  );
}
