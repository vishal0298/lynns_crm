/* eslint-disable react/prop-types */
import React, { useState, useEffect, useContext, createContext } from "react";
import { deleteStaffApi, staffApi } from "../../../../constans/apiname";
import { ApiServiceContext, successToast } from "../../../../core/core-index";
import { userRolesCheck } from "../../../../common/commonMethods";

const ListStaffContext = createContext({});

const ListStaffController = (props) => {
  const [show, setShow] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [staffDelete, setStaffDelete] = useState();
  const { getData, patchData } = useContext(ApiServiceContext);
  // For Roles and Permissions
  const [permission, setPermission] = useState({});
  const [admin, setAdmin] = useState(false);

  useEffect(() => {

    getStaffList();
    let findModule = userRolesCheck("unit");
    if (findModule == "admin") {
      setAdmin(true);
    } else {
      setPermission(findModule);
    }
  }, []);
  // For Roles and Permissions

  useEffect(() => {
    getStaffList();
  }, []);

  const [page, setPage] = useState(1);
  const [pagesize, setPagesize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const handlePagination = async (page, pageSize) => {
    setPage(page);
    setPagesize(pageSize);
    getStaffList(page, pageSize);
  };
  
  const getStaffList = async (currentpage = 1, currentpagesize = 10) => {
    try {
      let skipSize;
      skipSize = currentpage == 1 ? 0 : (currentpage - 1) * currentpagesize;
      console.log(staffApi)
      const response = await getData(
        `${staffApi}?limit=${currentpagesize}&skip=${skipSize}`
      );
      console.log(response)
      // const response = undefined
      if (response) {
            setStaffList(response?.data);
            setTotalCount(response?.totalRecords);   
      }
    } catch {
      return false;
    }
  };


  
  const onDelete = async (id) => {
    const url = `${deleteStaffApi}/${id}`;
    try {
      const responseDelete = await patchData(url);
      if (responseDelete) {
        handlePagination(1, 10);
        getStaffList();
        successToast("Staff deleted Successfully");
      }
    } catch {
      return false;
    }
  };

  return (
    <>
      <ListStaffContext.Provider
        value={{
          show,
          setShow,
          staffList,
          setStaffList,
          staffDelete,
          setStaffDelete,
          onDelete,
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
      </ListStaffContext.Provider>
    </>
  );
};

export { ListStaffContext, ListStaffController };
