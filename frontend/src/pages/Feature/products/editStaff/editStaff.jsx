import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { EditStaffContext } from "./editStaff.control"; // Updated import
import {
  handleCharacterRestriction,
  handleCharacterRestrictionSpace,
} from "../../../../constans/globals";

const EditStaff = () => {
  const { schema, staffEdit, onSubmit } = useContext(EditStaffContext);

  const {
    handleSubmit,
    control,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    console.log(onSubmit)
    console.log(staffEdit?.staffName)
    console.log(staffEdit?.employeeId)
    console.log(staffEdit?.mobileNumber)
    setValue("staffName", staffEdit?.staffName);
    setValue("employeeId", staffEdit?.employeeId);
    setValue("mobileNumber", staffEdit?.mobileNumber);
  }, [staffEdit]);

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="content-page-header">
          <h5>Edit Staff</h5>
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
                          Staff Name <span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="staffName"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <>
                              <input
                                className="form-control"
                                value={value}
                                type="text"
                                onKeyPress={handleCharacterRestrictionSpace}
                                placeholder="Enter Staff Name"
                                onChange={(val) => {
                                  onChange(val);
                                  trigger("staffName");
                                }}
                              />
                              {errors.staffName && (
                                <p className="text-danger">
                                  {errors.staffName.message}
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
                                onKeyPress={handleCharacterRestriction}
                                onChange={(val) => {
                                  onChange(val);
                                  trigger("employeeId");
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
                                onChange={(val) => {
                                  onChange(val);
                                  trigger("mobileNumber");
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
                <div className="text-end mt-4 staff-submit">
                  <Link to="/staff" className="btn btn-primary cancel me-2">
                    Cancel
                  </Link>
                  <button className="btn btn-primary" type="submit">
                    Update Staff
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

export default EditStaff;
