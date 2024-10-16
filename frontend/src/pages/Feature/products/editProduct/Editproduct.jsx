import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import { DropIcon } from "../../../../common/imagepath";
import { EditproductContext } from "./Editproduct.control";
import useFilePreview from "../hooks/useFilePreview";
import { handleKeyDown, handleNumberRestriction } from "../../../../constans/globals";
import { warningToast } from "../../../../core/core-index";

const Addproduct = () => {
  const {
    EditproductPageschema,
    skuNumber,
    setskuNumber,
    productValues,
    UpdateForm,
    discount,
    units,
    taxData,
    categoryData,
    imgerror,
    setImgError,
  } = useContext(EditproductContext);
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    control,
    clearErrors,
    resetField,
    formState: { errors },
  } = useForm({ resolver: yupResolver(EditproductPageschema) });

  const [files, setFile] = useState([]);

  const file = watch("images");
  const [filePreview] = useFilePreview(file, setImgError);

  useEffect(() => {
    if (imgerror) {
      warningToast(imgerror);
      resetField("images");
      setImgError("");
    }
  }, [imgerror]);

  useEffect(() => {
    if (filePreview) setFile(filePreview);
  }, [filePreview]);
  useEffect(() => {
    setValue("sku", skuNumber);
    clearErrors("sku");
  }, [skuNumber]);
  useEffect(() => {
    setskuNumber(productValues?.sku);
    setFile(productValues?.images);
    setValue("type", productValues?.type);
    setValue("name", productValues?.name);
    setValue("sku", productValues?.sku);
    setValue("discountValue", productValues?.discountValue);
    setValue("barcode", productValues?.barcode);
    setValue("units", productValues?.units);
    setValue("category", productValues?.category);
    setValue("tax", productValues?.tax);
    setValue("sellingPrice", productValues?.sellingPrice);
    setValue("purchasePrice", productValues?.purchasePrice);
    let discountType = discount.find(
      (data) => data.id == productValues?.discountType
    );
    setValue("discountType", discountType);
    setValue("alertQuantity", productValues?.alertQuantity);
  }, [productValues]);

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <form onSubmit={handleSubmit(UpdateForm)}>
            <div className="page-header">
              <div className="content-page-header">
                <h5>Edit Products / Services</h5>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="card-body">
                  <div className="form-group-item">
                    <h5 className="form-title">Basic Details</h5>
                    <div className="row">
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group">
                          <label>
                            Item Type<span className="text-danger"> *</span>
                          </label>
                          <div className="align-center">
                            <div className="form-control me-3">
                              <label className="custom_radio me-3 mb-0">
                                <input
                                  {...register("type")}
                                  type="radio"
                                  value="product"
                                  id="product_type"
                                />
                                <span className="checkmark" /> Product
                              </label>
                            </div>
                            <div className="form-control">
                              <label className="custom_radio mb-0">
                                <input
                                  {...register("type")}
                                  type="radio"
                                  value="service"
                                  id="service_type"
                                />
                                <span className="checkmark" /> Service
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group input_text">
                          <label>
                            Product Name <span className="text-danger"> *</span>
                          </label>
                          <Controller
                            name="name"
                            type="text"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <input
                                className={`form-control ${
                                  errors?.name ? "error-input" : ""
                                }`}
                                type="text"
                                value={value}
                                onChange={onChange}
                                placeholder="Enter Product Name"
                                autoComplete="false"
                                
                              />
                            )}
                            defaultValue=""
                          />
                          <small>{errors?.name?.message}</small>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group add-products input_text">
                          <label>
                            Product Code (SKU)
                            <span className="text-danger"> *</span>
                          </label>
                          <Controller
                            name="sku"
                            type="text"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <input
                                className={`form-control ${
                                  errors?.sku ? "error-input" : ""
                                }`}
                                type="text"
                                value={value}
                                onChange={onChange}
                                readOnly={true}
                                disabled={true}
                                placeholder="Enter Product Code"
                                autoComplete="false"
                              />
                            )}
                            defaultValue=""
                          />
                          <button
                            type="button"
                            // eslint-disable-next-line no-undef
                            onClick={() => getskuCode()}
                            className="btn btn-primary"
                          >
                            Generate Code
                          </button>
                          <small>{errors?.sku?.message}</small>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group input_text">
                          <label>
                            Category <span className="text-danger"> *</span>
                          </label>
                          <Controller
                            name="category"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                              <Select
                                value={value}
                                onChange={onChange}
                                className={`react-selectcomponent form-control ${
                                  errors?.category ? "error-input" : ""
                                }`}
                                placeholder="Select Category"
                                getOptionLabel={(option) => `${option.name}`}
                                getOptionValue={(option) => `${option._id}`}
                                options={categoryData}
                                classNamePrefix="select_kanakku"
                              />
                            )}
                          />
                          <small>{errors?.category?._id?.message}</small>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group input_text">
                          <label>
                            Selling Price{" "}
                            <span className="text-danger"> *</span>
                          </label>
                          <Controller
                            name="sellingPrice"
                            type="number"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <input
                                className={`form-control ${
                                  errors?.sellingPrice ? "error-input" : ""
                                }`}
                                type="text"
                                onKeyPress={handleNumberRestriction}
                                value={value}
                                onChange={onChange}
                                onKeyDown={(e) => handleKeyDown(e)}
                                placeholder="Enter Selling Price"
                                autoComplete="false"
                              />
                            )}
                            defaultValue=""
                          />
                          <small>{errors?.sellingPrice?.message}</small>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group input_text">
                          <label>
                            Purchase Price{" "}
                            <span className="text-danger"> *</span>
                          </label>
                          <Controller
                            name="purchasePrice"
                            type="number"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <input
                                className={`form-control ${
                                  errors?.purchasePrice ? "error-input" : ""
                                }`}
                                type="text"
                                onKeyPress={handleNumberRestriction}
                                value={value}
                                onKeyDown={(e) => handleKeyDown(e)}
                                onChange={onChange}
                                placeholder="Enter Purchase Price"
                                autoComplete="false"
                              />
                            )}
                            defaultValue=""
                          />
                          <small>{errors?.purchasePrice?.message}</small>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group">
                          <label>
                            Units<span className="text-danger"> *</span>
                          </label>

                          <Controller
                            name="units"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                              <Select
                                value={value}
                                onChange={onChange}
                                className={`react-selectcomponent form-control ${
                                  errors?.units ? "error-input" : ""
                                }`}
                                placeholder="Select unit"
                                getOptionLabel={(option) => `${option.name}`}
                                getOptionValue={(option) => `${option._id}`}
                                options={units}
                                classNamePrefix="select_kanakku"
                              />
                            )}
                          />
                          <small>{errors?.units?._id?.message}</small>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group">
                          <label>
                            Discount Type{" "}
                            <span className="text-danger"> *</span>
                          </label>
                          <Controller
                            name="discountType"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                              <Select
                                value={value}
                                onChange={onChange}
                                className={`react-selectcomponent form-control ${
                                  errors?.discountType ? "error-input" : ""
                                }`}
                                placeholder="Select unit"
                                getOptionLabel={(option) => `${option.text}`}
                                getOptionValue={(option) => `${option.id}`}
                                options={discount}
                                classNamePrefix="select_kanakku"
                              />
                            )}
                          />
                          <small>{errors?.discountType?.id?.message}</small>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group input_text">
                          <label>
                            Discount Value{" "}
                            <span className="text-danger"> *</span>{" "}
                          </label>
                          <Controller
                            name="discountValue"
                            type="number"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <input
                                className={`form-control ${
                                  errors?.discountValue ? "error-input" : ""
                                }`}
                                type="text"
                                onKeyPress={handleNumberRestriction}
                                value={value}
                                onChange={onChange}
                                placeholder="Enter discountValue"
                                autoComplete="false"
                              />
                            )}
                            defaultValue=""
                          />
                          <small>{errors?.discountValue?.message}</small>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group input_text add-products">
                          <label>Generate Barcode</label>
                          <Controller
                            name="barcode"
                            type="number"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <input
                                className={`form-control ${
                                  errors?.barcode ? "error-input" : ""
                                }`}
                                type="text"
                                onKeyPress={handleNumberRestriction}
                                value={value}
                                onChange={onChange}
                                placeholder="Enter Barcode"
                                autoComplete="false"
                              />
                            )}
                            defaultValue=""
                          />
                        
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group input_text">
                          <label>
                            Alert Quantity{" "}
                            <span className="text-danger"> *</span>
                          </label>
                          <Controller
                            name="alertQuantity"
                            type="number"
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <input
                                className={`form-control ${
                                  errors?.alertQuantity ? "error-input" : ""
                                }`}
                                type="text"
                                onKeyPress={handleNumberRestriction}
                                value={value}
                                onKeyDown={(e) => handleKeyDown(e)}
                                onChange={onChange}
                                placeholder="Enter Alert Quantity"
                                autoComplete="false"
                              />
                            )}
                            defaultValue=""
                          />
                          <small>{errors?.alertQuantity?.message}</small>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-6 col-sm-12">
                        <div className="form-group input_text">
                          <label>
                            Tax <span className="text-danger"> *</span>
                          </label>
                          <Controller
                            name="tax"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                              <Select
                                value={value}
                                onChange={onChange}
                                className={`react-selectcomponent form-control ${
                                  errors?.tax ? "error-input" : ""
                                }`}
                                placeholder="Select Tax"
                                getOptionLabel={(option) =>
                                  `${option.name} (${option.taxRate}%)`
                                }
                                getOptionValue={(option) => `${option._id}`}
                                options={taxData}
                                classNamePrefix="select_kanakku"
                              />
                            )}
                          />
                          <small>{errors?.tax?._id?.message}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-group-item">
                    <div className="row">
                      <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                        <div className="form-group">
                          <label>Product Image</label>
                          <div className="form-group service-upload mb-0">
                            <span>
                              <img src={DropIcon} alt="upload" />
                            </span>
                            <h6 className="drop-browse align-center">
                              Drop your files here or
                              <span className="text-primary ms-1">browse</span>
                            </h6>
                            <p className="text-muted">Maximum size: 50MB</p>
                            <input
                              type="file"
                              multiple=""
                              id="image_sign"
                              {...register("images")}
                            />
                            <div id="frames" />
                          </div>
                          {!imgerror
                            ? files?.[0]?.length > 0 && (
                                <img
                                  src={files}
                                  className="uploaded-imgs"
                                  style={{
                                    display: "flex",
                                    maxWidth: "200px",
                                    maxHeight: "200px",
                                  }}
                                  alt=""
                                />
                              )
                            : null}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="add-vendor-btns text-end">
                    <Link
                      to="/product-list"
                      className="btn btn-primary cancel me-2"
                    >
                      Cancel
                    </Link>
                    <button className="btn btn-primary" type="submit">
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
export default Addproduct;
