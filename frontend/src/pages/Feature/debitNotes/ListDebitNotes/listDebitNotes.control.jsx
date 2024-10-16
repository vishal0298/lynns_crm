/* eslint-disable react/prop-types */
import React, { createContext, useContext, useEffect, useState } from "react";
import "../../../../common/antd.css";
import {
  ApiServiceContext,
  debit_note,
  successToast,
} from "../../../../core/core-index";
import { userRolesCheck } from "../../../../common/commonMethods";

const ListDebitNotesContext = createContext({});

const ListDebitNotesComponentController = (props) => {
  const [menu, setMenu] = useState(false);
  const [show, setShow] = useState(false);
  const [purchaseReturn, setPurchaseReturn] = useState([]);
  const [purchaseReturnDelete, setpurchaseReturnDelete] = useState("");
  const { getData, patchData, postData } = useContext(ApiServiceContext);

  // For Roles and Permissions
  const [permission, setPermission] = useState({});
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    let findModule = userRolesCheck("debitNote");
    if (findModule == "admin") {
      setAdmin(true);
    } else {
      setPermission(findModule);
    }
    getPurchaseReturn();

  }, []);
  // For Roles and Permissions

  const onDelete = async (data) => {
    const url = `${debit_note?.Update}/${data}/softDelete`;
    try {
      const response = await patchData(url);
      getPurchaseReturn();
      if (response) {
        handlePagination(1, 10);

        successToast("Debit Notes Deleted successfully");
      }
    } catch {
      return false;
    }
  };

  const [page, setPage] = useState(1);
  const [pagesize, setPagesize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const handlePagination = async (page, pageSize) => {
    setPage(page);
    setPagesize(pageSize);
    getPurchaseReturn(page, pageSize);
  };

  const getPurchaseReturn = async (currentpage = 1, currentpagesize = 10) => {
    let skipSize;
    skipSize = currentpage == 1 ? 0 : (currentpage - 1) * currentpagesize;
    const response = await getData(
      `${debit_note?.List}?limit=${currentpagesize}&skip=${skipSize}`
    );
    if (response.code == 200) setPurchaseReturn(response?.data);
    setTotalCount(response?.totalRecords);
  };
  // UseEffect
  // useEffect(() => {
  //   getPurchaseReturn();
  // }, []);

  return (
    <ListDebitNotesContext.Provider
      value={{
        menu,
        setMenu,
        show,
        setShow,
        purchaseReturn,
        setPurchaseReturn,
        purchaseReturnDelete,
        setpurchaseReturnDelete,
        onDelete,
        admin,
        permission,
        handlePagination,
        page,
        pagesize,
        totalCount,
        setTotalCount,
        getPurchaseReturn,
        postData,
        setPage,
      }}
    >
      {props.children}
    </ListDebitNotesContext.Provider>
  );
};

export { ListDebitNotesContext, ListDebitNotesComponentController };
