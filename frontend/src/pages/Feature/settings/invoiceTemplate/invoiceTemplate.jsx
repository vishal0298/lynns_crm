/* eslint-disable no-undef */

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Invoice1,
  Invoice2,
  Invoice3,
  Invoice4,
  Invoice5,
} from "../../../../common/imagepath";
import { useDispatch } from "react-redux";
import { setInvoiceTemplate } from "../../../../reduxStore/appSlice";
import SettingSidebar from "../settingSidebar";
import { useSelector } from "react-redux";

const InvoiceTemplate = () => {
  const dispatch = useDispatch();

  const { invoiceTemplate } = useSelector((state) => state.app);

  const handleTemplate = (type) => {
    dispatch(setInvoiceTemplate(type));
  };

  const [selectedImage, setSelectedImage] = useState(null);

  const imageLinks = [Invoice1, Invoice2, Invoice3, Invoice4, Invoice5];

  const handleImageClick = (imageSrc) => {
    setSelectedImage(imageSrc);
  };

  useEffect(() => {
    if ($('[data-bs-toggle="tooltip"]').length > 0) {
      var tooltipTriggerList = [].slice.call(
        document.querySelectorAll('[data-bs-toggle="tooltip"]')
      );
      var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
      });
    }
  }, []);

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          {/* Page Header */}
          {/* /Page Header */}
          <div className="row">
            <div className="col-xl-3 col-md-4">
              <div className="card">
                <div className="card-body">
                  <div className="page-header">
                    <div className="content-page-header">
                      <h5>Settings</h5>
                    </div>
                  </div>
                  {/* Settings Menu */}
                  <SettingSidebar />
                  {/* /Settings Menu */}
                </div>
              </div>
            </div>
            <div className="col-xl-9 col-md-8">
              <div className="w-100 pt-0">
                <div className="content-page-header">
                  <h5>Invoice Templates</h5>
                </div>
                <div className="card template-invoice-card">
                  <div className="card-body pb-0">
                    <div className="invoice-card-title">
                      <h6>Invoice</h6>
                    </div>
                    <div className="row">
                      {/* Invoice List */}
                      {imageLinks.map((imageSrc, index) => (
                        <>
                          <div className="col-md-6 col-xl-3 col-sm-12 d-md-flex d-sm-block">
                            <div className="blog grid-blog invoice-blog flex-fill  d-flex flex-wrap align-content-betweens ">
                              <div className="blog-image">
                                <Link
                                  to="#"
                                  className="img-general"
                                  data-bs-toggle="modal"
                                  data-bs-target="#general_invoice_one"
                                  onClick={() => handleImageClick(imageSrc)}
                                >
                                  <img
                                    className="img-fluid"
                                    src={imageSrc}
                                    alt="Post Image"
                                  />
                                </Link>
                                <Link
                                  to="#"
                                  className="preview-invoice"
                                  data-bs-toggle="modal"
                                  data-bs-target="#general_invoice_one"
                                >
                                  <i className="fa-regular fa-eye" />
                                </Link>
                              </div>
                              <div className="invoice-content-title">
                                <Link
                                  to="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#general_invoice_one"
                                >
                                  General Invoice {index + 1}
                                </Link>
                                <span
                                  className="invoice-star"
                                  data-bs-toggle="tooltip"
                                  data-bs-placement="left"
                                  title=""
                                  data-bs-original-title="Make as default"
                                  style={
                                    invoiceTemplate == `${index + 1}`
                                      ? {
                                          background: "#e3271e",
                                          color: "#ffffff",
                                        }
                                      : {}
                                  }
                                  onClick={() => handleTemplate(`${index + 1}`)}
                                >
                                  <i className="fa-regular fa-star" />
                                </span>
                              </div>
                            </div>
                          </div>
                        </>
                      ))}
                      {/* /Invoice List */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        id="general_invoice_one"
        className="modal custom-modal invoice-model fade"
        role="dialog"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-md"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header border-0 p-0">
              <span
                className="close-model"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="fa-solid fa-xmark" />
                Close
              </span>
            </div>
            <div className="modal-body">
              <img src={selectedImage} alt="modal-img" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceTemplate;
