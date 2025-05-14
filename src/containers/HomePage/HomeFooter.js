import React, { Component } from "react";
import { connect } from "react-redux";
import "./HomeFooter.scss";

class HomeFooter extends Component {
  render() {
    return (
      <div className="home-footer">
        <div className="footer-container container">
          <div className="footer-section company-info">
            <h4>Công ty Carevo</h4>
            <p>📍 Lô B4/D21, Khu đô thị mới Cầu Giấy, Hà Nội, Việt Nam</p>
            <p>🔖 ĐKKD số 0106xxxxxx - Sở KHĐT Hà Nội cấp ngày 16/03/2015</p>
            <p>📞 024-7301-2468 (7h - 18h)</p>
            <p>📧 support@carevo.vn (7h - 18h)</p>
            <p>📍 Tòa nhà H3, 384 Hoàng Diệu, Q1, TP.HCM</p>
            <div className="certifications">
              {/* <img src="path-to-red-cert1.png" alt="Đã đăng ký" />
              <img src="path-to-red-cert2.png" alt="Đã đăng ký" /> */}
            </div>
          </div>

          <div className="footer-section quick-links">
            <h4>Liên kết</h4>
            <ul>
              <li><a href="#">Liên hệ hợp tác</a></li>
              <li><a href="#">Chuyển đổi số</a></li>
              <li><a href="#">Chính sách bảo mật</a></li>
              <li><a href="#">Quy chế hoạt động</a></li>
              <li><a href="#">Tuyển dụng</a></li>
              <li><a href="#">Điều khoản sử dụng</a></li>
              <li><a href="#">Câu hỏi thường gặp</a></li>
              <li><a href="#">Sức khỏe doanh nghiệp</a></li>
            </ul>
          </div>

          <div className="footer-section partners">
            <h4>Đối tác bảo trợ nội dung</h4>
            <div className="partner">
              {/* <img src="path-to-hello-doctor-logo.png" alt="Hello Doctor" /> */}
              <p><strong>Hello Doctor</strong><br/>Bảo trợ chuyên mục “sức khỏe tinh thần”</p>
            </div>
            <div className="partner">
              {/* <img src="path-to-bernard-logo.png" alt="Bernard" /> */}
              <p><strong>Bệnh viện Bernard</strong><br />Bảo trợ chuyên mục “y khoa chuyên sâu”</p>
            </div>
            <div className="partner">
              {/* <img src="path-to-doctor-check-logo.png" alt="Doctor Check" /> */}
              <p><strong>Doctor Check</strong><br />Chuyên mục “sức khỏe tổng quát”</p>
            </div>
          </div>
        </div>

        <div className="footer-download">
          <p>
            TRIỂN KHAI ỨNG DỤNG WEB ĐẶT LỊCH KHÁM BỆNH TRỰC TUYẾN - IUH 2025
          </p>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoggedIn: state.user.isLoggedIn,
});

export default connect(mapStateToProps)(HomeFooter);
