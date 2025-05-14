import axios from "../axios";

const handleLoginApi = async (userEmail, userPassword) => {
  return await axios.post("/api/login", {
    email: userEmail,
    password: userPassword,
  });
};

const getAllUsers = async (inputId) => {
  return await axios.get(`/api/get-all-users?id=${inputId}`);
};

const createNewUserService = async (inputData) => {

  const mappedData = {
    ...inputData,
    gender: inputData.gender,
    roleId: inputData.roleId,
    positionId: inputData.positionId,
  };
  console.log("🔵 Dữ liệu gửi lên server:", mappedData);
  return await axios.post("/api/create-new-user/", mappedData);
};

const deleteUserService = async (userId) => {
  return await axios.delete("/api/delete-user/", {
    data: {
      id: userId,
    },
  });
};

const getAllCodeService = (inputType) => {
  return axios.get(`/api/allcode?type=${inputType}`);
};

const editUserService = async (inputData) => {  
  const mappedData = {
    ...inputData,
    gender: inputData.gender,
    roleId: inputData.roleId,
    positionId: inputData.positionId,
  };
  console.log("🔵 Dữ liệu gửi lên server:", mappedData);
  return await axios.put("/api/edit-user", mappedData);
};

const getTopDoctorHomeService = (limit) => {
  return axios.get(`/api/top-doctor-home?limit=${limit}`);
}

const getAllDoctors = () => {
  return axios.get(`/api/get-all-doctors`)
}

const saveDetailDoctorService = (data) => {
  return axios.post('/api/save-infor-doctors', data);
}

const getDetailInforDoctor = (inputId) => {
  return axios.get(`/api/get-detail-doctor-by-id?id=${inputId}`)
}

const saveBulkScheduleDoctor = (data) => {
  return axios.post(`/api/bulk-create-schedule`, data)
}

const getScheduleDoctorByDate = (doctorId, date) => {
  return axios.get(`/api/get-schedule-doctor-by-date?doctorId=${doctorId}&date=${date}`)
}

const getExtraInforDoctorById = (doctorId) => {
  return axios.get(`/api/get-extra-infor-doctor-by-id?doctorId=${doctorId}`)
}

const getProfileDoctorById = (doctorId) => {
  return axios.get(`/api/get-profile-doctor-by-id?doctorId=${doctorId}`)
}

const postPatientBookAppointment = (data) => {
  console.log("Dữ liệu gửi lên server: ", data);  // In ra dữ liệu gửi lên

  return axios.post('/api/patient-book-appointment', data)
}

const postVerifyBookAppointment = (data) => {
  console.log('Check data - postVerify: ', data);
  
  return axios.post('/api/verify-book-appointment', data)
}

const createNewSpecialty = (data) => {
  return axios.post('/api/create-new-specialty', data)
}

const getAllSpecialty = () => {
  return axios.get(`/api/get-specialty`)
}
const getAllDetailSpecialtyById = (data) => {  
  return axios.get(`/api/get-detail-specialty-by-id?id=${data.id}&location=${data.location}`)
}

const createNewClinic = (data) => {
  return axios.post('/api/create-new-clinic', data)
}

const getAllClinic = () => {
  return axios.get(`/api/get-clinic`)
}

const getAllDetailClinicById = (data) => {
  return axios.get(`/api/get-detail-clinic-by-id?id=${data.id}`)
}

const getAllPatientForDoctor = (data) => {
  return axios.get(`/api/get-list-patient-for-doctor?doctorId=${data.doctorId}&date=${data.date}`)
}

const postSendRemedy = (data) => {
  return axios.post('/api/send-remedy', data)
}
const deleteClinic = (id) => {
  return axios.delete('/api/delete-clinic', {
      data: { id: id }
  });
};
const updateClinic = (data) => {
  return axios.put('/api/update-clinic', data);
};

const updateSpecialty = (data) => {
  return axios.put('/api/update-specialty', data);
};

const deleteSpecialty = (id) => {
  return axios.delete('/api/delete-specialty', {
      data: { id: id }
  });
};




export {
  handleLoginApi,
  getAllUsers,
  createNewUserService,
  deleteUserService,
  editUserService,
  getAllCodeService,
  getTopDoctorHomeService,
  getAllDoctors,
  saveDetailDoctorService,
  getDetailInforDoctor,
  saveBulkScheduleDoctor,
  getScheduleDoctorByDate,
  getExtraInforDoctorById,
  getProfileDoctorById,
  postPatientBookAppointment,
  postVerifyBookAppointment,
  createNewSpecialty,
  getAllSpecialty,
  getAllDetailSpecialtyById,
  createNewClinic,
  getAllClinic,
  getAllDetailClinicById,
  getAllPatientForDoctor,
  postSendRemedy,
  deleteClinic,
  updateClinic, updateSpecialty, deleteSpecialty
};
