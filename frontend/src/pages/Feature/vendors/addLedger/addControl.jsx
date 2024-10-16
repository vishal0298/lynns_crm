
import React, { createContext, useContext, useEffect, useState } from "react";
import * as yup from "yup";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import {
  addLedger,
  deletedLedger,
  errorToast,
  getLedger,
  successToast,
  updateLedger,
  viewLedger,
} from "../../../../core/core-index";
import { ApiServiceContext } from "../../../../core/API/api-service";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import moment from "moment";


const schema = yup.object().shape({
  name: yup.string().required("Enter Name"),
  amount: yup.string().required("Enter Amount"),
  mode: yup.string().required("Choose Any Mode"),
  reference: yup
    .number(" Reference Number must be a number")
    .typeError(" Enter Reference Number ")
    .positive("Reference must be a positive number")
    .required("Enter Reference Number")
    .integer("Reference must be a integer"),
});

const AddLedgerContext = createContext({
  schema: schema,
  onSubmit: async () => {},
  getUnitsEditDetails: async () => {},
  onDelete: async () => {},
  invalidSubmit: () => {},
  getListApi: async () => {},
  onSubmitEdit: async () => {},
});

const AddLedgerComponentController = (props) => {
  const { setValue, reset } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const { postData, getData, putData, patchData } =
    useContext(ApiServiceContext);
  const [startDate, setStartDate] = useState(new Date());
  const [radio1, setRadio1] = useState(false);
  const [radio2, setRadio2] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const navigate = useNavigate();
  const [source, setSource] = useState();
  const [ledgerEdit, setLedgerEdit] = useState({});
  const [modalDisable, setModalDisable] = useState(true);
  const { id } = useParams();

  const onSubmit = async (data) => {
    const obj = {
      name: data?.name,
      date: moment(startDate).format("YYYY-MM-DD"),
      reference: data?.reference,
      amount: data?.amount,
      mode: data?.mode,
      vendorId: id,
    };

    try {
      const response = await postData(addLedger, obj);
      if (response.code == 200) {
        successToast("Ledger Added Successfully");
        getListApi();
        reset();
        setRadio1(false);
        setRadio2(false);
      }else{
        errorToast(response?.data?.message)
      }
    } catch {
      /* empty */
    }
  };

  const [page, setPage] = useState(1);
  const [pagesize, setPagesize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const handlePagination = async (page, pageSize) => {
    setPage(page);
    setPagesize(pageSize);
    getListApi(page, pageSize);
  };

  const getListApi = async (currentpage = 1, currentpagesize = 10) => {
    try {
      let skipSize;
      skipSize = currentpage == 1 ? 0 : (currentpage - 1) * currentpagesize;

      const response = await getData(
        `${getLedger}?limit=${currentpagesize}&skip=${skipSize}&vendorId=${id}`
      );

      if (response) {
        setSource(response?.data?.ledgers);
        setLedgerEdit({});
        setTotalCount(response?.totalRecords);
      }
    } catch {
      /* empty */
    }
  };
  // useEffect(() => {
  //   getListApi();
  // }, []);

  useEffect(() => {
    getListApi();
    let elements = Array.from(
      document.getElementsByClassName("react-datepicker-wrapper")
    );
    elements.map((element) => element.classList.add("w-100"));
  }, []);


  const getUnitsEditDetails = async (id) => {
    const url = `${viewLedger}/${id}`;

    try {
      const response = await getData(url);

      if (response?.data?.ledger_details) {
        setLedgerEdit(response?.data?.ledger_details);
      }
    } catch {
      /* empty */
    }
  };

  useEffect(() => {
    setValue("name", ledgerEdit?.name);
    setValue("date", ledgerEdit?.date);
    setValue("reference", ledgerEdit?.reference);
    setValue("mode", ledgerEdit?.mode);
  }, [ledgerEdit]);

  const onSubmitEdit = async (data) => {
    const url = `${updateLedger}/${ledgerEdit?._id}`;

    const obj = {
      name: data?.name,
      date: moment(startDate).format("YYYY-MM-DD"),
      reference: data?.reference,
      mode: data?.mode,
    };
    try {
      const response = await putData(
        url,
        data
      );
      if (response) {
        successToast("Ledger edited successfully");
        getListApi();
        navigate("/add-ledger");
      }
    } catch {
      /* empty */
    }
  };

  const onDelete = async (id) => {
    const url = `${deletedLedger}/${deleteId}/softDelete`;

    const obj = {
      _id: deleteId,
    };

    try {
      const response = await patchData(url, obj);

      if (response) {
        handlePagination(1, 10);
        getListApi();
        successToast("Ledger Delete successfully");
        navigate("/add-ledger");
      }
    } catch {
      /* empty */
    }
  };

  const invalidSubmit = (data) => {};

  return (
    <AddLedgerContext.Provider
      value={{
        onDelete,
        invalidSubmit,
        onSubmitEdit,
        getUnitsEditDetails,
        navigate,
        radio2,
        setRadio2,
        radio1,
        setRadio1,
        onSubmit,
        setStartDate,
        setLedgerEdit,
        schema,
        source,
        startDate,
        deleteId,
        ledgerEdit,
        setDeleteId,
        setModalDisable,
        modalDisable,
        handlePagination,
        page,
        pagesize,
        totalCount,
        setTotalCount,
        setSource,
      }}
    >
      {props.children}
    </AddLedgerContext.Provider>
  );
};
export { AddLedgerContext, AddLedgerComponentController };
