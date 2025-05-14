import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManageSchedule.scss";
import { FormattedMessage } from "react-intl";
import Select from "react-select";
import * as actions from "../../../store/actions";
import { LANGUAGES, dateFormat } from "../../../utils/constant";
import DatePicker from "../../../components/Input/DatePicker";
import moment from "moment";
import { toast } from "react-toastify";
import _ from "lodash";
import { saveBulkScheduleDoctor } from "../../../services/userService";
//
class ManageSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listDoctors: [],
      selectedDoctor: {},
      currentDate: new Date(),
      rangeTime: [],
    };
  }

  componentDidMount() {
    this.props.fetchAllDoctors();
    this.props.fetchAllScheduleTime();
    // Nếu là Doctor thì đặt mặc định chính bản thân mình
    const { userInfo } = this.props;
    if (userInfo && userInfo.roleId === "R2") {
      this.setState({
        selectedDoctor: {
          label: `${userInfo.lastName} ${userInfo.firstName}`,
          value: userInfo.id,
        },
      });
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.allDoctors !== this.props.allDoctors) {
      let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
      this.setState({
        listDoctors: dataSelect,
      });
    }
    if (prevProps.allScheduleTime !== this.props.allScheduleTime) {
      let data = this.props.allScheduleTime;
      if (data && data.length > 0) {
        data = data.map((item) => ({ ...item, isSelected: "false" }));
      }
      this.setState({
        rangeTime: data,
      });
    }
  }

  //
  buildDataInputSelect = (inputData) => {
    let result = [];
    let { language } = this.props;
    if (inputData && inputData.length > 0) {
      inputData.map((item, index) => {
        let object = {};
        let labelVi = `${item.firstName} ${item.lastName}`;
        let labelEn = `${item.lastName} ${item.firstName}`;
        object.label = language === LANGUAGES.VI ? labelVi : labelEn;
        object.value = item.id;
        result.push(object);
      });
    }
    return result;
  };
  //
  handleChangeSelect = async (selectedDoctor) => {
    this.setState({ selectedDoctor: selectedDoctor });
  };
  //
  handleOnchangeDatePicker = (date) => {
    this.setState({ currentDate: date[0] });
  };
  //
  handleClickBtnTime = (time) => {
    let { rangeTime } = this.state;
    if (rangeTime && rangeTime.length > 0) {
      rangeTime = rangeTime.map((item) => {
        if (item.id === time.id) item.isSelected = !item.isSelected;
        return item;
      });
      this.setState({
        rangeTime: rangeTime,
      });
    }
  };
  //

  handleSaveSchedule = async () => {
    let { rangeTime, selectedDoctor, currentDate } = this.state;
    let result = [];

    if (!currentDate) {
      toast.error("Invalid Date");
      return;
    }
    if (!selectedDoctor || _.isEmpty(selectedDoctor)) {
      toast.error("Invalid Select Doctor");
      return;
    }
    let formatedDate = moment(currentDate).format("YYYY-MM-DD");
    if (rangeTime && rangeTime.length > 0) {
      let selectedTime = rangeTime.filter((item) => item.isSelected === true);

      if (selectedTime.length > 0) {
        result = selectedTime.map((schedule) => ({
          doctorId: selectedDoctor.value,
          date: formatedDate,
          timeType: schedule.keyMap,
        }));
      } else {
        toast.error("Invalid selected time!");
        return;
      }
    }

    try {
      let res = await saveBulkScheduleDoctor({
        arrSchedule: result,
        doctorId: selectedDoctor.value,
        formatedDate: formatedDate,
      });
      if (res.errCode === 0) {
        toast.success("Lưu thông tin thành công!");
        this.setState({
          rangeTime: rangeTime.map((item) => ({ ...item, isSelected: false })),
          // selectedDoctor: "",
          currentDate: "",
        });
      } else if (res.errCode === 1) {
        toast.error("Đã có lịch trong khoảng thời gian này!");
      } else {
        toast.error("Lỗi khi lưu lịch khám!");
      }
    } catch (error) {
      console.error("Lỗi khi lưu lịch khám:", error);
    }
  };

  render() {
    console.log("Check props: ", this.props);
    let { rangeTime } = this.state;
    let { language, userInfo } = this.props;

    // let nameVi = `${userInfo.firstName} ${userInfo.lastName}`;
    // let nameEn = `${userInfo.firstName} ${userInfo.lastName}`;

    let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
    return (
      <React.Fragment>
        <div className="manage-schedule-container">
          <div className="m-s-title">
            <FormattedMessage id="manage-schedule.title" />
          </div>
          <div className="container">
            <div className="row">
              {userInfo.roleId === "R1" ? (
                <div className="col-6 form-group">
                  <label>
                    <FormattedMessage id="manage-schedule.select-doctor" />
                  </label>
                  <Select
                    value={this.state.selectedDoctor}
                    onChange={this.handleChangeSelect}
                    options={this.state.listDoctors}
                    className="form-control"
                  />
                </div>
              ) : (
                <div className="col-6 form-group">
                  <label>
                    <FormattedMessage id="manage-schedule.doctor-name" />
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    value={`${userInfo.firstName} ${userInfo.lastName}`}
                    disabled
                  />
                </div>
              )}

              <div className="col-6 form-group">
                <label>
                  <FormattedMessage id="manage-schedule.select-date" />
                </label>
                <DatePicker
                  className="form-control"
                  onChange={this.handleOnchangeDatePicker}
                  value={this.state.currentDate}
                  minDate={yesterday}
                />
              </div>
              <div className="col-12 pick-hour-container">
                {rangeTime &&
                  rangeTime.length > 0 &&
                  rangeTime.map((item, index) => {
                    return (
                      <button
                        className={
                          item.isSelected === true
                            ? "btn btn-schedule active"
                            : "btn btn-schedule"
                        }
                        key={index}
                        onClick={() => this.handleClickBtnTime(item)}
                      >
                        {language === LANGUAGES.VI
                          ? item.valueVi
                          : item.valueEn}
                      </button>
                    );
                  })}
              </div>
            </div>
            <div className="col-12">
              <button
                className="btn btn-warning btn-save-schedule"
                onClick={() => this.handleSaveSchedule()}
              >
                <FormattedMessage id="manage-schedule.save" />
              </button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
    allDoctors: state.admin.allDoctors,
    allScheduleTime: state.admin.allScheduleTime,
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
    fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleTime()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
