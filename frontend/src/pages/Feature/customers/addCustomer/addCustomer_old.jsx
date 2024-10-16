/* eslint-disable react/no-unknown-property */
import React, { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PreviewImg } from "../../../../common/imagepath";
import { useForm, Controller } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import {
  handleCharacterRestrictionSpace,
  handleKeyDown,
  handleNumberRestriction,
  handleSpecialCharacterSpaceRestriction,
} from "../../../../constans/globals";
import { AddCustomerContext } from "./addCustomer.control";
// import { Select } from "react-select";

const AddCustomers = () => {
  const { addCustomerschema, setFileImage, getBase64, onSubmit, setFile } =
    useContext(AddCustomerContext);

  const {
    handleSubmit,
    control,
    // setValue,
    trigger,
    register,
    // watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addCustomerschema),
  });

  const [MembershipTypeData, setMembershipTypeData] = useState([
    { label: "Member", value: "Member" },
    { label: "Non-Member", value: "Non-Member" },
  ]);
  const navigate = useNavigate();

  // eslint-disable-next-line no-unused-vars
  const [previewImage, setPreviewImage] = useState("");

  // eslint-disable-next-line no-unused-vars
  const { getRootProps, getInputProps } = useDropzone({
    maxLength: 4,
    onDrop: (acceptedFile) => {
      setFileImage(acceptedFile);
      getBase64(acceptedFile?.[0]).then((result) => {
        acceptedFile["base64"] = result;
        setPreviewImage(acceptedFile.base64);
      });
    },
  });

  // const copyBill = () => {
  //   const formData = watch();
  //   let validateError = {
  //     shouldValidate: true,
  //   };
  //   setValue(
  //     "shippingAddress[name]",
  //     formData?.billingAddress?.name,
  //     validateError
  //   );
  //   setValue(
  //     "shippingAddress[addressLine1]",
  //     formData?.billingAddress?.addressLine1,
  //     validateError
  //   );
  //   setValue(
  //     "shippingAddress[addressLine2]",
  //     formData?.billingAddress?.addressLine2,
  //     validateError
  //   );
  //   setValue(
  //     "shippingAddress[state]",
  //     formData?.billingAddress?.state,
  //     validateError
  //   );
  //   setValue(
  //     "shippingAddress[country]",
  //     formData?.billingAddress?.country,
  //     validateError
  //   );
  //   setValue(
  //     "shippingAddress[city]",
  //     formData?.billingAddress?.city,
  //     validateError
  //   );
  //   setValue(
  //     "shippingAddress[pincode]",
  //     formData?.billingAddress?.pincode,
  //     validateError
  //   );
  // };

  const [imageSrc, setImageUrl] = useState(null);
  const fileInputRef = useRef(null);
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

  console.log(onSubmit)
  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="content-page-header">
              <h5>Add Customers</h5>
            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            <div className="col-md-12">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="card-body">
                  
                  <div className="form-group-item">
                    <h5 className="form-title">Basic Details</h5>
                    <div className="profile-picture">
                      <div
                        className="upload-profile"

                      >
                        <div className="profile-img add-customers">
                          <img
                            id="blah"
                            className="avatar"
                            onError={(e) => handleImageError()}
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
                          Upload{" "}
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
                          <Controller
                            name="name"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <>
                                <input
                                  className="form-control"
                                  value={value}
                                  type="text"
                                  // maxLength={20}
                                  label={"Name"}
                                  onKeyPress={handleCharacterRestrictionSpace}
                                  placeholder="Enter Name"
                                  onChange={(val) => {
                                    onChange(val);
                                    trigger("name");
                                  }}
                                  {...register("name")}
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
                            Email<span className="text-danger"> *</span>
                          </label>
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
                                  {...register("email")}
                                />
                                {errors.email && (
                                  <p className="text-danger">
                                    {errors.email.message}
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
                            Phone<span className="text-danger"> *</span>
                          </label>
                          <Controller
                            name="phone"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <>
                                <input
                                  className="form-control"
                                  containerclassname="intl-tel-input"
                                  inputclassname="form-control mail-icon2"
                                  value={value}
                                  type="text"
                                  onInput={(e) =>
                                  (e.target.value = e.target.value.slice(
                                    0,
                                    15
                                  ))
                                  }
                                  onKeyPress={handleNumberRestriction}
                                  placeholder="Enter Phone Number"
                                  onChange={(val) => {
                                    onChange(val);
                                    trigger("phone");
                                  }}
                                  {...register("phone")}
                                />
                                {errors.phone && (
                                  <p className="text-danger">
                                    {errors.phone.message}
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
                          <label>Adress</label>
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
                                  {...register("website")}
                                />
                                {errors.website && (
                                  <p className="text-danger">
                                    {errors.website.message}
                                  </p>
                                )}
                              </>
                            )}
                            defaultValue=""
                          />
                        </div>
                      </div>

                      {/* <div className="col-lg-4 col-md-6 col-sm-12">
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
                                  {...register("notes")}
                                />
                                {errors.notes && (
                                  <p className="text-danger">
                                    {errors.notes.message}
                                  </p>
                                )}
                              </>
                            )}
                            defaultValue=""
                          />
                        </div>
                      </div> */}

                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group input_text">
                          <label>
                            Membership Type
                            <span className="text-danger"> *</span>
                          </label>
                          <Controller
                            name="membership_type"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                              <Select
                                value={MembershipTypeData.find((option) => option.value === value) || ""}
                                onChange={(selectedOption) => {
                                  onChange(selectedOption.value);
                                  trigger("membership_type");
                                }}
                                className={`form-control react-selectcomponent w-100 ${errors?.membership_type ? "error-input" : ""
                                  }`}
                                placeholder="Select Membership Type"
                                options={MembershipTypeData}
                                classNamePrefix="select_kanakku"
                              />
                            )}
                          />
                          {errors?.membership_type && (
                            <small className="text-danger">{errors.membership_type.message}</small>
                          )}
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
                      name="Submit"
                      to="/customers"
                      className="btn btn-primary"
                      // type="submit"
                      type="button"
                      onClick={()=>(handleSubmit(onSubmit))}
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


                  {/* <div className="form-group-item">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="billing-btn mb-2">
                          <h5 className="form-title">Billing Address</h5>
                        </div>
                        <div className="form-group">
                          <label>Name<span className="text-danger"> *</span></label>
                          <Controller
                            name="billingAddress[name]"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <>
                                <input
                                  className="form-control"
                                  value={value}
                                  type="text"
                                  maxLength={20}
                                  label={"Name"}
                                  onKeyPress={handleCharacterRestrictionSpace}
                                  placeholder="Enter Name"
                                  onChange={(val) => {
                                    onChange(val);
                                    trigger("billingAddress[name]");
                                    
                                  }}
                                />
                                 {errors.billingAddress?.name && (
                                  <p className="text-danger">
                                    {errors.billingAddress?.name?.message}
                                  </p>
                                )}
                              </>
                            )}
                            defaultValue=""
                          />
                        </div>
                        <div className="form-group">
                          <label>Address Line 1<span className="text-danger"> *</span></label>
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
                                    trigger("billingAddress[addressLine1]");
                                    
                                  }}
                                />
                                {errors.billingAddress?.addressLine1 && (
                                      <p className="text-danger">
                                        {errors.billingAddress?.addressLine1?.message}
                                      </p>
                                    )}
                              </>
                            )}
                            defaultValue=""
                          />
                        </div>
                        <div className="form-group">
                          <label>Address Line 2<span className="text-danger"> *</span></label>
                          <Controller
                            name="billingAddress[addressLine2]"
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
                                    trigger("billingAddress[addressLine2]");
                                    
                                  }}
                                />
                                {errors.billingAddress?.addressLine2 && (
                                      <p className="text-danger">
                                        {errors.billingAddress?.addressLine2?.message}
                                      </p>
                                    )}
                              </>
                            )}
                            defaultValue=""
                          />
                        </div>
                        <div className="row">
                          <div className="col-lg-6 col-md-12">
                            <div className="form-group">
                              <label>City<span className="text-danger"> *</span></label>
                              <Controller
                                name="billingAddress[city]"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <>
                                    <input
                                      className="form-control"
                                      value={value}
                                      type="text"
                                      maxLength={20}
                                      label={"Name"}
                                      onKeyPress={
                                        handleCharacterRestrictionSpace
                                      }
                                      placeholder="Enter City"
                                      onChange={(val) => {
                                        onChange(val);
                                        trigger("billingAddress[city]");
                                        
                                      }}
                                    />
                                    {errors.billingAddress?.city && (
                                      <p className="text-danger">
                                        {errors.billingAddress?.city?.message}
                                      </p>
                                    )}
                                  </>
                                )}
                                defaultValue=""
                              />
                            </div>
                            <div className="form-group">
                              <label>Country<span className="text-danger"> *</span></label>
                              <Controller
                                name="billingAddress[country]"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <>
                                    <input
                                      className="form-control"
                                      value={value}
                                      type="text"
                                      onKeyPress={
                                        handleCharacterRestrictionSpace
                                      }
                                      label={"Name"}
                                      placeholder="Enter Country"
                                      onChange={(val) => {
                                        onChange(val);
                                        trigger("billingAddress[country]");
                                        
                                      }}
                                    />
                                    {errors.billingAddress?.country && (
                                      <p className="text-danger">
                                        {errors.billingAddress?.country?.message}
                                      </p>
                                    )}
                                  </>
                                )}
                                defaultValue=""
                              />
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-12">
                            <div className="form-group">
                              <label>State<span className="text-danger"> *</span></label>
                              <Controller
                                name="billingAddress[state]"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <>
                                    <input
                                      className="form-control"
                                      value={value}
                                      type="text"
                                      label={"Name"}
                                      onKeyPress={
                                        handleCharacterRestrictionSpace
                                      }
                                      placeholder="Enter State"
                                      onChange={(val) => {
                                        onChange(val);
                                        trigger("billingAddress[state]");
                                       
                                      }}
                                    />
                                    {errors.billingAddress?.state && (
                                      <p className="text-danger">
                                        {errors.billingAddress?.state?.message}
                                      </p>
                                    )}
                                  </>
                                )}
                                defaultValue=""
                              />
                            </div>
                            <div className="form-group">
                              <label>Pincode<span className="text-danger"> *</span></label>
                              <Controller
                                name="billingAddress[pincode]"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <>
                                    <input
                                      className="form-control"
                                      value={value}
                                      type="text"
                                      onKeyPress={handleNumberRestriction}
                                      onKeyDown={(e) => handleKeyDown(e)}
                                      label={"Name"}
                                      placeholder="Enter Pincode"
                                      onChange={(val) => {
                                        onChange(val);
                                        trigger("billingAddress[pincode]");
                                       
                                      }}
                                    />
                                    {errors.billingAddress?.pincode && (
                                      <p className="text-danger">
                                        {errors.billingAddress?.pincode?.message}
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
                      <div className="col-md-6">
                        <div className="billing-btn">
                          <h5 className="form-title mb-0">Shipping Address</h5>
                          <Link
                            to="#"
                            className="btn btn-primary"
                            onClick={copyBill}
                          >
                            Copy from Billing
                          </Link>
                        </div>
                        <div className="form-group">
                          <label>Name<span className="text-danger"> *</span></label>
                          <Controller
                            name="shippingAddress[name]"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <>
                                <input
                                  className="form-control"
                                  value={value}
                                  type="text"
                                  onKeyPress={handleCharacterRestrictionSpace}
                                  maxLength={20}
                                  placeholder="Enter Name"
                                  onChange={(val) => {
                                    onChange(val);
                                    trigger("shippingAddress[name]");
                                  }}
                                />
                                {errors.shippingAddress?.name && (
                                  <p className="text-danger">
                                    {errors.shippingAddress?.name?.message}
                                  </p>
                                )}
                              </>
                            )}
                          />
                        </div>
                        <div className="form-group">
                          <label>Address Line 1<span className="text-danger"> *</span></label>
                          <Controller
                            name="shippingAddress[addressLine1]"
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
                                    trigger("shippingAddress[addressLine1]");
                                  }}
                                />
                                {errors.shippingAddress?.addressLine1 && (
                                  <p className="text-danger">
                                    {errors.shippingAddress?.addressLine1?.message}
                                  </p>
                                )}
                              </>
                            )}
                          />
                        </div>
                        <div className="form-group">
                          <label>Address Line 2<span className="text-danger"> *</span></label>
                          <Controller
                            name="shippingAddress[addressLine2]"
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
                                    trigger("shippingAddress[addressLine2]");
                                  }}
                                />
                                {errors.shippingAddress?.addressLine2 && (
                                  <p className="text-danger">
                                    {errors.shippingAddress?.addressLine2?.message}
                                  </p>
                                )}  
                              </>
                            )}
                          />
                        </div>
                        <div className="row">
                          <div className="col-lg-6 col-md-12">
                            <div className="form-group">
                              <label>City<span className="text-danger"> *</span></label>
                              <Controller
                                name="shippingAddress[city]"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <>
                                    <input
                                      className="form-control"
                                      value={value}
                                      type="text"
                                      onKeyPress={
                                        handleCharacterRestrictionSpace
                                      }
                                      maxLength={20}
                                      placeholder="Enter City"
                                      onChange={(val) => {
                                        onChange(val);
                                        trigger("shippingAddress[city]");
                                      }}
                                    />
                                    {errors.shippingAddress?.city && (
                                      <p className="text-danger">
                                        {errors.shippingAddress?.city?.message}
                                      </p>
                                    )}
                                  </>
                                )}
                              />
                            </div>
                            <div className="form-group">
                              <label>Country<span className="text-danger"> *</span></label>
                              <Controller
                                name="shippingAddress[country]"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <>
                                    <input
                                      className="form-control"
                                      value={value}
                                      type="text"
                                      maxLength={20}
                                      onKeyPress={
                                        handleCharacterRestrictionSpace
                                      }
                                      placeholder="Enter Country"
                                      onChange={(val) => {
                                        onChange(val);
                                        trigger("shippingAddress[country]");
                                      }}
                                    />
                                    {errors.shippingAddress?.country && (
                                      <p className="text-danger">
                                        {errors.shippingAddress?.country?.message}
                                      </p>
                                    )}
                                  </>
                                )}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-12">
                            <div className="form-group">
                              <label>State<span className="text-danger"> *</span></label>
                              <Controller
                                name="shippingAddress[state]"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <>
                                    <input
                                      className="form-control"
                                      value={value}
                                      type="text"
                                      maxLength={20}
                                      onKeyPress={
                                        handleCharacterRestrictionSpace
                                      }
                                      placeholder="Enter State"
                                      onChange={(val) => {
                                        onChange(val);
                                        trigger("shippingAddress[state]");
                                      }}
                                    />
                                    {errors.shippingAddress?.state && (
                                      <p className="text-danger">
                                        {errors.shippingAddress?.state?.message}
                                      </p>
                                    )}
                                  </>
                                )}
                              />
                            </div>
                            <div className="form-group">
                              <label>Pincode<span className="text-danger"> *</span></label>
                              <Controller
                                name="shippingAddress[pincode]"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <>
                                    <input
                                      className="form-control"
                                      value={value}
                                      type="text"
                                      maxLength={10}
                                      onKeyPress={handleNumberRestriction}
                                      onKeyDown={(e) => handleKeyDown(e)}
                                      placeholder="Enter Pincode"
                                      onChange={(val) => {
                                        onChange(val);
                                        trigger("shippingAddress[pincode]");
                                      }}
                                    />
                                    {errors.shippingAddress?.pincode && (
                                      <p className="text-danger">
                                        {errors.shippingAddress?.pincode?.message}
                                      </p>
                                    )}
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
                          <label>
                            Bank Name
                          </label>
                          <Controller
                            name="bankDetails[bankName]"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <>
                                <input
                                  className="form-control"
                                  value={value}
                                  type="text"
                                  onKeyPress={handleCharacterRestrictionSpace}
                                  placeholder="Enter Bank Name"
                                  onChange={(val) => {
                                    onChange(val);
                                    trigger("bankDetails[bankName]");
                                  }}
                                />
                                
                              </>
                            )}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group">
                          <label>
                            Branch
                          </label>
                          <Controller
                            name="bankDetails[branch]"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <>
                                <input
                                  className="form-control"
                                  value={value}
                                  type="text"
                                  onKeyPress={
                                    handleSpecialCharacterSpaceRestriction
                                  }
                                  placeholder="Enter Branch Name"
                                  onChange={(val) => {
                                    onChange(val);
                                    trigger("bankDetails[branch]");
                                  }}
                                />
                                
                              </>
                            )}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-12 col-sm-12">
                        <div className="form-group">
                          <label>
                            Account Holder Name
                          </label>
                          <Controller
                            name="bankDetails[accountHolderName]"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <>
                                <input
                                  className="form-control"
                                  value={value}
                                  type="text"
                                  onKeyPress={handleCharacterRestrictionSpace}
                                  maxLength={20}
                                  placeholder="Enter Account Holder Name"
                                  onChange={(val) => {
                                    onChange(val);
                                    trigger("bankDetails[accountHolderName]");
                                  }}
                                />
                                {errors.bankDetails?.accountHolderName && (
                                  <p className="text-danger">
                                    {
                                      errors.bankDetails?.accountHolderName
                                        ?.message
                                    }
                                  </p>
                                )}
                              </>
                            )}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-12 col-sm-12">
                        <div className="form-group">
                          <label>
                            Account Number
                          </label>
                          <Controller
                            name="bankDetails[accountNumber]"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <>
                                <input
                                  className="form-control"
                                  value={value}
                                  type="text"
                                  onInput={(e) =>
                                    (e.target.value = e.target.value.slice(
                                      0,
                                      20
                                    ))
                                  }
                                  onKeyDown={(e) => handleKeyDown(e)}
                                  onKeyPress={handleNumberRestriction}
                                  placeholder="Enter Account Number"
                                  onChange={(val) => {
                                    onChange(val);
                                    trigger("bankDetails[accountNumber]");
                                  }}
                                />
                                
                              </>
                            )}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-12 col-sm-12">
                        <div className="form-group">
                          <label>
                            IFSC
                          </label>
                          <Controller
                            name="bankDetails[IFSC]"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <>
                                <input
                                  className="form-control"
                                  value={value}
                                  type="text"
                                  maxLength={15}
                                  placeholder="Enter IFSC Code"
                                  onChange={(val) => {
                                    onChange(val);
                                    trigger("bankDetails[IFSC]");
                                  }}
                                />
                                {errors.bankDetails?.IFSC && (
                                  <p className="text-danger">
                                    {errors.bankDetails?.IFSC?.message}
                                  </p>
                                )}
                              </>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div> */}

                  
