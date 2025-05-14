import actionTypes from "../actions/actionTypes";

const initialState = {
  isLoadingGender: false,
  genders: [],
  roles: [],
  positions: [],
  users: [],
  topDoctors: [],
  allDoctors: [],
  allScheduleTime: [],
  allRequiredDoctorInfor: []
};

const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    // -- Gender
    case actionTypes.FETCH_GENDER_START:
      state.isLoadingGender = true;
      return {
        ...state,
      };

    case actionTypes.FETCH_GENDER_SUCCESS:
      state.genders = action.data;
      state.isLoadingGender = false;

      return {
        ...state,
      };

    case actionTypes.FETCH_GENDER_FAILED:
      state.isLoadingGender = false;
      state.genders = [];
      return {
        ...state,
      };
    // -- Position
    case actionTypes.FETCH_POSITION_SUCCESS:
      state.positions = action.data;
      // state.isLoadingPosition = false;
      return {
        ...state,
      };

    case actionTypes.FETCH_POSITION_FAILED:
      // state.isLoadingPosition = false;
      state.positions = [];
      return {
        ...state,
      };

    // -- Role
    case actionTypes.FETCH_ROLE_SUCCESS:
      state.roles = action.data;
      // state.isLoadingRole = false;
      return {
        ...state,
      };

    case actionTypes.FETCH_ROLE_FAILED:
      // state.isLoadingRole = false;
      state.roles = [];
      return {
        ...state,
      };
      // -- 58 --

      // -------------
    case actionTypes.FETCH_ALL_USER_SUCCESS:
      state.users = action.users;
      return {
        ...state,
      };

      case actionTypes.FETCH_ALL_USER_FAILED:
      state.users = [];
      return {
        ...state,
      };

      // -- 58 --

      //
      case actionTypes.FETCH_TOP_DOCTORS_SUCCESS:
      state.topDoctors = action.dataDoctors;
      return {
        ...state,
      };

      case actionTypes.FETCH_TOP_DOCTORS_FAILED:
      state.topDoctors = [];
      return {
        ...state,
      };
      // 68
      case actionTypes.FETCH_ALL_DOCTORS_SUCCESS:
      state.allDoctors = action.dataDoctors;
      return {
        ...state,
      };

      case actionTypes.FETCH_ALL_DOCTORS_FAILED:
      state.allDoctors = [];
      return {
        ...state,
      };
      // 72
      case actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS:
      state.allScheduleTime = action.dataTime;
      return {
        ...state,
      };

      case actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED:
      state.allScheduleTime = [];
      return {
        ...state,
      };
      // 78
      case actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_SUCCESS:
      state.allRequiredDoctorInfor = action.data;
      return {
        ...state,
      };

      case actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_FAILED:
      state.allRequiredDoctorInfor = [];
      return {
        ...state,
      };

    default:
      return state;

  }
};

export default adminReducer;
