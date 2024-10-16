import React, { useEffect, useContext, useState, useRef } from "react";
import Select from "react-select";
import SignaturePad from "react-signature-canvas";
import { Link } from "react-router-dom";
import { Controller } from "react-hook-form";
import { dataURLtoBlob } from "./helper";
import FeatherIcon from "feather-icons-react";
import { ApiServiceContext } from "../core/core-index";
import { element } from "prop-types";

const SignaturePadComponent = ({
  setValue,
  trigger,
  register,
  clearErrors,
  formcontrol,
  errors,
  setTrimmedDataURL,
  setSignatureData,
  handleKeyPress,
  trimmedDataURL,
  data,
  setselectedSign,
  selectedSign,
}) => {
  const [SignOptions, setSignOptions] = useState([]);
  const [signature, setSignature] = useState("manualSignature");
  const [tempOption, setTempOption] = useState([]);

  const handlePaymentChange = (e) => {
    setSignature(e.target.value);
  };

  useEffect(() => {
    const optionsValue = SignOptions.find(
      (element) => element.markAsDefault == true
    );
    setValue("signatureId", optionsValue),
      setselectedSign(optionsValue?.signatureImage);
  }, [SignOptions]);

  useEffect(() => {
    if (Object.keys(data).length > 0) {
      setValue("sign_type", data?.sign_type);
      setSignature(data?.sign_type);
      if (data?.sign_type === "manualSignature") {
        let modified = data?.signatureId;
        if (modified) {
          modified.value = modified?._id;
          modified.label = modified?.signatureName;
          setValue("signatureId", modified);
          setselectedSign(modified?.signatureImage);
        }
      } else {
        setValue("signatureName", data?.signatureName);
        setTrimmedDataURL(data?.signatureImage);
        setsignData("true");
      }
    }
  }, [data]);

  const { getData } = useContext(ApiServiceContext);

  useEffect(() => {
    setValue("sign_type", "manualSignature");
    const getSignaturedata = async () => {
      const response = await getData(`/drop_down/signature`);
      if (response.code === 200) {
        setSignOptions(response?.data);
      }
    };
    getSignaturedata();
  }, []);

  const sigPadRef = useRef();
  const signPadcancelModal = useRef();
  const [signData, setsignData] = useState("false");

  const clear = (e) => {
    e.preventDefault();
    sigPadRef.current.clear();
  };

  useEffect(() => {
    setValue("signatureData", signData);
  }, [signData]);

  const trim = (e) => {
    e.preventDefault();
    const isCanvasEmpty = sigPadRef.current.isEmpty();
    if (isCanvasEmpty) {
      //
    } else {
      const signatureImage = sigPadRef.current.toDataURL();
      const blob = dataURLtoBlob(signatureImage);
      setSignatureData(blob);
      setsignData("true");
      clearErrors("signatureData");

      const dataURL = sigPadRef.current
        .getTrimmedCanvas()
        .toDataURL("image/png");
      setTrimmedDataURL(dataURL);
    }
    sigPadRef.current.clear();
    signPadcancelModal.current.click();
  };
  return (
    <>
      <div>
        <ul className="nav nav-pills" id="pills-tab" role="tablist">
          <li className="nav-item" role="presentation">
            <label
              className="custom_radio me-4 mb-0"
              id="home-tab"
              data-bs-toggle="tab"
              data-bs-target="#home"
              type="button"
              role="tab"
              aria-controls="home"
              aria-selected="false"
            >
              <input
                type="radio"
                {...register("sign_type")}
                className="form-control"
                name="sign_type"
                value="manualSignature"
                //checked={signature == "manualSignature"}
                onChange={handlePaymentChange}
              />
              <span className="checkmark" /> Manual Signature
            </label>
          </li>
          <li className="nav-item" role="presentation">
            <label
              className="custom_radio me-2 mb-0 active"
              id="profile-tab"
              data-bs-toggle="tab"
              data-bs-target="#profile"
              type="button"
              role="tab"
              aria-controls="profile"
              aria-selected="true"
            >
              <input
                type="radio"
                {...register("sign_type")}
                className="form-control"
                name="sign_type"
                value="eSignature"
                //checked={signature == "eSignature"}
                onChange={handlePaymentChange}
              />
              <span className="checkmark" /> eSignature
            </label>
          </li>
        </ul>
        <small>{errors?.sign_type?.message}</small>
        {signature == "manualSignature" ? (
          <div className="tab-content">
            <div
              className="tab-pane fade show active"
              id="home"
              role="tabpanel"
              aria-labelledby="home-tab"
            >
              <div className="input-block mb-3">
                <div className="form-group mb-0 input_text">
                  <label>
                    Select Signature Name{" "}
                    <span className="text-danger"> *</span>
                  </label>
                  <Controller
                    name="signatureId"
                    control={formcontrol}
                    render={({ field }) => (
                      <Select
                        // styles={styles}
                        value={field.value}
                        className={`react-selectcomponent form-control w-100`}
                        placeholder="Select Signature"
                        options={SignOptions}
                        classNamePrefix="select_kanakku"
                        onChange={(selectedOption) => {
                          field.onChange(selectedOption);
                          setTempOption(selectedOption);
                          trigger("signatureId");
                          setselectedSign(selectedOption?.signatureImage);
                        }}
                      />
                    )}
                  />
                  <small>{errors?.signatureId?.value?.message}</small>
                </div>
              </div>
              <div className="input-block mb-0">
                {selectedSign == undefined ? (
                  <></>
                ) : (
                  <>
                    <label>Signature Image</label>
                    <div>
                      <span>
                        <img
                          src={selectedSign}
                          // src={UserSign}
                          onError={(event) => {
                            event.target.style.display = "none";
                          }}
                          alt="signature"
                          className="uploaded-imgs"
                          style={{
                            display: "flex",
                            maxWidth: "200px",
                            maxHeight: "200px",
                            minHeight: "100px",
                          }}
                        />
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div
            className=" tab-content"
            id="profile"
            role="tabpanel"
            aria-labelledby="profile-tab"
          >
            <div className="input-block mb-3">
              <div className="form-group">
                <label>
                  Signature Name
                  <span className="text-danger"> *</span>
                </label>
                <Controller
                  name="signatureName"
                  type="text"
                  control={formcontrol}
                  render={({ field: { value, onChange } }) => (
                    <input
                      className={`form-control ${
                        errors?.signatureName ? "error-input" : ""
                      }`}
                      type="text"
                      value={value ? value : "" || ""}
                      onChange={onChange}
                      placeholder="Enter Signature Name"
                      autoComplete="false"
                      onKeyPress={handleKeyPress}
                    />
                  )}
                  defaultValue=""
                />
                <small className="text-danger">
                  {errors?.signatureName?.message}
                </small>
              </div>
            </div>
            <div className="input-block mb-0">
              <ul className="nav nav-pills" id="pills-tab" role="tablist">
                <li className="nav-item" role="presentation">
                  <div className="form-group mb-0">
                    <label
                      className="custom_radio me-2 mb-0 e-signature"
                      id="e-signature-tab"
                      type="button"
                    >
                      Draw your eSignature
                    </label>
                    <div
                      data-bs-toggle="modal"
                      data-bs-target="#draw_signature"
                      className="form-group service-upload service-upload-info mt-3 mb-0"
                    >
                      <span>
                        <FeatherIcon icon="edit" className="me-1" />
                        Draw Signature
                      </span>
                      <div id="frames" />
                    </div>
                    <small>{errors?.signatureData?.message}</small>
                    {trimmedDataURL && (
                      <img
                        className="uploaded-imgs signature_sigImage"
                        style={{
                          display: "flex",
                          maxWidth: "200px",
                          maxHeight: "400px",
                          minHeight: "100px",
                        }}
                        src={trimmedDataURL}
                        alt="Signature"
                      />
                    )}
                  </div>
                </li>
              </ul>
              <div className="tab-content">
                <div
                  className="tab-pane fade show active"
                  id="upload-signature"
                  role="tabpanel"
                  aria-labelledby="upload-signature-tab"
                ></div>
                <div
                  className="tab-pane fade"
                  id="e-signature"
                  role="tabpanel"
                  aria-labelledby="e-signature-tab"
                >
                  <div className="e-signature-block">
                    <div className="signature-draw-area"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Drawing pad modal */}
      <div
        className="modal custom-modal fade"
        id="draw_signature"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered modal-md">
          {/* <form> */}
          <div className="modal-content" style={{ width: "auto" }}>
            <div className="modal-header border-0 pb-0">
              {
                <div className="form-header modal-header-title text-start mb-0">
                  <h4 className="mb-0">Draw Signature</h4>
                </div>
              }
              <button
                type="button"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={(e) => {
                  clear(e);
                }}
              >
                <span className="align-center" aria-hidden="true">
                  ×
                </span>
              </button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <div className="signature_container">
                    <div className="signature_sigContainer">
                      <input
                        {...register("signatureData")}
                        control={formcontrol}
                        type="hidden"
                        name="signatureData"
                        value={signData}
                        onChange={(val) => {
                          setsignData(val);
                          onChange(val);
                          trigger("signatureData");
                        }}
                      />

                      <SignaturePad
                        canvasProps={{
                          width: "600",
                          height: "300",
                          clearonresize: "false",
                          className: "signature_canvas",
                        }}
                        ref={sigPadRef}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <Link
                onClick={(e) => {
                  clear(e);
                }}
                to="/invoice-list"
                type="reset"
                className="btn btn-danger paid-cancel-btn me-2"
              >
                Clear
              </Link>
              <Link
                onClick={(e) => {
                  clear(e);
                }}
                to="#"
                ref={signPadcancelModal}
                data-bs-dismiss="modal"
                className="btn btn-primary paid-cancel-btn me-2"
              >
                Cancel
              </Link>
              <button
                onClick={(e) => {
                  trim(e);
                }}
                className="btn btn-primary paid-continue-btn"
                type="submit"
              >
                Save
              </button>
            </div>
          </div>
          {/* </form> */}
        </div>
      </div>
    </>
  );
};

export default SignaturePadComponent;
