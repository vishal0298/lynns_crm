/* eslint-disable react/prop-types */
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { useParams } from "react-router-dom";
import { ApiServiceContext } from "../../../../core/API/api-service";
import { invoice as invoice_api, successToast } from "../../../../core/core-index";
import { format } from "date-fns";

const ViewinvoiceContext = createContext({});

const ViewinvoiceComponentController = (props) => {
  const { getData, postData } = useContext(ApiServiceContext);
  const { Base } = invoice_api;
  const [menu, setMenu] = useState(false);
  const toggleMobileMenu = () => setMenu(!menu);
  const [dataSource, setDataSource] = useState([]);
  const [invoiceData, setinvoicedata] = useState([]);
  const { id } = useParams();
  const [receivedon, setreceivedon] = useState(new Date());
  const [paymentMethodsData, setpaymentMethodsData] = useState([
    { id: "Cash", text: "Cash" },
  ]);
  const addpaymentcancelModal = useRef(null);

  const getViewDetails = async () => {
    try {
      const viewinvoiceData = await getData(`${Base}/${id}`);
      if (viewinvoiceData.code === 200) {
        setinvoicedata(viewinvoiceData?.data?.invoice_details);
        setDataSource(viewinvoiceData?.data?.invoice_details?.items);
      }
    } catch (error) {
      
    }
  };

  useEffect(() => {
    getViewDetails();
  }, []);

  const addpaymentsForm = async (data) => {
    let received_on =
      data?.received_on == undefined ? new Date() : data?.received_on;

    const formData = {};
    formData.amount = Number(data?.amount).toFixed(2);
    formData.invoiceAmount = data?.invoiceAmount || 0;
    formData.payment_method = data?.payment_method?.id;
    formData.received_on = format(received_on, "dd/MM/yyyy");
    formData.invoiceId = data?.invoiceId;
    formData.notes = data?.notes;
    try {
      const response = await postData("/payment/addPayment", formData);
      if (response.code === 200) {
        addpaymentcancelModal.current.click();
        successToast("Payment addedSuccessfully");
        getViewDetails();
      }
      return response;
    } catch (error) {
      return false;
    }
  };

  return (
    <ViewinvoiceContext.Provider
      value={{
        addpaymentcancelModal,
        dataSource,
        menu,
        toggleMobileMenu,
        invoiceData,
        receivedon,
        setreceivedon,
        paymentMethodsData,
        addpaymentsForm,
        setpaymentMethodsData,
      }}
    >
      {props.children}
    </ViewinvoiceContext.Provider>
  );
};

export { ViewinvoiceContext, ViewinvoiceComponentController };
