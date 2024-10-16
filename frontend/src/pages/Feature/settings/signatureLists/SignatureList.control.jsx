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
import { signatures_api, successToast } from "../../../../core/core-index";
import {Signaturechema} from './signatureListschema'

const EditSignaturechema = yup
  .object({
    edit_signatureName: yup
      .string()
      .required("Enter Account Holder Name")
      .min(3, "Account Holder Name Must Be At Least 3 Characters")
      .max(15, "Account Holder Name Must Be At Most 15 Characters")
      .matches(/^[aA-zZ\s]+$/, "Only Alphabets Are Allowed For This Field ")
      .matches(/^[a-zA-Z0-9 ]*$/, "Special Characters Are Not Allowed"),
  })
  .required();

const SignatureContext = createContext({
  Signaturechema: Signaturechema,
  EditSignaturechema: EditSignaturechema,
  addSignatureForm: () => {},
  updateSignatureForm: () => {},
});

const SignatureComponentController = (props) => {
  const { postData, getData, patchData, putData } =
    useContext(ApiServiceContext);
  const { List, Add, Delete, setdefault, statusUpdate, Upadte } =
    signatures_api;
  const navigate = useNavigate();
  const [signatureData, setSignsInfos] = useState([]);
  const [addstatus, setaddstatus] = useState(true);
  const [editstatus, seteditstatus] = useState(false);
  const [addDefaultstatus, setaddDefaultstatus] = useState(false);
  const [editDefaultstatus, seteditDefaultstatus] = useState(false);
  const EditsignCancelModal = useRef(null);
  const addsignCancelModal = useRef(null);
  const ViewcancelModal = useRef(null);
  const [files, setFile] = useState(null);
  //const { id } = useParams();

  const getSignatureData = async () => {
    try {
      const response = await getData(List);
      if (response.code === 200) {
        setSignsInfos(response.data);
      }
      return response;
    } catch (error) {
      /* empty */
    }
  };

  useEffect(() => {
    getSignatureData();
  }, []);

  const addSignatureForm = async (data) => {
    try {
      addsignCancelModal.current.click();
      const formData = new FormData();
      formData.append("signatureName", data.signatureName);
      formData.append("markAsDefault", addDefaultstatus);
      formData.append("status", addstatus);
      formData.append("signatureImage", data.signatureImage?.[0]);

      const response = await postData(Add, formData);
      if (response.code === 200) {
        successToast("Signature Added Successfully");
        getSignatureData();
        navigate("/signature-lists");
      }
      return response;
    } catch (error) {
      /* empty */
    }
  };

  const onDelete = async (id) => {
    try {
      const response = await patchData(`${Delete}/${id}`);
      if (response.code == 200) {
        successToast("Signature Deleted Successfully");
        getSignatureData();
      }
    } catch (err) {
      /* empty */
    }
  };

  const setDefault = async (id) => {
    try {
      const response = await getData(`${setdefault}?signatureId=${id}`, false);
      if (response.code == 200) {
        successToast("Default Signature updated Successfully");
        getSignatureData();
      }
    } catch (err) {
      /* empty */
    }
  };

  const update_status = async (id, value) => {
    try {
      const response = await putData(`${statusUpdate}/${id}`, {
        status: value,
      });
      if (response.code == 200) {
        successToast("Signature status updated Successfully");
        getSignatureData();
      }
    } catch (err) {
      /* empty */
    }
  };

  const updateSignatureForm = async (data) => {
    try {
      EditsignCancelModal.current.click();
      const formData = new FormData();
      formData.append("signatureName", data.edit_signatureName);
      formData.append("markAsDefault", editDefaultstatus);
      formData.append("status", editstatus);
      formData.append("signatureImage", data.edit_signatureImage[0]);

      const response = await putData(`${Upadte}/${data.edit_id}`, formData);
      if (response.code === 200) {
        successToast("Signature updated Successfully");
        getSignatureData();
        navigate("/signature-lists");
      }
      return response;
    } catch (error) {
      /* empty */
    }
  };

  return (
    <SignatureContext.Provider
      value={{
        Signaturechema,
        EditSignaturechema,
        EditsignCancelModal,
        addsignCancelModal,
        ViewcancelModal,
        signatureData,
        onDelete,
        addSignatureForm,
        updateSignatureForm,
        addstatus,
        setaddstatus,
        editstatus,
        seteditstatus,
        files,
        setFile,
        setDefault,
        addDefaultstatus,
        setaddDefaultstatus,
        editDefaultstatus,
        seteditDefaultstatus,
        update_status,
      }}
    >
      {props.children}
    </SignatureContext.Provider>
  );
};

export { SignatureContext, SignatureComponentController };
