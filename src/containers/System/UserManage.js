import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./UserManage.scss";
import { getDetailInforDoctor, editUserService } from "../../services/userService";
import { LANGUAGES } from "../../utils";
import { toast } from "react-toastify";
class UserManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userEdit: {},
      detailDoctor: {},
      isEditing: false,
      editedInfo: {
        phoneNumber: "",
        address: "",
      },
    };
  }

  async componentDidMount() {
    if (this.props.userInfo && this.props.userInfo.id) {
      let id = this.props.userInfo.id;
      let res = await getDetailInforDoctor(id);
      if (res && res.errCode === 0) {
        this.setState({
          detailDoctor: res.data,
          formData: {
            phoneNumber: res.data.phoneNumber || '',
            address: res.data.address || '',
          },
        });
      }
    }
  }
//
handleEditToggle = () => {
  this.setState({ isEditing: true });
};

handleInputChange = (e) => {
  const { name, value } = e.target;
  this.setState({
    formData: {
      ...this.state.formData,
      [name]: value,
    },
  });
};

handleSave = async () => {
  const { userInfo } = this.props;
  const { formData } = this.state;

  const payload = {
    id: userInfo.id,
    roleId: userInfo.roleId,
    positionId: this.state.detailDoctor.positionId,
    gender: userInfo.gender,
    email: userInfo.email,
    firstName: userInfo.firstName,
    lastName: userInfo.lastName,
    phoneNumber: formData.phoneNumber,
    address: formData.address,
  };

  let res = await editUserService(payload);
  if (res && res.errCode === 0) {
    toast.success('Cập nhật thông tin cá nhân thành công!')
    let updatedRes = await getDetailInforDoctor(userInfo.id);
    if (updatedRes && updatedRes.errCode === 0) {
      this.setState({
        detailDoctor: updatedRes.data,
        formData: {
          phoneNumber: updatedRes.data.phoneNumber || "",
          address: updatedRes.data.address || "",
        },
        isEditing: false,
      });
    }
  } else {
    toast.error('Cập nhật thông tin cá nhân thất bại!')
  }
};

  render() {
    let { language, userInfo } = this.props;
    const { detailDoctor, isEditing, formData } = this.state;
    
    let nameVi = "",
      nameEn = "";

    if (detailDoctor && detailDoctor.positionData) {
      nameVi = `${detailDoctor.firstName} ${detailDoctor.lastName}`;
      nameEn = `${detailDoctor.lastName} ${detailDoctor.firstName}`;
    }

    const googleFirstName = userInfo.firstName || "";
    const googleLastName = userInfo.lastName || "";

    return (
      <div className="user-profile-container container mt-5">
        <div className="card shadow p-4">
          <h2 className="text-center mb-4"><FormattedMessage id='user-infor.title'/></h2>
          {detailDoctor && detailDoctor.img ? (
            <div
              className="intro-doctor-user"
              style={{
                backgroundImage: `url(${detailDoctor.img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
          ) : (
            <div
              className="intro-doctor-user"
              style={{ backgroundColor: "#ccc" }}
            >
              <span><FormattedMessage id='user-infor.image'/></span>
            </div>
          )}

          <div className="row">
            <div className="col-md-6 mb-3">
              <label>
                <strong><FormattedMessage id='user-infor.fullName'/></strong>
              </label>
              <div className="form-control">
                {language === LANGUAGES.VI
                  ? `${googleFirstName} ${googleLastName}`
                  : `${googleLastName} ${googleFirstName}`}
              </div>
            </div>

            <div className="col-md-6 mb-3">
              <label>
                <strong><FormattedMessage id='user-infor.email'/></strong>
              </label>
              <div className="form-control">{userInfo.email}</div>
            </div>
            <div className="col-md-6 mb-3">
              <label>
                <strong><FormattedMessage id='user-infor.position'/></strong>
              </label>
              <div className="form-control">
                {detailDoctor?.positionData?.valueVi || "Chưa xác định chức vị"}
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <label>
                <strong><FormattedMessage id='user-infor.role'/></strong>
              </label>
              <div className="form-control">
                {userInfo?.roleId === "R1"
                  ? "Quản trị viên"
                  : userInfo?.roleId === "R2"
                  ? "Bác sĩ"
                  : "Chưa xác định vai trò"}
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <label>
                <strong><FormattedMessage id='user-infor.phone'/></strong>
              </label>
              {isEditing ? (
                <input
                  className="form-control"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={this.handleInputChange}
                />
              ) : (
                <div className="form-control">{detailDoctor.phoneNumber || "..."}</div>
              )}
            </div>
            <div className="col-md-6 mb-3">
              <label>
                <strong><FormattedMessage id='user-infor.address'/></strong>
              </label>
              {isEditing ? (
                <input
                  className="form-control"
                  name="address"
                  value={formData.address}
                  onChange={this.handleInputChange}
                />
              ) : (
                <div className="form-control">{detailDoctor.address || "..."}</div>
              )}
            </div>
            <div className="col-12 text-center mt-4">
              {isEditing ? (
                <button
                  className="btn btn-success px-4"
                  onClick={this.handleSave}
                >
                  <FormattedMessage id='user-infor.save'/>
                </button>
              ) : (
                <button
                  className="btn btn-primary px-4"
                  onClick={this.handleEditToggle}
                >
                  <FormattedMessage id='user-infor.edit'/>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.user.userInfo,
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
