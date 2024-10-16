import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ApiServiceContext } from "../../../core/API/api-service";
import { Checkbox, Form } from "antd";
import { successToast } from "../../../core/core-index";
import { toTitleCase } from "../../../common/helper";

const Permission = () => {
  const { putData, getData } = useContext(ApiServiceContext);
  const [form] = Form.useForm();
  const [permissiondata, setpermissiondata] = useState([]);
  const [responseData, setresponseData] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  const CheckglobalAllChangests = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();
    const newObj = { ...values };
    delete newObj["allModules"];
    const allFieldsChecked = Object.values(newObj).every(
      (value) => value === true
    );
    form.setFieldsValue({ allModules: allFieldsChecked });
  };

  const CheckallowAllChangests = async (field) => {
    await CheckglobalAllChangests();
    await form.validateFields();
    const values = form.getFieldsValue();

    if (field != "allModules") {
      let string = `${field}`;
      let modulName = string.substring(0, string.indexOf("_"));

      let rownewObj = {
        [`${modulName}_create`]: values[`${modulName}_create`],
        [`${modulName}_update`]: values[`${modulName}_update`],
        [`${modulName}_view`]: values[`${modulName}_view`],
        [`${modulName}_delete`]: values[`${modulName}_delete`],
      };
      const rowallFieldsChecked = Object.values(rownewObj).every(
        (value) => value === true
      );
      form.setFieldsValue({ [`${modulName}_all`]: rowallFieldsChecked });
    }
    await CheckglobalAllChangests();
  };

  const onCheckAllChange = async (e) => {
    let field = `${e.target.id}`;
    const checked = e.target.checked;
    if (!checked) form.setFieldsValue({ [`allModules`]: false });

    if (field == "allModules") {
      permissiondata.map((rec) => {
        form.setFieldsValue({ [`${rec?.module}_create`]: checked });
        form.setFieldsValue({ [`${rec?.module}_update`]: checked });
        form.setFieldsValue({ [`${rec?.module}_view`]: checked });
        form.setFieldsValue({ [`${rec?.module}_delete`]: checked });
        form.setFieldsValue({ [`${rec?.module}_all`]: checked });
      });
    } else {
      let modulName = field.replace("_all", "");
      form.setFieldsValue({ [`${modulName}_create`]: checked });
      form.setFieldsValue({ [`${modulName}_update`]: checked });
      form.setFieldsValue({ [`${modulName}_view`]: checked });
      form.setFieldsValue({ [`${modulName}_delete`]: checked });
      form.setFieldsValue({ [`${modulName}_all`]: checked });
    }

    CheckallowAllChangests(field);
  };

  const onChange = (e) => {
    const checked = e.target.checked;
    const field = e.target.id;
    if (!checked) form.setFieldsValue({ [`allModules`]: false });
    CheckallowAllChangests(field);
  };
  const camelCaseToSpaced = (camelCaseString) => {
    return camelCaseString
      .replace(/([A-Z])/g, " $1")

      .replace(/^./, (str) => str.toUpperCase());
  };

  const onFinish = async (data) => {
    const formdata = {};
    const moduleDatas = {};
    const formdataModules = [];
    formdata._id = responseData?._id;
    formdata.allModules = data["allModules"];
    delete data["allModules"];

    let keysData = Object.keys(data);
    let updatedkeysData = keysData.map((key) => key.split("_"));

    updatedkeysData.forEach(([key, value]) => {
      if (!moduleDatas[key]) {
        moduleDatas[key] = {};
      }
      moduleDatas[key][value] = data[`${key}_${value}`];
    });

    let moduleDatasArray = [moduleDatas];
    for (let key in moduleDatas) {
      let output_object = {
        [key]: moduleDatas[key],
      };
      moduleDatasArray.push(output_object);
    }

    for (let i = 1; i < moduleDatasArray.length; i++) {
      const input_object = moduleDatasArray[i];

      const module_name = Object.keys(input_object)[0];

      let output_object = {
        label: camelCaseToSpaced(module_name),
        module: module_name,
        permissions: input_object[module_name],
      };

      formdataModules.push(output_object);
    }

    formdata.modules = formdataModules;
    try {
      const response = await putData(
        `/permission/updatepermissions/${responseData._id}`,
        formdata
      );
      if (response.code === 200) {
        getPermissiondata();
        successToast("Permission Updated Successfully");
      }
    } catch (error) {
      /* empty */
    }
  };

  const getPermissiondata = async () => {
    try {
      const response = await getData(`/permission/viewpermission/${id}`);
      if (response.code === 200) {
        setpermissiondata([...response.data?.modules]);
        setresponseData(response.data);
        form.setFieldsValue({ allModules: response?.data?.allModules });
      }
    } catch (error) {
      /* empty */
    }
  };
  useEffect(() => {
    getPermissiondata();
  }, []);
  const isAdmin = responseData?.allModules;
  return (
    <>
      <div className="page-wrapper">
        <Form
          form={form}
          onFinish={onFinish}
          autoComplete="off"
        >
          <div className="content container-fluid">
            {/* Page Header */}
            <div className="page-header">
              <div className="content-page-header">
                <h5>Permission</h5>
              </div>
              <div className="role-testing d-flex align-items-center justify-content-between">
                <h6>
                  Role Name:
                  {responseData?.roleName && (
                    <span className="ms-1">
                      {toTitleCase(`${responseData?.roleName}`)}
                    </span>
                  )}
                </h6>

                <div>
                  <Form.Item
                    label="All Modules"
                    name="allModules"
                    valuePropName="checked"
                    initialValue={responseData?.allModules}
                  >
                    <Checkbox
                      onChange={onCheckAllChange}
                      disabled={isAdmin}
                    ></Checkbox>
                  </Form.Item>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            {/* Table */}
            <div className="row">
              <div className="col-sm-12">
                <div className="card-table">
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-stripped table-hover">
                        <thead className="thead-light">
                          <tr>
                            <th>Modules</th>
                            <th>Sub Modules</th>
                            <th>Create</th>
                            <th>Edit</th>
                            <th>Delete</th>
                            <th>View</th>
                            <th>Allow all</th>
                          </tr>
                        </thead>
                        <tbody>
                          {permissiondata &&
                            permissiondata.map((row, idx) => {
                              const isDisabled =
                                row.module === "dashboard" ||
                                row.module === "accountSettings";
                              return (
                                <tr key={idx}>
                                  <td className="role-data">
                                    {toTitleCase(`${row?.label}`)}
                                  </td>
                                  <td>{toTitleCase(`${row?.module}`)}</td>
                                  <td>
                                    <Form.Item
                                      name={`${row.module}_create`}
                                      valuePropName="checked"
                                      initialValue={
                                        isDisabled || isAdmin
                                          ? true
                                          : row?.permissions?.create
                                      }
                                    >
                                      <Checkbox
                                        onChange={onChange}
                                        disabled={isDisabled || isAdmin}
                                      ></Checkbox>
                                    </Form.Item>
                                  </td>
                                  <td>
                                    <Form.Item
                                      name={`${row.module}_update`}
                                      valuePropName="checked"
                                      initialValue={
                                        isDisabled || isAdmin
                                          ? true
                                          : row?.permissions?.update
                                      }
                                    >
                                      <Checkbox
                                        onChange={onChange}
                                        disabled={isDisabled || isAdmin}
                                      ></Checkbox>
                                    </Form.Item>
                                  </td>
                                  <td>
                                    <Form.Item
                                      name={`${row.module}_delete`}
                                      valuePropName="checked"
                                      initialValue={
                                        isDisabled || isAdmin
                                          ? true
                                          : row?.permissions?.delete
                                      }
                                    >
                                      <Checkbox
                                        onChange={onChange}
                                        disabled={isDisabled || isAdmin}
                                      ></Checkbox>
                                    </Form.Item>
                                  </td>
                                  <td>
                                    <Form.Item
                                      name={`${row.module}_view`}
                                      valuePropName="checked"
                                      initialValue={
                                        isDisabled || isAdmin
                                          ? true
                                          : row?.permissions?.view
                                      }
                                    >
                                      <Checkbox
                                        onChange={onChange}
                                        disabled={isDisabled || isAdmin}
                                      ></Checkbox>
                                    </Form.Item>
                                  </td>
                                  <td>
                                    <Form.Item
                                      name={`${row.module}_all`}
                                      valuePropName="checked"
                                      initialValue={
                                        isDisabled || isAdmin
                                          ? true
                                          : row?.permissions?.all
                                      }
                                    >
                                      <Checkbox
                                        onChange={onCheckAllChange}
                                        disabled={isDisabled || isAdmin}
                                      ></Checkbox>
                                    </Form.Item>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Table */}
            <div className="text-center">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(-1);
                }}
                className="btn btn-primary me-2"
              >
                Back
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isAdmin}
              >
                Update
              </button>
            </div>
          </div>
        </Form>
      </div>
    </>
  );
};

export default Permission;
