import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PreviewImg } from "../../../common/imagepath";
import { updatecustomerApi, viewCustomerApi } from "../../../constans/apiname";
import { useDropzone } from "react-dropzone";
import { ApiServiceContext, successToast } from "../../../core/core-index";
import { Select } from "antd";

const EditCustomer = () => {
  const { getData, putData } = useContext(ApiServiceContext);
  const [fileImage, setFileImage] = useState([]);
  const [customerListData, setCustomerEditlist] = useState({});
  const [previewImage, setPreviewImage] = useState("");
  const [imageSrc, setImageSrc] = useState(null);
  const [membershipType, setMembershipType] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    membership_type: "",
  });
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);

  const MembershipTypeData = [
    { label: "Member", value: "Member" },
    { label: "Non-Member", value: "Non-Member" },
  ];

  const { getRootProps } = useDropzone({
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setFileImage(acceptedFiles);
        getBase64(file).then((result) => {
          setPreviewImage(result);
          setImageSrc(result);
          setFile(file); // Set file for later submission
        });
      }
    },
  });

  const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            const imageDataURL = reader.result;
            setImageSrc(imageDataURL);
            setFile(file);
          };
          reader.readAsDataURL(file);
          if (fileInputRef.current) {
            fileInputRef.current.value = null;
          }
        }
      };

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    getCustomerDetails();
  }, [id]);

  const getCustomerDetails = async () => {
    const url = `${viewCustomerApi}/${id}`;
    try {
      const response = await getData(url);
      if (response?.data) {
        setFormData({
          name: response.data.name || "",
          phone: response.data.phone || "",
          address: response.data.address || "",
          membership_type: response.data.membership_type || "",
        });
        setCustomerEditlist(response.data);
        setMembershipType(response.data.membership_type || "");
        setImageSrc(response.data.image || PreviewImg); // Use default image if not present
      }
    } catch (error) {
      console.error("Error fetching customer details:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("image", file ? file : "remove");

    const flattenObject = (obj, prefix = "") => {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const propKey = prefix ? `${prefix}[${key}]` : key;
          const value = obj[key];
          if (typeof value === "object" && value !== null) {
            flattenObject(value, propKey);
          } else {
            formDataToSubmit.append(propKey, value);
          }
        }
      }
    };

    flattenObject(formData);
    formDataToSubmit.append("_id", id);

    const url = `${updatecustomerApi}/${id}`;
    try {
      const response = await putData(url, formDataToSubmit);
      if (response) {
        successToast("Customer Updated Successfully");
        navigate("/customers");
      }
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  const getBase64 = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
    });
  };

  const handleRemoveImage = () => {
    setFile(null);
    setImageSrc(null);
    setPreviewImage("");
  };

  const handleInputChange = (value, name) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const defaultImageSrc = PreviewImg;

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="page-header">
          <div className="content-page-header">
            <h5>Edit Customers</h5>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="card-body">
                <div className="form-group-item">
                  <h5 className="form-title">Basic Details</h5>
                  <div className="profile-picture">
                    <div
                      className="upload-profile"
                      {...getRootProps({ className: "dropzone dz-clickable" })}
                    >
                      <div className="profile-img add-customers">
                        <img
                          className="avatar"
                          onError={() => setImageSrc(defaultImageSrc)}
                          src={imageSrc || defaultImageSrc}
                          alt="Uploaded"
                        />
                      </div>
                      <div className="add-profile">
                        <h5>Upload a New Photo</h5>
                      </div>
                    </div>
                    <div className="img-upload">
                      <label className="btn btn-primary">
                        Upload{" "}
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          style={{ display: "none" }} // Hide input
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
                          name="name"
                          value={formData.name}
                          type="text"
                          maxLength={20}
                          placeholder="Enter Name"
                          onChange={(e) => handleInputChange(e.target.value, e.target.name)}
                        />
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="form-group">
                        <label>
                          Phone Number<span className="text-danger"> *</span>
                        </label>
                        <input
                          className="form-control"
                          name="phone"
                          value={formData.phone}
                          type="tel"
                          placeholder="Enter Phone Number"
                          onChange={(e) => handleInputChange(e.target.value, e.target.name)}
                        />
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="form-group">
                        <label>
                          Adress<span className="text-danger"> *</span>
                        </label>
                        <input
                          className="form-control"
                          name="address"
                          value={formData.address}
                          type="text"
                          placeholder="Enter Adress"
                          onChange={(e) => handleInputChange(e.target.value, e.target.name)}
                        />
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="form-group">
                        <label>
                          Membership Type<span className="text-danger"> *</span>
                        </label>
                        <Select
                          placeholder="Select Membership Type"
                          className="form-control react-selectcomponent w-100"
                          name="membership_type"
                          options={MembershipTypeData}
                          value={MembershipTypeData.find(item => item.value === formData.membership_type) || null}
                          onChange={(value) => handleInputChange(value, "membership_type")}
                        />
                      </div>
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
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCustomer;

