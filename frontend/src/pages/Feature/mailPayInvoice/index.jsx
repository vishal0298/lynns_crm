import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../../../common/imagepath";

const MailPayInvoice = () => {
  useEffect(() => {
    document.body.classList.add("invoice-center-pay");

    return () => document.body.classList.remove("invoice-center-pay");
  }, []);

  return (
    <div className="receipt-pay-mail">
      <div className="company-logo">
        <img src={Logo} alt="Logo" />
      </div>
      <ul>
        <li>
          <span>Hi Company Name,</span>
        </li>
        <li>I’m just getting in touch to follow up on our invoice.</li>
        <li>The invoice is scheduled to be paid on or before (15 Aug 2023).</li>
        <li>
          I look forward to hearing from you and receiving payment shortly. This
          will ensure we can continue to work together.
        </li>
      </ul>
      <div className="click-invoice-btn">
        <Link to="/online-payment" className="btn btn-primary">
          Click Here to pay Invoice
        </Link>
      </div>
      <p>Many thanks,</p>
      <p>Finance team</p>
    </div>
  );
};

export default MailPayInvoice;
