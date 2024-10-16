import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AddStaffContext } from "./addStaff.control";
import { handleCharacterRestrictionSpace } from "../../../../constans/globals";

const AddStaff = () => {
  const { schema, onSubmit } = useContext(AddStaffContext);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="content-page-header">
          <h5>Add Staff</h5>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group-item border-0 pb-0">
                  <div className="row">
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="form-group">
                        <label>
                          Name <span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="name"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <>
                              <input
                                className="form-control"
                                value={value}
                                type="text"
                                placeholder="Enter Name"
                                label={"Name"}
                                onKeyPress={handleCharacterRestrictionSpace}
                                onChange={(val) => {
                                  onChange(val);
                                }}
                              />
                              {errors.name && (
                                <p className="text-danger">
                                  {errors.name.message}
                                </p>
                              )}
                            </>
                          )}
                          defaultValue=""
                        />
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="form-group">
                        <label>
                          Employee ID <span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="employeeId"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <>
                              <input
                                className="form-control"
                                value={value}
                                type="text"
                                placeholder="Enter Employee ID"
                                label={"Employee ID"}
                                onChange={(val) => {
                                  onChange(val);
                                }}
                              />
                              {errors.employeeId && (
                                <p className="text-danger">
                                  {errors.employeeId.message}
                                </p>
                              )}
                            </>
                          )}
                          defaultValue=""
                        />
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="form-group">
                        <label>
                          Mobile Number <span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="mobileNumber"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <>
                              <input
                                className="form-control"
                                value={value}
                                type="text"
                                placeholder="Enter Mobile Number"
                                label={"Mobile Number"}
                                onChange={(val) => {
                                  onChange(val);
                                }}
                              />
                              {errors.mobileNumber && (
                                <p className="text-danger">
                                  {errors.mobileNumber.message}
                                </p>
                              )}
                            </>
                          )}
                          defaultValue=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-end mt-4 units-submit">
                  <Link to="/staff" className="btn btn-primary cancel me-2">
                    Cancel
                  </Link>
                  <button to="/staff" className="btn btn-primary" type="submit">
                    Add Staff
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStaff;
