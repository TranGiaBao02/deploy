import db from "../models/index";
require("dotenv").config();
import _, { includes, reject } from "lodash";
import emailService from '../services/emailService'
import { raw } from "body-parser";
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHome = (limitInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        limit: limitInput,
        where: { roleId: "R2" },
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.Allcode,
            as: "positionData",
            attributes: ["valueEn", "valueVi"],
          },
          {
            model: db.Allcode,
            as: "genderData",
            attributes: ["valueEn", "valueVi"],
          },
        ],
        raw: true,
        nest: true,
      });
      resolve({
        errCode: 0,
        data: users,
      });
    } catch (e) {
      reject(e);
    }
  });
};
//
let getAllDoctors = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctors = await db.User.findAll({
        where: { roleId: "R2" },
        attributes: {
          exclude: ["password", "img"],
        },
      });
      resolve({
        errCode: 0,
        data: doctors,
      });
    } catch (e) {
      reject(e);
    }
  });
};
//
let saveDetailInforDoctor = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      let checkObj = checkRequiredFields(inputData);
      if(checkObj.isValid === false){
        resolve({
          errCode: 1,
          errMessage: checkObj.errMessage,
          });
      }
      if (
        !inputData.doctorId ||
        !inputData.contentHTML ||
        !inputData.contentMarkdown || !inputData.action ||
        !inputData.selectedPrice || !inputData.selectedPayment ||
        !inputData.selectedProvince ||
        !inputData.nameClinic || !inputData.addressClinic ||
        !inputData.note
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        // Upsert to Markdown
        if (inputData.action === "CREATE") {
          await db.Markdown.create({
            contentHTML: inputData.contentHTML,
            contentMarkdown: inputData.contentMarkdown,
            description: inputData.description,
            doctorId: inputData.doctorId,
          });
        } else if (inputData.action === "EDIT") {
          let doctorMarkdown = await db.Markdown.findOne({
            where: { doctorId: inputData.doctorId },
            raw: false,
          });
          if (doctorMarkdown) {
            doctorMarkdown.contentHTML = inputData.contentHTML;
            doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
            doctorMarkdown.description = inputData.description;
            doctorMarkdown.updateAt = new Date();
            await doctorMarkdown.save();
          }
        }


        // Upsert to Doctor_infor_table
        let doctorInfor = await db.Doctor_Infor.findOne({
          where: {
            doctorId: inputData.doctorId,
          },
          raw: false
        })
        if(doctorInfor){
          // Update
          doctorInfor.doctorId = inputData.doctorId;
          doctorInfor.priceId = inputData.selectedPrice;
          doctorInfor.provinceId = inputData.selectedProvince;
          doctorInfor.paymentId = inputData.selectedPayment;
          doctorInfor.nameClinic = inputData.nameClinic;
          doctorInfor.addressClinic = inputData.addressClinic;
          doctorInfor.note = inputData.note;
          doctorInfor.specialtyId = inputData.specialtyId;
          doctorInfor.clinicId = inputData.clinicId
          await doctorInfor.save()
        } else {
          await db.Doctor_Infor.create({
            doctorId: inputData.doctorId,
            priceId: inputData.selectedPrice,
            provinceId: inputData.selectedProvince,
            paymentId: inputData.selectedPayment,
            nameClinic: inputData.nameClinic,
            addressClinic: inputData.addressClinic,
            note: inputData.note,
            specialtyId: inputData.specialtyId,
            clinicId: inputData.clinicId
          }) 
        }

        resolve({
          errCode: 0,
          errMessage: "Save detail infor doctor success",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
//
let getDetailDoctorById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        let data = await db.User.findOne({
          where: {
            id: inputId,
          },
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.Markdown,
              attributes: ["description", "contentHTML", "contentMarkdown"],
            },
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Doctor_Infor,
              attributes: {
                exclude: ['id', 'doctorId']
              },
              include: [
                {model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi']},
                {model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi']},
                {model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi']},
              ]
            }
          ],
          raw: false,
          nest: true,
        });

        if (data && data.img) {
          data.img = new Buffer(data.img, "base64").toString("binary");
        }

        if (!data) data = {};

        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
// 74
let bulkCreateSchedule = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data || !data.arrSchedule || !data.doctorId || !data.formatedDate) {
        return resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      }
      
      if (!Array.isArray(data.arrSchedule)) {
        return resolve({
          errCode: 2,
          errMessage: "arrSchedule phải là một mảng",
        });
      }
      
      let schedule = data.arrSchedule.map((item) => ({
        ...item,
        maxNumber: MAX_NUMBER_SCHEDULE,
        date: new Date(item.date).toISOString().split('T')[0] // Chuyển thành YYYY-MM-DD
      }));
      
      console.log("Dữ liệu chuẩn bị lưu vào DB:", schedule);
      
      // Lấy danh sách lịch đã tồn tại trong DB
      let existing = await db.Schedule.findAll({
        where: { doctorId: data.doctorId, date: data.formatedDate },
        attributes: ["timeType", "date", "doctorId", "maxNumber"],
        raw: true,
      });
      
      if (existing.length > 0) {
        existing = existing.map((item) => ({
          ...item,
          date: new Date(item.date).toISOString().split('T')[0] // Đồng bộ định dạng YYYY-MM-DD
        }));
      }
      
      console.log("Dữ liệu đã có trong DB:", existing);
      
      // Lọc ra các lịch mới chưa có trong DB
      let toCreate = schedule.filter((item) => {
        return !existing.find(
          (ex) =>
            ex.timeType === item.timeType &&
            ex.date === item.date &&
            ex.doctorId === data.doctorId
        );
      });
      
      if (toCreate.length > 0) {
        try {
          await db.Schedule.bulkCreate(toCreate);
          return resolve({
            errCode: 0,
            errMessage: `Lưu thành công ${toCreate.length} lịch khám`,
          });
        } catch (error) {
          console.error("Lỗi khi lưu lịch khám:", error);
          return resolve({
            errCode: 3,
            errMessage: "Lỗi tạo lịch khám",
          });
        }
      }
      
      return resolve({
        errCode: 4,
        errMessage: "Tất cả lịch đã tồn tại, không có lịch mới được lưu",
      });
    } catch (e) {
      console.error("Lỗi hệ thống:", e);
      reject(e);
    }
  });
};
//
let getScheduleByDate = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: "Vui lòng nhập đủ thông tin",
        });
      } else {
        let dataSchedule = await db.Schedule.findAll({
          where: {
            doctorId: doctorId,
            date: date,
          },
          include: [
            {model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi']},
            {model: db.User, as:'doctorData', attributes: ['firstName', 'lastName']},
          ],
          raw: false,
          nest: true
        });
        if (!dataSchedule) dataSchedule = [];

        resolve({
          errCode: 0,
          data: dataSchedule,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
//
let getExtraInforDoctorById = async (idInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!idInput) {
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameters'
        })
      } else {
        let data = await db.Doctor_Infor.findOne({
          where: {
            doctorId: idInput
            },
          attributes: {
            exclude: ['id', 'doctorId']
          },
          include: [
            {model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi']},
            {model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi']},
            {model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi']},
          ],
          raw: false,
          nest: true
        })
        if(!data) data = {};
        resolve({
          errCode: 0,
          data: data
        })
      }

    } catch(e) {
      reject(e);
    }
  })
}
//
let getProfileDoctorById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if(!inputId) {
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameters'
          })
      } else {
        let data = await db.User.findOne({
          where: {
            id: inputId
          },
          attributes: {
            exclude: ['password']
          },
          include: [
            {
              model: db.Markdown,
              attributes: ['description', 'contentHTML', 'contentMarkdown']
            },
            { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi']},
            {
              model: db.Doctor_Infor,
              attributes: {
                exclude: ['id', 'doctorId']
              },
              include: [
                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi']},
                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi']},
                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi']},
              ]
            },
          ],
          raw: false,
          nest: true
        })
        if(data && data.img) {
          data.img = new Buffer(data.img, 'base64').toString('binary');
        }
        if(!data) data = {};

        resolve({
          errCode: 0,
          data: data
        })
      }
    } catch (e){
      reject(e)
    }
  })
}
//
let checkRequiredFields = (inputData) => {
  let arrFields = ['doctorId', 'contentHTML', 'contentMarkdown', 'action', 'selectedPrice', 'selectedPayment', 'selectedProvince', 'nameClinic', 'addressClinic', 'note', 'specialtyId']
  let isValid = true;
  let element = '';
  for(let i = 0; i < arrFields.length; i++){
    if(!inputData[arrFields[i]]) {
      isValid = false;
      element = arrFields[i];
      break;
      }
  }
  return{
    isValid: isValid,
    element: element
  }
}
//
let getListPatientForDoctor = (doctorId, date) => {
  console.log('📥 Params:', doctorId, date);

  return new Promise(async (resolve, reject) => {
    try {
      if(!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameters'
          })
      } else {
        let data = await db.Booking.findAll({
          
          where: {
            statusId: 'S2',
            doctorId: doctorId,
            date: date
          },
          include: [
            {
              model: db.User, as: 'patientData',
              attributes: ['email', 'firstName', 'address', 'gender'],
              include: [
                {
                  model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi']
                }
              ]
            },
            {
              model: db.Allcode, as: 'timeTypeDataPatient', attributes: ['valueEn', 'valueVi']
            }
          ],
          
          raw: false,
          nest: true
        })
        console.log('Check data - doctorService: ', data);

        resolve({
          errCode: 0,
          data: data
        })
      }
    } catch(e) {
      reject(e)
    }
  })
}
//
let sendRemedy = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if(!data.email || !data.doctorId || !data.patientId) {
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameters'
        })
      } else {
        let appointment = await db.Booking.findOne({
          where: {
            // Update patient status
            doctorId: data.doctorId,
            patientId: data.patientId,
            timeType: data.timeType,
            statusId: 'S2'
          },
          raw: false
        })
        if(appointment) {
          appointment.statusId = 'S3';
          await appointment.save()
        }
        await emailService.sendAttachment(data);

        resolve({
          errCode: 0,
          errMessage: "OK"
        })
      }
    } catch(e){
      reject(e)
    }
  })
}
module.exports = {
  getTopDoctorHome: getTopDoctorHome,
  getAllDoctors: getAllDoctors,
  saveDetailInforDoctor: saveDetailInforDoctor,
  getDetailDoctorById: getDetailDoctorById,
  bulkCreateSchedule: bulkCreateSchedule,
  getScheduleByDate: getScheduleByDate,
  getExtraInforDoctorById: getExtraInforDoctorById,
  getProfileDoctorById: getProfileDoctorById,
  getListPatientForDoctor: getListPatientForDoctor,
  sendRemedy: sendRemedy
};
