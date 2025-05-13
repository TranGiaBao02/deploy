require("dotenv").config();
import { reject } from "lodash";
import nodemailer from "nodemailer";
import { resolveContent } from "nodemailer/lib/shared";

let sendSimpleEmail = async (dataSend) => {
  console.log("DATA SEND CHECK - emailService.js:", dataSend);
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
  let info = await transporter.sendMail({
    from: '"Carevo 👻" <trangiabao270802@gmail.com>',
    to: dataSend.reciverEmail,
    subject: "Thông tin đặt lịch khám bệnh",
    html: getBodyHTMLEmail(dataSend),
  });
};
//
let getBodyHTMLEmailRemedy = (dataSend) => {
  let result = ''
  if(dataSend.language === 'vi'){
    result = 
    `
    <h3>Xin chào ${dataSend.patientName}!</h3>
    <p>Bạn nhận được email này vì đã đặt lịch khám online trên Carevo</p>
    <p>Thông tin đơn thuốc/hóa đơn được gửi trong file đính kèm.</p>

    <div>Xin chân thành cảm ơn!</div>
    `
  }
  if(dataSend.language === 'en'){
    result = 
    `
    <h3>Hello ${dataSend.patientName}!</h3>
    <p>You are receiving this email because you have booked an online consultation on Carevo.</p>
    <p>The prescription/invoice information is attached in the file.</p>

    <div>Thank you sincerely!</div>
    `
  }
  return result;
}
//
let sendAttachment = async (dataSend) => {
  return new Promise(async (resolve, reject) => {
    try {
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_APP,
          pass: process.env.EMAIL_APP_PASSWORD,
        },
      });

      let info = await transporter.sendMail({
        from: '"Carevo" <Carevo@gmail.com>',
        to: dataSend.email,
        subject: "Kết quả đặt lịch khám bệnh",
        html: getBodyHTMLEmailRemedy(dataSend),
        attachments: [
          {
            filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
            content: dataSend.imgBase64.split("base64,")[1],
            encoding: 'base64'
          }
        ],
      });

      resolve(true);
    } catch (e) {
      reject(e);
    }
  });
}


//
let getBodyHTMLEmail = (dataSend) => {
  let result = "";
  if (dataSend.language === "vi") {
    result = `
    <h3>Xin chào ${dataSend.patientName}!</h3>
    <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên Carevo</p>
    <p>Thông tin đặt lịch khám bệnh:</p>
    <div><b>Thời gian: ${dataSend.time}</b></div>
    <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>

    <p>Nếu các thông tin trên là đúng sự thật, vui lòng click vào đường link bên dưới
    để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh</p>
    <div>
      <a href=${dataSend.redirectLink} target="_blank">Click here</a>
    </div>
    <div>Xin chân thành cảm ơn!</div>
    `;
  }
  if (dataSend.language === "en") {
    result = `
      <h3>Hello ${dataSend.patientName}!</h3>
      <p>You are receiving this email because you booked a medical appointment online on Carevo.</p>
      <p>Appointment Information:</p>
      <div><b>Time: ${dataSend.time}</b></div>
      <div><b>Doctor: ${dataSend.doctorName}</b></div>
  
      <p>If the above information is correct, please click the link below to confirm and complete your appointment booking.</p>
      <div>
        <a href=${dataSend.redirectLink} target="_blank">Click here</a>
      </div>
      <div>Thank you very much!</div>
    `;
  }
  return result;
};
async function main() {}

module.exports = {
  sendSimpleEmail: sendSimpleEmail,
  sendAttachment: sendAttachment
};
