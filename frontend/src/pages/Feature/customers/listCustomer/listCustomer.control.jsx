/* eslint-disable react/prop-types */
import React, { useState, useEffect, useContext, createContext } from "react";
import "../../../../common/antd.css";
import {
  listcustomerApi,
  deletecustomerApi,
  activateCustomerApi,
  deactivateCustomerApi,
} from "../../../../constans/apiname";
import { ApiServiceContext, successToast } from "../../../../core/core-index";
import { userRolesCheck } from "../../../../common/commonMethods";
import { PreviewImg } from "../../../../common/imagepath";

const ListCustomerContext = createContext({});

const ListCustomerController = (props) => {
  const [show, setShow] = useState(false);
  const [list, setList] = useState([]);
  const [customerDelete, setCustomerDelete] = useState("");

  // For Roles and Permissions
  const [permission, setPermission] = useState({});
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    let findModule = userRolesCheck("customer");
    if (findModule == "admin") {
      setAdmin(true);
    } else {
      setPermission(findModule);
    }
  }, []);
  // For Roles and Permissions
  const { getData, postData } = useContext(ApiServiceContext);

  useEffect(() => {
    getListcustomer();
  }, []);

  const [page, setPage] = useState(1);
  const [pagesize, setPagesize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const handlePagination = async (page, pageSize) => {
    setPage(page);
    setPagesize(pageSize);
    getListcustomer(page, pageSize);
  };

  const getListcustomer = async (currentpage = 1, currentpagesize = 10) => {
    let skipSize;
    skipSize = currentpage == 1 ? 0 : (currentpage - 1) * currentpagesize;
    const response = await getData(
      `${listcustomerApi}?limit=${currentpagesize}&skip=${skipSize}`
    );
    setList(response?.data || []);
    setTotalCount(response?.totalRecords);
  };

  const onDelete = async (data) => {
    const url = `${deletecustomerApi}`;
    const obj = {
      _id: data,
    };

    try {
      const response = await postData(url, obj);
      if (response) {
        handlePagination(1, 10);
        successToast("Customer Deleted  Successfully");
        getListcustomer(page, pagesize);
      }
    } catch {
      return false;
    }
  };

  const activate = async (data, type) => {
    const url =
      type === "activate"
        ? `${activateCustomerApi}`
        : `${deactivateCustomerApi}`;
    const obj = { _id: data };

    try {
      const response = await postData(url, obj);
      if (response) {
        getListcustomer();
      }
    } catch {
      return false;
    }
  };

  const handleImageError = (event) => {
    event.target.src = PreviewImg;
  };

  return (
    <ListCustomerContext.Provider
      value={{
        show,
        setShow,
        list,
        setList,
        customerDelete,
        setCustomerDelete,
        getListcustomer,
        onDelete,
        activate,
        handleImageError,
        permission,
        admin,
        handlePagination,
        page,
        pagesize,
        totalCount,
        setTotalCount,
        setPage,
      }}
    >
      {props.children}
    </ListCustomerContext.Provider>
  );
};
export { ListCustomerContext, ListCustomerController };
