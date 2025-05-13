import doctorService from "../services/doctorService";

let getTopDoctorHome = async (req, res) => {
  let limit = req.query.limit;
  if (!limit) limit = 10;
  try {
    let response = await doctorService.getTopDoctorHome(+limit);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: "Lỗi từ server",
    });
  }
};
//
let getAllDoctors = async (req, res) => {
  try {
    let doctors = await doctorService.getAllDoctors();
    return res.status(200).json(doctors);
  } catch (e) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Lỗi từ server",
    });
  }
};
//v67
let postInforDoctor = async (req, res) => {
  try {
    let response = await doctorService.saveDetailInforDoctor(req.body);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Lỗi từ server",
    });
  }
};
//
let getDetailDoctorById = async (req, res) => {
  try {
    let infor = await doctorService.getDetailDoctorById(req.query.id);
    return res.status(200).json(infor);
  } catch (e) {
    console.log("Lỗi: ", e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Lỗi từ server",
    });
  }
};
//
let bulkCreateSchedule = async (req, res) => {
  try{
    let infor = await doctorService.bulkCreateSchedule(req.body);
    return res.status(200).json(
      infor
    )
  } catch(e){
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error from the server'
    })
  }
}
//
let getScheduleByDate = async (req, res) => {
  try{
    let doctorId = req.query.doctorId;
    let date = req.query.date;
    let infor = await doctorService.getScheduleByDate(req.query.doctorId, req.query.date);
    return res.status(200).json(
      infor
    )
  } catch(e){
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error from the server - doctorController'
    })
  }
}
//
let getExtraInforDoctorById = async (req, res) => {
  try{
    let infor = await doctorService.getExtraInforDoctorById(req.query.doctorId);
    return res.status(200).json(infor)
  } catch(e){
    console.log(e);
    return res.status(200).json({
      errCode: -1,  
      errMessage: "Error from server"
    })
    
  }
}
//
let getProfileDoctorById = async (req, res) => {
  try {
    let infor = await doctorService.getProfileDoctorById(req.query.doctorId);
    return res.status(200).json(infor)
  } catch(e){
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error from the server'
      })
  }
}
//
let getListPatientForDoctor = async (req, res) => {
  console.log('📥 doctorId:', req.query.doctorId, '📆 date:', req.query.date);

  try {
    let infor = await doctorService.getListPatientForDoctor(req.query.doctorId, req.query.date);
    return res.status(200).json(infor)
  } catch(e){
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error from the server getListPatientForDoctor'
      })
  }
}
//
let sendRemedy = async (req, res) => {
  try {
    let infor = await doctorService.sendRemedy(req.body);
    return res.status(200).json(
      infor
    )
  } catch(e){
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error from the server doctorController'
      })
  }
}

module.exports = {
  getTopDoctorHome: getTopDoctorHome,
  getAllDoctors: getAllDoctors,
  postInforDoctor: postInforDoctor,
  getDetailDoctorById: getDetailDoctorById,
  bulkCreateSchedule: bulkCreateSchedule,
  getScheduleByDate: getScheduleByDate,
  getExtraInforDoctorById: getExtraInforDoctorById,
  getProfileDoctorById: getProfileDoctorById,
  getListPatientForDoctor: getListPatientForDoctor,
  sendRemedy: sendRemedy
};
