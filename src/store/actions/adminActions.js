import actionTypes from "./actionTypes";
import {
  createNewUserService,
  getAllCodeService,
  getAllUsers,
  deleteUserService,
  editUserService,
  getTopDoctorHomeService,
  getAllDoctors,
  saveDetailDoctorService,
  getAllSpecialty, getAllClinic
} from "../../services/userService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// -- Gender
export const fetchGenderStart = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: actionTypes.FETCH_GENDER_START,
      });
      let res = await getAllCodeService("gender");
      if (res && res.errCode === 0) {
        dispatch(fetchGenderSuccess(res.data));
      } else {
        dispatch(fetchGenderFailed());
      }
    } catch (e) {
      dispatch(fetchGenderFailed());
      console.log(e);
    }
  };
};

export const fetchGenderSuccess = (genderData) => ({
  type: actionTypes.FETCH_GENDER_SUCCESS,
  data: genderData,
});

export const fetchGenderFailed = () => ({
  type: actionTypes.FETCH_GENDER_FAILED,
});

// -- Position
export const fetchPositionStart = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllCodeService("POSITION");
      if (res && res.errCode === 0) {
        dispatch(fetchPositionSuccess(res.data));
      } else {
        dispatch(fetchPositionFailed());
      }
    } catch (e) {
      dispatch(fetchPositionFailed());
      console.log(e);
    }
  };
};
export const fetchPositionSuccess = (positionData) => ({
  type: actionTypes.FETCH_POSITION_SUCCESS,
  data: positionData,
});

export const fetchPositionFailed = () => ({
  type: actionTypes.FETCH_POSITION_FAILED,
});

// -- Role
export const fetchRoleStart = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllCodeService("ROLE");
      if (res && res.errCode === 0) {
        dispatch(fetchRoleSuccess(res.data));
      } else {
        dispatch(fetchRoleFailed());
      }
    } catch (e) {
      dispatch(fetchRoleFailed());
      console.log(e);
    }
  };
};

export const fetchRoleSuccess = (roleData) => ({
  type: actionTypes.FETCH_ROLE_SUCCESS,
  data: roleData,
});

export const fetchRoleFailed = () => ({
  type: actionTypes.FETCH_ROLE_FAILED,
});
// -- 58 --

//
export const createNewUser = (data) => {
  return async (dispatch, getState) => {
    try {
      let res = await createNewUserService(data);
      if (res && res.errCode === 0) {
        toast.success("Thêm người dùng mới thành công!");
        dispatch(saveUserSuccess());
        dispatch(fetchAllUsersStart());
      } else {
        dispatch(saveUserFailed());
      }
    } catch (e) {
      dispatch(saveUserFailed());
      console.log('saveUserFailed error: ', e);
    }
  };
};

export const saveUserSuccess = () => ({
  // type: actionTypes.SAVE_USER_SUCCESS,
  type: actionTypes.CREATE_USER_SUCCESS
});

export const saveUserFailed = () => ({
  // type: actionTypes.SAVE_USER_FAILED,
  type: actionTypes.CREATE_USER_FAILED
});
// --
export const fetchAllUsersStart = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllUsers("ALL");
      // let res1 = await getTopDoctorHomeService('');
      res.users.reverse();
      if (res && res.errCode === 0) {
        dispatch(fetchAllUserSuccess(res.users));
      } else {
        toast.error("Fetch all users error!");
        dispatch(fetchAllUserFailed());
      }
    } catch (e) {
      dispatch(fetchAllUserFailed());
      console.log(e);
    }
  };
};

export const fetchAllUserSuccess = (data) => ({
  type: actionTypes.FETCH_ALL_USER_SUCCESS,
  users: data,
});

export const fetchAllUserFailed = () => ({
  type: actionTypes.FETCH_ALL_USER_FAILED,
});

// xóa người dùng
export const deleteAUser = (userId) => {
  return async (dispatch, getState) => {
    try {
      let res = await deleteUserService(userId);
      if (res && res.errCode === 0) {
        toast.success("Xóa người dùng thành công!");
        dispatch(deleteUserSuccess());
        dispatch(fetchAllUsersStart());
      } else {
        toast.error("Xóa người dùng bị lỗi!");

        dispatch(deleteUserFailed());
      }
    } catch (e) {
      dispatch(deleteUserFailed());
      console.log(e);
    }
  };
};
//
export const deleteUserSuccess = () => ({
  type: actionTypes.DELETE_USER_SUCCESS,
});

export const deleteUserFailed = () => ({
  type: actionTypes.DELETE_USER_FAILED,
});

// Xóa người dùng
export const editAUser = (data) => {
  return async (dispatch, getState) => {
    try {
      let res = await editUserService(data);
      console.log("Response từ API:", res);
      if (res && res.errCode === 0) {
        toast.success("Cập nhật người dùng thành công!");
        dispatch(editUserSuccess());
        dispatch(fetchAllUsersStart());
      } else {
        toast.error("Cập nhật người dùng bị lỗi!");

        dispatch(editUserFailed());
      }
    } catch (e) {
      toast.error("Lỗi kết nối! Vui lòng thử lại.");
      dispatch(editUserFailed());
      console.log("Lỗi từ API:", e);
    }
  };
};

export const editUserSuccess = () => ({
  type: actionTypes.EDIT_USER_SUCCESS,
});

export const editUserFailed = () => ({
  type: actionTypes.EDIT_USER_FAILED,
});
//
export const fetchTopDoctor = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getTopDoctorHomeService('')
      if(res && res.errCode === 0) {
        dispatch({
          type: actionTypes.FETCH_TOP_DOCTORS_SUCCESS,
          dataDoctors: res.data
        })
      }else{
        dispatch({
          type: actionTypes.FETCH_TOP_DOCTORS_FAILED
        })
      }
    } catch (e) {
      console.log('FETCH_TOP_DOCTOR_FAILED: ', e)
      dispatch({
        type: actionTypes.FETCH_TOP_DOCTORS_FAILED
      })
    }
  };
}
//
export const fetchAllDoctors = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllDoctors()
      if(res && res.errCode === 0) {
        dispatch({
          type: actionTypes.FETCH_ALL_DOCTORS_SUCCESS,
          dataDoctors: res.data
        })
      }else{
        dispatch({
          type: actionTypes.FETCH_ALL_DOCTORS_FAILED
        })
      }
    } catch (e) {
      console.log('FETCH_ALL_DOCTOR_FAILED: ', e)
      dispatch({
        type: actionTypes.FETCH_ALL_DOCTORS_FAILED
      })
    }
  };
}

//
export const saveDetailDoctor = (data) => {
  return async (dispatch, getState) => {
    try {
      let res = await saveDetailDoctorService(data)
      if(res && res.errCode === 0) {
        toast.success("Save Infor Detail Doctor Success!")
        dispatch({
          type: actionTypes.SAVE_DETAIL_DOCTOR_SUCCESS,
          dataDoctors: res.data
        })
      }else{
        toast.error("Save Infor Detail Doctor Failed!")
        dispatch({
          type: actionTypes.SAVE_DETAIL_DOCTOR_FAILED
        })
      }
    } catch (e) {
      toast.error("Save Infor Detail Doctor Failed!")
      console.log('SAVE_DETAIL_DOCTOR_FAILED: ', e)
      dispatch({
        type: actionTypes.SAVE_DETAIL_DOCTOR_FAILED
      })
    }
  };
}
//FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS
export const fetchAllScheduleTime = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllCodeService('TIME')
      if(res && res.errCode === 0) {
        dispatch({
          type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS,
          dataTime: res.data
        })
      }else{
        dispatch({
          type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED
        })
      }
    } catch (e) {
      console.log('FETCH_ALLCODE_SCHEDULE_TIME_FAILED: ', e)
      dispatch({
        type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED
      })
    }
  };
}
// 78
export const getRequiredDoctorInfor = () => {
  return async(dispatch, getState) => {
    try{
      dispatch({type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_START})

      let resPrice = await getAllCodeService("PRICE");
      let resPayment = await getAllCodeService("PAYMENT");
      let resProvince = await getAllCodeService("PROVINCE");
      let resSpecialty = await getAllSpecialty();
      let resClinic = await getAllClinic();

      if(resPrice && resPrice.errCode === 0
        && resPayment && resPayment.errCode === 0
        && resProvince && resProvince.errCode === 0
        && resSpecialty && resSpecialty.errCode === 0
        && resClinic && resClinic.errCode === 0
      ){
        let data = {
          resPrice: resPrice.data,
          resPayment: resPayment.data,
          resProvince: resProvince.data,
          resSpecialty: resSpecialty.data,
          resClinic: resClinic.data
        }
        dispatch(fetchRequiredDoctorInforSuccess(data))
        } else {
          dispatch(fetchRequiredDoctorInforFailed())
        }
    } catch(e){
      dispatch(fetchRequiredDoctorInforFailed());
    }
  }
}

export const fetchRequiredDoctorInforSuccess = (allRequiredData) => ({
  type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_SUCCESS,
  data: allRequiredData
})

export const fetchRequiredDoctorInforFailed = () => ({
  type: actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_FAILED
})