/* eslint-disable react/prop-types */
import React, {
  useRef,
  createContext,
  useEffect,
  useContext,
  useState,
} from "react";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { ApiServiceContext } from "../../../../core/API/api-service";
import { TaxRateAPI, successToast } from "../../../../core/core-index";
import { userRolesCheck } from "../../../../common/commonMethods";

const TaxRatechema = yup
  .object({
    name: yup
      .string()
      .required("Enter Tax Name")
      .matches(/^[A-Za-z ]+$/, "Only alphabets are allowed"),
    taxRate: yup.string().required("Enter Tax Rate"),
  })
  .required();

const EditTaxRatechema = yup
  .object({
    edit_name: yup
      .string()
      .required("Enter Tax Name")
      .matches(/^[A-Za-z ]+$/, "Only Alphabets Are Allowed"),
    edit_taxRate: yup.string().required("Enter Tax Rate"),
  })
  .required();

const TaxRateContext = createContext({
  TaxRatechema: TaxRatechema,
  EditTaxRatechema: EditTaxRatechema,
  addTaxRateForm: () => {},
  updateTaxRateForm: () => {},
});

const TaxRatesComponentController = (props) => {
  const { postData, putData, getData } = useContext(ApiServiceContext);
  const { List, Add, Delete, Upadte } = TaxRateAPI;
  const navigate = useNavigate();
  const [menu, setMenu] = useState(false);
  const [addstatus, setaddstatus] = useState(true);
  const [status, setstatus] = useState(false);
  const toggleMobileMenu = () => setMenu(!menu);
  const [TaxRateData, setTaxRateInfos] = useState([]);
  const taxratecancelModal = useRef(null);
  const EdittaxratecancelModal = useRef(null);

  // eslint-disable-next-line no-unused-vars
  const [types, setypes] = useState([{ id: 1, text: "Percentage" }]);

  // For Roles and Permissions
  const [permission, setPermission] = useState({});
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    getTaxRateeData();
    let findModule = userRolesCheck("taxSettings");
    if (findModule == "admin") {
      setAdmin(true);
    } else {
      setPermission(findModule);
    }
  }, []);
  // For Roles and Permissions

  const getTaxRateeData = async () => {
    try {
      const response = await getData(List);
      if (response.code === 200) {
        setTaxRateInfos(response.data);
      }
      return response;
    } catch (error) {}
  };

  // useEffect(() => {
  //   getTaxRateeData();
  // }, []);

  const addTaxRateForm = async (data) => {
    const formData = {};
    formData.status = data.status;
    formData.name = data.name;
    formData.taxRate = data.taxRate;
    formData.type = "1";
    taxratecancelModal.current.click();
    try {
      const response = await postData(Add, formData);
      if (response.code === 200) {
        successToast("Tax Rate Added Successfully");
        getTaxRateeData();
        navigate("/tax-rates");
      }
      return response;
    } catch (error) {
      /* empty */
    }
  };

  const onDelete = async (id) => {
    try {
      const response = await postData(Delete, { _id: id });
      if (response.code == 200) {
        successToast("Tax Rate Deleted Successfully");
        getTaxRateeData();
      }
    } catch (err) {}
  };

  const updateTaxRateForm = async (data) => {
    let formData = {};
    formData.status = status;
    formData.name = data.edit_name;
    formData.taxRate = data.edit_taxRate;
    formData.type = data.edit_type?.id;
    formData._id = data.edit_id;
    EdittaxratecancelModal.current.click();
    try {
      const response = await putData(`${Upadte}/${data.edit_id}`, formData);
      if (response.code === 200) {
        successToast("Tax Rate Updated Successfully");
        getTaxRateeData();
        navigate("/tax-rates");
      }
      return response;
    } catch (error) {
      //
    }
  };

  return (
    <TaxRateContext.Provider
      value={{
        TaxRatechema,
        EditTaxRatechema,
        updateTaxRateForm,
        types,
        taxratecancelModal,
        EdittaxratecancelModal,
        TaxRateData,
        menu,
        onDelete,
        addTaxRateForm,
        toggleMobileMenu,
        addstatus,
        setaddstatus,
        status,
        setstatus,
        permission,
        admin,
      }}
    >
      {props.children}
    </TaxRateContext.Provider>
  );
};

export { TaxRateContext, TaxRatesComponentController };
