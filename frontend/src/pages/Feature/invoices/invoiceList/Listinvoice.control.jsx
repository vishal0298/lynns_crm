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
import { sortbyINVnumberDESC } from "../../../../common/helper";
import { userRolesCheck } from "../../../../common/commonMethods";
import dayjs from "dayjs";

const addpaymentschema = yup
  .object({
    amount: yup.string().required("Enter the amount"),
    payment_method: yup
      .object()
      .shape({ value: yup.string().required("Choose the payment method") })
      .typeError("Choose the payment method"),
  })
  .required();

const ListinvoiceContext = createContext({
  addpaymentschema: addpaymentschema,
});

const ListinvoiceComponentController = (props) => {
  const { getData, putData, postData } = useContext(ApiServiceContext);
  const [menu, setMenu] = useState(false);
  const [show, setShow] = useState(false);
  const [RowId, setRowId] = useState("");
  const [convertData, setconvertData] = useState({ id: "", status: "" });
  const [invoicelistData, setInvoiceListData] = useState([]);
  const toggleMobileMenu = () => setMenu(!menu);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [activeTab, setActiveTab] = useState("ALL");

  // const [fromDate, setfromDate] = useState(dayjs());
  const [fromDate, setfromDate] = useState();
  const [toDate, settoDate] = useState();
  // const [toDate, settoDate] = useState(dayjs());

  const [receivedon, setreceivedon] = useState(new Date());
  const addpaymentcancelModal = useRef(null);

  const [paymentMethodsData, setpaymentMethodsData] = useState([
    { label: "CASH", value: "Cash" },
    { label: "UPI", value: "Upi" },
    { label: "CARD", value: "Card" },
    { label: "MEMBERSHIP", value: "Membership" },
  ]);
  // For Roles and Permissions
  const [permission, setPermission] = useState({});
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    let findModule = userRolesCheck("invoice");
    if (findModule == "admin") {
      setAdmin(true);
    } else {
      setPermission(findModule);
    }
    getinvoiceDetails();
  }, []);
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const getInvoicetabData = async (type) => {
    try {
      setActiveTab(type);
      let url = `${invoice?.Base}`;
      if (type != "ALL") url = `${invoice?.Base}?status=${type}`;

      const response = await getData(url);
      if (response.code === 200) {
        let sortedArray = await sortbyINVnumberDESC(response?.data);
        console.log(sortedArray)
        setInvoiceListData(sortedArray);
        setTotalCount(response?.totalRecords);
      }
      return response;
    } catch (error) {
      return false;
    }
  };

  const [page, setPage] = useState(1);
  const [paidPage, setPaidPage] = useState(1);
  const [paidPagesize, setPaidPagesize] = useState(1);
  const [overduePage, setOverduePage] = useState(1);
  const [overduePagesize, setOverduePagesize] = useState(1);

  const [pagesize, setPagesize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const handlePagination = async (page, pageSize) => {
    setPage(page);
    setPagesize(pageSize);
    getinvoiceDetails(page, pageSize);
  };

  // Function to handle pagination for each section
  const handleSectionPagination = async (page, pageSize, section) => {
    switch (section) {
      case "PAID":
        setPaidPage(page);
        setPaidPagesize(pageSize);
        break;
      case "OVERDUE":
        setOverduePage(page);
        setOverduePagesize(pageSize);
        break;
      default:
        break;
    }

    await getInvoicetabData(activeTab);
  };
  const getinvoiceDetails = async (currentpage = 1, currentpagesize = 10) => {
    try {
      let skipSize;
      skipSize = currentpage == 1 ? 0 : (currentpage - 1) * currentpagesize;
      const response = await getData(
        `${invoice?.Base}?limit=${currentpagesize}&skip=${skipSize}`
      );
      if (response.code === 200) {

        let sortedArray = await sortbyINVnumberDESC(response?.data);
        console.log(sortedArray)
        setInvoiceListData(sortedArray);
        setTotalCount(response?.totalRecords);
      }
      return response;
    } catch (error) {
      return false;
    }
  };

  const onDelete = async (id) => {
    try {
      const response = await postData(productDelapi, { _id: id });
      if (response.code == 200) {
        successToast("Invoice Deleted Successfully");
        getinvoiceDetails();
      }
    } catch (err) {
      return false;
    }
  };

  const clone = async (id) => {
    try {
      const response = await postData(`/invoice/${id}/clone`, {});
      if (response.code === 200) {
        successToast("Invoice Cloned Successfully");
        let sortedArray = await sortbyINVnumberDESC([
          ...invoicelistData,
          response.data,
        ]);
        console.log(sortedArray)
        setInvoiceListData(sortedArray);
        return response;
      }
    } catch (error) {
      return false;
    }
  };

  const convertTosalesReturn = async (id, type) => {
    try {
      const response = await postData(`/invoice/${id}/convertsalesreturn`, {});
      if (response.code === 200) {
        successToast("Invoice converted to sales return.");
        getInvoicetabData(type);
      }
      return response;
    } catch (error) {
      return false;
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
      return false;
    }
  };

  const sendpaymentLink = async (id) => {
    try {
      const response = await getData(
        `/unauthorized/sentPaymentLinks?invoiceId=${id}`
      );
      if (response.code === 200) {
        successToast("Payment-Link sent to Mail");
        getinvoiceDetails();
      }
      return response;
    } catch (error) {
      return false;
    }
  };

  const requringStatus = async (id) => {
    try {
      const response = await putData(`/invoice/recurringUpdate/${id}`, {});
      if (response.code === 200) {
        successToast("Requrring status Updated");
      }
      return response;
    } catch (error) {
      return false;
    }
  };

  const addpaymentsForm = async (data) => {
    addpaymentcancelModal.current.click();
    let received_on =
      data?.received_on == undefined ? new Date() : data?.received_on;
    const formData = {};
    formData.amount = Number(data?.amount).toFixed(2);
    formData.payment_method = data?.payment_method?.value;
    formData.received_on = format(received_on, "dd/MM/yyyy");
    formData.invoiceId = data?.invoiceId;
    formData.notes = data?.notes;
    try {
      const response = await postData("/payment/addPayment", formData);
      if (response.code === 200) {
        successToast("Payment Added Successfully");
        getinvoiceDetails();
      }
      return response;
    } catch (error) {
      return false;
    }
  };

  // useEffect(() => {
  //   getinvoiceDetails();
  // }, []);

  return (
    <ListinvoiceContext.Provider
      value={{
        onDelete,
        setShow,
        invoicelistData,
        show,
        menu,
        toggleMobileMenu,
        RowId,
        setRowId,
        convertData,
        setconvertData,
        convertTosalesReturn,
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
        admin,
        permission,
        setInvoiceListData,
        handlePagination,
        page,
        pagesize,
        totalCount,
        setTotalCount,
        setPage,
        sendpaymentLink,
        handleSectionPagination,
      }}
    >
      {props.children}
    </ListinvoiceContext.Provider>
  );
};

export { ListinvoiceContext, ListinvoiceComponentController };
