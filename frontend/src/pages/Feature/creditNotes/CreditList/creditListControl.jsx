/* eslint-disable react/prop-types */
import React, { createContext, useEffect, useContext, useState } from "react";
import { ApiServiceContext } from "../../../../core/API/api-service";
import { successToast, credit_note } from "../../../../core/core-index";
import { userRolesCheck } from "../../../../common/commonMethods";
import { PreviewImg } from "../../../../common/imagepath";

const ListCreditNotesContext = createContext({});

const ListCreditNotesController = (props) => {
  const [show, setShow] = useState(false);
  const [credits, setCredits] = useState([]);
  const { getData, patchData } = useContext(ApiServiceContext);
  const [creditonDelete, setCreditonDelete] = useState("");

  // For Roles and Permissions
  const [permission, setPermission] = useState({});
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    let findModule = userRolesCheck("creditNote");
    if (findModule == "admin") {
      setAdmin(true);
    } else {
      setPermission(findModule);
    }
    getCreditList();
    
  }, []);
  // For Roles and Permissions

  const [page, setPage] = useState(1);
  const [pagesize, setPagesize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const handlePagination = async (page, pageSize) => {
    setPage(page);
    setPagesize(pageSize);
    getCreditList(page, pageSize);
  };

  const getCreditList = async (currentpage = 1, currentpagesize = 10) => {
    let skipSize;
    skipSize = currentpage == 1 ? 0 : (currentpage - 1) * currentpagesize;
    const response = await getData(
      `${credit_note?.List}?limit=${currentpagesize}&skip=${skipSize}`
    );
    setCredits(response?.data);
    setTotalCount(response?.totalRecords);
  };

  // useEffect(() => {
  //   getCreditList();
  // }, []);

  const onDelete = async (data) => {
    const url = `${credit_note?.delete}/${data}`;
    try {
      const response = await patchData(url);
      getCreditList();

      if (response) {
        handlePagination(1, 10);

        successToast("Sales Return deleted successfully");
      }
    } catch {
      return false;
    }
  };

  const handleImageError = () => {
    return PreviewImg;
  };

  return (
    <ListCreditNotesContext.Provider
      value={{
        show,
        setShow,
        credits,
        setCredits,
        creditonDelete,
        setCreditonDelete,
        handleImageError,
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
    </ListCreditNotesContext.Provider>
  );
};

export { ListCreditNotesContext, ListCreditNotesController };
