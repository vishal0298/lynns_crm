/* eslint-disable react/prop-types */
import React, { createContext, useContext, useEffect, useState } from "react";
import "../../../../common/antd.css";
import {
  ApiServiceContext,
  expenses,
  successToast,
} from "../../../../core/core-index";
import { userRolesCheck } from "../../../../common/commonMethods";

const ListExpenseContext = createContext({});

const ListExpenseComponentController = (props) => {
  const [menu, setMenu] = useState(false);
  const [show, setShow] = useState(false);
  const [expense, setExpense] = useState([]);
  const [expenseDelete, setExpenseDelete] = useState("");
  // For Roles and Permissions
  const [permission, setPermission] = useState({});
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    let findModule = userRolesCheck("expense");
    if (findModule == "admin") {
      setAdmin(true);
    } else {
      setPermission(findModule);
    }
    getExpense();

  }, []);
  // For Roles and Permissions

  const { getData, postData } = useContext(ApiServiceContext);

  // useEffect(() => {
  //   getExpense();
  // }, []);

  const [page, setPage] = useState(1);
  const [pagesize, setPagesize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const handlePagination = async (page, pageSize) => {
    setPage(page);
    setPagesize(pageSize);
    getExpense(page, pageSize);
  };

  const getExpense = async (currentpage = 1, currentpagesize = 10) => {
    let skipSize;
    skipSize = currentpage == 1 ? 0 : (currentpage - 1) * currentpagesize;
    const expenseList = await getData(
      `${expenses?.List}?limit=${currentpagesize}&skip=${skipSize}`
    );
    setExpense(expenseList?.data);
    setTotalCount(expenseList?.totalRecords);
  };

  const onDelete = async (data) => {
    const url = `${expenses?.Delete}`;
    const obj = { _id: data };
    try {
      const response = await postData(url, obj);
      if (response) {
        handlePagination(1, 10);

        getExpense();
        successToast("Expenses Deleted Successfully");
      }
    } catch {
      return false;
    }
  };

  return (
    <ListExpenseContext.Provider
      value={{
        menu,
        setMenu,
        show,
        setShow,
        expense,
        setExpense,
        onDelete,
        expenseDelete,
        setExpenseDelete,
        getExpense,
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
    </ListExpenseContext.Provider>
  );
};

export { ListExpenseContext, ListExpenseComponentController };
