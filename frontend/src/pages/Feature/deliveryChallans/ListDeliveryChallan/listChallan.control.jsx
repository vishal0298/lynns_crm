/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
import React, { createContext, useContext, useEffect, useState } from "react";
import "../../../../common/antd.css";
import {
  ApiServiceContext,
  delivery_challans,
  listcustomerApi,
  successToast,
} from "../../../../core/core-index";
import { userRolesCheck } from "../../../../common/commonMethods";

const ListChallanContext = createContext({});

const ListChallanComponentController = (props) => {
  const [menu, setMenu] = useState(false);
  const [show, setShow] = useState(false);
  const [challans, setChallans] = useState([]);
  const [challanDelete, setChallanDelete] = useState("");
  const [challan, setChallan] = useState([]);
  // For Roles and Permissions
  const [permission, setPermission] = useState({});
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    getChallanList();
    let findModule = userRolesCheck("deliveryChallan");
    if (findModule == "admin") {
      setAdmin(true);
    } else {
      setPermission(findModule);
    }
  }, []);
  // For Roles and Permissions

  const { getData, postData } = useContext(ApiServiceContext);

  // useEffect(() => {
  //   getChallanList();
  // }, []);

  const [page, setPage] = useState(1);
  const [pagesize, setPagesize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const handlePagination = async (page, pageSize) => {
    setPage(page);
    setPagesize(pageSize);
    getChallanList(page, pageSize);
  };

  const getChallanList = async (currentpage = 1, currentpagesize = 10) => {
    let skipSize;
    skipSize = currentpage == 1 ? 0 : (currentpage - 1) * currentpagesize;
    const response = await getData(
      `${delivery_challans?.List}?limit=${currentpagesize}&skip=${skipSize}`
    );
    setChallans(response?.data);
    setTotalCount(response?.totalRecords);
  };

  const handleImageError = (event) => {
    event.target.src = "fd81bd24259926e384cfb88c2301d548.png";
  };

  const onDelete = async (data) => {
    const url = `${delivery_challans?.delete}`;
    const obj = {
      _id: data,
    };
    try {
      const response = await postData(url, obj);
      if (response) {
        handlePagination(1, 10);

        successToast("Delivery Challan deleted successfully");
        getChallanList();
      }
    } catch {
      return false;
    }
  };

  const clone = async (id) => {
    try {
      const response = await postData(
        `${delivery_challans?.clone}/${id}/clone`,
        {
          id: id,
        }
      );
      if (response.code === 200) {
        successToast("Delivery Challan Cloned Successfully");
        setChallan([...challan, response.data]);
        getChallanList();
        const VendorListresponse = await getData(listcustomerApi);
        if (VendorListresponse.code === 200) {
        
          setsearchFilter(
            VendorListresponse.data.list.length > 0
              ? VendorListresponse.data.list
              : []
          );
        }
      }
      return response;
    } catch (error) {
      return false;
    }
  };

  return (
    <ListChallanContext.Provider
      value={{
        menu,
        setMenu,
        show,
        setShow,
        challans,
        setChallans,
        challanDelete,
        setChallanDelete,
        getChallanList,
        onDelete,
        handleImageError,
        admin,
        permission,
        clone,
        handlePagination,
        page,
        pagesize,
        totalCount,
        setTotalCount,
        setPage,
      }}
    >
      {props.children}
    </ListChallanContext.Provider>
  );
};

export { ListChallanContext, ListChallanComponentController };
