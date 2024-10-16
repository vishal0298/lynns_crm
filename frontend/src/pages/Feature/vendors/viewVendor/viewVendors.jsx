import React, { useContext, useEffect } from "react";
import { Controller,useForm } from "react-hook-form";
import { EditvendorContext } from "./viewVendor.control";

const ViewVendor = () => {
  const {
    vendorDetails,
    radio1,
    setRadio2,
    setRadio1,
  } = useContext(EditvendorContext);

  const {control,setValue,trigger } = useForm({});

  useEffect(() => {
    setValue("vendor_name", vendorDetails?.vendor_name);
    setValue("vendor_email", vendorDetails?.vendor_email);
    setValue("vendor_phone", vendorDetails?.vendor_phone);
    setValue("balance", vendorDetails?.balance);
    vendorDetails?.balanceType == "Debit" ? setRadio1(true) : setRadio1(false);
    vendorDetails?.balanceType == "Credit" ? setRadio2(true) : setRadio2(false);
  }, [vendorDetails]);

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <div className="page-header">
          <div className="content-page-header">
            <h5>Vendor Details</h5>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <form>
              <div className="card-body add-vendor">
                <div className="form-group-item border-0 pb-0">
                  <div className="row">
                    <div className="col-lg-6 col-sm-12">
                      <div className="form-group">
                        <label>
                          Name 
                        </label>
                        <Controller
                          name="vendor_name"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <>
                              <input
                                className="form-control"
                                value={value}
                                type="text"
                                placeholder="Enter Name"
                                disabled={true}
                                readOnly={true}
                                onChange={(val) => {
                                  onChange(val);
                                  trigger("vendor_name");
                                }}
                              />
                            </>
                          )}
                          defaultValue=""
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-sm-12">
                      <div className="form-group">
                        <label>
                          Email
                        </label>
                        <Controller
                          name="vendor_email"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <>
                              <input
                                className="form-control"
                                value={value}
                                type="text"
                                placeholder="Enter Email Address"
                                disabled={true}
                                readOnly={true}
                                onChange={(val) => {
                                  onChange(val);
                                  trigger("vendor_email");
                                }}
                              />
                            </>
                          )}
                          defaultValue=""
                        />
                      </div>
                    </div>

                    <div className="col-lg-6 col-sm-12">
                      <div className="form-group">
                        <label>
                          Phone Number
                        </label>
                        <Controller
                          name="vendor_phone"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <>
                              <input
                                className="form-control"
                                value={value}
                                type="text"
                                placeholder="Enter Phone Number"
                                disabled={true}
                                readOnly={true}
                                onChange={(val) => {
                                  onChange(val);
                                  trigger("vendor_phone");
                                }}
                              />
                            </>
                          )}
                          defaultValue=""
                        />
                      </div>
                    </div>

                    <div className="col-lg-6 col-sm-12">
                      <div className="form-group">
                        <label>Closing Balance</label>
                        <Controller
                          name="balance"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <>
                              <input
                                className="form-control"
                                value={value}
                                type="text"
                                placeholder="Enter Balance Amount"
                                disabled={true}
                                readOnly={true}
                                onChange={(val) => {
                                  onChange(val);
                                  trigger("balance");
                                }}
                              />
                            </>
                          )}
                          defaultValue=""
                        />
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12">
                      <div className="form-group d-inline-flex align-center mb-0">
                        <label className="me-5 mb-0">{"  "}Mode : {radio1 ? "Debit":"Credit"}</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewVendor;
