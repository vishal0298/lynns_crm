import React from "react";
import { Link } from "react-router-dom";
import { Logo, img2 } from "../../common/imagepath";

const LockScreen = () => {
  return (
    <div className="main-wrapper login-body">
      <div className="login-wrapper">
        <div className="container">
          <img className="img-fluid logo-dark mb-4" src={Logo} alt="Logo" />
          <div className="loginbox">
            <div className="login-right">
              <div className="login-right-wrap">
                <div className="lock-user">
                  <img className="rounded-circle" src={img2} alt="User Image" />
                  <h4>John Doe</h4>
                </div>

                {/* Form */}
                <form>
                  <div className="form-group">
                    <label className="form-control-label">Password</label>
                    <input className="form-control" type="text" />
                  </div>
                  <div className="form-group mb-0">
                    <button
                      className="btn btn-lg btn-block w-100 btn-primary w-100"
                      type="submit"
                    >
                      Enter
                    </button>
                  </div>
                </form>
                {/* /Form */}

                <div className="text-center dont-have">
                  Sign in as a different user? <Link to="/login">Login</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LockScreen;
