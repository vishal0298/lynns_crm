/* eslint-disable react/prop-types */
import React, { createContext, useContext, useEffect, useState } from "react";
import "../../../../common/antd.css";
import {
  ApiServiceContext,
  successToast,
  usersApi,
} from "../../../../core/core-index";
import { userRolesCheck } from "../../../../common/commonMethods";
import { PreviewImg } from "../../../../common/imagepath";
const ListUserContext = createContext({});
const ListUserController = (props) => {
  const [menu, setMenu] = useState(false);
  const [show, setShow] = useState(false);
  const [users, setUsers] = useState([]);
  const [userDelete, setUserDelete] = useState("");
  const [filterList, setFilterList] = useState([]);
  const [filter, setFilter] = useState(false);
  const [filterArray, setFilterArray] = useState([]);
  const [searchFilter, setsearchFilter] = useState([]);
  const [page, setPage] = useState(1);
  const [pagesize, setPagesize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const { getData, patchData } = useContext(ApiServiceContext);

  // For Roles and Permissions
  const [permission, setPermission] = useState({});
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    let findModule = userRolesCheck("user");
    if (findModule == "admin") {
      setAdmin(true);
    } else {
      setPermission(findModule);
    }
  }, []);

  // For Roles and Permissions
  useEffect(() => {
    getUsers();
  }, []);

  const handlePagination = async (page, pageSize) => {
    setPage(page);
    setPagesize(pageSize);
    getUsers(page, pageSize);
  };
  const getUsers = async (currentpage = 1, currentpagesize = 10) => {
    let skipSize;
    skipSize = currentpage == 1 ? 0 : (currentpage - 1) * currentpagesize;
    const response = await getData(
      `${usersApi?.List}?limit=${currentpagesize}&skip=${skipSize}`
    );
    setUsers(response?.data);
    setFilterList(response?.data);
    setsearchFilter(response?.data);
    setTotalCount(response?.totalRecords);
  };

  useEffect(() => {
    setFilterList(filterArray?.length > 0 && filterArray);
  }, [filterArray]);

  const onDelete = async (data) => {
    const url = `${usersApi?.Update}/${data}/softdelete`;
    try {
      const response = await patchData(url);
      if (response) {
        successToast("User Deleted  Successfully");
        getUsers();
      }
    } catch {
      return false;
    }
  };

  const handleImageError = (event) => {
    event.target.src = PreviewImg;
  };

  return (
    <ListUserContext.Provider
      value={{
        menu,
        setMenu,
        show,
        setShow,
        users,
        setUsers,
        userDelete,
        setUserDelete,
        filterList,
        setFilterList,
        filter,
        setFilter,
        filterArray,
        setFilterArray,
        searchFilter,
        setsearchFilter,
        permission,
        setPermission,
        admin,
        setAdmin,
        page,
        setPage,
        pagesize,
        setPagesize,
        totalCount,
        setTotalCount,
        handlePagination,
        onDelete,
        getUsers,
        handleImageError,
      }}
    >
      {props.children}
    </ListUserContext.Provider>
  );
};
export { ListUserContext, ListUserController };
