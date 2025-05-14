import React, { Component } from "react";
import { connect } from "react-redux";
import {
  postVerifyBookAppointment,
  getExtraInforDoctorById,
  getDetailInforDoctor,
} from "../../services/userService";
import { FormattedMessage } from "react-intl";
import HomeHeader from "../HomePage/HomeHeader";
import "./VerifyEmail.scss";
import NumberFormat from "react-number-format";
import { LANGUAGES } from "../../utils/constant";

class VerifyEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statusVerify: false,
      errCode: 0,
      amount: 0,
      extraInfor: {},
      detailDoctor: {},
      
    };
  }

  async componentDidMount() {
    let urlParams = new URLSearchParams(this.props.location.search);
    let token = urlParams.get("token");
    let doctorId = urlParams.get("doctorId");

    let verifyRes = await postVerifyBookAppointment({
      token: token,
      doctorId: doctorId,
    });
    let res = await getExtraInforDoctorById(doctorId);
    if (verifyRes && verifyRes.errCode === 0 && res && res.errCode === 0) {
      this.setState({
        extraInfor: res.data,
        statusVerify: true,
        errCode: verifyRes.errCode,
      });
    } else {
      this.setState({
        extraInfor: res.data,
        statusVerify: true,
        errCode: verifyRes?.errCode || -1,
      });
    }

    let resInforDoctor = await getDetailInforDoctor(doctorId);
    if (resInforDoctor && resInforDoctor.errCode === 0) {
      this.setState({
        detailDoctor: resInforDoctor.data,
      });
    }
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }

    if (this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
      let res = await getExtraInforDoctorById(this.props.doctorIdFromParent);
      if (res && res.errCode === 0) {
        this.setState({
          extraInfor: res.data,
        });
      }
    }
  }

  render() {
    let urlParams = new URLSearchParams(this.props.location.search);
    let token = urlParams.get("token");
    let { statusVerify, errCode, extraInfor, detailDoctor } = this.state;
    let { language } = this.props;
    let nameVi = "",
      nameEn = "";
    if (detailDoctor && detailDoctor.positionData) {
      nameVi = `${detailDoctor.positionData.valueVi}, ${detailDoctor.firstName} ${detailDoctor.lastName}`;
      nameEn = `${detailDoctor.positionData.valueEn}, ${detailDoctor.lastName} ${detailDoctor.firstName}`;
    }
    console.log("Check extraInfor: ", extraInfor);
    console.log("Check detailDoctor: ", detailDoctor);
    return (
      <>
        <HomeHeader />
        <div className="verify-container">
          {statusVerify === false ? (
            <div className="verify-loading">Loading data...</div>
          ) : (
            <div>
              {errCode === 0 ? (
                <div>
                  <div className="verify-message">
                    Xác nhận lịch hẹn thành công!
                  </div>
                  <div>
                    <div className="clinic-doctor-name">
                      {language === LANGUAGES.VI ? nameVi : nameEn}
                    </div>
                    <div className="infor-clinic-doctor">
                      Địa chỉ phòng khám: {extraInfor.addressClinic}
                    </div>
                    <div className="infor-clinic-doctor">
                      Tên phòng khám: {extraInfor.nameClinic}
                    </div>
                    <div className="infor-clinic-doctor">
                      Số điện thoại: {detailDoctor.phoneNumber}
                    </div>
                    <div className="infor-clinic-doctor">
                      <FormattedMessage id="email.verify-email.price" />
                      {extraInfor?.priceTypeData &&
                        language === LANGUAGES.VI && (
                          <NumberFormat
                            className="verify-price"
                            value={extraInfor.priceTypeData.valueVi}
                            displayType="text"
                            thousandSeparator={true}
                            suffix={"VND"}
                          />
                        )}
                      {extraInfor?.priceTypeData &&
                        language === LANGUAGES.EN && (
                          <NumberFormat
                            className="verify-price"
                            value={extraInfor.priceTypeData.valueEn}
                            displayType="text"
                            thousandSeparator={true}
                            suffix={"$"}
                          />
                        )}
                    </div>
                  </div>

                  <form
                    action="http://localhost:8080/api/payment"
                    method="POST"
                  >
                    <input
                      type="hidden"
                      name="orderInfo"
                      value="Thanh toán lịch hẹn khám bệnh"
                    />
                    <input
                      type="hidden"
                      name="amount"
                      value={extraInfor?.priceTypeData?.valueVi}
                    />
                    <input type="hidden" name="token" value={token} />
                    <button type="submit" className="momo-button">
                      Thanh toán qua MoMo
                    </button>
                  </form>
                  <form
                    action="http://localhost:8080/api/zalopay"
                    method="POST"
                  >
                    <input
                      type="hidden"
                      name="orderInfo"
                      value="Thanh toán lịch hẹn khám bệnh qua ZaloPay"
                    />
                    <input
                      type="hidden"
                      name="amount"
                      value={extraInfor?.priceTypeData?.valueVi}
                    />
                    <input type="hidden" name="token" value={token} />
                    <button type="submit" className="zalopay-button">
                      Thanh toán qua ZaloPay
                    </button>
                  </form>
                </div>
              ) : (
                <div>
                  <div className="verify-message">
                    Lịch hẹn đã được xác nhận!
                  </div>
                  <div>
                    <div className="clinic-doctor-name">
                      {language === LANGUAGES.VI ? nameVi : nameEn}
                    </div>
                    <div className="infor-clinic-doctor">
                      Địa chỉ phòng khám: {extraInfor.addressClinic}
                    </div>
                    <div className="infor-clinic-doctor">
                      Tên phòng khám: {extraInfor.nameClinic}
                    </div>
                    <div className="infor-clinic-doctor">
                      Số điện thoại: {detailDoctor.phoneNumber}
                    </div>
                    <div className="infor-clinic-doctor">
                      <FormattedMessage id="email.verify-email.price" />
                      {extraInfor?.priceTypeData &&
                        language === LANGUAGES.VI && (
                          <NumberFormat
                            className="verify-price"
                            value={extraInfor.priceTypeData.valueVi}
                            displayType="text"
                            thousandSeparator={true}
                            suffix={"VND"}
                          />
                        )}
                      {extraInfor?.priceTypeData &&
                        language === LANGUAGES.EN && (
                          <NumberFormat
                            className="verify-price"
                            value={extraInfor.priceTypeData.valueEn}
                            displayType="text"
                            thousandSeparator={true}
                            suffix={"$"}
                          />
                        )}
                    </div>
                  </div>
                  <form
                    action="http://localhost:8080/api/payment"
                    method="POST"
                  >
                    <input
                      type="hidden"
                      name="orderInfo"
                      value="Thanh toán lịch hẹn khám bệnh"
                    />
                    <input
                      type="hidden"
                      name="amount"
                      value={extraInfor?.priceTypeData?.valueVi}
                    />
                    <input type="hidden" name="token" value={token} />
                    <button type="submit" className="momo-button">
                      Thanh toán qua MoMo
                    </button>
                  </form>
                  <form
                    action="http://localhost:8080/api/zalopay"
                    method="POST"
                  >
                    <input
                      type="hidden"
                      name="orderInfo"
                      value="Thanh toán lịch hẹn khám bệnh qua ZaloPay"
                    />
                    <input
                      type="hidden"
                      name="amount"
                      value={extraInfor?.priceTypeData?.valueVi}
                    />
                    <input type="hidden" name="token" value={token} />
                    <button type="submit" className="zalopay-button">
                      Thanh toán qua ZaloPay
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail);
