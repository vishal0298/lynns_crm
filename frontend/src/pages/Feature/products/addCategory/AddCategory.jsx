import React, { useContext, useState } from "react";
import { DropIcon } from "../../../../common/imagepath";
import { Controller } from "react-hook-form";
import { AddcategoryContext } from "./AddCategory.control";
import { Link } from "react-router-dom";
import useFilePreview from "../hooks/useFilePreview";
import {
  handleCharacterRestriction,
  handleCharacterRestrictionSpace,
} from "../../../../constans/globals";

const Addcategory = () => {
  const {
    SubmitCategoryForm,
    handleSubmit,
    watch,
    control,
    trigger,
    register,

    formState: { errors },
  } = useContext(AddcategoryContext);

 
  const [imgerror, setImgError] = useState("");
  const file = watch("image");
  const [filePreview] = useFilePreview(file, setImgError);

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="content-page-header">
          <h5>Add Category</h5>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="card-body">
              <form onSubmit={handleSubmit(SubmitCategoryForm)}>
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
                          defaultValue=""
                          render={({ field: { value, onChange } }) => (
                            <>
                              <input
                                className="form-control"
                                value={value}
                                type="text"
                                placeholder="Enter Name"
                                label={"Name"}
                                onKeyPress={handleCharacterRestrictionSpace}
                                // maxLength={21}
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
                    <div className="col-lg-4 col-sm-12">
                      <div className="form-group">
                        <label>
                          Slug<span className="text-danger"> *</span>
                        </label>
                        <Controller
                          name="slug"
                          control={control}
                          defaultValue=""
                          render={({ field: { value, onChange } }) => (
                            <>
                              <input
                                className="form-control"
                                value={value}
                                type="text"
                                placeholder="Enter Slug"
                                label={"Name"}
                                maxLength={21}
                                onKeyPress={handleCharacterRestriction}
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
                        
                        {!imgerror && filePreview && (
                          <img
                            src={filePreview}
                            className="uploaded-imgs"
                            style={{
                              display: "flex",
                              maxWidth: "200px",
                              maxHeight: "200px",
                            }}
                          />
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
                    Add Category
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

export default Addcategory;
