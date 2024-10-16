import React, { useContext, useEffect, useState } from "react";
import { TaxRateContext } from "./TaxRates.control";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FeatherIcon from "feather-icons-react";
import Select from "react-select";
import SettingSidebar from "../settingSidebar";
import {
  handleCharacterRestrictionSpace,
  handleNumberRestriction,
} from "../../../../constans/globals";
import { Table } from "antd";
import {
  itemRender,
  onShowSizeChange,
} from "../../../../common/paginationfunction";

const TaxRateComponent = () => {
  const [primaryId, setprimaryId] = useState("");
  const {
    TaxRatechema,
    EditTaxRatechema,
    taxratecancelModal,
    EdittaxratecancelModal,
    types,
    updateTaxRateForm,
    TaxRateData,
    addTaxRateForm,
    onDelete,
    setaddstatus,
    setstatus,
    permission,
    admin,
  } = useContext(TaxRateContext);

  const {
    handleSubmit,
    control,
    reset,
    trigger: addtrigger,
    formState,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(TaxRatechema),
    defaultValues: {
      name: "",
      taxRate: "",
      type: "",
      status: true,
    },
    mode: "onChange",
  });

  const { create, update, delete: remove } = permission;
  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset({ ...TaxRateData });
    }
  }, [formState, TaxRateData, reset]);

  const handleCancel = () => {
    reset({ ...TaxRateData });
  };

  //edit
  const [ReadTaxratesData, setReadTaxratesData] = useState([]);

  const {
    handleSubmit: handleSubmitEdit,
    control: EditSubmitControl,
    setValue,
    reset: editreset,
    trigger,
    formState: { errors: EditSubmits },
  } = useForm({
    resolver: yupResolver(EditTaxRatechema),
    mode: "onChange",
  });

  const editTaxrate = (_id) => {
    const readData = TaxRateData.find((taxInfo) => taxInfo._id == _id);
    setReadTaxratesData(readData);
    edit_handleCancel();
  };

  const edit_handleCancel = () => {
    editreset({
      edit_name: ReadTaxratesData?.name,
      edit_taxRate: ReadTaxratesData?.taxRate,
      edit_type: { id: 1, text: "Percentage" },
      edit_id: ReadTaxratesData?._id,
    });
    setstatus(ReadTaxratesData?.status || false);
    setValue("edit_status", ReadTaxratesData?.status || false);
  };

  useEffect(() => {
    setValue("edit_name", ReadTaxratesData?.name);
    setValue("edit_taxRate", ReadTaxratesData?.taxRate);
    setValue("edit_type", { id: 1, text: "Percentage" });
    setValue("edit_id", ReadTaxratesData?._id);
    setstatus(ReadTaxratesData?.status);
    setValue("edit_status", ReadTaxratesData?.status);
  }, [ReadTaxratesData]);
 

  const columns = [
    {
      title: "#",
      dataIndex: "Id",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Tax Rate",
      dataIndex: "taxRate",
      render: (text) => `${text}%`,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => (
        <div>
          {text == true ? (
            <span className="badge bg-success-light">Active</span>
          ) : (
            <span className="badge bg-danger-light">Inactive</span>
          )}
        </div>
      ),
    },
    (update || remove || admin) && {
      title: "Action",
      render: (record) => (
        <>
          <div className="d-flex align-items-center signature-list">
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
                    {(update || admin) && (
                      <Link
                        className="dropdown-item"
                        to="#"
                        onClick={() => editTaxrate(record?._id)}
                        data-bs-toggle="modal"
                        data-bs-target="#edit_discount"
                      >
                        <FeatherIcon icon="edit" className="me-2" />
                        Edit
                      </Link>
                    )}
                  </li>
                  <li>
                    {(remove || admin) && (
                      <Link
                        className="dropdown-item"
                        //to="javascript:void(0);"
                        data-bs-toggle="modal"
                        data-bs-target="#delete_modal"
                        onClick={() => setprimaryId(record?._id)}
                      >
                        <i className="far fa-trash-alt me-2" />
                        Delete
                      </Link>
                    )}
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to="#"
                      onClick={() => editTaxrate(record?._id)}
                      data-bs-toggle="modal"
                      data-bs-target="#view_discount"
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
  ].filter(Boolean);

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
                    <h5>Tax Rates</h5>
                    {(create || admin) && (
                      <div className="list-btn">
                        <Link
                          onClick={handleCancel}
                          to="#"
                          className="btn btn-primary"
                          data-bs-toggle="modal"
                          data-bs-target="#add_discount"
                        >
                          <i
                            className="fa fa-plus-circle me-2"
                            aria-hidden="true"
                          />
                          Add Tax
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
                                total: TaxRateData.length,
                                showTotal: (total, range) =>
                                  `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                                showSizeChanger: true,
                                onShowSizeChange: onShowSizeChange,
                                itemRender: itemRender,
                              }}
                              columns={columns}
                              dataSource={TaxRateData}
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
                  <h3>Delete Tax Rate Details</h3>
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
        {/* Add Tax & Discount Modal */}
        <div
          className="modal custom-modal fade"
          id="add_discount"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <form onSubmit={handleSubmit(addTaxRateForm)}>
              <div className="modal-content">
                <div className="modal-header border-0 pb-0">
                  <div className="form-header modal-header-title text-start mb-0">
                    <h4 className="mb-0">Add Tax</h4>
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
                          Tax Name <span className="text-danger">*</span>
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
                              maxLength={20}
                              value={value}
                              onChange={onChange}
                              onKeyPress={handleCharacterRestrictionSpace}
                              placeholder="Enter Tax Name"
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
                          Tax Rates <span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="taxRate"
                          type="number"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <input
                              className={`form-control ${
                                errors?.taxRate ? "error-input" : ""
                              }`}
                              type="text"
                              maxLength={3}
                              onKeyPress={handleNumberRestriction}
                              value={value}
                              onChange={onChange}
                              placeholder="Enter Tax Rate"
                              autoComplete="false"
                            />
                          )}
                          defaultValue="1"
                        />
                        <small>{errors?.taxRate?.message}</small>
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12">
                      <div className="form-group input_text preference_setting">
                        <label>
                          Type <span className="text-danger">*</span>
                        </label>
                        <Controller
                          control={control}
                          name="type"
                          render={({ field: { value, onChange } }) => (
                            <Select
                              className={`react-selectcomponent form-control w-100 ${
                                errors?.type ? "error-input" : ""
                              }`}
                              onChange={onChange}
                              placeholder="Choose Type"
                              getOptionLabel={(option) => option.text}
                              getOptionValue={(option) => option.id}
                              options={types}
                              value={types?.[0]}
                              isDisabled={true}
                              classNamePrefix="select_kanakku"
                            />
                          )}
                        />
                        <small>{errors?.type?.message}</small>
                      </div>
                    </div>
                    <div className="payment-toggle">
                      <h5 className="form-title">Status</h5>
                      <div className="status-toggle">
                      
                        <Controller
                          name="status"
                          control={control}
                          defaultValue={false}
                          render={({ field: { value, onChange } }) => (
                            <input
                              id="addStatus"
                              className="check"
                              type="checkbox"
                              checked={value}
                              onChange={(e) => {
                                onChange(e.target.checked);
                                setaddstatus(e.target.checked);
                              }}
                            />
                          )}
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
                <div className="modal-footer add-tax-btns">
                  <Link
                    onClick={handleCancel}
                    to="#"
                    ref={taxratecancelModal}
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
        {/* Edit Tax & Discount Modal */}
        <div
          className="modal custom-modal fade"
          id="edit_discount"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <form onSubmit={handleSubmitEdit(updateTaxRateForm)}>
              <div className="modal-content">
                <div className="modal-header border-0 pb-0">
                  <div className="form-header modal-header-title text-start mb-0">
                    <h4 className="mb-0" onClick={edit_handleCancel}>
                      Edit Tax
                    </h4>
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
                          Tax Name <span className="text-danger"> *</span>
                        </label>
                        <Controller
                          name="edit_id"
                          type="hidden"
                          control={EditSubmitControl}
                          render={({ field: { value } }) => (
                            <input type="hidden" value={value} />
                          )}
                          defaultValue=""
                        />
                        <Controller
                          name="edit_name"
                          type="text"
                          control={EditSubmitControl}
                          render={({ field: { value, onChange } }) => (
                            <input
                              className={`form-control ${
                                EditSubmits?.edit_name ? "error-input" : ""
                              }`}
                              type="text"
                              maxLength={20}
                              value={value ? value : ""}
                              onChange={onChange}
                              onKeyPress={handleCharacterRestrictionSpace}
                              placeholder="Enter Tax Name"
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
                          Tax Rates <span className="text-danger"> *</span>
                        </label>
                        <Controller
                          name="edit_taxRate"
                          type="text"
                          control={EditSubmitControl}
                          render={({ field: { value, onChange } }) => (
                            <input
                              className={`form-control ${
                                EditSubmits?.edit_taxRate ? "error-input" : ""
                              }`}
                              type="text"
                              maxLength={3}
                              onKeyPress={handleNumberRestriction}
                              value={value ? value : ""}
                              onChange={onChange}
                              placeholder="Enter Tax Rates"
                              autoComplete="false"
                            />
                          )}
                          defaultValue=""
                        />
                        <small>{EditSubmits?.edit_taxRate?.message}</small>
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12">
                      <div className="form-group input_text">
                        <label>
                          Type <span className="text-danger"> *</span>
                        </label>
                        <Controller
                          control={EditSubmitControl}
                          name="edit_type"
                          render={({ field: { value, onChange } }) => (
                            <Select
                              className={`react-selectcomponent form-control w-100 ${
                                errors?.edit_type ? "error-input" : ""
                              }`}
                              onChange={onChange}
                              placeholder="Choose Type"
                              getOptionLabel={(option) => option.text}
                              getOptionValue={(option) => option.id}
                              options={[]}
                              isDisabled={true}
                              value={types?.[0]}
                              classNamePrefix="select_kanakku"
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div className="payment-toggle">
                      <h5 className="form-title">Status</h5>
                      <div className="status-toggle">
                        <Controller
                          name="edit_status"
                          control={EditSubmitControl}
                          render={({ field: { value, onChange } }) => {
                            return (
                              <>
                                <input
                                  id="editStatus"
                                  className="check"
                                  type="checkbox"
                                  checked={value || ""} // Use value prop for controlled input
                                  onChange={(e) => {
                                    onChange(e.target.checked); // Update the value using e.target.checked
                                    trigger("edit_status");

                                    setstatus(e.target.checked);
                                  }}
                                />
                              </>
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
                <div className="modal-footer add-tax-btns">
                  <Link
                    onClick={edit_handleCancel}
                    to="#"
                    ref={EdittaxratecancelModal}
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
        {/* View Tax & Discount Modal */}
        <div
          className="modal custom-modal fade"
          id="view_discount"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <div className="form-header modal-header-title text-start mb-0">
                  <h4 className="mb-0">View Tax</h4>
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
                    <div className="form-group">
                      <label>Tax Name</label>
                      <Controller
                        name="edit_id"
                        type="hidden"
                        control={EditSubmitControl}
                        render={({ field: { value } }) => (
                          <input type="hidden" value={value} />
                        )}
                      />
                      <Controller
                        name="edit_name"
                        type="text"
                        control={EditSubmitControl}
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
                      <label>Tax Rates</label>
                      <Controller
                        name="edit_taxRate"
                        type="text"
                        control={EditSubmitControl}
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
                      <label>Type</label>
                      <Controller
                        control={EditSubmitControl}
                        name="edit_type"
                        render={({ field: { value, onChange } }) => (
                          <Select
                            className={`react-selectcomponent form-control w-100}`}
                            placeholder="Choose Type"
                            getOptionLabel={(option) => option.text}
                            getOptionValue={(option) => option.id}
                            options={types}
                            onChange={onChange}
                            classNamePrefix="select_kanakku"
                            readOnly={true}
                            isDisabled={true}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="payment-toggle">
                    <h5 className="form-title">Status</h5>
                    <div className="status-toggle">
                      <input
                        id="taxView"
                        className="check"
                        type="checkbox"
                        readOnly={true}
                        disabled={true}
                      />
                      <label
                        htmlFor="taxView"
                        className="checktoggle checkbox-bg"
                      >
                        checkbox
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer add-tax-btns">
                <Link
                  to="#"
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
export default TaxRateComponent;
