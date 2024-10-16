/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useState } from "react";
import { search } from "../../../common/imagepath";
import { Link } from "react-router-dom";
import { ApiServiceContext } from "../../../core/API/api-service";
import { usersApi } from "../../../core/core-index";
import { debounce } from "../../../common/helper";
import { useForm } from "react-hook-form";

const UserFilter = ({
  show,
  setShow,
  setFilterArray,
  page,
  pagesize,
  setTotalCount,
}) => {
  const [first, setfirst] = useState(true);
  const { getData } = useContext(ApiServiceContext);
  const [key, setKey] = useState([]);
  const [noData, setNoData] = useState(false);
  const [searchText, setSearchText] = useState({ value: "", asset: [] });
  const [noDataText, setnoDataText] = useState("");
  const { resetField, register } = useForm({});
  const [searchInputValue, setSearchInputValue] = useState("");

  useEffect(() => {
    setKey([]);
    let data = searchText.asset;
    if (data.length) {
      data.forEach((data, idx) => {
        resetField(`user${idx}`);
      });
    }
  }, [searchText]);

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
      let searchUrl = usersApi?.List;

      const queryParams = [];
      let skipSize;
      skipSize = page == 1 ? 0 : (page - 1) * pagesize;
      queryParams.push(`limit=${pagesize}`);
      queryParams.push(`skip=${skipSize}`);

      if (key.length > 0) queryParams.push(`user=${key.join(",")}`);
      if (queryParams.length > 0)
        searchUrl = `${searchUrl}?${queryParams.join("&")}`;
      const response = await getData(searchUrl);
      if (response.code == 200) {
        setFilterArray(response?.data || []);
        setTotalCount(response?.totalRecords);
        setShow(false);
      }
    } catch {
      return false;
    }
  };

  const onSearchChange = async (val) => {
    if (val !== "") {
      try {
        let searchUrl = usersApi?.List;
        if (val !== "") searchUrl = `${searchUrl}?search_user=${val}`;
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
            setnoDataText("Customers Not Found !");
          }
        }
      } catch {
        setNoData(true);
        setnoDataText("Customers Not Found !");
      }
    } else {
      setKey([]);
      setSearchText({
        value: "",
        asset: [],
      });
      setNoData(false);
      if (key.length > 0) resetList();
    }
  };
  const resetList = async () => {
    let searchUrl = usersApi?.List;
    const response = await getData(searchUrl);
    if (response.code == 200) {
      setFilterArray(response?.data || []);
      setTotalCount(response?.totalRecords);
    }
  };
  const handleFilterclear = async () => {
    resetList();
    setKey([]);
    setSearchText({ value: "", asset: [] });
    setNoData(false);
    setSearchInputValue("");
  };
  // ;
  // ;
  const onSearchprocessChange = debounce(onSearchChange, 200);
  return (
    <div className={`toggle-sidebar ${show ? "open-filter" : ""}`}>
      <div className="sidebar-layout-filter">
        <div className="sidebar-header">
          <h5>Filter</h5>
          <Link
            to="#"
            className="sidebar-closes"
            onClick={() => setShow(!show)}
          >
            <i className="fa-regular fa-circle-xmark" />
          </Link>
        </div>
        <div className="sidebar-body">
          <form
            action="#"
            // onSubmit={handleApplyFilter}
            id="vendorf"
            autoComplete="off"
          >
            {/* Customer */}
            <div className="accordion accordion-last" id="accordionMain1">
              <div
                className="card-header-new"
                id="headingOne"
                onClick={() => setfirst(!first)}
              >
                <h6 className="filter-title">
                  <Link
                    to="#"
                    className={first ? "w-100" : "w-100 collapsed"}
                    // data-bs-toggle="collapse"
                    // data-bs-target="#collapseOne"
                    aria-expanded={first}
                    // aria-controls="collapseOne"
                  >
                    Users
                    <span className="float-end">
                      <i className="fa-solid fa-chevron-down" />
                    </span>
                  </Link>
                </h6>
              </div>
              <div
                id="collapseOne"
                className={first ? "collapse show" : "collapse"}
                // aria-labelledby="headingOne"
                // data-bs-parent="#accordionExample1"
              >
                <div className="card-body-chat">
                  <div className="row">
                    <div className="col-md-12">
                      <div id="checkBoxes1">
                        <div className="form-custom">
                          <input
                            type="text"
                            className="form-control"
                            id="member_search1"
                            placeholder="Search Users"
                            onChange={(e) => {
                              const val = e?.target?.value.toLowerCase();
                              setSearchText({
                                value: val,
                                asset: [],
                              });
                              // onSearchChange(val);
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
                          {searchText?.asset?.length > 0 &&
                            searchText?.asset.map((item, index) => {
                              return (
                                <label
                                  className="custom_check w-100"
                                  key={index}
                                >
                                  <input
                                    type="checkbox"
                                    {...register(`user${index}`)}
                                    defaultChecked={false}
                                    onChange={(e) =>
                                      handleCheckboxChange(e, item?._id)
                                    }
                                  />
                                  <span className="checkmark" /> {item.userName}
                                </label>
                              );
                            })}
                          {/* {(searchText?.asset?.length > 0
                            ? searchText?.asset
                            : cleansearch
                          )?.map((item) => {
                            return (
                              <label
                                className="custom_check w-100"
                                key={item?._id}
                              >
                                <input
                                  type="checkbox"
                                  name="username"
                                  onChange={(e) =>
                                    handleCheckboxChange(e, item?.userName, e)
                                  }
                                />
                                <span className="checkmark" /> {item.userName}
                              </label>
                            );
                          })} */}
                        </div>
                        {/* {searchText?.asset?.length == 0 && <span>No data</span>} */}
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
                {key.length > 0 ? "Apply" : "Select Users "}
              </button>
              <button
                // type="submit"
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

export default UserFilter;
