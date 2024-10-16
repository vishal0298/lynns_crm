/* eslint-disable react/prop-types */
import React, { createContext, useContext, useEffect, useState } from "react";
import { deleteVendor, listVendor, successToast } from "../../../../core/core-index";
import { ApiServiceContext } from "../../../../core/API/api-service";
import { userRolesCheck } from "../../../../common/commonMethods";

const ListvendorContext = createContext({});

const ListvendorComponentController = (props) => {
  const { getData, patchData } = useContext(ApiServiceContext);
  const [show, setShow] = useState(false);
  const [vendorlist, setVendorlist] = useState([]);
  const [vendordelete, setVedordelete] = useState("");

  // For Roles and Permissions
  const [permission, setPermission] = useState({});
  const [ledger, setLedger] = useState({});
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    getVendorlist();
    let findModule = userRolesCheck("vendor");
    let foundLedger = userRolesCheck("ledger");
    if (findModule == "admin") {
      setAdmin(true);
    } else {
      setPermission(findModule);
    }
    setLedger(foundLedger);
  }, []);

  // useEffect(() => {
  //   getVendorlist();
  // }, []);

  const [page, setPage] = useState(1);
  const [pagesize, setPagesize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const handlePagination = async (page, pageSize) => {
    setPage(page);
    setPagesize(pageSize);
    getVendorlist(page, pageSize);
  };

  const getVendorlist = async (currentpage = 1, currentpagesize = 10) => {
    let skipSize;
    skipSize = currentpage == 1 ? 0 : (currentpage - 1) * currentpagesize;
    const response = await getData(
      `${listVendor}?limit=${currentpagesize}&skip=${skipSize}`
    );
    setVendorlist(response?.data);
    setTotalCount(response?.totalRecords);
  };

  const onDelete = async () => {
    const url = `${deleteVendor}/${vendordelete}`;
    const obj = {
      _id: vendordelete,
    };
    try {
      const response = await patchData(url, obj);
      if (response) {
        handlePagination(1, 10);
        successToast("Vendor deleted successfully");
        getVendorlist();
      }
    } catch {
      /* empty */
    }
  };

  return (
    <ListvendorContext.Provider
      value={{
        onDelete,
        setShow,
        vendorlist,
        show,
        vendordelete,
        setVedordelete,
        setVendorlist,
        getVendorlist,
        admin,
        permission,
        ledger,
        handlePagination,
        page,
        pagesize,
        totalCount,
        setTotalCount,
      }}
    >
      {props.children}
    </ListvendorContext.Provider>
  );
};

export { ListvendorContext, ListvendorComponentController };
