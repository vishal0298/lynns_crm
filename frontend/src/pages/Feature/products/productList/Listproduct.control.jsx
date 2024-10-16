/* eslint-disable react/prop-types */
import React, { createContext, useEffect, useContext, useState } from "react";
import { ApiServiceContext } from "../../../../core/API/api-service";
import {
  productListapi,
  productDelapi,
  successToast,
} from "../../../../core/core-index";
import { userRolesCheck } from "../../../../common/commonMethods";

const ListproductContext = createContext({});

const ListproductComponentController = (props) => {
  const { getData, postData } = useContext(ApiServiceContext);
  const [menu, setMenu] = useState(false);
  const [show, setShow] = useState(false);
  const [productlist, setProductList] = useState([]);
  const toggleMobileMenu = () => setMenu(!menu);

  // For Roles and Permissions
  const [permission, setPermission] = useState({});
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    getProductDetails();
    let findModule = userRolesCheck("productsOrServices");
    if (findModule == "admin") {
      setAdmin(true);
    } else {
      setPermission(findModule);
    }
  }, []);
  // For Roles and Permissions

  const [page, setPage] = useState(1);
  const [pagesize, setPagesize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const handlePagination = async (page, pageSize) => {
    setPage(page);
    setPagesize(pageSize);
    getProductDetails(page, pageSize);
  };

  const getProductDetails = async (currentpage = 1, currentpagesize = 10) => {
    try {
      let skipSize;
      skipSize = currentpage == 1 ? 0 : (currentpage - 1) * currentpagesize;
      const response = await getData(
        `${productListapi}?limit=${currentpagesize}&skip=${skipSize}`
      );
      if (response.code === 200) {
        setProductList(response.data || []);
        setTotalCount(response?.totalRecords);
      }
      return response;
    } catch (error) {
      //
    }
  };

  // useEffect(() => {
  //   getProductDetails();
  // }, []);

  const onDelete = async (id) => {
    try {
      const response = await postData(productDelapi, { _id: id });
      if (response.code == 200) {
        handlePagination(1, 10);
        successToast("Product Deleted Successfully");
        getProductDetails();
      }
    } catch (err) {
      //
    }
  };

  return (
    <ListproductContext.Provider
      value={{
        onDelete,
        setShow,
        productlist,
        setProductList,
        show,
        menu,
        toggleMobileMenu,
        admin,
        permission,
        handlePagination,
        page,
        pagesize,
        totalCount,
        setTotalCount,
      }}
    >
      {props.children}
    </ListproductContext.Provider>
  );
};

export { ListproductContext, ListproductComponentController };
