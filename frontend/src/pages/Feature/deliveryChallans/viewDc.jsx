import React, { useContext, useEffect, useState } from "react";
import Header from "../layouts/Header";
import Sidebar from "../layouts/Sidebar";
import { useParams } from "react-router-dom";
import {
  ApiServiceContext,
  delivery_challans,
  productListapi,
  unitsApi,
} from "../../../core/core-index";
import { DetailsLogo } from "../../../common/imagepath";
import { Table } from "antd";
import FeatherIcon from "feather-icons-react";
import { commonDatacontext } from "../../../core/commonData";
import moment from "moment";

const ViewDc = () => {
  const { getData } = useContext(ApiServiceContext);
  const { View } = delivery_challans;
  const [menu, setMenu] = useState(false);
  const toggleMobileMenu = () => setMenu(!menu);
  const [dataSource, setDataSource] = useState([]);
  const [poData, setPurchaseOorderdata] = useState([]);
  const [unitsList, setUnitsList] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const { id } = useParams();

  const getViewDetails = async () => {
    try {
      const viewPodata = await getData(`${View}/${id}`);
      if (viewPodata.code === 200) {
        setPurchaseOorderdata(viewPodata?.data);
        setDataSource(viewPodata?.data?.dc_details?.items);
      }
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    getViewDetails();
    getUnitsList();
    getProductsList();
  }, []);

  const getUnitsList = async () => {
    try {
      const response = await getData(`${unitsApi}`);
      if (response) {
        setUnitsList(response?.data);
       
      }
    } catch {
      return false;
    }
  };
  const getProductsList = async () => {
    try {
      const response = await getData(`${productListapi}`);
      if (response) {
        setProductsList(response?.data);
        
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
      dataIndex: "productId",
      render: (text) => {
        let result = productsList?.find((item) => item?._id == text);
        return <span>{result?.name}</span>;
      },
    },
    {
      title: "Unit",
      dataIndex: "unit",
      render: (text) => {
        let result = unitsList?.find((item) => item?._id == text);
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
          {(record?.rate * (Number(record?.discount) / 100)).toFixed(2)}
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
    <div className={`main-wrapper ${menu ? "slide-nav" : ""}`}>
      <Header onMenuClick={() => toggleMobileMenu()} />
      <Sidebar />
      <div className="page-wrapper">
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="content-invoice-header">
              <h5>Delivery Challan Details</h5>
              <div className="list-btn">
                <ul className="filter-list"></ul>
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
                              <h1>Delivery Challan</h1>
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
                                {moment(
                                  poData?.dc_details?.deliveryChallanDate
                                ).format("DD-MM-YYYY")}
                              </strong>
                            </p>
                          </div>
                          <div className="col-md-6">
                            <p className="invoice-details">
                              Invoice No<span>: </span>
                              <strong>
                                {poData?.dc_details?.deliveryChallanNumber}
                              </strong>
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
                                Quotation To<span>:</span>
                              </strong>
                              <p className="invoice-details-two">
                                {poData?.dc_details?.customerId?.name}
                                <br />
                                {poData?.dc_details?.customerId?.email}
                                <br />
                                {poData?.dc_details?.customerId?.phone}
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
                                {companyData?.companyName}
                                <br />
                                {companyData?.companyAddress ||
                                  companyData?.addressLine1 ||
                                  companyData?.addressLine2}{" "}
                                {companyData?.city}
                                <br />
                                {companyData?.state} {companyData?.pincode}
                                <br />
                                {companyData?.country}
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
                                  {poData?.dc_details?.termsAndCondition}
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
                                <p className="mb-0">
                                  {poData?.dc_details?.notes}
                                </p>
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
                                      {currencyData ? currencyData : "$"}
                                      
                                      {Number(
                                        poData?.dc_details?.taxableAmount
                                      ).toLocaleString("en-IN", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      })}
                                    </span>
                                  </p>
                                  <p>
                                    Discount
                                    <span>
                                      {currencyData ? currencyData : "$"}
                                      {Number(
                                        poData?.dc_details?.totalDiscount
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
                                      {Number(
                                        poData?.dc_details?.vat
                                      ).toLocaleString("en-IN", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      })}
                                    </span>
                                  </p>
                                </div>
                                <div className="invoice-total-footer">
                                  <h4>
                                    Total Amount{" "}
                                    <span>
                                      {currencyData ? currencyData : "$"}
                                      {Number(
                                        poData?.dc_details?.TotalAmount
                                      ).toLocaleString("en-IN", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                      })}
                                    </span>
                                  </h4>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="invoice-sign text-end">
                        <span className="d-block">
                          {poData?.dc_details?.signatureName}
                        </span>
                        
                        {poData?.dc_details?.signatureImage && (
                          <img
                            className="img-fluid d-inline-block uploaded-imgs"
                            style={{
                              display: "flex",
                              maxWidth: "200px",
                              maxHeight: "200px",
                            }}
                            src={poData?.dc_details?.signatureImage}
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
    </div>
  );
};

export default ViewDc;
