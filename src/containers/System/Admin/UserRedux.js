import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./UserRedux.scss";
import { getAllCodeService } from "../../../services/userService";
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";
import * as actions from "../../../store/actions";
import TableManageUser from "./TableManageUser";
import { values } from "lodash";
// import Lightbox from "react-lightbox-component";

class UserRedux extends Component {
  constructor(props) {
    super(props);
    this.state = {
      genderArr: [],
      positionArr: [],
      roleArr: [], // -- 58 --
      previewImgURL: "",
      isOpen: false,

      isUserCreated: false,

      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      address: "",
      gender: "",
      position: "",
      role: "",
      img: "", //avatar

      action: "",
      userEditId: "",
    };
  }

  async componentDidMount() {
    this.props.getGenderStart();
    this.props.getPositionStart();
    this.props.getRoleStart();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.genderRedux !== this.props.genderRedux) {
      let arrGenders = this.props.genderRedux;
      this.setState({
        genderArr: arrGenders,
        gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : "",
      });
    }

    if (prevProps.roleRedux !== this.props.roleRedux) {
      let arrRoles = this.props.roleRedux;
      this.setState({
        roleArr: arrRoles,
        role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : "",
      });
    }

    if (prevProps.positionRedux !== this.props.positionRedux) {
      let arrPositions = this.props.positionRedux;

      this.setState({
        positionArr: arrPositions,
        position:
          arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : "",
      });
    }
    //..
    if (prevProps.listUsers !== this.props.listUsers) {
      let arrGenders = this.props.genderRedux;
      let arrRoles = this.props.roleRedux;
      let arrPositions = this.props.positionRedux;
      this.setState({
        userEditId: "",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        address: "",
        gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : "",
        role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : "",
        position:
          arrPositions && arrPositions.length > 0 ? arrPositions[0].keyMap : "",
        //avatar
        img: "",
        action: CRUD_ACTIONS.CREATE,
        previewImgURL: "",
      });
    }
  }
  //
  handleOnchangeImage = async (event) => {
    let data = event.target.files;
    let file = data[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      let objectUrl = URL.createObjectURL(file);
      this.setState({
        previewImgURL: objectUrl,
        img: base64,
      });
    }
  };
  //
  openPreviewImage = () => {
    this.setState({
      isOpen: true,
    });
  };
  //
  handleSaveUser = () => {
    let isValid = this.checkValidateInput();
    if (isValid === false) return;
    this.setState({
      ...this.state,
      isUserCreated: false,
    });
    let { action } = this.state;

    if (action === CRUD_ACTIONS.CREATE) {
      // Fire redux create user
      this.props.createNewUser({
        email: this.state.email,
        password: this.state.password,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        address: this.state.address,
        phoneNumber: this.state.phoneNumber,
        gender: this.state.gender,
        roleId: this.state.role,
        positionId: this.state.position,
        img: this.state.img,
      });
    }
    if (action === CRUD_ACTIONS.EDIT) {
      // Fire Redux Edit User
      this.props.editAUserRedux({
        id: this.state.userEditId,
        email: this.state.email,
        password: this.state.password,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        address: this.state.address,
        phoneNumber: this.state.phoneNumber,
        gender: this.state.gender,
        roleId: this.state.role,
        positionId: this.state.position,
        img: this.state.img,
      });
    }
  };
  //
  onChangeInput = (event, id) => {
    let copyState = { ...this.state };
    copyState[id] = event.target.value;
    this.setState(
      {
        ...copyState,
      },
      () => {
      }
    );
  };
  //
  checkValidateInput = () => {
    let isValid = true;
    let arrCheck = [
      "email",
      "password",
      "firstName",
      "lastName",
      "phoneNumber",
      "address",
    ];
    for (let i = 0; i < arrCheck.length; i++) {
      if (!this.state[arrCheck[i]]) {
        isValid = false;
        alert(`Trường ${arrCheck[i]} không được để trống`);
        break;
      }
    }
    return isValid;
  };
  //
  handleEditUserFromParent = (user) => {
    let imageBase64 = '';
    if (user.img) {
      imageBase64 = new Buffer(user.img, 'base64').toString('binary');
    }
    this.setState({
      email: user.email,
      password: "user.password",
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      address: user.address,
      gender: user.gender,
      role: user.roleId,
      position: user.positionId,

      img: '',
      previewImgURL: imageBase64,

      action: CRUD_ACTIONS.EDIT,
      userEditId: user.id,
    });
  };
  //
  render() {
    let genders = this.state.genderArr;
    let positions = this.state.positionArr;
    let roles = this.state.roleArr;
    let language = this.props.language;

    let {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      address,
      gender,
      position,
      role,
      img, //avatar
    } = this.state;

    return (
      <div>
        <div className="user-redux-container">
          <div className="title">
            <FormattedMessage id="manage-user.title" />
          </div>
          <div className="user-redux-body">
            <div className="container">
              <div className="row">
                <form>
                  <div className="col-12 my-3">
                    <label htmlFor="add">
                      <FormattedMessage id="manage-user.add" />
                    </label>
                  </div>

                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label htmlFor="inputEmail">
                        <FormattedMessage id="manage-user.email" />
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="inputEmail"
                        placeholder="Email"
                        value={email}
                        onChange={(event) => {
                          this.onChangeInput(event, "email");
                        }}
                        disabled={
                          this.state.action === CRUD_ACTIONS.EDIT ? true : false
                        }
                      />
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="inputPassword4">
                        <FormattedMessage id="manage-user.password" />
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="inputPassword"
                        placeholder="Password"
                        value={password}
                        onChange={(event) => {
                          this.onChangeInput(event, "password");
                        }}
                        disabled={
                          this.state.action === CRUD_ACTIONS.EDIT ? true : false
                        }
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label htmlFor="inputFirstName">
                        <FormattedMessage id="manage-user.firstName" />
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputFirstName"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(event) => {
                          this.onChangeInput(event, "firstName");
                        }}
                      />
                    </div>
                    <div className="form-group col-md-6">
                      <label htmlFor="inputLastName">
                        <FormattedMessage id="manage-user.lastName" />
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputLastName"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(event) => {
                          this.onChangeInput(event, "lastName");
                        }}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="inputAddress">
                      <FormattedMessage id="manage-user.address" />
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="inputAddress"
                      placeholder="Lê Văn Việt, TP. Thủ Đức"
                      value={address}
                      onChange={(event) => {
                        this.onChangeInput(event, "address");
                      }}
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group col-md-6">
                      <label htmlFor="inputPhone">
                        <FormattedMessage id="manage-user.phone" />
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="inputPhone"
                        value={phoneNumber}
                        onChange={(event) => {
                          this.onChangeInput(event, "phoneNumber");
                        }}
                      />
                    </div>
                    <div className="form-group col-md-4">
                      <label htmlFor="inputGender">
                        <FormattedMessage id="manage-user.gender" />
                      </label>
                      <select
                        id="inputGender"
                        className="form-control"
                        value={gender}
                        onChange={(event) => {
                          this.onChangeInput(event, "gender");
                        }}
                      >
                        {genders &&
                          genders.length > 0 &&
                          genders.map((item, index) => {
                            return (
                              <option key={index} value={item.keyMap}>
                                {language === LANGUAGES.VI
                                  ? item.valueVi
                                  : item.valueEn}
                              </option>
                            );
                          })}
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group col-md-4">
                      <label htmlFor="inputPosition">
                        <FormattedMessage id="manage-user.position" />
                      </label>
                      <select
                        id="inputPosition"
                        className="form-control"
                        value={position}
                        onChange={(event) => {
                          this.onChangeInput(event, "position");
                        }}
                      >
                        {positions &&
                          positions.length > 0 &&
                          positions.map((item, index) => {
                            return (
                              <option key={index} value={item.keyMap}>
                                {language === LANGUAGES.VI
                                  ? item.valueVi
                                  : item.valueEn}
                              </option>
                            );
                          })}
                      </select>
                    </div>
                    <div className="form-group col-md-4">
                      <label htmlFor="inputRole">
                        <FormattedMessage id="manage-user.role" />
                      </label>
                      <select
                        id="inputRole"
                        className="form-control"
                        value={role}
                        onChange={(event) => {
                          this.onChangeInput(event, "role");
                        }}
                      >
                        {roles &&
                          roles.length > 0 &&
                          roles.map((item, index) => {
                            return (
                              <option key={index} value={item.keyMap}>
                                {language === LANGUAGES.VI
                                  ? item.valueVi
                                  : item.valueEn}
                              </option>
                            );
                          })}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="inputImage">
                      <FormattedMessage id="manage-user.image" />
                    </label>
                    <div className="preview-img-container">
                      <input
                        onChange={(event) => this.handleOnchangeImage(event)}
                        type="file"
                        className="form-control"
                        id="previewImg"
                        hidden
                      />
                      <label className="label-upload" htmlFor="previewImg">
                        Tải ảnh <i className="fas fa-upload"></i>
                      </label>
                      <div
                        className="preview-image"
                        style={{
                          backgroundImage: `url(${this.state.previewImgURL})`,
                        }}
                        onClick={() => this.openPreviewImage()}
                      ></div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={
                      this.state.action == CRUD_ACTIONS.EDIT
                        ? "btn btn-warning"
                        : "btn btn-primary"
                    }
                    onClick={() => this.handleSaveUser()}
                  >
                    {this.state.action === CRUD_ACTIONS.EDIT ? (
                      <FormattedMessage id="manage-user.edit" />
                    ) : (
                      <FormattedMessage id="manage-user.save" />
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 mb-5">
          <TableManageUser
            handleEditUserFromParentKey={this.handleEditUserFromParent}
            action={this.state.action}
          />
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    genderRedux: state.admin.genders,
    roleRedux: state.admin.roles,
    positionRedux: state.admin.positions,
    // isLoadingGender: state.admin.isLoadingGender,
    listUsers: state.admin.users,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGenderStart: () => dispatch(actions.fetchGenderStart()),
    getPositionStart: () => dispatch(actions.fetchPositionStart()),
    getRoleStart: () => dispatch(actions.fetchRoleStart()),
    createNewUser: (data) => dispatch(actions.createNewUser(data)), // -- 59
    fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
    editAUserRedux: (data) => dispatch(actions.editAUser(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
