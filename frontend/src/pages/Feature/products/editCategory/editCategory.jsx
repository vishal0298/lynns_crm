import React, { useState, useEffect, useContext } from "react";
import { DropIcon } from "../../../../common/imagepath";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { yupResolver } from "@hookform/resolvers/yup";
import { EditCategoryContext } from "./editCategory.control";
import useFilePreview from "../hooks/useFilePreview";
import { warningToast } from "../../../../core/core-index";
import {
  handleCharacterRestriction,
  handleCharacterRestrictionSpace,
} from "../../../../constans/globals";

const EditCategory = () => {
  const { addcategoryPageschema, categoryDeatil, setFileImage, onSubmit } =
    useContext(EditCategoryContext);

  const {
    handleSubmit,
    control,
    setValue,
    trigger,
    resetField,
    watch,
    register,
    formState: { errors },
  } = useForm({ resolver: yupResolver(addcategoryPageschema) });
  const [imgerror, setImgError] = useState("");
  const file = watch("image");
  const [filePreview] = useFilePreview(file, setImgError);
  const [img, setImg] = useState("");
  useEffect(() => {
    if (imgerror) {
      warningToast(imgerror);
      resetField("image");
      setImgError("");
    }
  }, [imgerror]);
  useEffect(() => {
    setValue("name", categoryDeatil?.name);
    setValue("slug", categoryDeatil?.slug);
    // setValue("parent_Category", categoryDeatil?.parent_Category);
    // setValue("image", categoryDeatil?.image);
    setImg(categoryDeatil?.image);
  }, [categoryDeatil]);

  // eslint-disable-next-line no-unused-vars
  const { getRootProps, getInputProps } = useDropzone({
    maxLength: 4,
    onDrop: (acceptedFile) => {
      setValue("image", acceptedFile);
      setFileImage(acceptedFile);
    },
  });
  useEffect(() => {
    if (imgerror) {
      warningToast(imgerror);
      setImgError("");
    }
  }, [imgerror]);

  // const handleImageError = (event) => {
  //   event.target.src = DetailsLogo;
  // };

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="content-page-header">
          <h5>Edit Category</h5>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group-item border-0 pb-0 mb-0">
                  <div className="row">
                    <div className="col-lg-4 col-sm-12">
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
                                // maxLength={20}
                                onKeyPress={handleCharacterRestrictionSpace}
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
                          defaultValue=""
                        />
                       
                      </div>
                    </div>
                    <div className="col-lg-4 col-sm-12">
                      <div className="form-group">
                        <label>
                          Slug<span className="text-danger"> *</span>
                        </label>
                        <Controller
                          name="slug"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <>
                              <input
                                className="form-control"
                                value={value}
                                type="text"
                                placeholder="Enter Slug"
                                label={"Name"}
                                onKeyPress={handleCharacterRestriction}
                                maxLength={20}
                                onChange={(val) => {
                                  onChange(val);
                                  trigger("slug");
                                }}
                              />
                              {errors.slug && (
                                <p className="text-danger">
                                  {errors.slug.message}
                                </p>
                              )}
                            </>
                          )}
                          defaultValue=""
                        />
                      </div>
                    </div>

                    <div className="col-lg-6 col-sm-12">
                      <div className="form-group mb-0 pb-0">
                        <label>Image</label>
                        <div className="form-group service-upload mb-0">
                          <div
                          
                          >
                            <span>
                              <img src={DropIcon} alt="upload" />
                            </span>
                            <h6 className="drop-browse align-center">
                              Drop your files here or
                              <span className="text-primary ms-1">browse</span>
                            </h6>
                            <p className="text-muted">Maximum size: 50MB</p>
                            <>
                              <Controller
                                name="image"
                                control={control}
                                // eslint-disable-next-line no-unused-vars
                                render={({ field: { value, onChange } }) => (
                                  <>
                                    <input
                                      type="file"
                                      multiple=""
                                      id="image"
                                      {...register("image")}
                                    />
                                  </>
                                )}
                              />
                              <div id="frames" />
                            </>
                          </div>
                        </div>
                        
                        {!imgerror && filePreview ? (
                          <img
                            src={filePreview}
                            className="uploaded-imgs"
                            style={{
                              display: "flex",
                              maxWidth: "200px",
                              maxHeight: "200px",
                            }}
                          />
                        ) : (
                          img && (
                            <img
                              src={img}
                              // onError={handleImageError}
                              className="uploaded-imgs"
                              style={{
                                display: "flex",
                                maxWidth: "200px",
                                maxHeight: "200px",
                              }}
                            />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-end">
                  <Link to="/category" className="btn btn-primary cancel me-2">
                    Cancel
                  </Link>
                  <button className="btn btn-primary" type="submit">
                    Update Category
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

export default EditCategory;
