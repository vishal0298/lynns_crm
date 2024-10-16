import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import { ApiServiceContext, successToast } from "../../../core/core-index";
import moment from "moment";
import { Popconfirm, Empty } from "antd";

const AllNotification = () => {
  const [notificationdata, setnotificationdata] = useState([]);
  const [markasreadsts, setmarkasreadsts] = useState(true);
  const { deleteData, getData } = useContext(ApiServiceContext);

  const deleteNotifications = async () => {
    try {
      const response = await deleteData(`/notification/deleteNotification`);
      if (response?.code == 200) {
        successToast("Notifications Deleted successfully");
        setnotificationdata([]);
      }
    } catch (err) {
      //
    }
  };

  const getnotifications = async () => {
    try {
      const response = await getData(`/notification/listNotification`, false);
      if (response?.data) {
        setnotificationdata(response?.data);
      }
    } catch {
      return false;
    }
  };

  const markasread = async () => {
    try {
      const response = await getData(`/notification`, false);
      if (response?.code == 200) {
        successToast("Success");
      }
    } catch {
      return false;
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteData(`/notification/deleteNotification`, {
        _id: [id],
      });
      if (response?.code == 200) {
        successToast("Notification Deleted successfully");
        getnotifications();
      }
    } catch (err) {
      //
    }
  };

  useEffect(() => {
    getnotifications();
  }, []);
  useEffect(() => {
    let markasread = notificationdata.some((record) => record?.read === true);
    setmarkasreadsts(markasread);
  }, [notificationdata]);

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper notifications">
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="content-page-header">
              <h5>Notifications</h5>
            </div>
            <div className="noti-action-btns d-flex align-items-center justify-content-sm-end">
              {notificationdata.length > 0 && markasreadsts && (
                <Link
                  to="#"
                  onClick={() => markasread()}
                  className="btn btn-white btn-mark-read"
                >
                  <i className="fa-solid fa-check me-1" />
                  Mark as read
                </Link>
              )}
              {notificationdata.length > 0 && (
                <Link
                  to="#"
                  className="btn btn-white btn-delete-all delete"
                  data-bs-toggle="modal"
                  data-bs-target="#notification-delete"
                >
                  <i className="fe fe-trash-2 me-1">
                    <FeatherIcon icon="trash-2" />
                  </i>
                  Delete all
                </Link>
              )}
            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            <div className="col-xl-12 col-md-12">
              {/* <div className="card user-list-item">
                <div>
                  <div className="avatar avatar-online">
                    <Link to="/settings">
                      <img src={img2} className="rounded-circle" alt="image" />
                    </Link>
                  </div>
                </div>
                <div className="users-list-body">
                  <div className="name-list-user">
                    <h6>
                      Lex Murphy <span>requested access to </span>UNIX directory
                      tree hierarchy
                    </h6>
                    <div className="follow-btn">
                      <Link to="#" className="btn btn-primary">
                        Accept
                      </Link>
                      <Link to="#" className="btn btn-outline-primary">
                        Reject
                      </Link>
                    </div>
                    <span className="time">Today at 9:42 AM</span>
                  </div>
                  <div className="chat-user-time">
                    <span className="chats-delete">
                      <Link
                        to="#"
                        data-bs-toggle="modal"
                        data-bs-target="#notification-delete"
                      >
                        <i className="fe fe-trash">
                          <FeatherIcon icon="trash" />
                        </i>
                      </Link>
                    </span>
                  </div>
                </div>
              </div>
              <div className="card user-list-item">
                <div>
                  <div className="avatar avatar-online">
                    <Link to="settings.html">
                      <img src={img10} className="rounded-circle" alt="image" />
                    </Link>
                  </div>
                </div>
                <div className="users-list-body">
                  <div className="name-list-user">
                    <h6>
                      Ray Arnold <span>left 6 comments on </span>Isla Nublar
                      SOC2 compliance report
                    </h6>
                    <span className="time">Yesterday at 11:42 PM</span>
                  </div>
                  <div className="chat-user-time">
                    <span className="chats-delete">
                      <Link
                        to="#"
                        data-bs-toggle="modal"
                        data-bs-target="#notification-delete"
                      >
                        <i className="fe fe-trash">
                          <FeatherIcon icon="trash" />
                        </i>
                      </Link>
                    </span>
                  </div>
                </div>
              </div>
              <div className="card user-list-item">
                <div>
                  <div className="avatar avatar-online">
                    <Link to="settings.html">
                      <img src={img13} className="rounded-circle" alt="image" />
                    </Link>
                  </div>
                </div>
                <div className="users-list-body">
                  <div className="name-list-user">
                    <h6>
                      Dennis Nedry <span>commented on </span>Isla Nublar SOC2
                      compliance report
                    </h6>
                    <blockquote>
                      "Oh, I finished de-bugging the phones, but the system's
                      compiling for eighteen minutes, or twenty. So, some minor
                      systems may go on.
                    </blockquote>
                    <span className="time">Yesterday at 5:42 PM</span>
                  </div>
                  <div className="chat-user-time">
                    <span className="chats-delete">
                      <Link
                        to="#"
                        data-bs-toggle="modal"
                        data-bs-target="#notification-delete"
                      >
                        <i className="fe fe-trash">
                          <FeatherIcon icon="trash" />
                        </i>
                      </Link>
                    </span>
                  </div>
                </div>
              </div> */}
              {notificationdata.length > 0 ? (
                notificationdata.map((data, idx) => (
                  <div key={idx} className="card user-list-item">
                    <div>
                      <div
                        className={`avatar ${data.read ? "avatar-onlie" : ""}`}
                      >
                        <span className="avatar-title rounded-circle bg-primary-light">
                          <i className="far fa-comment" />
                        </span>
                      </div>
                    </div>
                    <div className="users-list-body">
                      <div className="name-list-user">
                        <h6>
                          {data?.title} <span> : </span> {data?.body}
                        </h6>
                        <span className="time">
                          {" "}
                          {moment(data?.createdAt).fromNow()}{" "}
                        </span>
                      </div>
                      <div className="chat-user-time">
                        <Popconfirm
                          title="Sure to delete?"
                          onConfirm={() => handleDelete(data?._id)}
                        >
                          <span className="chats-delete">
                            <i className="fe fe-trash">
                              <FeatherIcon icon="trash" />
                            </i>
                          </span>
                        </Popconfirm>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <Empty description={<span>Records Not Found</span>} />
              )}
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      {/* Delete Items Modal */}
      <div
        className="modal custom-modal fade signature-delete-modal"
        id="notification-delete"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-body">
              <div className="form-header">
                <div className="mb-2 notification-module">
                  <i className="fe fe-trash-2">
                    <FeatherIcon icon="trash-2" />
                  </i>
                </div>
                <h3>Delete All Notifications</h3>
                <p>Are you sure to delete all notifications ?</p>
              </div>
              <div className="modal-btn delete-action text-end">
                <button
                  type="reset"
                  data-bs-dismiss="modal"
                  className="btn btn-primary me-3"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteNotifications()}
                  data-bs-dismiss="modal"
                  className="btn btn-danger"
                >
                  <i className="fe fe-trash-2 me-1">
                    <FeatherIcon icon="trash-2" />
                  </i>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Delete Items Modal */}
    </>
  );
};

export default AllNotification;
