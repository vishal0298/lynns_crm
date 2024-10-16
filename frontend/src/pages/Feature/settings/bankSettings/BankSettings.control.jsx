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
import {
  BankSettings as BankSettingsConst,
  successToast,
} from "../../../../core/core-index";
import { userRolesCheck } from "../../../../common/commonMethods";
import {BankSettingschema} from './AddBankSettingsschema'

const EditBankSettingschema = yup
  .object({
    edit_name: yup
      .string()
      .required("Enter Account Holder Name")
      .min(3, "Account Holder Name Must Be At Least 3 Characters")
      .max(15, "Account Holder Name Must Be At Most 15 Characters")
      .matches(/^[aA-zZ\s]+$/, "Only Alphabets Are Allowed For This Field ")
      .matches(/^[a-zA-Z0-9 ]*$/, "Special Characters Are Not Allowed"),
    edit_bankName: yup
      .string()
      .required("Enter Bank Name")
      .min(3, "Bank Name Must Be At Least 3 Characters")
      .max(15, "Bank Name Must Be At Most 15 Characters")
      .matches(/^[aA-zZ\s]+$/, "Only Alphabets Are Allowed For This Field ")
      .matches(/^[a-zA-Z0-9 ]*$/, "Special Characters Are Not Allowed"),
    edit_branch: yup
      .string()
      .required("Enter Branch Name")
      .min(3, "Branch Name Must Be At Least 3 Characters")
      .max(15, "Branch Name Must Be At Most 15 Characters")
      .matches(/^[aA-zZ\s]+$/, "Only Alphabets Are Allowed For This Field ")
      .matches(/^[a-zA-Z0-9 ]*$/, "Special Characters Are Not Allowed"),
    edit_accountNumber: yup
      .string()
      .typeError("Enter valid Account Number.")
      .min(4, "Account Number Must Be At Least 4 Digits")
      .max(15, "Account Number Must Be At Most 15 Digits")
      .matches(/^\d+$/, "Input Value Must Contain Only Numbers")
      .matches(/^[a-zA-Z0-9]*$/, "Special Characters Are Not Allowed"),
    edit_IFSCCode: yup
      .string()
      .required("Enter IFSC Code")
      .min(4, "IFSC Must Be At Least 4 Characters")
      .max(15, "IFSC Must Be At Most 15 Characters")
      .matches(/^[a-zA-Z0-9]*$/, "Special Characters Are Not Allowed"),
  })
  .required();

const BankSettingsContext = createContext({
  BankSettingschema: BankSettingschema,
  EditBankSettingschema: EditBankSettingschema,
  addBankSettingsForm: () => {},
  updateBankSettingsForm: () => {},
});

const BankSettingsComponentController = (props) => {
  const { postData, getData, putData } = useContext(ApiServiceContext);
  const { List, Add, Delete, Upadte } = BankSettingsConst;
  const [menu, setMenu] = useState(false);
  const navigate = useNavigate();
  const toggleMobileMenu = () => setMenu(!menu);
  const [BankSettings, setBankSettingsInfos] = useState([]);
  const EditbankCancelModal = useRef(null);
  const addbankCancelModal = useRef(null);
  const ViewcancelModal = useRef(null);

  // For Roles and Permissions
  const [permission, setPermission] = useState({});
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    getBankSettingseData();
    let findModule = userRolesCheck("bankSettings");
    if (findModule == "admin") {
      setAdmin(true);
    } else {
      setPermission(findModule);
    }
  }, []);
  // For Roles and Permissions

  const getBankSettingseData = async () => {
    try {
      const response = await getData(List);
      if (response.code === 200) {
        setBankSettingsInfos(response.data);
      }
      return response;
    } catch (error) {
      /* empty */
    }
  };

  // useEffect(() => {
  //   getBankSettingseData();
  // }, []);

  const addBankSettingsForm = async (data) => {
    const formData = {};
    formData.name = data.name;
    formData.bankName = data.bankName;
    formData.branch = data.branch;
    formData.accountNumber = data.accountNumber;
    formData.IFSCCode = data.IFSCCode;
    addbankCancelModal.current.click();
    try {
      const response = await postData(Add, formData);
      if (response.code === 200) {
        successToast("Bank Added Successfully");
        getBankSettingseData();
        navigate("/bank-account");
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
        successToast("Bank Deleted Successfully");
        getBankSettingseData();
      }
    } catch (err) {
      /* empty */
    }
  };

  const updateBankSettingsForm = async (data) => {
    EditbankCancelModal.current.click();
    const formData = {};
    formData.name = data.edit_name;
    formData.bankName = data.edit_bankName;
    formData.branch = data.edit_branch;
    formData.accountNumber = data.edit_accountNumber;
    formData.IFSCCode = data.edit_IFSCCode;
    formData._id = data.edit_id;

    try {
      const response = await putData(`${Upadte}/${data.edit_id}`, formData);
      if (response.code === 200) {
        successToast("Bank updated Successfully");
        getBankSettingseData();
        navigate("/bank-account");
      }
      return response;
    } catch (error) {
      /* empty */
    }
  };

  return (
    <BankSettingsContext.Provider
      value={{
        BankSettingschema,
        EditBankSettingschema,
        EditbankCancelModal,
        addbankCancelModal,
        ViewcancelModal,
        BankSettings,
        menu,
        onDelete,
        addBankSettingsForm,
        updateBankSettingsForm,
        toggleMobileMenu,
        permission,
        admin,
      }}
    >
      {props.children}
    </BankSettingsContext.Provider>
  );
};

export { BankSettingsContext, BankSettingsComponentController };
