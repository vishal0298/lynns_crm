import { Table } from "antd";
import React from "react";
import {
  onShowSizeChange,
  itemRender,
} from "../../../common/paginationfunction";
import Data from "../../../assets/jsons/signatureList";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import { EditSignature } from "../../../common/imagepath";

const SignatureList = () => {
  const datasource = Data?.Data;

  const columns = [
    {
      title: "#",
      dataIndex: "Id",
    },
    {
      title: "Signature Name",
      dataIndex: "SignatureName",
    },
    {
      title: "Signature",
      dataIndex: "Img",
      render: (text, record) => (
        <h2 className="table-avatar">
          <img
            className="img-fluid"
            width={80}
            height={30}
            src={record?.Img}
            alt="User Image"
          />
        </h2>
      ),
    },
    {
      title: "Status",
      dataIndex: "Status",
      render: () => (
        <div className="status-toggle">
          <input
            id="rating_2"
            className="check"
            type="checkbox"
            defaultChecked="true"
          />
          <label htmlFor="rating_2" className="checktoggle checkbox-bg">
            checkbox
          </label>
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "Action",
      render: () => (
        <div className="d-flex align-items-center">
          <Link
            className=" btn-action-icon me-2"
            to="#"
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
            data-bs-toggle="modal"
            data-bs-target="#edit_modal"
          >
            <i className="fe fe-edit">
              <FeatherIcon icon="edit" />
            </i>
          </Link>
          <Link
            className=" btn-action-icon"
            to=""
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
          {/* Page Header */}
          <div className="page-header">
            <div className="content-page-header ">
              <h5>Signature </h5>
              <div className="list-btn">
                <ul className="filter-list">
                  <li>
                    <Link
                      className="btn btn-primary"
                      to="#"
                      data-bs-toggle="modal"
                      data-bs-target="#add_modal"
                    >
                      <i
                        className="fa fa-plus-circle me-2"
                        aria-hidden="true"
                      />
                      Add Signature
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          {/* Table */}
          <div className="row">
            <div className="col-sm-12">
              <div className=" card-table">
                <div className="card-body category">
                  <div className="table-responsive table-hover">
                    <Table
                      pagination={{
                        total: datasource.length,
                        showTotal: (total, range) =>
                          `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                        showSizeChanger: true,
                        onShowSizeChange: onShowSizeChange,
                        itemRender: itemRender,
                      }}
                      columns={columns}
                      dataSource={datasource}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* /Table */}
        </div>
      </div>

      <>
        <div
          className="modal custom-modal signature-add-modal fade"
          id="add_modal"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <div className="form-header modal-header-title text-start mb-0">
                  <h4 className="mb-0">Add Signature</h4>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <div className="input-block mb-3">
                      <label>Signature Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Signature Name"
                      />
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="input-block mb-3">
                      <label>Upload</label>
                      <div className="input-block service-upload service-upload-info mb-0">
                        <span>
                          <i className="fe fe-upload-cloud me-1">
                            <FeatherIcon icon="upload-cloud" className="me-1" />
                          </i>
                          Upload Signature
                        </span>
                        <input type="file" multiple="" />
                        <div id="frames" />
                      </div>
                      <p>Image format should be png and jpg</p>
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <label className="custom_check">
                      <input type="checkbox" name="invoice" />
                      <span className="checkmark" />
                      Mark as default
                    </label>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <a
                  href="javascript:void(0);"
                  data-bs-dismiss="modal"
                  className="btn btn-back me-2"
                >
                  Cancel
                </a>
                <a
                  href="javascript:void(0);"
                  data-bs-dismiss="modal"
                  className="btn btn-primary"
                >
                  Save
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* / Add Modal */}
        {/* Edit Modal */}
        <div
          className="modal custom-modal signature-add-modal fade"
          id="edit_modal"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <div className="form-header modal-header-title text-start mb-0">
                  <h4 className="mb-0">Edit Signature</h4>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <div className="input-block mb-3">
                      <label>Signature Name</label>
                      <input
                        type="text"
                        className="form-control"
                        defaultValue="Shirley"
                      />
                    </div>
                  </div>
                  <div className="col-lg-9 col-md-12">
                    <div className="input-block mb-3">
                      <label>Upload</label>
                      <div className="input-block service-upload service-upload-info mb-0">
                        <span>
                          <i className="fe fe-upload-cloud me-1">
                            <FeatherIcon icon="upload-cloud" className="me-1" />
                          </i>
                          Upload Signature
                        </span>
                        <input type="file" multiple="" />
                        <div id="frames" />
                      </div>
                      <p>Image format should be png and jpg</p>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-12 ps-0">
                    <div className="input-block mb-3">
                      <label>&nbsp;</label>
                      <div className="signature-preview">
                        <a href="javascript:void(0);">
                          <i className="fe fe-trash-2">
                            <FeatherIcon icon="trash-2" />
                          </i>
                        </a>
                        <img
                          src={EditSignature}
                          className="img-fluid"
                          alt="img"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <label className="custom_check">
                      <input type="checkbox" name="invoice" />
                      <span className="checkmark" />
                      Mark as default
                    </label>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <a
                  href="javascript:void(0);"
                  data-bs-dismiss="modal"
                  className="btn btn-back me-2"
                >
                  Cancel
                </a>
                <a
                  href="javascript:void(0);"
                  data-bs-dismiss="modal"
                  className="btn btn-primary"
                >
                  Update
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* / Edit Modal */}
        {/* Delete Items Modal */}
        <div
          className="modal custom-modal fade signature-delete-modal"
          id="warning_modal"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-body">
                <div className="form-header">
                  <div className="mb-2">
                    <i className="fe fe-alert-circle text-warning">
                      <FeatherIcon
                        icon="alert-circle"
                        className="text-warning"
                      />
                    </i>
                  </div>
                  <h3>Are you Sure?</h3>
                  <p>You won’t be able to revert this!</p>
                </div>
                <div className="modal-btn delete-action text-center modal-footer pb-0 justify-content-center">
                  <button
                    type="reset"
                    data-bs-toggle="modal"
                    data-bs-target="#delete_modal"
                    className="btn btn-primary me-2"
                  >
                    Yes, delete it!
                  </button>
                  <button
                    type="reset"
                    data-bs-dismiss="modal"
                    className="btn btn-back"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Delete Items Modal */}
        {/* Delete Items Modal */}
        <div
          className="modal custom-modal fade signature-delete-modal"
          id="delete_modal"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered modal-md">
            <div className="modal-content">
              <div className="modal-body">
                <div className="form-header">
                  <div className="mb-2">
                    <i className="fe fe-trash-2">
                      <FeatherIcon icon="trash-2" />
                    </i>
                  </div>
                  <h3>Signature Deleted</h3>
                  <p>The signature deleted successfully!</p>
                </div>
                <div className="modal-btn delete-action text-center">
                  <button
                    type="reset"
                    data-bs-dismiss="modal"
                    className="btn btn-primary"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </>
  );
};

export default SignatureList;
