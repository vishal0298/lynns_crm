import React from "react";
import { Link } from "react-router-dom";

const Unauthorised = () => {
  return (
    <div className="main-wrapper">
      <div className="error-box">
        <h1>404</h1>
        <h3 className="h2 mb-3">
          <i className="fas fa-exclamation-circle" /> Oops! Page not found!
        </h3>
        <p className="h4 font-weight-normal">
          You are unauthorized to view these contents.
        </p>
        <Link to="/index" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Unauthorised;
