/* eslint-disable react/prop-types */
import React, { useState, useEffect, useContext, createContext } from "react";
import "../../../../common/antd.css";
import { categoryApi } from "../../../../constans/apiname";
import { ApiServiceContext, successToast } from "../../../../core/core-index";
import { userRolesCheck } from "../../../../common/commonMethods";

const ListCategoryContext = createContext({});

const ListCategoryController = (props) => {
  const [show, setShow] = useState(false);
  const [categorylist, setCategorylist] = useState([]);
  const [categoryDelete, setCategoryDelete] = useState([]);


  const [permission, setPermission] = useState({});
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    getCategoryDetails();
    let findModule = userRolesCheck("category");
    if (findModule == "admin") {
      setAdmin(true);
    } else {
      setPermission(findModule);
    }
  }, []);

  const { getData, patchData } = useContext(ApiServiceContext);

  // useEffect(() => {
  //   getCategoryDetails();
  // }, []);

  const [page, setPage] = useState(1);
  const [pagesize, setPagesize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const handlePagination = async (page, pageSize) => {
    setPage(page);
    setPagesize(pageSize);
    getCategoryDetails(page, pageSize);
  };

  const getCategoryDetails = async (currentpage = 1, currentpagesize = 10) => {
    try {
      let skipSize;
      skipSize = currentpage == 1 ? 0 : (currentpage - 1) * currentpagesize;
      const response = await getData(
        `${categoryApi}?limit=${currentpagesize}&skip=${skipSize}`
      );
      if (response) {
        setCategorylist(response?.data);
        setTotalCount(response?.totalRecords);
      }
    } catch {
      return false;
    }
  };
  const onDelete = async (id) => {
    const url = `${categoryApi}/${id}`;
    try {
      const responseDelete = await patchData(url);
      if (responseDelete) {
        handlePagination(1, 10);
        successToast("Category Deleted Successfully");
        getCategoryDetails();
      }
    } catch {
      return false;
    }
  };

  return (
    <>
      <ListCategoryContext.Provider
        value={{
          show,
          setShow,
          categorylist,
          setCategorylist,
          categoryDelete,
          setCategoryDelete,
          onDelete,
          admin,
          permission,
          handlePagination,
          page,
          pagesize,
          totalCount,
          setTotalCount,
          setPage,
          setPagesize,
        }}
      >
        {props.children}
      </ListCategoryContext.Provider>
    </>
  );
};

export { ListCategoryContext, ListCategoryController };
