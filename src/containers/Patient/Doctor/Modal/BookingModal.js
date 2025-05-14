import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./BookingModal.scss";
import { Modal } from "reactstrap";
import ProfileDoctor from "../ProfileDoctor";
import _ from "lodash";

import DatePicker from "../../../../components/Input/DatePicker";
import * as actions from "../../../../store/actions";
import { LANGUAGES } from "../../../../utils";
import Select from "react-select";
import { postPatientBookAppointment } from "../../../../services/userService";
import { toast } from "react-toastify";
import moment from "moment";
import { getProfileDoctorById } from "../../../../services/userService";

class BookingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: "",
      phoneNumber: "",
      email: "",
      address: "",
      reason: "",
      birthday: "",
      selectedGender: "",
      doctorId: "",
      genders: "",
      timeType: "",
      paymentMethod: "",
      dataProfile: {},
    };
  }

  async componentDidMount() {
    this.props.getGenders();
  }
  //
  getInforDoctor = async (id) => {
    let result = {};
    if (id) {
      let res = await getProfileDoctorById(id);
      if (res && res.errCode === 0) {
        result = res.data;
      }
    }
    return result;
  };
  //

  async componentDidUpdate(prevProps) {
    // Cập nhật giới tính nếu thay đổi
    if (this.props.language !== prevProps.language || this.props.genders !== prevProps.genders) {
      this.setState({
        genders: this.buildDataGender(this.props.genders),
      });
    }
  
    // Khi dataTime thay đổi thì gọi getInforDoctor()
    if (this.props.dataTime !== prevProps.dataTime && this.props.dataTime && this.props.dataTime.doctorId) {
      let doctorId = this.props.dataTime.doctorId;
      let timeType = this.props.dataTime.timeType;
      this.setState({
        doctorId,
        timeType,
      });
  
      // Chỉ gọi khi có doctorId hợp lệ
      let data = await this.getInforDoctor(doctorId);
      this.setState({
        dataProfile: data,
      });
    }
  }
  
  //
  buildDataGender = (data) => {
    let result = [];
    let language = this.props.language;
    if (data && data.length > 0) {
      data.map((item) => {
        let object = {};
        object.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn;
        object.value = item.keyMap;
        result.push(object);
      });
    }
    return result;
  };
  //
  handleOnChangeInput = (event, id) => {
    let valueInput = event.target.value;
    let stateCopy = { ...this.state };
    stateCopy[id] = valueInput;
    this.setState({
      ...stateCopy,
    });
  };
  //
  handleOnchangeDatePicker = (date) => {
    this.setState({
      birthday: date[0],
    });
  };
  //
  handleChangeSelect = (selectOption) => {
    this.setState({ selectedGender: selectOption });
  };
  //
  handleConfirmBooking = async () => {
    console.log('Check: ', this.state);
    
    let date = new Date(this.state.birthday).getTime();
    let timeString = this.buildTimeBooking(this.props.dataTime);
    let doctorName = this.buildDoctorName(this.props.dataTime);
    let {
      fullName,
      phoneNumber,
      email,
      address,
      reason,
      birthday,
      selectedGender,
      doctorId,
      timeType,
      paymentMethod,
    } = this.state;

    if (
      !fullName ||
      !phoneNumber ||
      !email ||
      !address ||
      !reason ||
      !birthday ||
      !selectedGender ||
      !doctorId ||
      !timeType ||
      !paymentMethod
    ) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    //
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Email không hợp lệ!");
      return;
    }
    //
    const phoneRegex = /^[0-9]{9,11}$/;
    if (!phoneRegex.test(phoneNumber)) {
      toast.error("Số điện thoại không hợp lệ!");
      return;
    }

    let res = await postPatientBookAppointment({
      fullName: this.state.fullName,
      phoneNumber: this.state.phoneNumber,
      email: this.state.email,
      address: this.state.address,
      reason: this.state.reason,
      date: this.props.dataTime.date,
      birthday: date,
      selectedGender: this.state.selectedGender.value,
      doctorId: this.state.doctorId,
      timeType: this.state.timeType,
      language: this.props.language,
      timeString: timeString,
      doctorName: doctorName,
      paymentMethod: this.state.paymentMethod,
    });
    if (res && res.errCode === 0) {
      toast.success("Đặt lịch khám thành công!");
      this.setState({
        fullName: "",
        phoneNumber: "",
        email: "",
        address: "",
        reason: "",
        birthday: "",
        selectedGender: "",
        paymentMethod: "",
      });
      this.props.closeBookingClose();
    } else {
      toast.error("Đặt lịch hẹn thất bại!");
    }
  };
  //
  buildTimeBooking = (dataTime) => {
    let { language } = this.props;
    if (dataTime && !_.isEmpty(dataTime)) {
      let time =
        language === LANGUAGES.VI
          ? dataTime.timeTypeData.valueVi
          : dataTime.timeTypeData.valueEn;
  
      // Kiểm tra và đảm bảo moment nhận timestamp đúng định dạng (milliseconds)
      let date = moment(dataTime.date, "YYYY-MM-DD"); // hoặc "DD/MM/YYYY" tùy format

      if (!date.isValid()) {
        return `${time} - Invalid date`;
      }
  
      let formattedDate =
        language === LANGUAGES.VI
          ? date.format("dddd - DD/MM/YYYY")
          : date.locale("en").format("ddd - MM/DD/YYYY");
  
      return `${time} - ${formattedDate}`;
    }
    return "";
  };
  
  //
  buildDoctorName = (dataTime) => {
    let { language } = this.props;
    if (dataTime && !_.isEmpty(dataTime)) {
      let name =
        language === LANGUAGES.VI
          ? `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`
          : `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}`;
      return name;
    }
    return "";
  };
  render() {
    
    let { isOpenModal, closeBookingClose, dataTime } = this.props;
    let doctorId = "";
    if (dataTime && !_.isEmpty(dataTime)) {
      doctorId = dataTime.doctorId;
    }    
    return (
      <Modal
        isOpen={isOpenModal}
        className={"booking-modal-container"}
        size="lg"
        centered
      >
        <div className="booking-modal-content">
          <div className="booking-modal-header">
            <span className="left">
              <FormattedMessage id="patient.booking-modal.title" />
            </span>
            <span className="right" onClick={closeBookingClose}>
              <i className="fas fa-times"></i>
            </span>
          </div>
          <div className="booking-modal-body">
            <div className="doctor-infor">
              <ProfileDoctor
                doctorId={doctorId}
                isShowDescriptionDoctor={false}
                dataTime={dataTime}
                isShowLinkDetail={false}
                isShowPrice={true}
              />
            </div>
            <div className="row">
              <div className="col-6 form-group">
                <label>
                  <FormattedMessage id="patient.booking-modal.fullName" />
                </label>
                <input
                  className="form-control"
                  value={this.state.fullName}
                  onChange={(event) =>
                    this.handleOnChangeInput(event, "fullName")
                  }
                ></input>
              </div>
              <div className="col-6 form-group">
                <label>
                  <FormattedMessage id="patient.booking-modal.phoneNumber" />
                </label>
                <input
                  className="form-control"
                  value={this.state.phoneNumber}
                  onChange={(event) =>
                    this.handleOnChangeInput(event, "phoneNumber")
                  }
                ></input>
              </div>
              <div className="col-6 form-group">
                <label>
                  <FormattedMessage id="patient.booking-modal.email" />
                </label>
                <input
                  className="form-control"
                  value={this.state.email}
                  onChange={(event) => this.handleOnChangeInput(event, "email")}
                ></input>
              </div>
              <div className="col-6 form-group">
                <label>
                  <FormattedMessage id="patient.booking-modal.address" />
                </label>
                <input
                  className="form-control"
                  value={this.state.address}
                  onChange={(event) =>
                    this.handleOnChangeInput(event, "address")
                  }
                ></input>
              </div>
              <div className="col-6 form-group">
                <label>
                  <FormattedMessage id="patient.booking-modal.reason" />
                </label>
                <input
                  className="form-control"
                  value={this.state.reason}
                  onChange={(event) =>
                    this.handleOnChangeInput(event, "reason")
                  }
                ></input>
              </div>
              <div className="col-6 form-group">
                <label>
                  <FormattedMessage id="patient.booking-modal.birthday" />
                </label>
                <DatePicker
                  onChange={this.handleOnchangeDatePicker}
                  className="form-control"
                  value={this.state.birthday}
                />
              </div>
              <div className="col-6 form-group">
                <label>
                  <FormattedMessage id="patient.booking-modal.gender" />
                </label>
                <Select
                  value={this.state.selectedGender}
                  onChange={this.handleChangeSelect}
                  options={this.state.genders}
                />
              </div>
              <div className="col-6 form-group">
                <label>Hình thức thanh toán</label>
                <select
                  className="form-control"
                  value={this.state.paymentMethod}
                  onChange={(event) =>
                    this.handleOnChangeInput(event, "paymentMethod")
                  }
                >
                  <option value="cash">Tiền mặt</option>
                  <option value="banking">Chuyển khoản</option>
                </select>
              </div>
            </div>
          </div>
          <div className="booking-modal-footer">
            <button
              className="btn-booking-confirm"
              onClick={() => this.handleConfirmBooking()}
            >
              <FormattedMessage id="patient.booking-modal.btnConfirm" />
            </button>
            <button className="btn-booking-cancel" onClick={closeBookingClose}>
              <FormattedMessage id="patient.booking-modal.btnCancel" />
            </button>
          </div>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    genders: state.admin.genders,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGenders: () => dispatch(actions.fetchGenderStart()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
