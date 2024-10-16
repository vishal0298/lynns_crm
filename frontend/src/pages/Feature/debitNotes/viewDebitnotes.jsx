import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ApiServiceContext, debit_note, unitsApi } from "../../../core/core-index";
import { DetailsLogo } from "../../../common/imagepath";
import { Table } from "antd";
import FeatherIcon from "feather-icons-react";
import { commonDatacontext } from "../../../core/commonData";
import dayjs from "dayjs";

const ViewDebitnotes = () => {
  const { getData } = useContext(ApiServiceContext);
  const { View } = debit_note;
  const [dataSource, setDataSource] = useState([]);
  const [poData, setPurchaseOorderdata] = useState([]);
  const [unitsList, setUnitsList] = useState([]);
  const { id } = useParams();

  const getViewDetails = async () => {
    try {
      const viewPodata = await getData(`${View}/${id}`);
      if (viewPodata.code === 200) {
        setPurchaseOorderdata(viewPodata?.data);
        setDataSource(viewPodata?.data?.items);
      }
    } catch (error) {
      // ;
    }
  };

  useEffect(() => {
    getViewDetails();
    getUnitsList();
  }, []);

  const getUnitsList = async () => {
    try {
      const response = await getData(`${unitsApi}`);
      // ;
      if (response) {
        setUnitsList(response?.data);
        // setFilterList(response?.data);
      }
    } catch {
      return false;
    }
  };

  const { currencyData, companyData } = useContext(commonDatacontext);

  const handleImageError = (event) => {
    event.target.src = DetailsLogo;
  };

  const columns = [
    {
      title: "Product / Service",
      dataIndex: "name",
    },
    {
      title: "Unit",
      dataIndex: "unit",
      render: (text) => {
        let result = unitsList?.find((item) => item?._id == text);
        // ;
        return <span>{result?.name}</span>;
      },
    },
    {
      title: "quantity",
      dataIndex: "quantity",
    },
    {
      title: "Rate",
      dataIndex: "rate",
      render: (text, record) => (
        <>
          {currencyData ? currencyData : "$"}
          {Number(record?.rate).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </>
      ),
    },
    {
      title: "Discount",
      dataIndex: "discount",
      render: (text, record) => (
        <>
          {currencyData ? currencyData : "$"}
          {record?.discountValue}
        </>
      ),
    },
    {
      title: "Tax",
      dataIndex: "tax",
      render: (text, record) => (
        <>
          {currencyData ? currencyData : "$"}
          {record?.tax}
        </>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (text, record) => (
        <>
          {currencyData ? currencyData : "$"}
          {Number(record?.amount).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </>
      ),
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        {/* Page Header */}
        <div className="page-header">
          <div className="content-invoice-header">
            <h5>Debit notes Details</h5>
            <div className="list-btn">
              <ul className="filter-list">
                {/* <li>
                  <Link
                    className="btn btn-import me-2"
                    to="#"
                  >
                    <span>
                     
                      <FeatherIcon icon="printer" className="me-2"/>
                      Print
                    </span>
                  </Link>
                </li>
                <li>
                  <Link to="#" className="btn btn-primary" download="">
                    <i className="fa fa-download me-2" aria-hidden="true" />
                    Download
                  </Link>
                </li> */}
              </ul>
            </div>
          </div>
        </div>
        {/* /Page Header */}
        <div className="row justify-content-center">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-body">
                <div className="card-table">
                  <div className="card-body">
                    {/* Invoice Logo */}
                    <div className="invoice-item invoice-item-one">
                      <div className="row align-items-center">
                        <div className="col-md-6">
                          <div className="invoice-logo">
                            <img
                              src={companyData?.siteLogo}
                              onError={handleImageError}
                              alt="logo"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="invoice-info">
                            <h1>Debit notes</h1>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* /Invoice Logo */}
                    {/* Invoice Date */}
                    <div className="invoice-item invoice-item-date">
                      <div className="row">
                        <div className="col-md-6">
                          <p className="text-start invoice-details">
                            Date<span>: </span>
                            <strong>
                              {dayjs(poData?.purchaseOrderDate).format(
                                "DD-MM-YYYY"
                              )}
                            </strong>
                          </p>
                        </div>
                        <div className="col-md-6">
                          <p className="invoice-details">
                            Debit Note No<span>: </span>
                            <strong>{poData?.debit_note_id}</strong>
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* /Invoice Date */}
                    {/* Invoice To */}
                    <div className="invoice-item invoice-item-two">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="invoice-info">
                            <strong className="customer-text-one">
                              Debit Note To<span>:</span>
                            </strong>
                            <p className="invoice-details-two">
                              {poData?.vendorId?.vendor_name}
                              <br />
                              {poData?.vendorId?.vendor_email}
                              <br />
                              {poData?.vendorId?.vendor_phone}
                              {/* <br />
                              United Kingdom */}
                            </p>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="invoice-info invoice-info2">
                            <strong className="customer-text-one">
                              Pay To<span>:</span>
                            </strong>
                            <p className="invoice-details-two text-start">
                              {companyData?.companyName
                                ? companyData?.companyName
                                : ""}
                              <br />
                              {companyData?.companyAddress
                                ? companyData?.companyAddress
                                : "" || companyData?.addressLine1
                                ? companyData?.addressLine1
                                : "" || companyData?.addressLine2
                                ? companyData?.addressLine2
                                : ""}{" "}
                              {companyData?.city ? companyData?.city : ""}
                              <br />
                              {companyData?.state
                                ? companyData?.state
                                : ""}{" "}
                              {companyData?.pincode ? companyData?.pincode : ""}
                              <br />
                              {companyData?.country ? companyData?.country : ""}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* /Invoice To */}
                    {/* Invoice Item */}
                    <div className="invoice-item invoice-table-wrap">
                      <div className="invoice-table-head">
                        <h6>Items:</h6>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <div className=" card-table">
                            <div className="card-body product-list">
                              <div className="table-responsive table-hover table-striped">
                                <Table
                                  bordered
                                  dataSource={dataSource}
                                  columns={columns}
                                  pagination={{ position: ["none", "none"] }}
                                  rowKey={(record) => record?.productId}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* /Invoice Item */}
                    {/* Terms & Conditions */}
                    <div className="terms-conditions credit-details">
                      <div className="row align-items-center justify-content-between">
                        <div className="col-lg-6 col-md-6">
                          <div className="invoice-terms align-center justify-content-start">
                            <span className="invoice-terms-icon bg-white-smoke me-3">
                              <i className="fe fe-file-text">
                                <FeatherIcon icon="file-text" />
                              </i>
                            </span>
                            <div className="invocie-note">
                              <h6>Terms &amp; Conditions</h6>
                              <p className="mb-0">
                                {poData?.termsAndCondition}
                              </p>
                            </div>
                          </div>
                          <div className="invoice-terms align-center justify-content-start">
                            <span className="invoice-terms-icon bg-white-smoke me-3">
                              <i className="fe fe-file-minus">
                                <FeatherIcon icon="file-minus" />
                              </i>
                            </span>
                            <div className="invocie-note">
                              <h6>Note</h6>
                              <p className="mb-0">{poData?.notes}</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-5 col-md-6">
                          <div className="invoice-total-card">
                            <div className="invoice-total-box">
                              <div className="invoice-total-inner">
                                <p>
                                  Amount
                                  <span>
                                    {" "}
                                    {currencyData ? currencyData : "$"}
                                    {/* {poData?.taxableAmount} */}
                                    {Number(
                                      poData?.taxableAmount
                                    ).toLocaleString("en-IN", {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })}
                                  </span>
                                </p>
                                <p>
                                  Discount
                                  <span>
                                    {" "}
                                    {currencyData ? currencyData : "$"}
                                    {/* {poData?.totalDiscount} */}
                                    {Number(
                                      poData?.totalDiscount
                                    ).toLocaleString("en-IN", {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })}
                                  </span>
                                </p>
                                <p>
                                  Tax
                                  <span>
                                    {" "}
                                    {currencyData ? currencyData : "$"}
                                    {/* {poData?.vat} */}
                                    {Number(poData?.vat).toLocaleString(
                                      "en-IN",
                                      {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      }
                                    )}
                                  </span>
                                </p>
                              </div>
                              <div className="invoice-total-footer">
                                <h4>
                                  Total Amount{" "}
                                  <span>
                                    {" "}
                                    {currencyData ? currencyData : "$"}
                                    {/* {poData?.TotalAmount} */}
                                    {Number(poData?.TotalAmount).toLocaleString(
                                      "en-IN",
                                      {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      }
                                    )}
                                  </span>
                                </h4>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="invoice-sign text-end">
                      <span className="d-block">{poData?.signatureName}</span>
                      {/* <img
                          className="img-fluid d-inline-block"
                          src={poData?.signature_image}
                          alt="sign"
                        /> */}
                      {poData?.signatureImage && (
                        <img
                          className="img-fluid d-inline-block uploaded-imgs"
                          style={{
                            display: "flex",
                            maxWidth: "200px",
                            maxHeight: "200px",
                          }}
                          src={poData?.signatureImage}
                          alt=""
                        />
                      )}
                    </div>
                    {/* /Terms & Conditions */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDebitnotes;
