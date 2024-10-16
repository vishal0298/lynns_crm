import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AddStaffContext,  } from "./addStaff.control";
import { handleCharacterRestrictionSpace } from "../../../../constans/globals";
import { toast } from 'react-toastify'; // Assuming you have react-toastify installed
import { ApiServiceContext, errorToast, successToast } from "../../../../core/core-index";
import { addStaffApi } from "../../../../constans/apiname";

const AddStaff = () => {
  const { schema, } = useContext(AddStaffContext);

  // console.log(AddStaffComponentController.onSubmit)
  const [formData, setFormData] = useState({
    name: "",
    employeeId: "",
    mobileNumber: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    try {
      schema.validateSync(formData, { abortEarly: false });
      return true;
    } catch (err) {
      const validationErrors = err.inner.reduce((acc, curr) => {
        acc[curr.path] = curr.message;
        return acc;
      }, {});
      setErrors(validationErrors);
      return false;
    }
  };

  const navigate = useNavigate();
  const { postData } = useContext(ApiServiceContext);

  const onSubmit = async (data) => {
    const obj = {
      name: data?.name,
      employeeId: data?.employeeId,
      mobileNumber: data?.mobileNumber,
    };
    try {
      console.log(postData)
      const response = await postData(addStaffApi, obj);
      if (response.code == 200) {
        successToast("Staff Added successfully");
        navigate("/staff");
      } else {
        errorToast(response?.data?.message);
      }
    } catch {
      return false;
    }
  };

  const handleSubmit =(e) => {
    e.preventDefault();
    if (validate()) {
      try {
        onSubmit(formData);
        toast.success('Staff added successfully!');
      } catch (error) {
        toast.error('An error occurred. Please try again.');
      }
    } else {
      toast.error('Please fix the errors in the form.');
    }
    console.log("submitt cliked: ", formData)
  };

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="content-page-header">
          <h5>Add Staff</h5>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group-item border-0 pb-0">
                  <div className="row">
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="form-group">
                        <label>
                          Name <span className="text-danger">*</span>
                        </label>
                        <input
                          name="name"
                          className="form-control"
                          type="text"
                          placeholder="Enter Name"
                          value={formData.name}
                          onKeyPress={handleCharacterRestrictionSpace}
                          onChange={handleChange}
                        />
                        {errors.name && (
                          <p className="text-danger">{errors.name}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="form-group">
                        <label>
                          Employee ID <span className="text-danger">*</span>
                        </label>
                        <input
                          name="employeeId"
                          className="form-control"
                          type="text"
                          placeholder="Enter Employee ID"
                          value={formData.employeeId}
                          onChange={handleChange}
                        />
                        {errors.employeeId && (
                          <p className="text-danger">{errors.employeeId}</p>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="form-group">
                        <label>
                          Mobile Number <span className="text-danger">*</span>
                        </label>
                        <input
                          name="mobileNumber"
                          className="form-control"
                          type="text"
                          placeholder="Enter Mobile Number"
                          value={formData.mobileNumber}
                          onChange={handleChange}
                        />
                        {errors.mobileNumber && (
                          <p className="text-danger">{errors.mobileNumber}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-end mt-4 units-submit">
                  <Link to="/staff" className="btn btn-primary cancel me-2">
                    Cancel
                  </Link>
                  <button className="btn btn-primary" type="submit">
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
