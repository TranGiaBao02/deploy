import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./ManagePatient.scss";
import DatePicker from "../../../components/Input/DatePicker";
import {
  getAllPatientForDoctor,
  postSendRemedy,
} from "../../../services/userService";
import moment from "moment";
import { withRouter } from "react-router-dom";
import { LANGUAGES } from "../../../utils";
import RemedyModal from "./RemedyModal";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";

class ManagePatient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: moment(new Date()).startOf("day").valueOf(),
      dataPatient: [],
      isOpenRemedyModal: false,
      dataModal: {},
      isShowLoading: false,
    };
  }

  componentDidMount() {
    this.getDataPatient();
  }

  componentDidUpdate(prevProps) {
    if (this.props.language !== prevProps.language) {
      this.getDataPatient(); // reload khi đổi ngôn ngữ
    }
  }

  handleOnChangeDatePicker = (date) => {
    this.setState(
      {
        currentDate: date[0],
      },
      () => {
        this.getDataPatient();
      }
    );
  };

  getDataPatient = async () => {
    const { user } = this.props;
    const { currentDate } = this.state;
    const formatedDate = moment(currentDate).format("YYYY-MM-DD");

    let res = await getAllPatientForDoctor({
      doctorId: user.id,
      date: formatedDate,
    });

    if (res && res.errCode === 0) {
      const uniquePatients = res.data.filter((value, index, self) => {
        if (!value.patientData) return false;

        return (
          index ===
          self.findIndex(
            (t) =>
              t.patientData &&
              t.patientData.email === value.patientData.email &&
              t.patientData.firstName === value.patientData.firstName &&
              t.date === value.date
          )
        );
      });

      this.setState({
        dataPatient: uniquePatients,
      });
    }
  };

  handleBtnConfirm = (item) => {
    const data = {
      doctorId: item.doctorId,
      patientId: item.patientId,
      email: item.patientData.email,
      timeType: item.timeType,
      patientName: item.patientData.firstName,
    };
    this.setState({
      isOpenRemedyModal: true,
      dataModal: data,
    });
  };

  closeRemedyModal = () => {
    this.setState({
      isOpenRemedyModal: false,
      dataModal: {},
    });
  };

  sendRemedy = async (dataChild) => {
    const { dataModal } = this.state;
    this.setState({ isShowLoading: true });

    const res = await postSendRemedy({
      email: dataChild.email,
      imgBase64: dataChild.imgBase64,
      doctorId: dataModal.doctorId,
      patientId: dataModal.patientId,
      timeType: dataModal.timeType,
      language: this.props.language,
      patientName: dataModal.patientName,
    });

    if (res && res.errCode === 0) {
      toast.success("Gửi đơn thuốc thành công!");
      this.setState({ isShowLoading: false });
      this.closeRemedyModal();
      this.getDataPatient();
    } else {
      toast.error("Vui lòng kiểm tra lại thông tin!");
      this.setState({ isShowLoading: false });
      console.error("Error sending Remedy: ", res);
    }
  };

  handleBtnRemedy = (item) => {
    console.log("Gửi hóa đơn", item);
  };

  render() {
    const {
      dataPatient,
      isOpenRemedyModal,
      dataModal,
      isShowLoading,
      currentDate,
    } = this.state;
    const { language } = this.props;

    console.log("This.state: ", this.state);
    console.log("Check dataPatient: ", dataPatient);

    return (
      <LoadingOverlay active={isShowLoading} spinner text="Loading...">
        <div className="manage-patient-container">
          <div className="m-p-title">
            <FormattedMessage id="manage-patient.title" />
          </div>
          <div className="manage-patient-body row">
            <div className="col-4 form-group">
              <label>
                <FormattedMessage id="manage-patient.select-date" />
              </label>
              <DatePicker
                onChange={this.handleOnChangeDatePicker}
                className="form-control"
                value={currentDate}
              />
            </div>
            <div className="col-12 table-manage-patient">
              <table className="table" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>
                      <FormattedMessage id="manage-patient.ord" />
                    </th>
                    <th>
                      <FormattedMessage id="manage-patient.time" />
                    </th>
                    <th>
                      <FormattedMessage id="manage-patient.fullName" />
                    </th>
                    <th>
                      <FormattedMessage id="manage-patient.email" />
                    </th>
                    <th>
                      <FormattedMessage id="manage-patient.address" />
                    </th>
                    <th>
                      <FormattedMessage id="manage-patient.gender" />
                    </th>
                    <th>
                      <FormattedMessage id="manage-patient.paymentMethod" />
                    </th>
                    <th>
                      <FormattedMessage id="manage-patient.paymentStatus" />
                    </th>
                    <th>
                      <FormattedMessage id="manage-patient.action" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dataPatient.length > 0 ? (
                    dataPatient.map((item, index) => {
                      const gender =
                        language === LANGUAGES.VI
                          ? item.patientData.genderData.valueVi
                          : item.patientData.genderData.valueEn;

                      const paymentStatus = item.paymentStatus;
                      const paymentStatusText =
                        paymentStatus === "PS1"
                          ? language === LANGUAGES.VI
                            ? "Chưa thanh toán"
                            : "Unpaid"
                          : paymentStatus === "PS2"
                          ? language === LANGUAGES.VI
                            ? "Đã thanh toán"
                            : "Paid"
                          : language === LANGUAGES.VI
                          ? "Không xác định"
                          : "Unknown";

                      const paymentMethod = item.paymentMethod;
                      const paymentMethodText =
                        paymentMethod === "cash"
                          ? language === LANGUAGES.VI
                            ? "Tiền mặt"
                            : "Cash"
                          : paymentMethod === "banking"
                          ? language === LANGUAGES.VI
                            ? "Chuyển khoản"
                            : "Bank"
                          : language === LANGUAGES.VI
                          ? "Không xác định"
                          : "Unknown";

                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.date}</td>
                          <td>{item.patientData.firstName}</td>
                          <td>{item.patientData.email}</td>
                          <td>{item.patientData.address}</td>
                          <td>{gender}</td>
                          <td>{paymentMethodText}</td>
                          <td>{paymentStatusText}</td>

                          <td>
                            <button
                              className="mp-btn-confirm"
                              onClick={() => this.handleBtnConfirm(item)}
                            >
                              Xác nhận
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center" }}>
                        Không có dữ liệu!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <RemedyModal
          isOpenModal={isOpenRemedyModal}
          dataModal={dataModal}
          closeRemedyModal={this.closeRemedyModal}
          sendRemedy={this.sendRemedy}
        />
      </LoadingOverlay>
    );
  }
}

const mapStateToProps = (state) => ({
  language: state.app.language,
  user: state.user.userInfo,
});

export default withRouter(connect(mapStateToProps)(ManagePatient));
