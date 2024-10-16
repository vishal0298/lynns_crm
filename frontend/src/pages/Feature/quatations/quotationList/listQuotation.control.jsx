/* eslint-disable react/prop-types */
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  ApiServiceContext,
  quotation,
  successToast,
} from "../../../../core/core-index";
import { userRolesCheck } from "../../../../common/commonMethods";

const ListQuotationContext = createContext({});

const ListQuotationsController = (props) => {
  const [show, setShow] = useState(false);
  const [quotations, setQuotations] = useState([]);
  const [singleQuotation, setSingleQuotation] = useState({});
  const { getData, patchData, postData } = useContext(ApiServiceContext);
  const [quotationDelete, setQuotationDelete] = useState("");
  const [RowId, setRowId] = useState("");
  const [convertId, setConvertId] = useState("");
  const [permission, setPermission] = useState({});
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    getQuotation();
    let findModule = userRolesCheck("quotation");
    if (findModule == "admin") {
      setAdmin(true);
    } else {
      setPermission(findModule);
    }
  }, []);
  

  const [page, setPage] = useState(1);
  const [pagesize, setPagesize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const handlePagination = async (page, pageSize) => {
    setPage(page);
    setPagesize(pageSize);
    getQuotation(page, pageSize);
  };

  const getQuotation = async (currentpage = 1, currentpagesize = 10) => {
    let skipSize;
    skipSize = currentpage == 1 ? 0 : (currentpage - 1) * currentpagesize;
    const response = await getData(
      `${quotation?.List}?limit=${currentpagesize}&skip=${skipSize}`
    );
    setQuotations(response?.data);
    setTotalCount(response?.totalRecords);
  };

  const getSingleQuotation = async (id) => {
    const response = await getData(`${quotation?.View}/${id}`);
    setSingleQuotation(response?.data);
  };

  // useEffect(() => {
  //   getQuotation();
  // }, []);

  const onDelete = async (data) => {
    const url = `${quotation?.delete}/${data}`;
    try {
      const response = await patchData(url);
      if (response) {
        handlePagination(1, 10);

        successToast("Quotation deleted successfully");
        getQuotation();
      }
    } catch {
      /* empty */
    }
  };

  const handleImageError = (event) => {
    event.target.src = "fd81bd24259926e384cfb88c2301d548.png";
  };

  const clone = async (id) => {
    try {
      const response = await postData(`${quotation?.clone}`, {
        id: id,
      });
      if (response.code === 200) {
        successToast("Quotation Cloned Successfully");
        getQuotation();
      }
      return response;
    } catch (error) {
      /* empty */
    }
  };

  return (
    <ListQuotationContext.Provider
      value={{
        quotations,
        setQuotations,
        singleQuotation,
        setSingleQuotation,
        quotationDelete,
        setQuotationDelete,
        RowId,
        setRowId,
        convertId,
        setConvertId,
        getQuotation,
        getSingleQuotation,
        onDelete,
        handleImageError,
        clone,
        show,
        setShow,
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
    </ListQuotationContext.Provider>
  );
};

export { ListQuotationContext, ListQuotationsController };
