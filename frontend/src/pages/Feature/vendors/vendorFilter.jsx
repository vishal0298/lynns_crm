import React, { useContext, useEffect, useState } from "react";
import { search } from "../../../common/imagepath";
import { Link } from "react-router-dom";
import { ApiServiceContext } from "../../../core/API/api-service";
import { useForm } from "react-hook-form";
import { debounce } from "../../../common/helper";
import { listVendor } from "../../../core/core-index";

const VendorFilter = ({
  // eslint-disable-next-line react/prop-types
  show,
  // eslint-disable-next-line react/prop-types
  setShow,
  // eslint-disable-next-line react/prop-types
  page,
  // eslint-disable-next-line react/prop-types
  pagesize,
  // eslint-disable-next-line react/prop-types
  setVendorlist,
  // eslint-disable-next-line react/prop-types
  setTotalCount,
}) => {
  const { resetField, register } = useForm({});
  const [first, setfirst] = useState(true);
  const { getData } = useContext(ApiServiceContext);
  const [key, setKey] = useState([]);
  const [noData, setNoData] = useState(false);
  const [noDataText, setnoDataText] = useState("");
  const [searchText, setSearchText] = useState({ value: "", asset: [] });
  const [searchInputValue, setSearchInputValue] = useState("");

  useEffect(() => {
    setKey([]);
    let data = searchText.asset;
    if (data.length) {
      data.forEach((data, idx) => {
        resetField(`vendor${idx}`);
      });
    }
  }, [searchText]);

  const resetList = async () => {
    let searchUrl = listVendor;
    const response = await getData(searchUrl);
    if (response.code == 200) {
      setVendorlist(response?.data || []);
      setTotalCount(response?.totalRecords);
    }
  };

  const handleCheckboxChange = (event, name) => {
    const { checked } = event.target;
    if (checked) {
      setKey((prev) => [...prev, name]);
    } else {
      setKey((prev) => prev.filter((item) => item !== name));
    }
  };

  const handleApplyFilter = async (e) => {
    e.preventDefault();
    try {
      let searchUrl = listVendor;
      const queryParams = [];
      let skipSize;
      skipSize = page == 1 ? 0 : (page - 1) * pagesize;
      queryParams.push(`limit=${pagesize}`);
      queryParams.push(`skip=${skipSize}`);

      if (key.length > 0) queryParams.push(`vendor=${key.join(",")}`);
      if (queryParams.length > 0)
        searchUrl = `${searchUrl}?${queryParams.join("&")}`;

      const response = await getData(searchUrl);
      if (response.code == 200) {
        setVendorlist(response?.data || []);
        setTotalCount(response?.totalRecords);
        setShow(false);
      }
    } catch {
      /* empty */
    }
  };

  const onSearchChange = async (val) => {
    if (val !== "") {
      try {
        let searchUrl = listVendor;
        if (val !== "") searchUrl = `${searchUrl}?search_vendor=${val}`;
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
            setnoDataText("Vendors Not Found !");
          }
        }
      } catch {
        setNoData(true);
        setnoDataText("Vendors Not Found !");
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

  const handleFilterclear = async () => {
    resetList();
    setKey([]);
    setSearchText({ value: "", asset: [] });
    setNoData(false);
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
          <form action="#" id="vendorf" autoComplete="off">
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
                    aria-expanded={first}
                  >
                    Vendors
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
                        <div className="form-custom">
                          <input
                            type="text"
                            className="form-control"
                            id="member_search1"
                            placeholder="Search Vendors"
                            onChange={(e) => {
                              const val = e?.target?.value.toLowerCase();
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
                        {searchText?.asset?.length > 0 &&
                          searchText?.asset.map((item, index) => {
                            return (
                              <label className="custom_check w-100" key={index}>
                                <input
                                  type="checkbox"
                                  {...register(`vendor${index}`)}
                                  onChange={(e) =>
                                    handleCheckboxChange(e, item?._id)
                                  }
                                />
                                <span className="checkmark" />{" "}
                                {item.vendor_name}
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
                disabled={key.length > 0 ? false : true}
                onClick={handleApplyFilter}
                className="d-inline-flex align-items-center justify-content-center btn w-100 btn-primary"
              >
                {key.length > 0 ? "Apply" : "Select Vendors"}
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

export default VendorFilter;
