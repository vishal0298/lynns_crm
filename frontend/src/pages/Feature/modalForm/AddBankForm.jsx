/* eslint-disable react/prop-types */
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useContext } from "react";
import { Modal } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
// import Select from "react-select";
import * as yup from "yup";
import {
  ApiServiceContext,
  BankSettings,
  successToast,
} from "../../../core/core-index";

const AddBankForm = ({
  bankModalDismiss,
  setBankModalDismiss,
  successCallBack,
  setRefer,
}) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        name: yup
          .string()
          .required("Enter Account Holder Name")
          .matches(/^[aA-zZ\s]+$/, "Only Alphabets Are Allowed For This Field"),
        bankName: yup
          .string()
          .required("Enter Bank Name")
          .matches(
            /^[aA-zZ\s]+$/,
            "Only Alphabets Are Allowed For This Field "
          ),
        branch: yup
          .string()
          .required("Enter Branch Name")
          .matches(
            /^[aA-zZ\s]+$/,
            "Only Alphabets Are Allowed For This Field "
          ),
        accountNumber: yup
          .number()
          .test(
            (value) =>
              typeof value === "number" && !/[eE+-]/.test(value.toString())
          )
          .typeError("Enter Valid Account Number"),
        IFSCCode: yup.string().required("Enter IFSC Code"),
      })
    ),
  });
  const { postData } = useContext(ApiServiceContext);

  const addBankSettingsForm = async (data) => {
    setBankModalDismiss(false);
    const formData = {};
    formData.name = data.name;
    formData.bankName = data.bankName;
    formData.branch = data.branch;
    formData.accountNumber = data.accountNumber;
    formData.IFSCCode = data.IFSCCode;
    try {
      const response = await postData(BankSettings?.Add, formData);
      if (response.code === 200) {
        successToast("Bank addedSuccessfully");
        setRefer(true);
        successCallBack();
        setBankModalDismiss(false);
      }
      return response;
    } catch (error) {
      return false;
    }
  };
  return (
    <Modal show={bankModalDismiss}>
      <form onSubmit={handleSubmit(addBankSettingsForm)}>
        <div className="modal-content">
          <div className="modal-header border-0 pb-0">
            <div className="form-header modal-header-title text-start mb-0">
              <h4 className="mb-0">Add Bank Details</h4>
            </div>
            <button
              type="button"
              className="close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => setBankModalDismiss(false)}
            >
              <span className="align-center" aria-hidden="true">
                ×
              </span>
            </button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-lg-12 col-md-12">
                <div className="form-group input_text">
                  <label>
                    Bank Name <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="bankName"
                    type="text"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <input
                        className={`form-control ${
                          errors?.bankName ? "error-input" : ""
                        }`}
                        type="text"
                        value={value}
                        onChange={onChange}
                        placeholder="Enter Bank Name"
                        autoComplete="false"
                      />
                    )}
                    defaultValue=""
                  />
                  <small>{errors?.bankName?.message}</small>
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="form-group input_text">
                  <label>
                    Account Number <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="accountNumber"
                    type="number"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <input
                        className={`form-control ${
                          errors?.accountNumber ? "error-input" : ""
                        }`}
                        type="number"
                        value={value}
                        onChange={onChange}
                        placeholder="Enter Account Number"
                        autoComplete="false"
                      />
                    )}
                    defaultValue=""
                  />
                  <small>{errors?.accountNumber?.message}</small>
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="form-group input_text">
                  <label>
                    Account Holder Name <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="name"
                    type="text"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <input
                        className={`form-control ${
                          errors?.name ? "error-input" : ""
                        }`}
                        type="text"
                        value={value}
                        onChange={onChange}
                        placeholder="Enter Account Holder Name"
                        autoComplete="false"
                      />
                    )}
                    defaultValue=""
                  />
                  <small>{errors?.name?.message}</small>
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="form-group input_text">
                  <label>
                    Branch Name <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="branch"
                    type="text"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <input
                        className={`form-control ${
                          errors?.branch ? "error-input" : ""
                        }`}
                        type="text"
                        value={value}
                        onChange={onChange}
                        placeholder="Enter branch Name"
                        autoComplete="false"
                      />
                    )}
                    defaultValue=""
                  />
                  <small>{errors?.branch?.message}</small>
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="form-group input_text mb-0">
                  <label>
                    IFSC Code <span className="text-danger">*</span>
                  </label>
                  <Controller
                    name="IFSCCode"
                    type="text"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <input
                        className={`form-control ${
                          errors?.IFSCCode ? "error-input" : ""
                        }`}
                        type="text"
                        value={value}
                        onChange={onChange}
                        placeholder="Enter IFSC Code"
                        autoComplete="false"
                      />
                    )}
                    defaultValue=""
                  />
                  <small>{errors?.IFSCCode?.message}</small>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <Link
              to="#"
              //   ref={addbankCancelModal}
              data-bs-dismiss="modal"
              className="btn btn-primary paid-cancel-btn me-2"
              onClick={() => setBankModalDismiss(false)}
            >
              Cancel
            </Link>
            <button
              className="btn btn-primary paid-continue-btn"
              type="submit"
              data-bs-dismiss="modal"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddBankForm;
