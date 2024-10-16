/* eslint-disable react/prop-types */
import React, { createContext, useEffect, useContext, useState } from "react";
import { ApiServiceContext } from "../../../../core/API/api-service";
import {
  purchase_orders as purchase_orders_api,
  successToast,
} from "../../../../core/core-index";
import { userRolesCheck } from "../../../../common/commonMethods";

const ListPOContext = createContext({});

const ListpurchaseOrderController = (props) => {
  const { getData, postData, patchData } = useContext(ApiServiceContext);
  const { List, Delete, View } = purchase_orders_api;
  const [menu, setMenu] = useState(false);
  const [show, setShow] = useState(false);
  const [RowId, setRowId] = useState("");
  const [purchaseOrderData, setPurchaseOrderList] = useState([]);
  const toggleMobileMenu = () => setMenu(!menu);

  // For Roles and Permissions
  const [permission, setPermission] = useState({});
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    getpoDetails();
    let findModule = userRolesCheck("purchaseOrder");
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
    getpoDetails(page, pageSize);
  };

  const getpoDetails = async (currentpage = 1, currentpagesize = 10) => {
    try {
      let skipSize;
      skipSize = currentpage == 1 ? 0 : (currentpage - 1) * currentpagesize;
      const response = await getData(
        `${List}?limit=${currentpagesize}&skip=${skipSize}`
      );
      if (response.code === 200) {
        setPurchaseOrderList(response.data.length > 0 ? response.data : []);
        setTotalCount(response.totalRecords);
      }
      return response;
    } catch (error) {
      //
    }
  };

  // useEffect(() => {
  //   getpoDetails();
  // }, []);

  const getpoDetail = async (id) => {
    try {
      const viewPodata = await getData(`${View}/${id}`);
      if (viewPodata.code === 200) {
      }
      return viewPodata;
    } catch (error) {
      //
    }
  };

  useEffect(() => {
    getpoDetails();
  }, []);

  const onDelete = async (id) => {
    try {
      const response = await patchData(`${Delete}/${id}/softdelete`);
      if (response.code == 200) {
        handlePagination(1, 10);

        successToast("Purchase Order Deleted Successfully");
        getpoDetails();
      }
    } catch (err) {
      //
    }
  };

  useEffect(() => {
    setPurchaseOrderList(purchaseOrderData?.length > 0 && purchaseOrderData);
  }, [purchaseOrderData]);

  const converTopurchase = async (id) => {
    const res = await getpoDetail(id);
    let purorderData = res?.data;
    let Items = res?.data?.items;

    try {
      const formData = new FormData();
      for (let i = 0; i < Items.length; i++) {
        formData.append(`items[${i}][name]`, Items[i].name);
        formData.append(`items[${i}][key]`, Items[i].key);
        formData.append(`items[${i}][productId]`, Items[i].productId);
        formData.append(`items[${i}][productId]`, Items[i].productId);
        formData.append(`items[${i}][quantity]`, Items[i].quantity);
        formData.append(`items[${i}][units]`, Items[i].name);
        formData.append(`items[${i}][unit]`, Items[i].unit_id);
        formData.append(`items[${i}][rate]`, Items[i].rate);
        formData.append(`items[${i}][discount]`, Items[i].discount);
        formData.append(`items[${i}][tax]`, Items[i].tax);
        formData.append(`items[${i}][amount]`, Items[i].amount);
      }

      formData.append("purchaseId", purorderData?.purchaseId);
      formData.append("taxableAmount", purorderData?.taxableAmount);
      formData.append("totalDiscount", purorderData?.totalDiscount);
      formData.append("roundOff", purorderData?.roundOff);
      formData.append("TotalAmount", purorderData?.TotalAmount);
      formData.append("bank", purorderData?.bank);
      formData.append("notes", purorderData?.notes);
      formData.append("termsAndCondition", purorderData?.termsAndCondition);
      formData.append("signatureName", purorderData?.signatureName);
      formData.append("vendorId", purorderData?.vendorId);
      formData.append("purchaseOrderDate", purorderData?.purchaseOrderDate);
      formData.append("dueDate", purorderData?.dueDate);
      formData.append("referenceNo", purorderData?.referenceNo);
      formData.append("_id", id);

      const response = await postData(`/purchase_orders/convert`, formData);
      if (response.code === 200) {
        successToast("Purchase order Converted Successfully");
      }
      return response;
    } catch (error) {
      //
    }
  };

  const clone = async (id) => {
    try {
      const response = await postData(
        `/purchase_orders/purchaseOrders/${id}/clone`,
        {}
      );
      if (response.code === 200) {
        successToast("Purchase order Cloned Successfully");
        setPurchaseOrderList([...purchaseOrderData, response.data]);
        return response;
      }
    } catch (error) {
      //
    }
  };

  return (
    <ListPOContext.Provider
      value={{
        converTopurchase,
        clone,
        RowId,
        setRowId,
        onDelete,
        setShow,
        purchaseOrderData,
        show,
        menu,
        toggleMobileMenu,
        setPurchaseOrderList,
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
    </ListPOContext.Provider>
  );
};

export { ListPOContext, ListpurchaseOrderController };
