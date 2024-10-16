import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AddUnitsContext } from "./addUnits.control";
import { handleCharacterRestrictionSpace } from "../../../../constans/globals";

const AddUnit = () => {
  const { schema, onSubmit } = useContext(AddUnitsContext);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="content-page-header">
          <h5>Add Unit</h5>
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
                                onKeyPress={handleCharacterRestrictionSpace}
                                onChange={(val) => {
                                  onChange(val);
                                  // trigger("name");
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
                    <div className="col-lg-4 col-md-6 col-sm-12">
                      <div className="form-group">
                        <label>
                          Symbol <span className="text-danger">*</span>
                        </label>
                        <Controller
                          name="symbol"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <>
                              <input
                                className="form-control"
                                value={value}
                                type="text"
                                // maxLength={2}
                                placeholder="Enter Symbol"
                                label={"Name"}
                                onChange={(val) => {
                                  onChange(val);
                                  // trigger("symbol");
                                }}
                              />
                              {errors.symbol && (
                                <p className="text-danger">
                                  {errors.symbol.message}
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
                <div className="text-end mt-4 units-submit">
                  <Link to="/units" className="btn btn-primary cancel me-2">
                    Cancel
                  </Link>
                  <button to="/units" className="btn btn-primary" type="submit">
                    Add Unit
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

export default AddUnit;
