import db from "../models/index";
require("dotenv").config();
import _, { first, reject } from "lodash";
import emailService from "./emailService";
import { v4 as uuidv4 } from 'uuid'

let buildUrEmail = (doctorId, token) => {
  let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`
  return result
}

let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
      const { email, doctorId, fullName, address, selectedGender , date, timeType, paymentMethod } = data;      
      try {
        if(!email || !doctorId || !timeType || !date || !fullName || !selectedGender || !address || !paymentMethod ) {
            resolve({
                errCode: 1,
                errMessage: 'Missing paremeter'
            })
      } else {

        let token = uuidv4();
        await emailService.sendSimpleEmail({
          reciverEmail: data.email,
          patientName: data.fullName,
          time: data.timeString,
          doctorName: data.doctorName,
          language: data.language,
          redirectLink: buildUrEmail(data.doctorId, token),
        })
        // Upsert patient
        let user = await db.User.findOrCreate({
            where: {
                email: data.email
            },
            
            defaults: {
                email: data.email,
                roleId: 'R3',
                gender: data.selectedGender,
                address: data.address,
                firstName: data.fullName
            },
        });

        // Create a booking record
        if(user && user[0]){
            await db.Booking.findOrCreate({
                where: { patientId: user[0].id},
                defaults: {
                    statusId: 'S1',
                    doctorId: data.doctorId,
                    patientId: user[0].id,
                    date: data.date,
                    timeType: data.timeType,
                    token: token,
                    paymentMethod: data.paymentMethod,
                    paymentStatus: 'PS1'
                }
            })
        }
        resolve({
            errCode: 0,
            errMessage: 'Save infor patient success!'
        })
      }
    } catch (e){
        reject(e);
    }
  })
}

// let postBookAppointment = async (data) => {
//   try {
//       const { doctorId, patientId, date, timeType, token, paymentMethod, paymentStatus } = data;

//       // Kiểm tra dữ liệu đầu vào
//       if (!doctorId || !patientId || !date || !timeType || !token || !paymentMethod || !paymentStatus) {
//           return {
//               errCode: 1,
//               errMessage: 'Missing required fields (doctorId, patientId, date, timeType, token, paymentMethod, paymentStatus)'
//           };
//       }

//       // Tạo một bản ghi lịch khám mới với thông tin phương thức thanh toán và trạng thái thanh toán
//       const newBooking = await Booking.create({
//           doctorId,
//           patientId,
//           date,
//           timeType,
//           token,
//           paymentMethod,     // Phương thức thanh toán
//           paymentStatus      // Trạng thái thanh toán
//       });

//       return {
//           errCode: 0,
//           errMessage: 'Booking created successfully',
//           data: newBooking
//       };
//   } catch (e) {
//       console.log("❌ Error in creating booking:", e);
//       return {
//           errCode: -1,
//           errMessage: 'Error creating booking in service'
//       };
//   }
// };

//
let postVerifyBookAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if(!data.token || !data.doctorId){
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameters'
          })
      } else {
        let appointment = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            token: data.token,
            statusId: 'S1'
          },
          raw: false
        })
        
        if(appointment) {
          appointment.statusId = 'S2';
          await appointment.save();

          resolve({
            errCode: 0,
            errMessage: 'Update status booking success!'
          })
        } else {
          resolve({
            errCode: 2,
            errMessage: 'Appointment has been activated or does not exist'
          })
        }
      }
    } catch(e){
      reject(e)
    }
  })
}

  module.exports = {
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment,
  };
  