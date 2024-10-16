/* eslint-disable no-unsafe-optional-chaining */
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../../common/antd.css";
import { Table } from "antd";
import FeatherIcon from "feather-icons-react";
import {
  onShowSizeChange,
  itemRender,
} from "../../../common/paginationfunction";
import { ApiServiceContext, paymentList } from "../../../core/core-index";

import PsFilter from "./psFilter";
import { commonDatacontext } from "../../../core/commonData";
import moment from "moment";
import { PreviewImg } from "../../../common/imagepath";
import { hostName } from "../../../assets/constant";

const PaymentSummary = () => {
  const [show, setShow] = useState(false);
  const [paymentSummary, setPaymentSummary] = useState([]);
  const { getData } = useContext(ApiServiceContext);
  const { currencyData } = useContext(commonDatacontext);

  const [page, setPage] = useState(1);
  const [pagesize, setPagesize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const handlePagination = async (page, pageSize) => {
    setPage(page);
    setPagesize(pageSize);
    getpaymentsummerylist(page, pageSize);
  };

  const getpaymentsummerylist = async (
    currentpage = 1,
    currentpagesize = 10
  ) => {
    try {
      let skipSize;
      skipSize = currentpage == 1 ? 0 : (currentpage - 1) * currentpagesize;
      const response = await getData(
        `${paymentList?.List}?limit=${currentpagesize}&skip=${skipSize}`
      );
      if (response.code === 200) {
        setPaymentSummary(response?.data);
        setTotalCount(response?.totalRecords);
      }
      return response;
    } catch (error) {
      //
    }
  };

  useEffect(() => {
    getpaymentsummerylist();
  }, []);

  const columns = [
    {
      title: "#",
      dataIndex: "Id",

      render: (text, record, index) => (page - 1) * pagesize + (index + 1),
    },

    {
      title: "Invoice Number",
      dataIndex: "invoiceNumber",
      render: (text, record) => (
        <Link to={{ pathname: `${"/view-invoice"}/${record?.invoiceId}`}}>
        {text}
      </Link>
      )
    },
    {
      title: "Customer",
      dataIndex: "Name",
      render: (text, record) => (
        <>
          <h2 className="table-avatar">
            <Link 
              to={{ pathname: `${"/view-customer"}/${record?.customerDetail?._id}` }}
            className="avatar avatar-sm me-2">
              <img
                className="aavatar avatar-sm me-2 avatar-img rounded-circle"
                src=
                {
                  record.customerDetail?.image
                  //record.customerDetail?.image
                  ? record.customerDetail?.image
                  : PreviewImg
                }
                
                
                alt="User Image"
              />
            </Link>
            <Link 
              to={{ pathname: `${"/view-customer"}/${record?.customerDetail?._id}` }}
            >
              {record.customerDetail?.name
                ? record.customerDetail?.name
                : `Deleted Customer`}
              <span>
                {record.customerDetail?.phone
                  ? record.customerDetail?.phone
                  : `Deleted Customer`}
              </span>
            </Link>
          </h2>
        </>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",

      render: (text, record) => (
        <>
          {currencyData ? currencyData : "$"}
          {(record?.amount).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      render: (text) => moment(text).format("DD-MM-YYYY"),
    },
    {
      title: "Payment Method",
      dataIndex: "payment_method",
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="content-page-header">
              <h5>Payment Summary</h5>
              <div className="list-btn">
                <ul className="filter-list">
                  <li>
                    <Link
                      className="btn btn-filters w-auto popup-toggle"
                      onClick={() => setShow(!show)}
                    >
                      <span className="me-2">
                        <FeatherIcon icon="filter" />
                      </span>
                      Filter
                    </Link>
                  </li>
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
          {/* Table */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card-table">
                <div className="card-body paymentSummary">
                  <div className="table-responsive table-hover">
                    <Table
                      rowKey={(record) => record?._id}
                      pagination={{
                        total: totalCount,
                        showTotal: (total, range) =>
                          `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                        showSizeChanger: true,
                        onShowSizeChange: onShowSizeChange,
                        itemRender: itemRender,
                        pageSizeOptions: [10, 25, 50, 100],
                        defaultPageSize: 10,
                        defaultCurrent: 1,
                        onChange: (page, pageSize) =>
                          handlePagination(page, pageSize),
                      }}
                      columns={columns}
                      dataSource={paymentSummary}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* /Table */}
        </div>
      </div>

      <PsFilter
        setShow={setShow}
        show={show}
        setPaymentSummary={setPaymentSummary}
        page={page}
        pagesize={pagesize}
      />
    </>
  );
};

export default PaymentSummary;
