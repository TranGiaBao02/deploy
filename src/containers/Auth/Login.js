import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import * as actions from "../../store/actions";

import "./Login.scss";
import { FormattedMessage } from "react-intl";
import { handleLoginApi } from "../../services/userService";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode"; 

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      errMessage: "",
    };
  }

  //
  handleOnChangeUsername = (event) => {
    this.setState({
      username: event.target.value,
    });
    console.log(event.target.value);
  };
  //
  handleOnChangePassword = (event) => {
    this.setState({
      password: event.target.value,
    });
    console.log(event.target.value);
  };
  //
  handleLogin = async () => {
    this.setState({
      errMessage: "",
    });
    try {
      let data = await handleLoginApi(this.state.username, this.state.password);
      if (data && data.errCode !== 0) {
        this.setState({
          errMessage: data.message,
        });
      }
      if (data && data.errCode === 0) {
        this.props.userLoginSuccess(data.user);
      }
    } catch (e) {
      if (e.response) {
        if (e.response.data) {
          this.setState({
            errMessage: e.message,
          });
        }
      }
    }
  };
  //
  handleShowHidePassword = () => {
    this.setState({
      isShowPassword: !this.state.isShowPassword,
    });
  };
  //
  handleKeyDown = (event) => {
    if (event.key === "Enter" || event.keyCode === 13) {
      this.handleLogin();
    }
  };
  //
  handleGoogleLoginSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log("Thông tin từ Google:", decoded);
  
      // Tạo đối tượng người dùng với thông tin từ Google
      const userFromGoogle = {
        firstName: decoded.given_name,
        lastName: decoded.family_name,
        email: decoded.email,
        avatar: decoded.picture,
        googleId: decoded.sub,
      };
  
      // Cập nhật thông tin vào Redux hoặc backend
      this.props.userLoginSuccess(userFromGoogle);
    } catch (error) {
      console.error("Lỗi giải mã token Google:", error);
    }
  };
  

  handleGoogleLoginFailure = () => {
    console.error("Đăng nhập Google thất bại");
  };

  render() {
    //jsx

    return (
      <div className="login-background">
        <div className="login-container">
          <div className="login-content">
            <div className="col-12 text-center text-login">Login</div>
            <div className="col-12 form-group login-input">
              <label className="text-username">Username</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your username"
                value={this.state.username}
                onChange={(event) => this.handleOnChangeUsername(event)}
                onKeyDown={(event) => this.handleKeyDown(event)}
              />
            </div>
            <div className="col-12 form-group login-input">
              <label className="text-password">Password</label>
              <div className="custom-input-password">
                <input
                  type={this.state.isShowPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Enter your password"
                  value={this.state.password}
                  onChange={(event) => this.handleOnChangePassword(event)}
                  onKeyDown={(event) => this.handleKeyDown(event)}
                />
                <span
                  onClick={() => {
                    this.handleShowHidePassword();
                  }}
                >
                  <i
                    class={
                      this.state.isShowPassword
                        ? "far fa-eye"
                        : "far fa-eye-slash"
                    }
                  ></i>
                </span>
              </div>
              <div className="col-12" style={{ color: "red" }}>
                {this.state.errMessage}
              </div>

              <div className="col-12">
                <button
                  className="btn-login"
                  onClick={() => {
                    this.handleLogin();
                  }}
                >
                  Login
                </button>
              </div>
              <div className="col-12">
                <span className="forgot-password">Forgot your password?</span>
              </div>
              <div className="col-12 text-center mt-3">
                <span className="text-other-login">Or Login with:</span>
              </div>
              <div className="col-12 social-login d-flex justify-content-center">
                <GoogleLogin
                  onSuccess={this.handleGoogleLoginSuccess}
                  onError={this.handleGoogleLoginFailure}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    navigate: (path) => dispatch(push(path)),
    // userLoginFail: () => dispatch(actions.adminLoginFail()),
    userLoginSuccess: (userInfo) =>
      dispatch(actions.userLoginSuccess(userInfo)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
