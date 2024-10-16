/* eslint-disable react/prop-types */
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import Select from "react-select";
import * as yup from "yup";

const EditProductForm = ({
  editPro,
  setNewEdit,
  afterModalSubmit,
  modalDismiss,
  setModalDismiss,
  taxList,
  module,
}) => {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        rate: yup.string().required("Enter Valid Rate"),
        tax: yup.object().required("Choose Any Tax"),
        discountAmount: yup
          .number()
          .test(
            (value) =>
              typeof value === "number" && !/[eE+-]/.test(value.toString())
          )
          .typeError("Enter Valid Discount Price"),
      })
    ),
  });
  useEffect(() => {
    if (editPro?.id) {
      setValue("rate", editPro?.rate);
      setValue("discountAmount", editPro?.discount);
    }
  }, [editPro]);
  // const [modalDismiss, setModalDismiss] = useState(false);

  const onModalSubmit = (data) => {
    setNewEdit({ ...data, id: editPro._id });
    editPro.record["discountValue"] = parseInt(data?.discountAmount);
    module == "quotation"
      ? (editPro.record["sellingPrice"] = parseInt(data?.rate))
      : (editPro.record["purchasePrice"] = parseInt(data?.rate));
    editPro.record.tax["taxRate"] = parseInt(data?.tax?.value);
    afterModalSubmit(editPro);
    setModalDismiss(false);
  };
  return (
    <Modal show={modalDismiss}>
      <div className="modal-content">
        <div className="modal-header border-0 pb-0">
          <div className="form-header modal-header-title text-start mb-0">
            <h4 className="mb-0">Add Tax &amp; Discount</h4>
          </div>
          <button
            type="button"
            className="close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <span
              className="align-center"
              onClick={() => {
                setModalDismiss(false);
              }}
              // aria-hidden="true"
            >
              ×
            </span>
          </button>
        </div>
        <form onSubmit={handleSubmit(onModalSubmit)}>
          <div className="modal-body">
            <div className="row">
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <label htmlFor="rate">Rate</label>
                  <Controller
                    name="rate"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <>
                        <input
                          type="number"
                          className="form-control"
                          placeholder={120}
                          onChange={(val) => onChange(val)}
                          value={value}
                        />
                        {}
                        {errors.rate && (
                          <p className="text-danger">{errors.rate.message}</p>
                        )}
                      </>
                    )}
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="form-group">
                  <label>Discount Amount</label>
                  <Controller
                    name="discountAmount"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <>
                        <input
                          // type="number"
                          className="form-control"
                          placeholder={0}
                          onChange={(val) => onChange(val)}
                          value={value}
                        />
                        {errors.discountAmount && (
                          <p className="text-danger">
                            {errors.discountAmount.message}
                          </p>
                        )}
                      </>
                    )}
                    defaultValue=""
                  />
                </div>
              </div>
              <div className="col-lg-12 col-md-12">
                <div className="form-group mb-0">
                  <label>Tax</label>
                  <Controller
                    name="tax"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <>
                        <Select
                          options={taxList}
                          onChange={(val) => onChange(val)}
                          value={value}
                          classNamePrefix="select_kanakku"
                        />
                        {errors.tax && (
                          <p className="text-danger">{errors.tax.message}</p>
                        )}
                      </>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <Link
              to="#"
              onClick={() => setModalDismiss(false)}
              // data-bs-dismiss="modal"
              className="btn btn-primary paid-cancel-btn me-2"
            >
              Back
            </Link>
            <button
              // to="#"
              type="submit"
              // data-bs-dismiss={
              // Object.keys(errors).length === 0 ? "modal" : null
              //   modalDismiss ? "modal" : null
              // }
              className="btn btn-primary paid-continue-btn"
              // onClick={() => setModalDismiss(false)}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditProductForm;
