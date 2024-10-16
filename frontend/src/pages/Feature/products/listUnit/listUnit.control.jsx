/* eslint-disable react/prop-types */
import React, { useState, useEffect, useContext, createContext } from "react";
import { deleteUnitsApi, unitsApi } from "../../../../constans/apiname";
import { ApiServiceContext, successToast } from "../../../../core/core-index";
import { userRolesCheck } from "../../../../common/commonMethods";

const ListUnitContext = createContext({});

const ListUnitController = (props) => {
  const [show, setShow] = useState(false);
  const [unitsList, setUnitsList] = useState([]);
  const [unitsDelete, setUnitsDelete] = useState();
  const { getData, patchData } = useContext(ApiServiceContext);
  // For Roles and Permissions
  const [permission, setPermission] = useState({});
  const [admin, setAdmin] = useState(false);

  useEffect(() => {

    getUnitsList();
    let findModule = userRolesCheck("unit");
    if (findModule == "admin") {
      setAdmin(true);
    } else {
      setPermission(findModule);
    }
  }, []);
  // For Roles and Permissions

  // useEffect(() => {
  //   getUnitsList();
  // }, []);

  const [page, setPage] = useState(1);
  const [pagesize, setPagesize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const handlePagination = async (page, pageSize) => {
    setPage(page);
    setPagesize(pageSize);
    getUnitsList(page, pageSize);
  };

  const getUnitsList = async (currentpage = 1, currentpagesize = 10) => {
    try {
      let skipSize;
      skipSize = currentpage == 1 ? 0 : (currentpage - 1) * currentpagesize;
      const response = await getData(
        `${unitsApi}?limit=${currentpagesize}&skip=${skipSize}`
      );
      if (response) {
        setUnitsList(response?.data);
        setTotalCount(response?.totalRecords);
      }
    } catch {
      return false;
    }
  };

  const onDelete = async (id) => {
    const url = `${deleteUnitsApi}/${id}`;
    try {
      const responseDelete = await patchData(url);
      if (responseDelete) {
        handlePagination(1, 10);
        getUnitsList();
        successToast("Units deleted Successfully");
      }
    } catch {
      return false;
    }
  };

  return (
    <>
      <ListUnitContext.Provider
        value={{
          show,
          setShow,
          unitsList,
          setUnitsList,
          unitsDelete,
          setUnitsDelete,
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
      </ListUnitContext.Provider>
    </>
  );
};

export { ListUnitContext, ListUnitController };
