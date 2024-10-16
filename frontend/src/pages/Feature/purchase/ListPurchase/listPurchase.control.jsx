/* eslint-disable react/prop-types */
import React, { createContext, useContext, useEffect, useState } from "react";
import "../../../../common/antd.css";
import { ApiServiceContext, successToast } from "../../../../core/core-index";
import { deletePurchaseApi, listPurchasesApi } from "../../../../constans/apiname";
import { userRolesCheck } from "../../../../common/commonMethods";

const ListPurchaseContext = createContext({});

const ListPurchaseComponentController = (props) => {
  const [menu, setMenu] = useState(false);
  const [show, setShow] = useState(false);
  const [List, setList] = useState([]);
  const [purchaseDelete, setPurchaseDelete] = useState("");

  // For Roles and Permissions
  const [permission, setPermission] = useState({});
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    getPurchaseList();
    let findModule = userRolesCheck("purchase");
    if (findModule == "admin") {
      setAdmin(true);
    } else {
      setPermission(findModule);
    }
  }, []);
  // For Roles and Permissions

  const { getData, postData } = useContext(ApiServiceContext);

  // Get List
  // useEffect(() => {
  //   getPurchaseList();
  // }, []);

  const [page, setPage] = useState(1);
  const [pagesize, setPagesize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const handlePagination = async (page, pageSize) => {
    setPage(page);
    setPagesize(pageSize);
    getPurchaseList(page, pageSize);
  };

  const getPurchaseList = async (currentpage = 1, currentpagesize = 10) => {
    let skipSize;
    skipSize = currentpage == 1 ? 0 : (currentpage - 1) * currentpagesize;
    const response = await getData(
      `${listPurchasesApi}?limit=${currentpagesize}&skip=${skipSize}`
    );
    if (response.code == 200) {
      setList(response?.data);
      setTotalCount(response?.totalRecords);
    }
  };

  const onDelete = async (data) => {
    const url = `${deletePurchaseApi}`;
    const obj = { _id: data };
    try {
      const response = await postData(url, obj);
      if (response) {
        handlePagination(1, 10);

        successToast("Purchase Deleted  Successfully");
        getPurchaseList();
      }
    } catch {
      /* empty */
    }
  };

  return (
    <ListPurchaseContext.Provider
      value={{
        menu,
        setMenu,
        show,
        setShow,
        List,
        setList,
        onDelete,
        purchaseDelete,
        setPurchaseDelete,
        getPurchaseList,
        admin,
        permission,
        handlePagination,
        page,
        pagesize,
        totalCount,
        setTotalCount,
        setPage,
      }}
    >
      {props.children}
    </ListPurchaseContext.Provider>
  );
};

export { ListPurchaseContext, ListPurchaseComponentController };
