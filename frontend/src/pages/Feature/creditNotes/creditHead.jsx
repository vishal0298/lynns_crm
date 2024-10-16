/* eslint-disable react/prop-types */
import React from "react";
import { Link } from "react-router-dom";
import { FilterIcon } from "../../../common/imagepath";

const CreditHead = ({ show, setShow, create, admin }) => {
  return (
    <>
      <div className="page-header">
        <div className="content-page-header">
          <h5>Sales Return</h5>
          <div className="list-btn">
            <ul className="filter-list">
              <li>
                <Link
                  className="btn btn-filters w-auto popup-toggle"
                  onClick={() => setShow(!show)}
                >
                  <span className="me-2">
                    <img src={FilterIcon} alt="" />
                  </span>
                  Filter
                </Link>
              </li>
              {(create || admin) && (
                <li>
                  <Link className="btn btn-primary" to="/add-sales-return">
                    <i className="fa fa-plus-circle me-2" aria-hidden="true" />
                    Add Sales Return
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
      <div id="filter_inputs" className="card filter-card">
        <div className="card-body pb-0">
          <div className="row">
            <div className="col-sm-6 col-md-3">
              <div className="form-group">
                <label>Name</label>
                <input type="text" className="form-control" />
              </div>
            </div>
            <div className="col-sm-6 col-md-3">
              <div className="form-group">
                <label>Email</label>
                <input type="text" className="form-control" />
              </div>
            </div>
            <div className="col-sm-6 col-md-3">
              <div className="form-group">
                <label>Phone</label>
                <input type="text" className="form-control" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreditHead;
