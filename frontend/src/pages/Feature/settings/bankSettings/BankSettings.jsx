import React, { useContext, useEffect, useState } from "react";
import { BankSettingsContext } from "./BankSettings.control";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FeatherIcon from "feather-icons-react";
import { Table } from "antd";
import {
  itemRender,
  onShowSizeChange,
} from "../../../../common/paginationfunction";
import SettingSidebar from "../settingSidebar";
import {
  handleCharacterRestrictionSpace,
  handleNumberRestriction,
  handleSpecialCharacterRestriction,
} from "../../../../constans/globals";

const BankComponent = () => {
  const [primaryId, setprimaryId] = useState("");
  const {
    BankSettingschema,
    EditBankSettingschema,
    EditbankCancelModal,
    addbankCancelModal,
    ViewcancelModal,
    BankSettings,
    addBankSettingsForm,
    onDelete,
    permission,
    admin,
    updateBankSettingsForm,
  } = useContext(BankSettingsContext);

  const {
    handleSubmit,
    control,
    reset,
    formState,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(BankSettingschema),
    defaultValues: {
      name: "",
      bankName: "",
      branch: "",
      accountNumber: "",
      IFSCCode: "",
    },
  });
  const { create } = permission;
  const handleCancel = () => {
    reset({ ...BankSettings });
  };

  const edit_handleCancel = () => {
    editreset({
      edit_name: ReadBankSettingsData?.name,
      edit_bankName: ReadBankSettingsData?.bankName,
      edit_branch: ReadBankSettingsData?.branch,
      edit_accountNumber: ReadBankSettingsData?.accountNumber,
      edit_IFSCCode: ReadBankSettingsData?.IFSCCode,
    });
  };

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset({ ...BankSettings });
    }
  }, [formState, BankSettings, reset]);

  //edit
  const [ReadBankSettingsData, setReadBankSettingsData] = useState([]);

  const {
    handleSubmit: handleSubmitEdit,
    control: EditSubmit,
    reset: editreset,
    setValue,
    formState: { errors: EditSubmits },
  } = useForm({ resolver: yupResolver(EditBankSettingschema) });

  const editBank = (_id) => {
    edit_handleCancel();
    const readData = BankSettings.find((BankInfo) => BankInfo._id == _id);
    setReadBankSettingsData(readData);
  };

  useEffect(() => {
    setValue("edit_bankName", ReadBankSettingsData?.bankName);
    setValue("edit_name", ReadBankSettingsData?.name);
    setValue("edit_branch", ReadBankSettingsData?.branch);
    setValue("edit_accountNumber", ReadBankSettingsData?.accountNumber);
    setValue("edit_IFSCCode", ReadBankSettingsData?.IFSCCode);
    setValue("edit_id", ReadBankSettingsData?._id);
  }, [ReadBankSettingsData]);

  const columns = [
    {
      title: "#",
      dataIndex: "Id",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Bank Name",
      dataIndex: "bankName",
    },
    {
      title: "Branch",
      dataIndex: "branch",
    },
    {
      title: "Account Number",
      dataIndex: "accountNumber",
    },
    {
      title: "IFSC Code",
      dataIndex: "IFSCCode",
    },
    {
      title: "Action",
      render: (record) => (
        <>
          <div className="d-flex align-items-center">
            <div className="dropdown dropdown-action">
              <Link
                to="#"
                className=" btn-action-icon "
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fas fa-ellipsis-v" />
              </Link>
              <div className="dropdown-menu dropdown-menu-end">
                <ul>
                  <li>
                    <Link
                      className="dropdown-item"
                      to="#"
                      onClick={() => editBank(record?._id)}
                      data-bs-toggle="modal"
                      data-bs-target="#edit_bank_details"
                    >
                      <FeatherIcon icon="edit" className="me-2" />
                      Edit
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to="#"
                      data-bs-toggle="modal"
                      data-bs-target="#delete_modal"
                      onClick={() => setprimaryId(record?._id)}
                    >
                      <FeatherIcon icon="trash-2" className="me-2" /> Delete
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to="#"
                      onClick={() => editBank(record?._id)}
                      data-bs-toggle="modal"
                      data-bs-target="#view_bank_details"
                    >
                      <FeatherIcon icon="eye" className="me-2" />
                      View
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </>
      ),
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          {/* Page Header */}
          {/* /Page Header */}
          <div className="row">
            <div className="col-xl-3 col-md-4">
              <div className="card">
                <div className="card-body">
                  <div className="page-header">
                    <div className="content-page-header">
                      <h5>Settings</h5>
                    </div>
                  </div>
                  {/* Settings Menu */}
                  <SettingSidebar />
                  {/* /Settings Menu */}
                </div>
              </div>
            </div>
            <div className="col-xl-9 col-md-8">
              <div className="card">
                <div className="card-body w-100">
                  <div className="content-page-header p-0">
                    <h5>Bank Accounts</h5>
                    {(create || admin) && (
                      <div className="list-btn">
                        <Link
                          to="#"
                          onClick={handleCancel}
                          className="btn btn-primary"
                          data-bs-toggle="modal"
                          data-bs-target="#bank_details"
                        >
                          <i
                            className="fa fa-plus-circle me-2"
                            aria-hidden="true"
                          />
                          Add Bank
                        </Link>
                      </div>
                    )}
                  </div>
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="card-table">
                        <div className="card-body purchase settings">
                          <div className="table-responsive no-pagination">
                            <Table
                              rowKey={(record) => record?._id}
                              pagination={{
                                total: BankSettings.length,
                                showTotal: (total, range) =>
                                  `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                                showSizeChanger: true,
                                onShowSizeChange: onShowSizeChange,
                                itemRender: itemRender,
                              }}
                              columns={columns}
                              dataSource={BankSettings}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <>
        <div
          className="modal custom-modal fade"
          id="delete_modal"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-body">
                <div className="form-header">
                  <h3>Delete Account Details</h3>
                  <p>Are you sure want to delete?</p>
                </div>
                <div className="modal-btn delete-action">
                  <div className="row">
                    <div className="col-6">
                      <button
                        onClick={() => onDelete(primaryId)}
                        type="reset"
                        data-bs-dismiss="modal"
                        className="w-100 btn btn-primary paid-continue-btn"
                      >
                        Delete
                      </button>
                    </div>
                    <div className="col-6">
                      <button
                        type="submit"
                        data-bs-dismiss="modal"
                        className="w-100 btn btn-primary paid-cancel-btn"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Delete Items Modal */}
        {/* Add Bank Details Modal */}
        <div
          className="modal custom-modal fade"
          id="bank_details"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <form onSubmit={handleSubmit(addBankSettingsForm)}>
              <div className="modal-content">
                <div className="modal-header border-0 pb-0">
                  <div className="form-header modal-header-title text-start mb-0">
                    <h4 className="mb-0">Add Bank Details</h4>
                  </div>
                  <button
                    onClick={handleCancel}
                    type="button"
                    className="close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
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
                              // maxLength={16}
                              value={value}
                              onChange={onChange}
                              onKeyPress={handleCharacterRestrictionSpace}
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
                          type="text"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <input
                              className={`form-control ${
                                errors?.accountNumber ? "error-input" : ""
                              }`}
                              type="text"
                              maxLength={16}
                              onKeyPress={handleNumberRestriction}
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
                          Account Holder Name{" "}
                          <span className="text-danger">*</span>
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
                              // maxLength={16}
                              value={value}
                              onChange={onChange}
                              onKeyPress={handleCharacterRestrictionSpace}
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
                              // maxLength={16}
                              value={value}
                              onChange={onChange}
                              onKeyPress={handleSpecialCharacterRestriction}
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
                              maxLength={16}
                              value={value}
                              onKeyPress={handleSpecialCharacterRestriction}
                              onChange={onChange}
                              placeholder="Enter the IFSC Code"
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
                    ref={addbankCancelModal}
                    onClick={handleCancel}
                    data-bs-dismiss="modal"
                    className="btn btn-primary paid-cancel-btn me-2"
                  >
                    Cancel
                  </Link>
                  <button
                    className="btn btn-primary paid-continue-btn"
                    type="submit"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        {/* Edit Bank Details Modal */}
        <div
          className="modal custom-modal fade"
          id="edit_bank_details"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <form onSubmit={handleSubmitEdit(updateBankSettingsForm)}>
              <div className="modal-content">
                <div className="modal-header border-0 pb-0">
                  <div className="form-header modal-header-title text-start mb-0">
                    <h4 className="mb-0">Edit Bank Details</h4>
                  </div>
                  <button
                    onClick={edit_handleCancel}
                    type="button"
                    className="close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
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
                          name="edit_id"
                          type="hidden"
                          control={EditSubmit}
                          render={({ field: { value } }) => (
                            <input type="hidden" value={value} />
                          )}
                          defaultValue=""
                        />
                        <Controller
                          name="edit_bankName"
                          type="text"
                          control={EditSubmit}
                          render={({ field: { value, onChange } }) => (
                            <input
                              className={`form-control ${
                                EditSubmits?.edit_bankName ? "error-input" : ""
                              }`}
                              type="text"
                              value={value}
                              onChange={onChange}
                              onKeyPress={handleCharacterRestrictionSpace}
                              placeholder="Enter Bank Name"
                              autoComplete="false"
                            />
                          )}
                          defaultValue=""
                        />
                        <small>{EditSubmits?.edit_bankName?.message}</small>
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12">
                      <div className="form-group input_text">
                        <label>
                          Account Number <span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="edit_accountNumber"
                          type="text"
                          control={EditSubmit}
                          render={({ field: { value, onChange } }) => (
                            <input
                              className={`form-control ${
                                EditSubmits?.edit_accountNumber
                                  ? "error-input"
                                  : ""
                              }`}
                              type="text"
                              value={value}
                              onChange={onChange}
                              onKeyPress={handleNumberRestriction}
                              placeholder="Enter Account Number"
                              autoComplete="false"
                            />
                          )}
                          defaultValue=""
                        />
                        <small>
                          {EditSubmits?.edit_accountNumber?.message}
                        </small>
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12">
                      <div className="form-group input_text">
                        <label>
                          Account Holder Name{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="edit_name"
                          type="text"
                          control={EditSubmit}
                          render={({ field: { value, onChange } }) => (
                            <input
                              className={`form-control ${
                                EditSubmits?.edit_name ? "error-input" : ""
                              }`}
                              type="text"
                              value={value}
                              onChange={onChange}
                              onKeyPress={handleCharacterRestrictionSpace}
                              placeholder="Enter Account Holder Name"
                              autoComplete="false"
                            />
                          )}
                          defaultValue=""
                        />
                        <small>{EditSubmits?.edit_name?.message}</small>
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12">
                      <div className="form-group input_text">
                        <label>
                          Branch Name <span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="edit_branch"
                          type="text"
                          control={EditSubmit}
                          render={({ field: { value, onChange } }) => (
                            <input
                              className={`form-control ${
                                EditSubmits?.edit_branch ? "error-input" : ""
                              }`}
                              type="text"
                              value={value}
                              onChange={onChange}
                              onKeyPress={handleCharacterRestrictionSpace}
                              placeholder="Enter branch Name"
                              autoComplete="false"
                            />
                          )}
                          defaultValue=""
                        />
                        <small>{EditSubmits?.edit_branch?.message}</small>
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12">
                      <div className="form-group input_text mb-0">
                        <label>
                          IFSC Code <span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="edit_IFSCCode"
                          type="text"
                          control={EditSubmit}
                          render={({ field: { value, onChange } }) => (
                            <input
                              className={`form-control ${
                                EditSubmits?.edit_IFSCCode ? "error-input" : ""
                              }`}
                              type="text"
                              value={value}
                              onChange={onChange}
                              onKeyPress={handleSpecialCharacterRestriction}
                              placeholder="Enter the IFSC Code"
                              autoComplete="false"
                            />
                          )}
                          defaultValue=""
                        />
                        <small>{EditSubmits?.edit_IFSCCode?.message}</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <Link
                    to="#"
                    ref={EditbankCancelModal}
                    onClick={edit_handleCancel}
                    data-bs-dismiss="modal"
                    className="btn btn-primary paid-cancel-btn me-2"
                  >
                    Cancel
                  </Link>
                  <button
                    className="btn btn-primary paid-continue-btn"
                    type="submit"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        {/* Edit Bank Details Modal */}
        <div
          className="modal custom-modal fade"
          id="view_bank_details"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <div className="form-header modal-header-title text-start mb-0">
                  <h4 className="mb-0">View Bank Details</h4>
                </div>
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
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
                        name="edit_bankName"
                        type="text"
                        control={EditSubmit}
                        render={({ field: { value } }) => (
                          <input
                            className={`form-control`}
                            type="text"
                            value={value}
                            readOnly={true}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group input_text">
                      <label>
                        Account Number <span className="text-danger">*</span>
                      </label>
                      <Controller
                        name="edit_accountNumber"
                        type="number"
                        control={EditSubmit}
                        render={({ field: { value } }) => (
                          <input
                            className={`form-control`}
                            type="number"
                            value={value}
                            readOnly={true}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>
                        Account Holder Name{" "}
                        <span className="text-danger">*</span>
                      </label>
                      <Controller
                        name="edit_name"
                        type="text"
                        control={EditSubmit}
                        render={({ field: { value } }) => (
                          <input
                            className={`form-control`}
                            type="text"
                            value={value}
                            readOnly={true}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>
                        Branch Name <span className="text-danger">*</span>
                      </label>
                      <Controller
                        name="edit_branch"
                        type="text"
                        control={EditSubmit}
                        render={({ field: { value } }) => (
                          <input
                            className={`form-control`}
                            type="text"
                            value={value}
                            readOnly={true}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group mb-0">
                      <label>
                        IFSC Code <span className="text-danger">*</span>
                      </label>
                      <Controller
                        name="edit_IFSCCode"
                        type="text"
                        control={EditSubmit}
                        render={({ field: { value } }) => (
                          <input
                            className={`form-control`}
                            type="text"
                            value={value}
                            readOnly={true}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <Link
                  to="#"
                  ref={ViewcancelModal}
                  data-bs-dismiss="modal"
                  className="btn btn-primary paid-cancel-btn me-2"
                >
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    </>
  );
};
export default BankComponent;
