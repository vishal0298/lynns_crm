/* eslint-disable react/prop-types */
import React, { createContext, useEffect, useContext, useState } from "react";
import { ApiServiceContext } from "../../core/API/api-service";
import {
  purchase_orders as purchase_orders_api,
  successToast,
} from "../../core/core-index";

const ListPOContext = createContext({});

const ListpurchaseOrderController = (props) => {
  const { getData, postData, patchData } = useContext(ApiServiceContext);
  const { List, Delete, View } = purchase_orders_api;
  const [menu, setMenu] = useState(false);
  const [show, setShow] = useState(false);
  const [RowId, setRowId] = useState("");
  const [debitNoteListdata, setdebitNoteListdata] = useState([]);
  const toggleMobileMenu = () => setMenu(!menu);

  const [filterList, setFilterList] = useState([]);
  const [filterArray, setFilterArray] = useState([]);

  const getpoDetails = async () => {
    try {
      const response = await getData(List);
      if (response.code === 200) {
        setdebitNoteListdata(
          response.data.list.length > 0 ? response.data.list : []
        );
      }
      return response;
    } catch (error) {
      return false;
    }
  };

  const getpoDetail = async (id) => {
    try {
      const viewPodata = await getData(`${View}/${id}`);
      if (viewPodata.code === 200) {
        successToast("Success");
      }
      return viewPodata;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    getpoDetails();
  }, []);

  const onDelete = async (id) => {
    try {
      const response = await patchData(`${Delete}/${id}/softdelete`);
      if (response.code == 200) {
        successToast("Purchase Order Deleted");
        getpoDetails();
      }
    } catch (err) {
      return false;
    }
  };

  const converTopurchase = async (id) => {
    const res = await getpoDetail(id);
    let purorderData = res?.data?.purchaseorder_details;
    let Items = res?.data?.purchaseorder_details?.items;

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

      //

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
      formData.append("referenceNo", purorderData?.referenceNo);
      formData.append("_id", id);

      const response = await postData(`/purchase_orders/convert`, formData);
      if (response.code === 200) {
        successToast("Converted");
      }
      return response;
    } catch (error) {
      return false;
    }
  };

  const clone = async (id) => {
    try {
      const response = await postData(
        `/purchase_orders/purchaseOrders/${id}/clone`,
        {}
      );
      if (response.code === 200) {
        successToast("Request Success");
        setdebitNoteListdata([...debitNoteListdata, response.data]);
      }
      return response;
    } catch (error) {
      return false;
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
        debitNoteListdata,
        show,
        menu,
        toggleMobileMenu,
        setdebitNoteListdata,
        setFilterList,
        filterList,
        filterArray,
        setFilterArray,
      }}
    >
      {props.children}
    </ListPOContext.Provider>
  );
};

export { ListPOContext, ListpurchaseOrderController };
