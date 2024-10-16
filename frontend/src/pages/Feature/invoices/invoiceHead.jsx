/* eslint-disable react/prop-types */
import React, { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import {
  Recepit,
  TransactionMinus,
  ArchiveBook,
  MessageEdit,
  FilterIcon,
} from "../../../common/imagepath";
import { invoice } from "../../../core/core-index";
import { ApiServiceContext } from "../../../core/API/api-service";

const InvoiceHead = ({
  show,
  setShow,
  invoicelistData,
  currencyData,
  amountFormat,
  permission,
  admin,
}) => {
  const { getData } = useContext(ApiServiceContext);

  const [totalCancelled, settotalCancelled] = useState({});
  const [totaloutstanding, settotaloutstanding] = useState({});
  const [totalOverdue, settotalOverdue] = useState({});
  const [total_invoice, settotal_invoice] = useState({});
  const [total_drafted, settotal_drafted] = useState({});
  
  const [recurring_total, setrecurring_total] = useState({});
  
  const { create, delete: remove } = permission;

  const getInvoiceListData = async () => {
    try {
      const response = await getData(invoice?.CardCounts);
      if (response.code === 200) {
        settotalCancelled(response?.data?.total_cancelled?.[0]);
        settotaloutstanding(response?.data?.total_outstanding?.[0]);
        settotalOverdue(response?.data?.total_overdue?.[0]);
        settotal_invoice(response?.data?.total_invoice?.[0]);
        settotal_drafted(response?.data?.total_drafted?.[0]);
        setrecurring_total(response?.data?.recurring_total?.[0]);
      }
      return response;
    } catch (error) {
      //
    }
  };

  useEffect(() => {
    getInvoiceListData();
  }, []);
  useEffect(() => {
    getInvoiceListData();
  }, [invoicelistData]);

  const totalSum = (totaloutstanding, totalOverdue, total_drafted) => {
    const totalValue = totaloutstanding + totalOverdue + total_drafted;

    return totalValue;
  };

  return (
    <>
      <div className="page-header">
        <div className="content-page-header">
          <h5>Invoices</h5>
          <div className="list-btn">
            <ul className="filter-list">
              <li>
                <Link
                  className="btn btn-filters w-auto popup-toggle"
                  onClick={() => setShow(!show)}
                >
                  <span className="me-2">
                    <img src={FilterIcon} alt="" />
                  </span>
                  Filter
                </Link>
              </li>
              {(create || admin) && (
                <li>
                  <Link className="btn btn-primary" to="/add-invoice">
                    <i className="fa fa-plus-circle me-2" aria-hidden="true" />
                    New Invoice
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
      {/* /Page Header */}
      {/* Search Filter */}
      <div id="filter_inputs" className="card filter-card">
        <div className="card-body pb-0">
          <div className="row">
            <div className="col-sm-6 col-md-3">
              <div className="form-group">
                <label>Name</label>
                <input type="text" className="form-control" />
              </div>
            </div>
            <div className="col-sm-6 col-md-3">
              <div className="form-group">
                <label>Email</label>
                <input type="text" className="form-control" />
              </div>
            </div>
            <div className="col-sm-6 col-md-3">
              <div className="form-group">
                <label>Phone</label>
                <input type="text" className="form-control" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Search Filter */}
      {/* Inovices card */}
      <div className="row">
        <div className="col-sm-3 col-12 d-flex">
          <div className="card inovices-card w-100">
            <div className="card-body">
              <div className="dash-widget-header">
                <span className="inovices-widget-icon bg-info-light">
                  <img src={Recepit} alt="" />
                </span>
                <div className="dash-count">
                  <div className="dash-title">Total Invoice</div>
                  <div className="dash-counts">
                    <p>
                      {currencyData}
                      {amountFormat(total_invoice?.total_sum)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <p className="inovices-all">
                  No of Invoice{" "}
                  <span className="rounded-circle bg-light-gray">
                    {total_invoice?.count || 0}
                  </span>
                </p>
                <p className="inovice-trending text-success-light">
                 
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-3 col-12 d-flex">
          <div className="card inovices-card w-100">
            <div className="card-body">
              <div className="dash-widget-header">
                <span className="inovices-widget-icon bg-primary-light">
                  <img src={TransactionMinus} alt="" />
                </span>
                <div className="dash-count">
                  <div className="dash-title">Outstanding</div>
                  <div className="dash-counts">
                    <p>
                      {currencyData}
                      {amountFormat(
                        totalSum(
                          totaloutstanding?.total_sum
                            ? totaloutstanding?.total_sum
                            : 0,
                          totalOverdue?.total_sum ? totalOverdue?.total_sum : 0,
                          total_drafted?.total_sum
                            ? total_drafted?.total_sum
                            : 0
                        )
                      )}
                    </p>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <p className="inovices-all">
                  No of Outstandings{" "}
                  <span className="rounded-circle bg-light-gray">
                    {totaloutstanding?.count || 0}
                  </span>
                </p>
                <p className="inovice-trending text-success-light">
                  
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-3 col-12 d-flex">
          <div className="card inovices-card w-100">
            <div className="card-body">
              <div className="dash-widget-header">
                <span className="inovices-widget-icon bg-warning-light">
                  <img src={ArchiveBook} alt="" />
                </span>
                <div className="dash-count">
                  <div className="dash-title">Total Overdue</div>
                  <div className="dash-counts">
                    <p>
                      {currencyData}
                      {amountFormat(totalOverdue?.total_sum)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <p className="inovices-all">
                  No of Overdues{" "}
                  <span className="rounded-circle bg-light-gray">
                    {totalOverdue?.count || 0}
                  </span>
                </p>
                <p className="inovice-trending text-danger-light">
                  
                </p>
              </div>
            </div>
          </div>
        </div>
       
        <div className="col-sm-3 col-12 d-flex">
          <div className="card inovices-card w-100">
            <div className="card-body">
              <div className="dash-widget-header">
                <span className="inovices-widget-icon bg-green-light">
                  <img src={MessageEdit} alt="" />
                </span>
                <div className="dash-count">
                  <div className="dash-title">Draft</div>
                  <div className="dash-counts">
                    <p>
                      {currencyData}
                      {amountFormat(total_drafted?.total_sum)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <p className="inovices-all">
                  No of Drafts{" "}
                  <span className="rounded-circle bg-light-gray">
                    {total_drafted?.count || 0}
                  </span>
                </p>
                <p className="inovice-trending text-danger-light">
                  
                </p>
              </div>
            </div>
          </div>
        </div>
       
      </div>
     
    </>
  );
};

export default InvoiceHead;
