import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select2 from "react-select2-wrapper";
import { PreviewImg, img10 } from "../common/imagepath";
import {
  listcustomerApi,
  updatecustomerApi,
  viewCustomerApi,
} from "../../constans/apiname";
// import { getData, getDataWithToken } from "../services/apiservice";
import { useDropzone } from "react-dropzone";
import { useForm, Controller } from "react-hook-form";
import { ApiServiceContext, successToast } from "../core/core-index";
import { yupResolver } from "@hookform/resolvers/yup";
import { EditCustomerContext } from "./editCustomer.control";
import {
  handleCharacterRestriction,
  handleCharacterRestrictionSpace,
  handleNumberRestriction,
  handleSpecialCharacterRestriction,
  handleSpecialCharacterSpaceRestriction,
} from "../../constans/globals";

const EditCustomers = () => {
  const {
    editCustomerschema,
    fileImage,
    setFileImage,
    customerListData,
    setCustomerEditlist,
    onSubmit,
    currencyOptions,
    setcurrencyOptions,
    getBase64,
    handleImageError,
  } = useContext(EditCustomerContext);

  const {
    handleSubmit,
    control,
    setValue,
    clearErrors,
    reset,
    trigger,
    formState: { errors },
  } = useForm({ resolver: yupResolver(editCustomerschema) });

  const { getData } = useContext(ApiServiceContext);
  const [previewImage, setPreviewImage] = useState("");
  const { getRootProps, getInputProps } = useDropzone({
    maxLength: 4,
    onDrop: (acceptedFile) => {
      // setValue("images", acceptedFile);
      setFileImage(acceptedFile);
      getBase64(acceptedFile?.[0]).then((result) => {
        acceptedFile["base64"] = result;
        setPreviewImage(acceptedFile.base64);
      });
    },
  });

  const getCustomerDetails = async () => {
    const url = `${viewCustomerApi}/${id}`;
    try {
      const response = await getData(url);
      if (response?.data) {
        setNewValues(response?.data);
        setCustomerEditlist(response?.data);
      }
      // ;
    } catch {}
  };

  useEffect(() => {
    getCustomerDetails();
  }, [id]);

  const setNewValues = (data) => {
    setValue("name", data?.name);
    // setValue("email", data?.email);
    setValue("phone", data?.phone);
    setValue("currency", data?.currency);
    setValue("website", data?.website);
    setValue("notes", data?.notes);

    setValue("billingAddress[name]", data?.billingAddress?.name);
    setValue(
      "billingAddress[addressLine1]",
      data?.billingAddress?.addressLine1
    );
    setValue(
      "billingAddress[addressLine2]",
      data?.billingAddress?.addressLine2
    );
    setValue("billingAddress[country]", data?.billingAddress?.country);
    setValue("billingAddress[city]", data?.billingAddress?.city);
    setValue("billingAddress[state]", data?.billingAddress?.state);
    setValue("billingAddress[pincode]", data?.billingAddress?.pincode);

    setValue("shippingAddress[name]", data?.shippingAddress?.name);
    setValue(
      "shippingAddress[addressLine1]",
      data?.shippingAddress?.addressLine1
    );
    setValue(
      "shippingAddress[addressLine2]",
      data?.shippingAddress?.addressLine2
    );
    setValue("shippingAddress[country]", data?.shippingAddress?.country);
    setValue("shippingAddress[city]", data?.shippingAddress?.city);
    setValue("shippingAddress[state]", data?.shippingAddress?.state);
    setValue("shippingAddress[pincode]", data?.shippingAddress?.pincode);

    setValue(
      "bankDetails[bankName]",
      data?.bankDetails?.bankName ? data?.bankDetails?.bankName : ""
    );
    setValue(
      "bankDetails[branch]",
      data?.bankDetails?.branch ? data?.bankDetails?.branch : ""
    );
    setValue(
      "bankDetails[accountHolderName]",
      data?.bankDetails?.accountHolderName
        ? data?.bankDetails?.accountHolderName
        : ""
    );
    setValue(
      "bankDetails[accountNumber]",
      data?.bankDetails?.accountNumber ? data?.bankDetails?.accountNumber : ""
    );
    setValue(
      "bankDetails[IFSC]",
      data?.bankDetails?.IFSC ? data?.bankDetails?.IFSC : ""
    );
  };


  const [imageSrc, setImageSrc] = useState(null);
  const fileInputRef = useRef(null);
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
      // Reset file input value after the file is selected
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    }
  };
  const handleRemoveImage = () => {
    setFile(null);
    setImageSrc(null);
  };

  const defaultImageSrc = PreviewImg;

  return (
    <>
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
                    <h5 className="form-title">Basics Details</h5>
                    <div className="profile-picture">
                      <div
                        className="upload-profile"
                        {...getRootProps({
                          className: "dropzone dz-clickable",
                        })}
                      >
                        <div className="profile-img add-customers">
                          {/* <img
                            id="blah"
                            className="avatar"
                            onError={handleImageError}
                            src={
                              previewImage
                                ? previewImage
                                : customerListData.image
                            }
                          /> */}
                          <img
                            id="blah"
                            className="avatar"
                            onError={(e) => handleImageError(e)}
                            // key={imageSrc}
                            src={imageSrc ? imageSrc : defaultImageSrc}
                            alt="Uploaded"
                          />
                        </div>
                        <div className="add-profile">
                          <h5>Upload a New Photoo</h5>
                          {/* <span>{fileImage?.[0]?.name}</span> */}
                        </div>
                      </div>
                      <div className="img-upload">
                        <label className="btn btn-primary">
                          Upload{" "}
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            // {...getInputProps()}
                            // onChange={handleFileInputChange}
                          />
                        </label>
                        <Link
                          className="btn btn-remove"
                          // onClick={() => {
                          //   setPreviewImage(PreviewImg);
                          //   setFileImage(null);
                          // }}
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
                                  label={"Name"}
                                  placeholder="Enter Name"
                                  onKeyPress={
                                    handleSpecialCharacterSpaceRestriction
                                  }
                                  onChange={(val) => {
                                    onChange(val);
                                    trigger("name");
                                  }}
                                />
                                {errors.name && (
                                  <p className="text-danger">
                                    {errors.name.message}
                                  </p>
                                )}
                              </>
                            )}
                          />
                        </div>
                      </div>
                      {/* <div className="col-lg-4 col-md-6 col-sm-12">
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
                                />
                                {errors.email && (
                                  <p className="text-danger">
                                    {errors.email.message}
                                  </p>
                                )}
                              </>
                            )}
                          />
                        </div>
                      </div> */}
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group">
                          <label>
                            JAG<span className="text-danger"> *</span>
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
                                  type="number"
                                  onKeyDown={(e) => handleKeyDown(e)}
                                  onKeyPress={handleNumberRestriction}
                                  placeholder="Enter Phone Numberrr"
                                  onChange={(val) => {
                                    onChange(val);
                                    trigger("phone");
                                  }}
                                />

                                <p className="text-danger">
                                  {errors.phone.message}
                                </p>
                              </>
                            )}
                          />
                          {/* <IntlTelInput
                              containerclassname="intl-tel-input"
                              inputclassname="form-control mail-icon2"
                              placeholder=""
                            /> */}
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
                                  placeholder="Select Currency"
                                  onChange={(val) => {
                                    onChange(val);
                                    trigger("currency");
                                  }}
                                />
                                {/* {errors.currency && (
                                    <p className="text-danger">
                                      {errors.currency.message}
                                    </p>
                                  )} */}
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
                                {errors.website && (
                                  <p className="text-danger">
                                    {errors.website.message}
                                  </p>
                                )}
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
                                {errors.notes && (
                                  <p className="text-danger">
                                    {errors.notes.message}
                                  </p>
                                )}
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
                          <label>
                            Name<span className="text-danger"> *</span>
                          </label>
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
                                  onKeyPress={handleCharacterRestrictionSpace}
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
                          />
                        </div>
                        <div className="form-group">
                          <label>
                            Address Line 1
                            <span className="text-danger"> *</span>
                          </label>
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
                                {errors.billingAddress?.addressLine1 && (
                                  <p className="text-danger">
                                    {
                                      errors.billingAddress?.addressLine1
                                        ?.message
                                    }
                                  </p>
                                )}
                              </>
                            )}
                          />
                        </div>
                        <div className="form-group">
                          <label>
                            Address Line 2
                            {/* <span className="text-danger"> *</span> */}
                          </label>
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
                                    trigger("billingAddress.addressLine2");
                                  }}
                                />
                                {errors.billingAddress?.addressLine2 && (
                                  <p className="text-danger">
                                    {
                                      errors.billingAddress?.addressLine2
                                        ?.message
                                    }
                                  </p>
                                )}
                              </>
                            )}
                          />
                        </div>
                        <div className="row">
                          <div className="col-lg-6 col-md-12">
                            <div className="form-group">
                              <label>
                                Country<span className="text-danger"> *</span>
                              </label>
                              <Controller
                                name="billingAddress[country]"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <>
                                    <input
                                      className="form-control"
                                      value={value}
                                      type="text"
                                      label={"Name"}
                                      placeholder="Enter Country"
                                      onKeyPress={
                                        handleCharacterRestrictionSpace
                                      }
                                      onChange={(val) => {
                                        onChange(val);
                                        trigger("billingAddress.country");
                                      }}
                                    />
                                    {errors.billingAddress?.country && (
                                      <p className="text-danger">
                                        {
                                          errors.billingAddress?.country
                                            ?.message
                                        }
                                      </p>
                                    )}
                                  </>
                                )}
                              />
                            </div>
                            <div className="form-group">
                              <label>
                                City<span className="text-danger"> *</span>
                              </label>
                              <Controller
                                name="billingAddress[city]"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <>
                                    <input
                                      className="form-control"
                                      value={value}
                                      type="text"
                                      label={"Name"}
                                      placeholder="Enter City"
                                      onKeyPress={
                                        handleCharacterRestrictionSpace
                                      }
                                      onChange={(val) => {
                                        onChange(val);
                                        trigger("billingAddress.city");
                                      }}
                                    />
                                    {errors.billingAddress?.city && (
                                      <p className="text-danger">
                                        {errors.billingAddress?.city?.message}
                                      </p>
                                    )}
                                  </>
                                )}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-12">
                            <div className="form-group">
                              <label>
                                State<span className="text-danger"> *</span>
                              </label>
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
                                      placeholder="Enter State"
                                      onKeyPress={
                                        handleCharacterRestrictionSpace
                                      }
                                      onChange={(val) => {
                                        onChange(val);
                                        trigger("billingAddress.state");
                                      }}
                                    />
                                    {errors.billingAddress?.state && (
                                      <p className="text-danger">
                                        {errors.billingAddress?.state?.message}
                                      </p>
                                    )}
                                  </>
                                )}
                              />
                            </div>
                            <div className="form-group">
                              <label>
                                Pincode<span className="text-danger"> *</span>
                              </label>
                              <Controller
                                name="billingAddress[pincode]"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <>
                                    <input
                                      className="form-control"
                                      value={value}
                                      type="text"
                                      label={"Name"}
                                      placeholder="Enter Pincode"
                                      onKeyPress={handleNumberRestriction}
                                      onChange={(val) => {
                                        onChange(val);
                                        trigger("billingAddress.pincode");
                                      }}
                                    />
                                    {errors.billingAddress?.pincode && (
                                      <p className="text-danger">
                                        {
                                          errors.billingAddress?.pincode
                                            ?.message
                                        }
                                      </p>
                                    )}
                                  </>
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="billing-btn">
                          <h5 className="form-title mb-0">Shipping Address</h5>
                          <Link to="#" className="btn btn-primary">
                            Copy from Billing
                          </Link>
                        </div>
                        <div className="form-group">
                          <label>
                            Name<span className="text-danger"> *</span>
                          </label>
                          <Controller
                            name="shippingAddress[name]"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <>
                                <input
                                  className="form-control"
                                  value={value}
                                  type="text"
                                  placeholder="Enter Name"
                                  onKeyPress={handleCharacterRestrictionSpace}
                                  onChange={(val) => {
                                    onChange(val);
                                    trigger("shippingAddress.name");
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
                          <label>
                            Address Line 1
                            <span className="text-danger"> *</span>
                          </label>
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
                                    trigger("shippingAddress.addressLine1");
                                  }}
                                />
                                {errors.shippingAddress?.addressLine1 && (
                                  <p className="text-danger">
                                    {
                                      errors.shippingAddress?.addressLine1
                                        ?.message
                                    }
                                  </p>
                                )}
                              </>
                            )}
                          />
                        </div>
                        <div className="form-group">
                          <label>
                            Address Line 2
                            {/* <span className="text-danger"> *</span> */}
                          </label>
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
                                    trigger("shippingAddress.addressLine2");
                                  }}
                                />
                                {errors.shippingAddress?.addressLine2 && (
                                  <p className="text-danger">
                                    {
                                      errors.shippingAddress?.addressLine2
                                        ?.message
                                    }
                                  </p>
                                )}
                              </>
                            )}
                          />
                        </div>
                        <div className="row">
                          <div className="col-lg-6 col-md-12">
                            <div className="form-group">
                              <label>
                                Country<span className="text-danger"> *</span>
                              </label>
                              <Controller
                                name="shippingAddress[country]"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <>
                                    <input
                                      className="form-control"
                                      value={value}
                                      type="text"
                                      placeholder="Enter Country"
                                      onKeyPress={
                                        handleCharacterRestrictionSpace
                                      }
                                      onChange={(val) => {
                                        onChange(val);
                                        trigger("shippingAddress.country");
                                      }}
                                    />
                                    {errors.shippingAddress?.country && (
                                      <p className="text-danger">
                                        {
                                          errors.shippingAddress?.country
                                            ?.message
                                        }
                                      </p>
                                    )}
                                  </>
                                )}
                              />
                            </div>
                            <div className="form-group">
                              <label>
                                City<span className="text-danger"> *</span>
                              </label>
                              <Controller
                                name="shippingAddress[city]"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <>
                                    <input
                                      className="form-control"
                                      value={value}
                                      type="text"
                                      placeholder="Enter City"
                                      onKeyPress={
                                        handleCharacterRestrictionSpace
                                      }
                                      onChange={(val) => {
                                        onChange(val);
                                        trigger("shippingAddress.city");
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
                          </div>
                          <div className="col-lg-6 col-md-12">
                            <div className="form-group">
                              <label>
                                State<span className="text-danger"> *</span>
                              </label>
                              <Controller
                                name="shippingAddress[state]"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <>
                                    <input
                                      className="form-control"
                                      value={value}
                                      type="text"
                                      placeholder="Enter State"
                                      onKeyPress={
                                        handleCharacterRestrictionSpace
                                      }
                                      onChange={(val) => {
                                        onChange(val);
                                        trigger("shippingAddress.state");
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
                              <label>
                                Pincode<span className="text-danger"> *</span>
                              </label>
                              <Controller
                                name="shippingAddress[pincode]"
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                  <>
                                    <input
                                      className="form-control"
                                      value={value}
                                      type="text"
                                      placeholder="Enter Pincode"
                                      onKeyPress={handleNumberRestriction}
                                      onChange={(val) => {
                                        onChange(val);
                                        trigger("shippingAddress.pincode");
                                      }}
                                    />
                                    {errors.shippingAddress?.pincode && (
                                      <p className="text-danger">
                                        {
                                          errors.shippingAddress?.pincode
                                            ?.message
                                        }
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
                            Bank Name<span className="text-danger"> *</span>
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
                                  placeholder="Enter Bank Name"
                                  onKeyPress={
                                    handleSpecialCharacterSpaceRestriction
                                  }
                                  onChange={(val) => {
                                    onChange(val);
                                    trigger("bankDetails.bankName");
                                  }}
                                />
                                {errors.bankDetails?.bankName && (
                                  <p className="text-danger">
                                    {errors.bankDetails?.bankName?.message}
                                  </p>
                                )}
                              </>
                            )}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group">
                          <label>
                            Branch<span className="text-danger"> *</span>
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
                                  placeholder="Enter Branch Name"
                                  onKeyPress={handleSpecialCharacterRestriction}
                                  onChange={(val) => {
                                    onChange(val);
                                    trigger("bankDetails.branch");
                                  }}
                                />
                                {errors.bankDetails?.branch && (
                                  <p className="text-danger">
                                    {errors.bankDetails?.branch?.message}
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
                            Account Holder Name
                            <span className="text-danger"> *</span>
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
                                  placeholder="Enter Account Holder Name"
                                  onKeyPress={handleCharacterRestrictionSpace}
                                  onChange={(val) => {
                                    onChange(val);
                                    trigger("bankDetails.accountHolderName");
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
                            <span className="text-danger"> *</span>
                          </label>
                          <Controller
                            name="bankDetails[accountNumber]"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <>
                                <input
                                  className="form-control"
                                  value={value}
                                  type="number"
                                  onKeyDown={(e) => handleKeyDown(e)}
                                  placeholder="Enter Account Number"
                                  onKeyPress={handleNumberRestriction}
                                  onChange={(val) => {
                                    onChange(val);
                                    trigger("bankDetails.accountNumber");
                                  }}
                                />
                                {errors.bankDetails?.accountNumber && (
                                  <p className="text-danger">
                                    {errors.bankDetails?.accountNumber?.message}
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
                            IFSC<span className="text-danger"> *</span>
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
                                  placeholder="Enter IFSC Code"
                                  onChange={(val) => {
                                    onChange(val);
                                    trigger("bankDetails.IFSC");
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
                  </div>

                  <div className="add-customer-btns text-end">
                    <Link
                      to="/customers"
                      className="btn btn-primary cancel me-2"
                    >
                      Cancel
                    </Link>
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
    </>
  );
};
export default EditCustomers;
