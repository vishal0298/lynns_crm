import React, { useContext, useEffect, useState } from "react";
import { SignatureContext } from "./SignatureList.control";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FeatherIcon from "feather-icons-react";
import useFilePreview from "../../hooks/useFilePreview";
import { Table } from "antd";
import {
  itemRender,
  onShowSizeChange,
} from "../../../../common/paginationfunction";
import SettingSidebar from "../settingSidebar";
import { handleCharacterRestrictionSpace } from "../../../../constans/globals";
import { signature } from "../../../../common/imagepath";

const SignatureComponent = () => {
  const [primaryId, setprimaryId] = useState("");
  const {
    Signaturechema,
    EditSignaturechema,
    EditsignCancelModal,
    addsignCancelModal,
    signatureData,
    onDelete,
    addSignatureForm,
    updateSignatureForm,
    addstatus,
    setaddstatus,
    seteditstatus,
    files,
    setFile,
    setDefault,
    addDefaultstatus,
    setaddDefaultstatus,
    seteditDefaultstatus,
    update_status,
  } = useContext(SignatureContext);

  const {
    handleSubmit,
    control,
    reset,
    watch,
    register,
    formState,
    trigger: addtrigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(Signaturechema),
  });

  const {
    handleSubmit: handleSubmitEdit,
    control: EditSubmit,
    reset: editreset,
    setValue,
    trigger,
    watch: editwatch,
    register: editRegister,
    formState: { errors: EditSubmits },
  } = useForm({ resolver: yupResolver(EditSignaturechema) });

  const [imgerror, setImgError] = useState("");
  const file = watch("signatureImage");
  const [filePreview, setfilePreview] = useFilePreview(file, setImgError);

  const [editimgerror, setEditImgError] = useState("");
  const editfile = editwatch("edit_signatureImage");
  const [editfilePreview] = useFilePreview(editfile, setEditImgError);

  useEffect(() => {
    if (editfilePreview) setFile(editfilePreview);
  }, [editfilePreview]);

  const handleCancel = () => {
    reset({ ...signatureData });
    setfilePreview(null);
    setaddstatus(true);
    setaddDefaultstatus(false);
  };

  const edit_handleCancel = () => {
    editreset({
      edit_signatureName: ReadSignatureData?.signatureName,
    });
    seteditstatus(
      ReadSignatureData?.status ? ReadSignatureData?.status : false
    );
    seteditDefaultstatus(
      ReadSignatureData?.markAsDefault
        ? ReadSignatureData?.markAsDefault
        : false
    );
    setFile(ReadSignatureData?.signatureImage);
  };

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset({ ...signatureData });
    }
  }, [formState, signatureData, reset]);

  //edit
  const [ReadSignatureData, setReadSignatureData] = useState([]);

  const editSignature = (_id) => {
    edit_handleCancel();
    const readData = signatureData.find((signInfo) => signInfo._id == _id);
    setValue("edit_id", _id);
    setReadSignatureData(readData);
  };

  useEffect(() => {
    setValue("edit_id", ReadSignatureData?._id);
    setValue("edit_signatureName", ReadSignatureData?.signatureName);
    seteditstatus(
      ReadSignatureData?.status ? ReadSignatureData?.status : false
    );
    setValue("edit_status", ReadSignatureData?.status);
    seteditDefaultstatus(
      ReadSignatureData?.markAsDefault
        ? ReadSignatureData?.markAsDefault
        : false
    );
    setValue("edit_makeDefault", ReadSignatureData?.markAsDefault);
    setFile(ReadSignatureData?.signatureImage);
  }, [ReadSignatureData]);

  const columns = [
    {
      title: "S.NO",
      dataIndex: "Id",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Signature Name",
      dataIndex: "signatureName",
    },
    {
      title: "Signature",
      dataIndex: "branch",
      render: (text, record) => (
        <h2 className="table-avatar">
          <img
            className="img-fluid"
            width={80}
            height={30}
            src={record?.signatureImage ? record?.signatureImage : signature}
            alt="Sign"
          />
        </h2>
      ),
    },
    {
      title: "Status",
      dataIndex: "accountNumber",
      render: (text, record, index) => (
        <div className="status-toggle">
         
          <Controller
            name="statuslist"
            control={control}
            render={({ field: { value, onChange } }) => (
              <>
                <input
                  id={`status${index}`}
                  className="check"
                  type="checkbox"
                  checked={record?.status ? record?.status : ""}
                  value={value ? value : ""}
                  onChange={(val) => {
                    onChange(val);
                    update_status(record?._id, !record?.status);
                  }}
                />
              </>
            )}
            defaultValue=""
          />
          <label htmlFor={`status${index}`} className="checktoggle checkbox-bg">
            checkbox
          </label>
        </div>
      ),
    },
    {
      title: "Action",
      render: (text, record) => (
        <div className="d-flex align-items-center">
          <Link
            style={
              record?.markAsDefault
                ? { background: "#e3271e", color: "#ffffff" }
                : {}
            }
            className={`btn-action-icon me-2`}
            to="#"
            onClick={() => setDefault(record._id)}
            data-bs-toggle="tooltip"
            title="Make as default"
            data-bs-placement="left"
          >
            <i className="fe fe-star">
              <FeatherIcon icon="star" />
            </i>
          </Link>
          <Link
            className=" btn-action-icon me-2"
            to="#"
            onClick={() => editSignature(record._id)}
            data-bs-toggle="modal"
            data-bs-target="#edit_modal"
          >
            <i className="fe fe-edit">
              <FeatherIcon icon="edit" />
            </i>
          </Link>
          <Link
            className=" btn-action-icon"
            to="#"
            onClick={() => setprimaryId(record?._id)}
            data-bs-toggle="modal"
            data-bs-target="#warning_modal"
          >
            <i className="fe fe-trash-2">
              <FeatherIcon icon="trash-2" />
            </i>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="row">
            <div className="col-xl-3 col-md-4">
              <div className="card">
                <div className="card-body">
                  <div className="page-header">
                    <div className="content-page-header">
                      <h5>Signature </h5>
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
                    <h5>Signatures</h5>
                    <div className="list-btn">
                      <Link
                        className="btn btn-primary"
                        to="#"
                        onClick={handleCancel}
                        data-bs-toggle="modal"
                        data-bs-target="#add_modal"
                      >
                        <i
                          className="fa fa-plus-circle me-2"
                          aria-hidden="true"
                        />
                        Add Signature
                      </Link>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="card-table">
                        <div className="card-body purchase settings">
                          <div className="table-responsive no-pagination">
                            <Table
                              rowKey={(record) => record?._id}
                              pagination={{
                                total: signatureData.length,
                                showTotal: (total, range) =>
                                  `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                                showSizeChanger: true,
                                onShowSizeChange: onShowSizeChange,
                                itemRender: itemRender,
                              }}
                              columns={columns}
                              dataSource={signatureData}
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
          id="warning_modal"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-body">
                <div className="form-header">
                  <h3>Delete Signature </h3>
                  <p>Are you sure to delete this ?</p>
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
        {/* Add Signature Modal */}
        <div className="modal custom-modal fade" id="add_modal" role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-md">
            <form onSubmit={handleSubmit(addSignatureForm)}>
              <div className="modal-content">
                <div className="modal-header border-0 pb-0">
                  <div className="form-header modal-header-title text-start mb-0">
                    <h4 className="mb-0">Add Signature</h4>
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
                          Signature Name <span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="signatureName"
                          type="text"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <input
                              className={`form-control ${
                                errors?.signatureName ? "error-input" : ""
                              }`}
                              type="text"
                              maxLength={16}
                              value={value ? value : ""}
                              onChange={onChange}
                              onKeyPress={handleCharacterRestrictionSpace}
                              placeholder="Enter Signature Name"
                              autoComplete="false"
                            />
                          )}
                          defaultValue=""
                        />
                        <small>{errors?.signatureName?.message}</small>
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12">
                      <div className="form-group mb-0">
                        <label>
                          Upload Signature Image
                          <span className="text-danger"> *</span>
                        </label>
                        <>
                          <div className="form-group service-upload service-upload-info mb-0">
                            <span>
                              <FeatherIcon
                                icon="upload-cloud"
                                className="me-1"
                              />
                              Upload Signature
                            </span>
                            <Controller
                              name="signatureImage"
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <>
                                  <input
                                    type="file"
                                    multiple=""
                                    id="signatureImage"
                                    {...register("signatureImage")}
                                  />
                                </>
                              )}
                            />
                            <div id="frames" />
                          </div>
                          <small className="text-danger">
                            {imgerror
                              ? imgerror
                              : errors?.signatureImage?.message}
                          </small>
                          {!imgerror && filePreview && (
                            <img
                              src={filePreview}
                              className="uploaded-imgs"
                              style={{
                                display: "flex",
                                maxWidth: "200px",
                                maxHeight: "200px",
                              }}
                            />
                          )}
                        </>
                      </div>
                    </div>
                    <div className="payment-toggle pt-3">
                      <h5 className="form-title">Make a Default</h5>
                      <div className="status-toggle">
                        <Controller
                          name="markAsDefault"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <>
                              <input
                                id="addMkdfStatus"
                                className="check"
                                type="checkbox"
                                checked={
                                  addDefaultstatus ? addDefaultstatus : ""
                                }
                                value={value ? value : ""}
                                onChange={(val) => {
                                  onChange(val);
                                  addtrigger("markAsDefault");
                                  setaddDefaultstatus(!addDefaultstatus);
                                }}
                              />
                            </>
                          )}
                          defaultValue=""
                        />
                        <label
                          htmlFor="addMkdfStatus"
                          className="checktoggle checkbox-bg"
                        >
                          checkbox
                        </label>
                      </div>
                    </div>
                    <div className="payment-toggle pt-3">
                      <h5 className="form-title">Status</h5>
                      <div className="status-toggle">
                        <Controller
                          name="status"
                          control={control}
                          render={({ field: { onChange } }) => (
                            <>
                              <input
                                id="addStatus"
                                className="check"
                                type="checkbox"
                                checked={addstatus ? addstatus : ""}
                                defaultValue={addstatus}
                                onChange={(val) => {
                                  onChange(val);
                                  addtrigger("status");
                                  setaddstatus(!addstatus);
                                }}
                              />
                            </>
                          )}
                          defaultValue=""
                        />
                        <label
                          htmlFor="addStatus"
                          className="checktoggle checkbox-bg"
                        >
                          checkbox
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <Link
                    to="#"
                    ref={addsignCancelModal}
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

        {/* Edit Signature Modal */}
        <div className="modal custom-modal fade" id="edit_modal" role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-md">
            <form onSubmit={handleSubmitEdit(updateSignatureForm)}>
              <div className="modal-content">
                <div className="modal-header border-0 pb-0">
                  <div className="form-header modal-header-title text-start mb-0">
                    <h4 className="mb-0">Edit Signature</h4>
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
                          Signature Name <span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="edit_id"
                          type="hidden"
                          defaultValue=""
                          control={EditSubmit}
                          render={({ field: { value } }) => (
                            <input type="hidden" value={value} />
                          )}
                        />
                        <Controller
                          name="edit_signatureName"
                          type="text"
                          control={EditSubmit}
                          render={({ field: { value, onChange } }) => (
                            <input
                              className={`form-control ${
                                EditSubmits?.edit_signatureName
                                  ? "error-input"
                                  : ""
                              }`}
                              type="text"
                              value={value ? value : ""}
                              onChange={onChange}
                              onKeyPress={handleCharacterRestrictionSpace}
                              placeholder="Enter Bank Name"
                              autoComplete="false"
                            />
                          )}
                          defaultValue=""
                        />
                        <small>
                          {EditSubmits?.edit_signatureName?.message}
                        </small>
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12">
                      <div className="form-group mb-0">
                        <label>
                          Upload Signature Image
                          <span className="text-danger"> *</span>
                        </label>
                        <div className="form-group service-upload service-upload-info mb-0">
                          <span>
                            <FeatherIcon icon="upload-cloud" className="me-1" />
                            Upload Signature
                          </span>
                          <Controller
                            name="edit_signatureImage"
                            control={EditSubmit}
                            render={({ field: { value, onChange } }) => (
                              <>
                                <input
                                  type="file"
                                  multiple=""
                                  id="edit_signatureImage"
                                  {...editRegister("edit_signatureImage")}
                                />
                              </>
                            )}
                          />
                          <div id="frames1" />
                        </div>
                        {!editimgerror
                          ? files && (
                              <img
                                className="uploaded-imgs"
                                style={{
                                  display: "flex",
                                  maxWidth: "200px",
                                  maxHeight: "200px",
                                }}
                                src={files}
                                alt=""
                              />
                            )
                          : null}
                      </div>
                    </div>
                    <div className="payment-toggle pt-3">
                      <h5 className="form-title">Make a Default</h5>
                      <div className="status-toggle">
                       
                        <Controller
                          name="edit_makeDefault"
                          control={EditSubmit}
                          defaultValue={false}
                          render={({ field: { value, onChange } }) => {
                            return (
                              <input
                                id="editmakeDefault"
                                className="check"
                                type="checkbox"
                                checked={value}
                                onChange={(e) => {
                                  onChange(e.target.checked);
                                  trigger("edit_makeDefault");
                                  seteditDefaultstatus(e.target.checked);
                                }}
                              />
                            );
                          }}
                        />
                        <label
                          htmlFor="editmakeDefault"
                          className="checktoggle checkbox-bg"
                        >
                          checkbox
                        </label>
                      </div>
                    </div>
                    <div className="payment-toggle pt-3">
                      <h5 className="form-title">Status</h5>
                      <div className="status-toggle">
                        
                        <Controller
                          name="edit_status"
                          control={EditSubmit}
                          defaultValue={false}
                          render={({ field: { value, onChange } }) => {
                            return (
                              <input
                                id="editStatus"
                                className="check"
                                type="checkbox"
                                checked={value} // Use the value prop to make it a controlled input
                                onChange={(e) => {
                                  onChange(e.target.checked);
                                  trigger("edit_status");
                                  seteditstatus(e.target.checked);
                                }}
                              />
                            );
                          }}
                        />
                        <label
                          htmlFor="editStatus"
                          className="checktoggle checkbox-bg"
                        >
                          checkbox
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <Link
                    to="#"
                    ref={EditsignCancelModal}
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
      </>
    </>
  );
};
export default SignatureComponent;
