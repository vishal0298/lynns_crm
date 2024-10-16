/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, {
  createContext,
  useRef,
  useEffect,
  useContext,
  useState,
} from "react";
import { ApiServiceContext } from "../../../../core/API/api-service";
import { invoice, successToast } from "../../../../core/core-index";
import { format } from "date-fns";
import * as yup from "yup";

const addpaymentschema = yup
  .object({
    amount: yup.string().required("Enter the amount"),
    payment_method: yup.object().shape({
      id: yup.string().required("Choose the payment method"),
    }),
  })
  .required();

const ListrqinvoiceContext = createContext({
  addpaymentschema: addpaymentschema,
});

const ListrqinvoiceComponentController = (props) => {
  const { getData, postData, putData } = useContext(ApiServiceContext);
  const [menu, setMenu] = useState(false);
  const [show, setShow] = useState(false);
  const [RowId, setRowId] = useState("");
  const [invoicelistData, setInvoiceListData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [activeTab, setActiveTab] = useState("RECURRING");
  const [fromDate, setfromDate] = useState("");
  const [toDate, settoDate] = useState("");
  const [receivedon, setreceivedon] = useState(new Date());
  const addpaymentcancelModal = useRef(null);
  const [paymentMethodsData, setpaymentMethodsData] = useState([
    { id: "Cash", text: "Cash" },
  ]);

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const getInvoicetabData = async (type) => {
    try {
      let url = `${invoice?.Base}`;
      if (type != "ALL") url = `${invoice?.Base}?status=RECURRING`;

      const response = await getData(url);
      if (response.code === 200) {
        setInvoiceListData(response?.data);
      }
      return response;
    } catch (error) {
      //
    }
  };

  const [page, setPage] = useState(1);
  const [pagesize, setPagesize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const handlePagination = async (page, pageSize) => {
    setPage(page);
    setPagesize(pageSize);
    getinvoiceDetails(page, pageSize);
  };

  const getinvoiceDetails = async (currentpage = 1, currentpagesize = 10) => {
    try {
      let skipSize;
      skipSize = currentpage == 1 ? 0 : (currentpage - 1) * currentpagesize;
      const response = await getData(
        `${invoice?.Base}?status=RECURRING&limit=${currentpagesize}&skip=${skipSize}`
      );
      if (response.code === 200) {
        setInvoiceListData(response?.data?.length > 0 ? response?.data : []);
        setTotalCount(response?.totalRecords);
      }
      return response;
    } catch (error) {
      //
    }
  };

  const onDelete = async (id) => {
    try {
      const response = await postData(productDelapi, { _id: id });
      if (response.code == 200) {
        successToast("Item Deleted");
        getinvoiceDetails();
      }
    } catch (err) {
      //
    }
  };

  const clone = async (id) => {
    try {
      const response = await postData(`/invoice/${id}/clone`, {});
      if (response.code === 200) {
        successToast("Request Success");
        setInvoiceListData([...invoicelistData, response.data]);
      }
      return response;
    } catch (error) {
      //
    }
  };

  const convertTosalesReturn = async (id) => {
    try {
      const response = await postData(`/invoice/${id}/convertsalesreturn`, {});
      if (response.code === 200) {
        successToast("Request Success");
      }
      return response;
    } catch (error) {
      //
    }
  };

  const send = async (id) => {
    try {
      const response = await getData(`/invoice/pdfCreate?invoiceId=${id}`);
      if (response.code === 200) {
        successToast("Invoice Mail sent Success");
      }
      return response;
    } catch (error) {
      //
    }
  };

  const requringStatus = async (id) => {
    try {
      const response = await putData(`/invoice/recurringUpdate/${id}`, {});
      if (response.code === 200) {
        successToast("Requrring status Updated");
        getinvoiceDetails();
      }
      return response;
    } catch (error) {
      //
    }
  };

  const addpaymentsForm = async (data) => {
    addpaymentcancelModal.current.click();
    let received_on =
      data?.received_on == undefined ? new Date() : data?.received_on;
    const formData = {};
    formData.amount = data?.amount;
    formData.payment_method = data?.payment_method?.id;
    formData.received_on = format(received_on, "dd/MM/yyyy");
    formData.invoiceId = data?.invoiceId;
    formData.notes = data?.notes;
    try {
      const response = await postData("/payment/addPayment", formData);
      if (response.code === 200) {
        successToast("Payment addedSuccessfully");
        getinvoiceDetails();
      }
      return response;
    } catch (error) {
      /* empty */
    }
  };

  useEffect(() => {
    setInvoiceListData(invoicelistData?.length > 0 && invoicelistData);
  }, [invoicelistData]);

  return (
    <ListrqinvoiceContext.Provider
      value={{
        onDelete,
        setShow,
        invoicelistData,
        show,
        menu,
        RowId,
        setRowId,
        convertTosalesReturn,
        rowSelection,
        onSelectChange,
        selectedRowKeys,
        getInvoicetabData,
        activeTab,
        clone,
        send,
        requringStatus,
        receivedon,
        setreceivedon,
        paymentMethodsData,
        addpaymentsForm,
        addpaymentcancelModal,
        addpaymentschema,
        fromDate,
        toDate,
        setfromDate,
        settoDate,
        setInvoiceListData,
        handlePagination,
        page,
        pagesize,
        totalCount,
        setTotalCount,
      }}
    >
      {props.children}
    </ListrqinvoiceContext.Provider>
  );
};

export { ListrqinvoiceContext, ListrqinvoiceComponentController };
