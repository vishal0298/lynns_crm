import React, { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PreviewImg } from "../../../../common/imagepath";
import Select from "react-select";
import { toast } from "react-toastify";
import {
  handleCharacterRestrictionSpace,
  handleNumberRestriction,
  handleSpecialCharacterSpaceRestriction,
} from "../../../../constans/globals";
import { AddCustomerContext } from "./addCustomer.control";

const AddCustomers = () => {
  const { addCustomerschema, setFileImage, getBase64, onSubmit, setFile } =
    useContext(AddCustomerContext);

  const [name, setName] = useState("");
  // const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [membershipType, setMembershipType] = useState("");
  const [imageSrc, setImageUrl] = useState(null);
  const fileInputRef = useRef(null);

  const MembershipTypeData = [
    { label: "Member", value: "Member" },
    { label: "Non-Member", value: "Non-Member" },
  ];
  const navigate = useNavigate();

  const validateForm = async (formData) => {
    try {
      await addCustomerschema.validate(formData, { abortEarly: false });
      return true; // Validation passed
    } catch (error) {
      if (error.inner) {
        error.inner.forEach((err) => {
          console.log(err.path, err.message); // Display validation errors
        });
      }
      return false; // Validation failed
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageDataURL = reader.result;
        setImageUrl(imageDataURL);
        setFile(file);
      };
      reader.readAsDataURL(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setImageUrl(null);
  };

  const defaultImageSrc = PreviewImg;

  const handleImageError = () => {
    return PreviewImg;
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      name,
      // email,
      phone,
      address,
      membership_type: membershipType,
    };
    const isValid = await validateForm(formData);

    if (isValid) {
      // Submit form data
       onSubmit(formData)
       toast.success("Form Submitted");
      // Perform actual form submission here
    } else {
      toast.error("Form validation failed. Please check the errors and try again.");
    }
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="page-header">
            <div className="content-page-header">
              <h5>Add Customers</h5>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <form onSubmit={handleFormSubmit}>
                <div className="card-body">
                  
                  <div className="form-group-item">
                    <h5 className="form-title">Basic Details</h5>
                    <div className="profile-picture">
                      <div className="upload-profile">
                        <div className="profile-img add-customers">
                          <img
                            id="blah"
                            className="avatar"
                            onError={handleImageError}
                            src={imageSrc ? imageSrc : defaultImageSrc}
                            alt="Uploaded"
                          />
                        </div>
                        <div className="add-profile">
                          <h5>Upload a New Photo</h5>
                        </div>
                      </div>
                      <div className="img-upload">
                        <label className="btn btn-primary">
                          Upload
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                          />
                        </label>
                        <Link
                          className="btn btn-remove"
                          onClick={handleRemoveImage}
                        >
                          Remove
                        </Link>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group">
                          <label>
                            Name<span className="text-danger"> *</span>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Enter Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyPress={handleCharacterRestrictionSpace}
                          />
                        </div>
                      </div>
                      {/* <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group">
                          <label>
                            Email<span className="text-danger"> *</span>
                          </label>
                          <input
                            className="form-control"
                            type="email"
                            placeholder="Enter Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                      </div> */}
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group">
                          <label>
                            Phone<span className="text-danger"> *</span>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Enter Phone Number"
                            value={phone}
                            onChange={(e) => {
                              setPhone(e.target.value.slice(0, 15));
                            }}
                            onKeyPress={handleNumberRestriction}
                          />
                        </div>
                      </div>

                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group">
                          <label>Adress</label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Enter address" 
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group input_text">
                          <label>
                            Membership Type
                            <span className="text-danger"> *</span>
                          </label>
                          <Select
                            value={MembershipTypeData.find((option) => option.value === membershipType) || ""}
                            onChange={(selectedOption) => setMembershipType(selectedOption.value)}
                            className={`form-control react-selectcomponent w-100`}
                            placeholder="Select Membership Type"
                            options={MembershipTypeData}
                            classNamePrefix="select_kanakku"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="add-customer-btns text-end">
                    <Link
                      type="button"
                      to="/customers"
                      className="btn btn-primary cancel me-2"
                      onClick={() => navigate(-1)}
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      className="btn btn-primary"
                    >
                      Save Changes
                    </button>
                  </div>

                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddCustomers;
