import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";

class About extends Component {
  render() {
    return (
      <div className="section-share section-about">
        <div className="section-about-header">
          Truyền thông nói về Carevo
        </div>
        {/* <div className="section-about-content">
          <div className="content-left">
            <iframe
              width="100%"
              height="400px"
              src="https://www.youtube.com/embed/rJJqtZZLJy0"
              title="Sở Y tế thông tin về quy trình khám bệnh tại BV Thu Cúc | Tin tức mới nhất"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
            ></iframe>
          </div>
          <div className="content-right">
            <p>
              Liên quan đến sự cố y khoa xảy ra tại Bệnh viện Đa khoa Quốc tế
              Thu Cúc mới đây, Sở Y tế Hà Nội đã thành lập Hội đồng chuyên môn
              để xem xét, đánh giá quy trình khám bệnh, chữa bệnh đối với bệnh
              nhân.
            </p>
          </div>
        </div> */}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(About);
