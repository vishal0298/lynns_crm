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
import { commonDatacontext } from "../../../core/commonData";
import PaymentsFilter from "./paymentsilter";
import moment from "moment";
import { PreviewImg } from "../../../common/imagepath";
import { hostName } from "../../../assets/constant";

const Payments = () => {
  const [show, setShow] = useState(false);
  const [paymentslist, setPaymentslist] = useState([]);
  const { getData } = useContext(ApiServiceContext);
  const { currencyData } = useContext(commonDatacontext);

  const [page, setPage] = useState(1);
  const [pagesize, setPagesize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const handlePagination = async (page, pageSize) => {
    setPage(page);
    setPagesize(pageSize);
    getInvoiceDetails(page, pageSize);
  };

  const getInvoiceDetails = async (currentpage = 1, currentpagesize = 10) => {
    try {
      let skipSize;
      skipSize = currentpage == 1 ? 0 : (currentpage - 1) * currentpagesize;
      const response = await getData(
        `${paymentList?.List}?limit=${currentpagesize}&skip=${skipSize}`
      );
      if (response.code === 200) {
        setPaymentslist(response?.data);
        setTotalCount(response?.totalRecords);
      }
      return response;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    getInvoiceDetails();
  }, []);

  const columns = [
    {
      title: "#",
      dataIndex: "Id",
      render: (text, record, index) => (page - 1) * pagesize + (index + 1),
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
                // onError={handleImageError}
                className="aavatar avatar-sm me-2 avatar-img rounded-circle"
                src={
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
      title: "Payment ID",
      dataIndex: "_id",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (text, record) => (
        <>
          {currencyData ? currencyData : "$"}
          {record.amount.toLocaleString("en-IN", {
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
      // render: (text, record) => <>{moment(text).format("DD-MM-YYYY")}</>,
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
              <h5>Payments</h5>
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
          {/* Table */}
          <div className="row">
            <div className="col-sm-12">
              <div className="card-table">
                <div className="card-body payments">
                  <div className="table-responsive table-hover">
                    <Table
                      pagination={{
                        total: totalCount,
                        current: page,
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
                      dataSource={paymentslist}
                      rowKey={(record) => record._id}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* /Table */}
        </div>
      </div>

      <PaymentsFilter
        setShow={setShow}
        show={show}
        setPaymentslist={setPaymentslist}
        page={page}
        pagesize={pagesize}
        setTotalCount={setTotalCount}
        setPage={setPage}
        handlePagination={handlePagination}
      />

      <div className="modal custom-modal fade" id="delete_modal" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-body">
              <div className="form-header">
                <h3>Delete Payments</h3>
                <p>Are you sure want to delete?</p>
              </div>
              <div className="modal-btn delete-action">
                <div className="row">
                  <div className="col-6">
                    <button
                      type="reset"
                      data-bs-dismiss="modal"
                      className="w-100 btn btn-primary paid-continue-btn"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="col-6">
                    <button
                      type="submit"
                      data-bs-dismiss="modal"
                      className="w-100 btn btn-primary paid-cancel-btn"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Payments;
