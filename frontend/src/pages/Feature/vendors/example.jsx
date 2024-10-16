import React, { useState } from "react";
import { Link } from "react-router-dom";
import Select2 from "react-select2-wrapper";
import Header from "../layouts/Header";
import Sidebar from "../layouts/Sidebar";
import { img10 } from "../common/imagepath";
import "react-intl-tel-input/dist/main.css";
import { updatecustomerApi } from "../constans/apiname";
import { useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { putDataJsonwithtoken } from "../services/apiservice";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";

const EditCustomerss = () => {
  const {
    handleSubmit,
    control,
    setValue,
    trigger,
    // eslint-disable-next-line no-unused-vars
    formState: { errors },
  } = useForm({});

  const [menu, setMenu] = useState(false);
  const [fileImage, setFileImage] = useState([]);

  const { getRootProps, getInputProps } = useDropzone({
    maxLength: 4,
    onDrop: (acceptedFile) => {
      setValue("images", acceptedFile);
      setFileImage(acceptedFile);
    },
  });
  const navigate = useNavigate();

  let { id } = useParams();
  let _id = id;

  const toggleMobileMenu = () => {
    setMenu(!menu);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("User", JSON.stringify(data));
    formData.append("_id", _id);
    const finalData = JSON.parse(formData.get("User"));

    try {
      const response = await putDataJsonwithtoken(updatecustomerApi, finalData);
      if (response) {
        navigate.pushState("/customers");
      }
    } catch {
      /* empty */
    }
  };
  // eslint-disable-next-line no-unused-vars
  const [currencyOptions, setcurrencyOptions] = useState([
    { id: 1, text: "₹" },
    { id: 2, text: "$" },
    { id: 3, text: "£" },
    { id: 4, text: "€" },
  ]);

  return (
    <>
      <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
        <Header onMenuClick={() => toggleMobileMenu()} />
        <Sidebar />
        <div className="page-wrapper">
          <div className="content container-fluid">
            {/* Page Header */}
            <div className="page-header">
              <div className="content-page-header">
                <h5>Edit Customers</h5>
              </div>
            </div>
            {/* /Page Header */}
            <div className="row">
              <div className="col-md-12">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  encType="multipart/form-data"
                >
                  <div className="card-body">
                    <div className="form-group-item">
                      <h5 className="form-title">Basic Details</h5>
                      <div className="profile-picture">
                        <div
                          className="upload-profile"
                          {...getRootProps({
                            className: "dropzone dz-clickable",
                          })}
                        >
                          <div className="profile-img">
                            <img
                              id="blah"
                              className="avatar"
                              src={img10}
                              alt=""
                            />
                          </div>
                          <div className="add-profile">
                            <h5>Upload a New Photo</h5>
                            <span>{fileImage?.[0]?.name}</span>
                          </div>
                        </div>
                        <div className="img-upload">
                          <label className="btn btn-primary">
                            Upload <input type="file" {...getInputProps()} />
                          </label>
                          <Link className="btn btn-remove">Remove</Link>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-4 col-md-6 col-sm-12">
                          <div className="form-group">
                            <label>Name</label>
                            <Controller
                              name="name"
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <>
                                  <input
                                    className="form-control"
                                    value={value}
                                    type="text"
                                    label={"Name"}
                                    placeholder="Enter Name"
                                    onChange={(val) => {
                                      onChange(val);
                                      trigger("name");
                                    }}
                                  />
                                </>
                              )}
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-12">
                          <div className="form-group">
                            <label>Email</label>
                            <Controller
                              name="email"
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <>
                                  <input
                                    className="form-control"
                                    value={value}
                                    type="email"
                                    label={"Name"}
                                    placeholder="Enter Email Address"
                                    onChange={(val) => {
                                      onChange(val);
                                      trigger("email");
                                    }}
                                  />
                                </>
                              )}
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-12">
                          <div className="form-group">
                            <label>Phone</label>
                            <Controller
                              name="phone"
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <>
                                  <input
                                    className="form-control"
                                    containerClassName="intl-tel-input"
                                    inputClassName="form-control mail-icon2"
                                    value={value}
                                    type=""
                                    placeholder="Enter Phone Number"
                                    onChange={(val) => {
                                      onChange(val);
                                      trigger("phone");
                                    }}
                                  />
                                </>
                              )}
                            />
                            
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-12">
                          <div className="form-group">
                            <label>Currency</label>
                            <Controller
                              name="currency"
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <>
                                  <Select2
                                    className="w-100"
                                    data={currencyOptions}
                                    options={{
                                      placeholder: "Currency",
                                    }}
                                    value={value}
                                    type="number"
                                    label={"Name"}
                                    placeholder="Enter Email Address"
                                    onChange={(val) => {
                                      onChange(val);
                                      trigger("currency");
                                    }}
                                  />
                                </>
                              )}
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-12">
                          <div className="form-group">
                            <label>Website</label>
                            <Controller
                              name="website"
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <>
                                  <input
                                    className="form-control"
                                    value={value}
                                    type="text"
                                    label={"Name"}
                                    placeholder="Enter Website"
                                    onChange={(val) => {
                                      onChange(val);
                                      trigger("website");
                                    }}
                                  />
                                </>
                              )}
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-12">
                          <div className="form-group">
                            <label>Notes</label>
                            <Controller
                              name="notes"
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <>
                                  <input
                                    className="form-control"
                                    value={value}
                                    type="text"
                                    label={"Name"}
                                    placeholder="Enter Notes"
                                    onChange={(val) => {
                                      onChange(val);
                                      trigger("notes");
                                    }}
                                  />
                                </>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="form-group-item">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="billing-btn mb-2">
                            <h5 className="form-title">Billing Address</h5>
                          </div>
                          <div className="form-group">
                            <label>Name</label>
                            <Controller
                              name="billingAddress[name]"
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <>
                                  <input
                                    className="form-control"
                                    value={value}
                                    type="text"
                                    label={"Name"}
                                    placeholder="Enter Name"
                                    onChange={(val) => {
                                      onChange(val);
                                      trigger("billing_name");
                                    }}
                                  />
                                </>
                              )}
                            />
                          </div>
                          <div className="form-group">
                            <label>Address Line 1</label>
                            <Controller
                              name="billingAddress[addressLine1]"
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <>
                                  <input
                                    className="form-control"
                                    value={value}
                                    type="text"
                                    label={"Name"}
                                    placeholder="Enter Address Line1"
                                    onChange={(val) => {
                                      onChange(val);
                                      trigger("billingAddress.addressLine1");
                                    }}
                                  />
                                </>
                              )}
                            />
                          </div>
                          <div className="form-group">
                            <label>Address Line 2</label>
                            <Controller
                              name="billingAddress.addressLine2"
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <>
                                  <input
                                    className="form-control"
                                    value={value}
                                    type="text"
                                    label={"Name"}
                                    placeholder="Enter Address Line2"
                                    onChange={(val) => {
                                      onChange(val);
                                      trigger("billingAddress.addressLine2");
                                    }}
                                  />
                                </>
                              )}
                            />
                          </div>
                          <div className="row">
                            <div className="col-lg-6 col-md-12">
                              <div className="form-group">
                                <label>Country</label>
                                <Controller
                                  name="billingAddress.country"
                                  control={control}
                                  render={({ field: { value, onChange } }) => (
                                    <>
                                      <input
                                        className="form-control"
                                        value={value}
                                        type="text"
                                        label={"Name"}
                                        placeholder="Enter Country"
                                        onChange={(val) => {
                                          onChange(val);
                                          trigger("billingAddress.country");
                                        }}
                                      />
                                    </>
                                  )}
                                />
                              </div>
                              <div className="form-group">
                                <label>City</label>
                                <Controller
                                  name="billingAddress.city"
                                  control={control}
                                  render={({ field: { value, onChange } }) => (
                                    <>
                                      <input
                                        className="form-control"
                                        value={value}
                                        type="text"
                                        label={"Name"}
                                        placeholder="Enter City"
                                        onChange={(val) => {
                                          onChange(val);
                                          trigger("billingAddress.city");
                                        }}
                                      />
                                    </>
                                  )}
                                />
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-12">
                              <div className="form-group">
                                <label>State</label>
                                <Controller
                                  name="billingAddress.state"
                                  control={control}
                                  render={({ field: { value, onChange } }) => (
                                    <>
                                      <input
                                        className="form-control"
                                        value={value}
                                        type="text"
                                        label={"Name"}
                                        placeholder="Enter State"
                                        onChange={(val) => {
                                          onChange(val);
                                          trigger("billingAddress.state");
                                        }}
                                      />
                                    </>
                                  )}
                                />
                              </div>
                              <div className="form-group">
                                <label>Pincode</label>
                                <Controller
                                  name="billingAddress.pincode"
                                  control={control}
                                  render={({ field: { value, onChange } }) => (
                                    <>
                                      <input
                                        className="form-control"
                                        value={value}
                                        type="text"
                                        label={"Name"}
                                        placeholder="Enter Pincode"
                                        onChange={(val) => {
                                          onChange(val);
                                          trigger("billingAddress.pincode");
                                        }}
                                      />
                                    </>
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="billing-btn">
                            <h5 className="form-title mb-0">
                              Shipping Address
                            </h5>
                            <Link to="#" className="btn btn-primary">
                              Copy from Billing
                            </Link>
                          </div>
                          <div className="form-group">
                            <label>Name</label>
                            <Controller
                              name="shippingAddress.name"
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <>
                                  <input
                                    className="form-control"
                                    value={value}
                                    type="text"
                                    placeholder="Enter Name"
                                    onChange={(val) => {
                                      onChange(val);
                                      trigger("shippingAddress.name");
                                    }}
                                  />
                                </>
                              )}
                            />
                          </div>
                          <div className="form-group">
                            <label>Address Line 1</label>
                            <Controller
                              name="shippingAddress.addressLine1"
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <>
                                  <input
                                    className="form-control"
                                    value={value}
                                    type="text"
                                    placeholder="Enter Address 1"
                                    onChange={(val) => {
                                      onChange(val);
                                      trigger("shippingAddress.addressLine1");
                                    }}
                                  />
                                </>
                              )}
                            />
                          </div>
                          <div className="form-group">
                            <label>Address Line 2</label>
                            <Controller
                              name="shippingAddress.addressLine2"
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <>
                                  <input
                                    className="form-control"
                                    value={value}
                                    type="text"
                                    placeholder="Enter Address 2"
                                    onChange={(val) => {
                                      onChange(val);
                                      trigger("shippingAddress.addressLine2");
                                    }}
                                  />
                                </>
                              )}
                            />
                          </div>
                          <div className="row">
                            <div className="col-lg-6 col-md-12">
                              <div className="form-group">
                                <label>Country</label>
                                <Controller
                                  name="shippingAddress.country"
                                  control={control}
                                  render={({ field: { value, onChange } }) => (
                                    <>
                                      <input
                                        className="form-control"
                                        value={value}
                                        type="text"
                                        placeholder="Enter Country"
                                        onChange={(val) => {
                                          onChange(val);
                                          trigger("shippingAddress.country");
                                        }}
                                      />
                                    </>
                                  )}
                                />
                              </div>
                              <div className="form-group">
                                <label>City</label>
                                <Controller
                                  name="shippingAddress.city"
                                  control={control}
                                  render={({ field: { value, onChange } }) => (
                                    <>
                                      <input
                                        className="form-control"
                                        value={value}
                                        type="text"
                                        placeholder="Enter City"
                                        onChange={(val) => {
                                          onChange(val);
                                          trigger("shippingAddress.city");
                                        }}
                                      />
                                    </>
                                  )}
                                />
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-12">
                              <div className="form-group">
                                <label>State</label>
                                <Controller
                                  name="shippingAddress.state"
                                  control={control}
                                  render={({ field: { value, onChange } }) => (
                                    <>
                                      <input
                                        className="form-control"
                                        value={value}
                                        type="text"
                                        placeholder="Enter State"
                                        onChange={(val) => {
                                          onChange(val);
                                          trigger("shippingAddress.state");
                                        }}
                                      />
                                    </>
                                  )}
                                />
                              </div>
                              <div className="form-group">
                                <label>Pincode</label>
                                <Controller
                                  name="shippingAddress.pincode"
                                  control={control}
                                  render={({ field: { value, onChange } }) => (
                                    <>
                                      <input
                                        className="form-control"
                                        value={value}
                                        type="text"
                                        placeholder="Enter Pincode"
                                        onChange={(val) => {
                                          onChange(val);
                                          trigger("shippingAddress.pincode");
                                        }}
                                      />
                                    </>
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="form-group-customer customer-additional-form">
                      <div className="row">
                        <h5 className="form-title">Bank Details</h5>
                        <div className="col-lg-4 col-md-6 col-sm-12">
                          <div className="form-group">
                            <label>Bank Name</label>
                            <Controller
                              name="bankDetails.bankName"
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <>
                                  <input
                                    className="form-control"
                                    value={value}
                                    type="text"
                                    placeholder="Enter Bank Name"
                                    onChange={(val) => {
                                      onChange(val);
                                      trigger("bankDetails.bankName");
                                    }}
                                  />
                                </>
                              )}
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-12">
                          <div className="form-group">
                            <label>Branch</label>
                            <Controller
                              name="bankDetails.branch"
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <>
                                  <input
                                    className="form-control"
                                    value={value}
                                    type="text"
                                    placeholder="Enter Branch Name"
                                    onChange={(val) => {
                                      onChange(val);
                                      trigger("bankDetails.branch");
                                    }}
                                  />
                                </>
                              )}
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-12 col-sm-12">
                          <div className="form-group">
                            <label>Account Holder Name</label>
                            <Controller
                              name="bankDetails.accountHolderName"
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <>
                                  <input
                                    className="form-control"
                                    value={value}
                                    type="text"
                                    placeholder="Enter Account Holder Name"
                                    onChange={(val) => {
                                      onChange(val);
                                      trigger("bankDetails.accountHolderName");
                                    }}
                                  />
                                </>
                              )}
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-12 col-sm-12">
                          <div className="form-group">
                            <label>Account Number</label>
                            <Controller
                              name="bankDetails.accountNumber"
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <>
                                  <input
                                    className="form-control"
                                    value={value}
                                    type="text"
                                    placeholder="Enter Account Number"
                                    onChange={(val) => {
                                      onChange(val);
                                      trigger("bankDetails.accountNumber");
                                    }}
                                  />
                                </>
                              )}
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 col-md-12 col-sm-12">
                          <div className="form-group">
                            <label>IFSC</label>
                            <Controller
                              name="bankDetails.IFSC"
                              control={control}
                              render={({ field: { value, onChange } }) => (
                                <>
                                  <input
                                    className="form-control"
                                    value={value}
                                    type="text"
                                    placeholder="Enter IFSC Code"
                                    onChange={(val) => {
                                      onChange(val);
                                      trigger("bankDetails.IFSC");
                                    }}
                                  />
                                </>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="add-customer-btns text-end">
                      <button
                        to="/customers"
                        className="btn btn-primary cancel me-2"
                      >
                        Cancel
                      </button>
                      <button
                        to="/customers"
                        className="btn btn-primary"
                        type="submit"
                      >
                        Update Changes
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default EditCustomerss;
