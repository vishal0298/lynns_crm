/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from "react";
import { search } from "../../../common/imagepath";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { debounce } from "../../../common/helper";
import {staffApi, ApiServiceContext } from "../../../core/core-index";

const staffFilter = ({
  show,
  setShow,
  setStaffList,
  page,
  pagesize,
  setTotalCount,
  setPage,
  handlePagination,
}) => {
  const [key, setKey] = useState([]);
  const [noData, setNoData] = useState(false);
  const [searchText, setSearchText] = useState({ value: "", asset: [] });
  const { getData } = useContext(ApiServiceContext);
  const { resetField, register } = useForm({});
  const [noDataText, setnoDataText] = useState("");
  const [unit, setunit] = useState(true);
  const [searchInputValue, setSearchInputValue] = useState("");

  useEffect(() => {
    setKey([]);
    let data = searchText.asset;
    if (data.length) {
      data.forEach((data, idx) => {
        resetField(`unit${idx}`);
      });
    }
  }, [searchText]);

  const onSearchChange = async (val) => {
    if (val !== "") {
      try {
        let searchUrl = staffApi;
        if (val !== "") searchUrl = `${searchUrl}?search_staff=${val}`;
        const response = await getData(searchUrl, false);
        if (response.code == 200) {
          let data = response?.data;
          if (data.length > 0) {
            setNoData(false);
            setSearchText({
              value: val,
              asset: response?.data,
            });
          } else {
            setSearchText({
              value: val,
              asset: data,
            });
            setNoData(true);
            setnoDataText("Category Not Found !");
          }
        }
      } catch {
        setNoData(true);
        setnoDataText("Category Not Found !");
      }
    } else {
      if (key.length > 0) resetList();
      setKey([]);
      setSearchText({
        value: "",
        asset: [],
      });
      setNoData(false);
    }
  };

  const resetList = async () => {
    let searchUrl =staffApi;
    const response = await getData(searchUrl);
    if (response.code == 200) {
      setStaffList(response?.data || []);
      setTotalCount(response?.totalRecords);
    }
  };

  const handleCheckboxChange = (event, name) => {
    // eslint-disable-next-line no-unused-vars
    const { value, checked } = event.target;
    if (checked) {
      setKey((prev) => [...prev, name]);
    } else {
      setKey((prev) => prev.filter((item) => item !== name));
    }
  };

  const handleApplyFilter = async (e) => {
    e.preventDefault();
    try {
      let searchUrl =staffApi;
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

      if (key.length > 0) queryParams.push(`search_staff=${key.join(",")}`);
      if (queryParams.length > 0)
        searchUrl = `${searchUrl}?${queryParams.join("&")}`;

      const response = await getData(searchUrl);
      if (response.code == 200) {
        if (page > 1) {
          setPage(1);
        }
        setStaffList(response?.data || []);
        setTotalCount(response?.totalRecords);
      }
    } catch {
      return false;
    }
  };

  const handleFilterclear = async () => {
    resetList();
    setKey([]);
    setSearchText({ value: "", asset: [] });
    setNoData(false);
    handlePagination(1, 10);
    setSearchInputValue("");
  };

  const onSearchprocessChange = debounce(onSearchChange, 200);

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
          <form action="#" autoComplete="off">
            {/* Unts */}
            <div className="accordion" id="accordionMain3">
              <div
                className="card-header-new"
                id="headingThree"
                onClick={() => setunit(!unit)}
              >
                <h6 className="filter-title">
                  <Link
                    to="#"
                    className={unit ? "w-100" : "w-100 collapsed"}
                    aria-expanded={unit}
                  >
                   Staff
                    <span className="float-end">
                      <i className="fa-solid fa-chevron-down" />
                    </span>
                  </Link>
                </h6>
              </div>
              <div
                id="collapseThree"
                className={unit ? "collapse show" : "collapse"}
              >
                <div className="card-body-chat">
                  <div id="checkBoxes2">
                    <div className="form-custom">
                      <input
                        type="text"
                        className="form-control"
                        id="member_search1"
                        placeholder="Search Unit"
                        onChange={(e) => {
                          const val = e?.target?.value;
                          setSearchText({
                            value: val,
                            asset: [],
                          });
                          setSearchInputValue(val);
                          onSearchprocessChange(val);
                        }}
                        value={searchInputValue} 
                        // value={searchText?.value}
                      />
                      <span>
                        <img src={search} alt="img" />
                      </span>
                    </div>
                    <div className="selectBox-cont">
                      {(searchText?.asset?.length > 0 ||
                      (noData && searchText?.value != "")
                        ? searchText?.asset
                        : []
                      )?.map((item, index) => {
                        return (
                          <label className="custom_check w-100" key={index}>
                            <input
                              type="checkbox"
                              {...register(`unit${index}`)}
                              onChange={(e) =>
                                handleCheckboxChange(e, item?.staffName)
                              }
                            />
                            <span className="checkmark" />
                            {item?.staffName}
                          </label>
                        );
                      })}
                      {noData && <span>{noDataText}</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Staff */}

            <div className="filter-buttons">
              <button
                onClick={handleApplyFilter}
                disabled={key.length > 0 ? false : true}
                className="d-inline-flex align-items-center justify-content-center btn w-100 btn-primary"
              >
                {key.length > 0 ? "Apply" : "Select Products"}
              </button>
              <button
                type="button"
                onClick={handleFilterclear}
                disabled={
                  searchText.value == "" && key.length == 0 ? true : false
                }
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

export default staffFilter;
