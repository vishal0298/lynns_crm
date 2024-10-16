/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  expenses as expenses_api,
  ApiServiceContext,
} from "../../../core/core-index";

const ExpenseFilter = ({
  show,
  setShow,
  setExpense,
  page,
  pagesize,
  setTotalCount,
  setPage,
  handlePagination,
}) => {
  const [key, setKey] = useState([]);
  const [first, setfirst] = useState(true);
  const [noData, setNoData] = useState(false);
  const [searchText, setSearchText] = useState([
    "Paid",
    "Pending",
    "Cancelled",
  ]);
  const [checkedStatus, setCheckedStatus] = useState({});
  const { getData } = useContext(ApiServiceContext);
  const { register } = useForm({});
  // eslint-disable-next-line no-unused-vars
  const [noDataText, setnoDataText] = useState("");

  const resetList = async () => {
    let searchUrl = expenses_api.List;
    const response = await getData(searchUrl);
    if (response.code == 200) {
      setExpense(response?.data);
      setTotalCount(response?.totalRecords);
    }
  };

  const handleCheckboxChange = (event, name) => {
    const { value, checked } = event.target;
    if (checked) {
      setKey((prev) => [...prev, name]);
    } else {
      setKey((prev) => prev.filter((item) => item !== name));
    }
    setCheckedStatus((prev) => ({ ...prev, [name]: checked }));
  };
  const uncheckAllCheckboxes = () => {
    setCheckedStatus({});
  };
  const handleApplyFilter = async (e) => {
    e.preventDefault();
    try {
      let searchUrl = expenses_api.List;
      const queryParams = [];
      let skipSize;
      if (page > 1) {
        setPage(1);
        skipSize = 0;
      }
      else {
        skipSize = (page - 1) * pagesize;
      }
      queryParams.push(`limit=${pagesize}`);
      queryParams.push(`skip=${skipSize}`);
      if (key.length > 0) queryParams.push(`status=${key.join(",")}`);
      if (queryParams.length > 0)
        searchUrl = `${searchUrl}?${queryParams.join("&")}`;

      const response = await getData(searchUrl);
      if (response.code == 200) {
        if (page > 1) {
          setPage(1);
        }
        setExpense(response?.data);
        setTotalCount(response?.totalRecords);
        setShow(false);
      }
    } catch {
      return false;
    }
  };

  const handleFilterclear = async () => {
 
        setKey([]);
    setNoData(false);
    setSearchText(["Paid", "Pending", "Cancelled"]);
    setNoData(false);
    uncheckAllCheckboxes();
    setShow(false);
    handlePagination(1, 10);
    
  };

  return (
    <div className={`toggle-sidebar ${show ? "open-filter" : ""}`}>
      <div className="sidebar-layout-filter">
        <div className="sidebar-header">
          <h5>Filter</h5>
          <Link
            to="#"
            className="sidebar-closes"
            onClick={() => {
              setShow(!show);
            }}
          >
            <i className="fa-regular fa-circle-xmark" />
          </Link>
        </div>
        <div className="sidebar-body">
          <form id="vendorFilterform" autoComplete="off">
            {/* Customer */}
            <div className="accordion accordion-last" id="accordionMain1">
              <div className="card-header-new" id="headingOne">
                <h6 className="filter-title">
                  <Link
                    to="#"
                    onClick={() => setfirst(!first)}
                    className={first ? "w-100" : "w-100 collapsed"}
                    aria-expanded={first}
                  >
                    By Status
                    <span className="float-end">
                      <i className="fa-solid fa-chevron-down" />
                    </span>
                  </Link>
                </h6>
              </div>
              <div
                id="collapseOne"
                className={first ? "collapse show" : "collapse"}
              >
                <div className="card-body-chat">
                  <div className="row">
                    <div className="col-md-12">
                      <div id="checkBoxes1">
                        {searchText.length > 0 &&
                          searchText.map((item, index) => {
                            return (
                              <label className="custom_check w-100" key={index}>
                                <input
                                  type="checkbox"
                                  {...register(`status${index}`)}
                                  onChange={(e) =>
                                    handleCheckboxChange(e, item)
                                  }
                                  checked={checkedStatus[item]}
                                />
                                <span className="checkmark" />
                                {item}
                              </label>
                            );
                          })}
                        {noData && <span>{noDataText}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Customer */}
            <div className="filter-buttons">
              <button
                onClick={handleApplyFilter}
                disabled={key.length > 0 ? false : true}
                className="d-inline-flex align-items-center justify-content-center btn w-100 btn-primary"
              >
                {key.length > 0 ? "Apply" : "Select Status"}
              </button>
              <button
                type="button"
                onClick={handleFilterclear}
               
                className="d-inline-flex align-items-center justify-content-center btn w-100 btn-secondary"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExpenseFilter;
