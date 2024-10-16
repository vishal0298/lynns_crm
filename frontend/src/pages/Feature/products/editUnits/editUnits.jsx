import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { EditUnitsContext } from "./editUnits.control";
import {
  handleCharacterRestriction,
  handleCharacterRestrictionSpace,
} from "../../../../constans/globals";

const EditUnits = () => {
  const { schema, unitEdit, onSubmit } = useContext(EditUnitsContext);

  const {
    handleSubmit,
    control,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    setValue("name", unitEdit?.name);
    setValue("symbol", unitEdit?.symbol);
  }, [unitEdit]);

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="content-page-header">
          <h5>Edit Unit</h5>
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
                                // maxLength={10}
                                onKeyPress={handleCharacterRestrictionSpace}
                                placeholder="Enter Name"
                                label={"Name"}
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
                                placeholder="Enter Symbol"
                                onKeyPress={handleCharacterRestriction}
                                label={"Name"}
                                // maxLength={2}
                                onChange={(val) => {
                                  onChange(val);
                                  trigger("symbol");
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
                    Update Unit
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

export default EditUnits;
