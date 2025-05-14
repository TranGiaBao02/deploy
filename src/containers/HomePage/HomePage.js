import React, { Component } from 'react';
import { connect } from 'react-redux';
import HomeHeader from './HomeHeader';
import Spectialty from './Section/Spectialty';
import MedicalFacility from './Section/MedicalFacility';
import OutStandingDoctor from './Section/OutStandingDoctor';
// import About from './Section/About';
import HomeFooter from './HomeFooter';
import './HomePage.scss'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

class HomePage extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         paymentStatus: null, // Trạng thái thanh toán
    //         amount: null,
    //         appTransId: null
    //     };
    // }
    // componentDidMount() {
    //         window.history.pushState({}, '', '/home');
    //     }
    render() {
        let settings = {
            dots: false,
            infinite: false,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 1,
            // slickGoto: this.handleAfterChange
        };
        return (
            <div>
                <HomeHeader isShowBanner={true}/>
                <Spectialty 
                    settings={settings}
                />
                <MedicalFacility 
                    settings={settings}
                />
                <OutStandingDoctor
                    settings={settings}
                />
                {/* <About/> */}
                <HomeFooter/>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
