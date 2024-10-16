/* eslint-disable react/prop-types */
import React, { useState, useEffect, useContext,memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../approuter";
import FeatherIcon from "feather-icons-react";
import { setcommonData, setCurrentLoginUser } from "../../../constans/globals";
import { AlterFavIcon, PreviewImg } from "../../../common/imagepath";
import { commonDatacontext } from "../../../core/commonData";
import { ApiServiceContext } from "../../../core/core-index";
import moment from "moment";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { Badge } from "antd";

const Header = memo((props) => {
  const { loggedin, setloggedin, setnotificationFlag, notificationFlag } =
    useContext(AuthContext);
  const { getData } = useContext(ApiServiceContext);
  const [notificationdata, setnotificationdata] = useState([]);
  const { profileData, companyData } = useContext(commonDatacontext);
  const { userDetails } = useSelector((state) => state.app);
  const isAdmin = userDetails?.permissionRes?.allModules;
  const role = userDetails?.permissionRes?.roleName;
  const capitalizedRole = role?.charAt(0)?.toUpperCase() + role?.slice(1);
  const navigate = useNavigate();
  const handlesidebar = () => {
    document.body.classList.toggle("mini-sidebar");
  };

  const onMenuClik = () => {
    props.onMenuClick();
  };

  const logoutPage = () => {
    let rebembermedata = localStorage.getItem("rebemberme");
    localStorage.clear();
    if (rebembermedata != "undefined" && rebembermedata != null) {
      setCurrentLoginUser(rebembermedata);
    }
    setcommonData("logout");
    setloggedin(false);
    navigate("/login");
  };

  const clearNotifications = async () => {
    setnotificationdata([]);
    
  };

  useEffect(() => {
    const getDatas = async () => {
      try {
        const response = await getData(
          `/notification/listNotification?skip=&limit=5`,
          false
        );
        if (response?.data) {
          setnotificationdata(response?.data);
        }
      } catch {
        return false;
      }
    };
    if (loggedin) getDatas();
  }, [notificationFlag]);

  return (
    <>
      <Helmet>
        <title>Lynns Salon</title>
        <meta name="description" content="Lynns Salon" />
        <link
          rel="icon"
          href={companyData?.favicon ? companyData?.favicon : AlterFavIcon}
        ></link>
      </Helmet>
      <div className="header header-one">
        {/* Sidebar Toggle */}
        <Link to="#" id="toggle_btn" onClick={handlesidebar}>
          <span className="toggle-bars">
            <span className="bar-icons" />
            <span className="bar-icons" />
            <span className="bar-icons" />
            <span className="bar-icons" />
          </span>
        </Link>
        {/* /Sidebar Toggle */}
        {/* Search */}
        <Link className="mobile_btn" id="mobile_btn">
          <i className="fas fa-bars" />
        </Link>

        <Link
          className="mobile_btn"
          id="mobile_btn"
          onClick={() => onMenuClik()}
        >
          <i className="fas fa-bars" />
        </Link>
        {/* /Mobile Menu Toggle */}
        {/* Header Menu */}
        <ul className="nav nav-tabs user-menu">
          <li
            className="nav-item dropdown  flag-nav dropdown-heads"
            onClick={() => setnotificationFlag(false)}
          >
            <Link
              className="nav-link bell-icon"
              data-bs-toggle="dropdown"
              to="#"
              role="button"
            >
              {notificationFlag ? (
                <Badge
                  count={notificationdata.length || 0}
                  overflowCount={4}
                  color="hwb(205 6% 9%)"
                >
                  <FeatherIcon icon="bell" />
                </Badge>
              ) : (
                <FeatherIcon icon="bell" />
              )}

            </Link>
            <div className="dropdown-menu notifications">
              <div className="topnav-dropdown-header">
                <div className="notification-title me-2">
                  Notifications<Link to="all-notifications">View all</Link>
                </div>
                
              </div>
              <div className="noti-content">
                <ul className="notification-list">
                  {notificationdata.length > 0 ? (
                    notificationdata.map((data, idx) => (
                      <li key={idx} className="notification-message">
                        <Link to="/#">
                          <div className="media d-flex">
                            <div className="avatar avatar-sm">
                              <span className="avatar-title rounded-circle bg-primary-light">
                                <i className="far fa-comment" />
                              </span>
                            </div>
                            <div className="media-body">
                              <p className="noti-details">
                                <span className="noti-title">
                                  {data?.title}
                                </span>
                              </p>
                              <p className="noti-time">
                                <span className="notification-time">
                                  {data?.body}
                                </span>
                              </p>
                              <p className="noti-time">
                                <span className="notification-time">
                                  {moment(data?.createdAt).fromNow()}
                                </span>
                              </p>
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))
                  ) : (
                    <>
                      <p className="no_notifications">
                        <span className="no_notifications_text">
                          No Notifications
                        </span>
                      </p>
                    </>
                  )}
                </ul>
              </div>
              <div className="topnav-dropdown-footer">
                {notificationdata.length > 0 && (
                  <Link
                    to="#"
                    className="clear-noti"
                    onClick={() => clearNotifications()}
                  >
                    {" "}
                    Clear All
                  </Link>
                )}
              </div>
            </div>
          </li>
         
          <li className="nav-item dropdown">
            <Link
              to="#"
              className="user-link  nav-link"
              data-bs-toggle="dropdown"
            >
              <span className="user-img">
                <img
                  src={profileData?.image ? profileData?.image : PreviewImg}
                  onError={(event) => {
                    event.target.src = PreviewImg;
                  }}
                  alt=""
                  className="profilesidebar"
                />
                <span className="animate-circle" />
              </span>
              <span className="user-content">
                <span className="user-details">
                  {isAdmin ? "Super Admin" : capitalizedRole}
                </span>
                <span className="user-name">
                  {profileData?.firstName} {profileData?.lastName}
                </span>
              </span>
            </Link>
            <div className="dropdown-menu menu-drop-user">
              <div className="profilemenu">
                <div className="subscription-menu">
                  <ul>
                   
                    <li>
                      <Link className="dropdown-item" to="/settings">
                        Settings
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="subscription-logout">
                  <ul>
                    <li className="pb-0">
                      <Link
                        className="dropdown-item"
                        to="/login"
                        onClick={() => logoutPage()}
                      >
                        Log Out
                      </Link>
                      
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </li>
          {/* /User Menu */}
        </ul>
        {/* /Header Menu */}
      </div>
    </>
  );
});
export default Header;
