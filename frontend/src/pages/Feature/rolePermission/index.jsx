import React, { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import "../../../common/antd.css";
import { Table } from "antd";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  onShowSizeChange,
  itemRender,
} from "../../../common/paginationfunction";
import { ApiServiceContext } from "../../../core/API/api-service";
import { rolesApi, successToast } from "../../../core/core-index";

const RolesPermission = () => {
  const submitRoleFormschema = yup
    .object({
      roleName: yup.string().required("Enter Role Name"),
    })
    .required();

  const {
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(submitRoleFormschema) });

  const { postData, getData, putData } = useContext(ApiServiceContext);
  const [rolesdata, setrolesdata] = useState([]);
  const [formaction, setformaction] = useState("Add");
  const cancelModal = useRef(null);

  const submitRoleForm = async (data) => {
    try {
      cancelModal.current.click();
      let url;
      let formdata;
      let response;
      url =
        formaction == "Add" ? rolesApi.Add : `${rolesApi.Update}/${data._id}`;

      if (formaction == "Add") {
        formdata = { roleName: data.roleName };
        response = await postData(`${url}`, formdata);
      } else {
        formdata = { _id: data._id, roleName: data.roleName };
        response = await putData(`${url}`, formdata);
      }

      if (response.code === 200) {
        getrolesdata();
        resetData();
        if (formaction == "Add") successToast("Role Added Successfully");
        if (formaction != "Add") successToast("Role Updated Successfully");
      }
    } catch (error) {
      /* empty */
    }
  };

  const getrolesdata = async () => {
    try {
      const response = await getData(`${rolesApi.Get}`);
      if (response.code === 200) {
        setrolesdata(response.data);
      }
    } catch (error) {
      /* empty */
    }
  };

  const addModal = () => {
    setformaction("Add");
    setValue("roleName", "");
    setValue("_id", "");
  };

  const editModal = (data) => {
    setformaction("Edit");
    setValue("roleName", data?.roleName);
    setValue("_id", data?._id);
  };

  useEffect(() => {
    getrolesdata();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "Id",
      render: (text, record, idx) => <>{idx + 1}</>,
    },
    {
      title: "Role Name",
      dataIndex: "roleName",
    },
    {
      title: "Created On",
      dataIndex: "createdAt",
    },
    {
      title: "Action",
      dataIndex: "Action",
      render: (text, record) => {
        const isAdmin = record?.roleName
          ?.toLowerCase()
          ?.includes("super admin");
        return (
          <>
            <div className="d-flex align-items-center">
              {!isAdmin && (
                <Link
                  to="#"
                  className="btn btn-greys me-2"
                  data-bs-toggle="modal"
                  onClick={() => editModal(record)}
                  data-bs-target="#add_role"
                >
                  <i className="fa fa-edit me-1" /> Edit Role
                </Link>
              )}
              <Link
                to={{ pathname: `${"/permission"}/${record._id}` }}
                className="btn btn-greys me-2"
              >
                <i className="fa fa-shield me-1" /> Permissions
              </Link>
            </div>
          </>
        );
      },
    },
  ];

  const resetData = () => {
    reset();
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="content-page-header ">
              <h5>Roles &amp; Permission</h5>
              <div className="list-btn">
                <ul className="filter-list">
                  <li>
                    <Link
                      className="btn btn-primary"
                      to="#"
                      data-bs-toggle="modal"
                      onClick={() => addModal()}
                      data-bs-target="#add_role"
                    >
                      <i
                        className="fa fa-plus-circle me-2"
                        aria-hidden="true"
                      />
                      Add Role
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card-table">
                <div className="card-body rolesPermission">
                  <div className="table-responsive table-hover">
                    <Table
                      rowKey={(record) => record?._id}
                      pagination={{
                        total: rolesdata.length,
                        showTotal: (total, range) =>
                          `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                        showSizeChanger: true,
                        onShowSizeChange: onShowSizeChange,
                        itemRender: itemRender,
                      }}
                      columns={columns}
                      dataSource={rolesdata}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal custom-modal fade" id="add_role" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <form onSubmit={handleSubmit(submitRoleForm)} className="w-100">
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <div className="form-header modal-header-title text-start mb-0">
                  <h4 className="mb-0">{formaction} Role</h4>
                </div>
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => resetData()}
                >
                  <span className="align-center" aria-hidden="true">
                    ×
                  </span>
                </button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group input_text mb-0">
                      <label>
                        Role Name <span className="text-danger">*</span>
                      </label>
                      <Controller
                        name={`_id`}
                        type="hidden"
                        control={control}
                        render={({ field: { value } }) => (
                          <input
                            className={`form-control`}
                            type="hidden"
                            value={value}
                          />
                        )}
                      />
                      <Controller
                        name={`roleName`}
                        type="text"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <input
                            className={`form-control ${
                              errors?.roleName ? "error-input" : ""
                            }`}
                            type="text"
                            value={value}
                            onChange={onChange}
                            placeholder="Enter Role Name"
                            autoComplete="false"
                          />
                        )}
                      />
                      <small>{errors?.roleName?.message}</small>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <Link
                  onClick={() => resetData()}
                  to="#"
                  ref={cancelModal}
                  data-bs-dismiss="modal"
                  className="btn btn-primary paid-cancel-btn me-2"
                >
                  Close
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
  );
};

export default RolesPermission;
