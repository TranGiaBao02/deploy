import actionTypes from "../actions/actionTypes";

const initialState = {
  isLoggedIn: false,
  adminInfo: null,
  doctorInfo: null,
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.USER_LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        userInfo: action.userInfo,
        // doctorInfo: action.doctorInfo,
      };
    case actionTypes.USER_LOGIN_FAIL:
      return {
        ...state,
        isLoggedIn: false,
        userInfo: null,
      };
    case actionTypes.PROCESS_LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        userInfo: null,
      };
    case actionTypes.GET_DOCTOR_INFO_SUCCESS:
      return {
        ...state,
        doctorInfo: action.doctorInfo,
      };
    default:
      return state;
  }
};

export default appReducer;
