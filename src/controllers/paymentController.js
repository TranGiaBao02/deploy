import https from "https";
import crypto from "crypto";
import db from "../models/index";
import moment from "moment";
const CryptoJS = require('crypto-js');
const axios = require('axios');

const config = {
  app_id: "2553",
  key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
  key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create"
};

// Các thông tin xác thực từ MoMo
const accessKey = process.env.MOMO_ACCESS_KEY;
const secretKey = process.env.MOMO_SECRET_KEY;
const partnerCode = "MOMO";
const redirectUrl = "http://localhost:3000/home";
const ipnUrl = process.env.MOMO_IPNURL;
const requestType = "payWithMethod";
const lang = "vi";
const extraData = "";
function createSignature(orderInfo, amount, orderId, requestId, extraData) {
  const rawSignature =
    "accessKey=" +
    accessKey +
    "&amount=" +
    amount +
    "&extraData=" +
    extraData +
    "&ipnUrl=" +
    ipnUrl +
    "&orderId=" +
    orderId +
    "&orderInfo=" +
    orderInfo +
    "&partnerCode=" +
    partnerCode +
    "&redirectUrl=" +
    redirectUrl +
    "&requestId=" +
    requestId +
    "&requestType=" +
    requestType;

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");

  return signature;
}

 const initiatePayment = async (req, res) => {
  const { orderInfo, amount, token } = req.body;
  const orderId = partnerCode + new Date().getTime();
  const requestId = orderId;
  const extraData = Buffer.from(JSON.stringify({ token })).toString("base64"); // mã hóa token
  
  const signature = createSignature(
    orderInfo,
    amount,
    orderId,
    requestId,
    extraData
  );

  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    partnerName: "Test",
    storeId: "MomoTestStore",
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    lang: lang,
    requestType: requestType,
    autoCapture: "",
    extraData: extraData,
    orderGroupId: "",
    signature: signature,
  });

  const options = {
    hostname: "test-payment.momo.vn",
    port: 443,
    path: "/v2/gateway/api/create",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(requestBody),
    },
    data: requestBody,
  };

  //
  const momoRequest = https.request(options, (response) => {
    console.log(`Status - paymentController: ${response.statusCode}`);
    response.setEncoding("utf8");
    response.on("data", (body) => {
      const result = JSON.parse(body);
      console.log("MoMo response:", result);

      if (result.resultCode === 0) {
        res.redirect(result.payUrl);
      } else {
        res.redirect("/error");
      }
    });
  });

  momoRequest.on("error", (e) => {
    console.error(`Problem with request: ${e.message}`);
    res.redirect("/error");
  });

  momoRequest.write(requestBody);
  momoRequest.end();
};
//

const handleMoMoCallback = async (req, res) => {
  const {
    partnerCode,
    orderId,
    requestId,
    amount,
    orderInfo,
    orderType,
    transId,
    resultCode,
    message,
    payType,
    responseTime,
    extraData,
    signature,
  } = req.body;
  let parsedExtraData = {};
  if (extraData) {
    try {
      parsedExtraData = JSON.parse(
        Buffer.from(extraData, "base64").toString("utf8")
      );
      const token = parsedExtraData.token;

    } catch (e) {
      console.error("Lỗi giải mã extraData:", e);
    }
  }
  console.log(
    "Dữ liệu callback MoMo gửi về:",
    JSON.stringify(req.body, null, 2)
  );

  // Tạo lại signature từ các trường giống y chang MoMo gửi về
  const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;

  const generatedSignature = crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");
    
  if (signature === generatedSignature) {
    if (resultCode === 0) {
      console.log("Thanh toán thành công");
      try {
        parsedExtraData = JSON.parse(
          Buffer.from(extraData, "base64").toString("utf8")
        );
        const token = parsedExtraData.token;
        const appointment = await db.Booking.findOne({ where: { token } });
        if (appointment) {
          appointment.paymentStatus = "PS2";
          await appointment.save(); 
          console.log(
            `Cập nhật paymentStatus thành PS2 cho booking với token ${token}`
          );
        } else {
          console.log(`Không tìm thấy booking với token ${token}`);
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật paymentStatus:", error);
        return res
          .status(500)
          .json({ message: "Lỗi khi cập nhật paymentStatus vào Booking" });
      }
      res.status(200).json({ message: "Thanh toán thành công" });
    } else {
      console.log("Thanh toán thất bại:", resultCode, message);
      res.status(200).json({ message: "Thanh toán thất bại" });
    }
  } else {
    console.log("Chữ ký không hợp lệ");
    res.status(400).json({ message: "Lỗi chữ ký" });
  }
};

//--
 const getDoctorPriceInfo = async (req, res) => {
  try {
    const { doctorId } = req.query;

    if (!doctorId) {
      return res
        .status(400)
        .json({ errCode: 1, errMessage: "Missing doctorId" });
    }

    let doctorInfo = await db.Doctor_Infor.findOne({
      where: { doctorId },
      include: [
        {
          model: db.Allcode,
          as: "priceTypeData",
          attributes: ["valueVi", "valueEn"],
        },
      ],
      attributes: ["priceId"],
      raw: true,
      nest: true,
    });

    if (!doctorInfo) {
      return res
        .status(404)
        .json({ errCode: 2, errMessage: "Doctor not found" });
    }

    return res.status(200).json({
      errCode: 0,
      valueVi: doctorInfo.priceTypeData.valueVi,
      valueEn: doctorInfo.priceTypeData.valueEn,
    });
  } catch (e) {
    console.error("getDoctorPriceInfo error:", e);
    return res.status(500).json({ errCode: -1, errMessage: "Server error" });
  }
};
//
const createZaloPayOrder = async (req, res) => {
  try {
    const amount = req.body.amount;
    const token = req.body.token;
    const transID = Math.floor(Math.random() * 1000000);

    const embed_data = { token,
      redirecturl: "http://localhost:3000/home",

     }; // Đưa token vào embed_data
    const items = [{}];

    const order = {
      app_id: config.app_id,
      app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
      app_user: "user123",
      app_time: Date.now(),
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount,
      description: `Thanh toán hóa đơn đặt lịch khám`,
      bank_code: "",
      callback_url: "https://3dad-2405-4802-8030-75f0-d503-3557-6164-1485.ngrok-free.app/api/payment/zalopay-callback"
    };

    const data = [
      config.app_id,
      order.app_trans_id,
      order.app_user,
      order.amount,
      order.app_time,
      order.embed_data,
      order.item
    ].join("|");

    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    const response = await axios.post(config.endpoint, null, { params: order });
    res.redirect(response.data.order_url);

  } catch (error) {
    console.error("Lỗi tạo đơn ZaloPay:", error.response?.data || error.message);
    res.status(500).json({ message: "Lỗi tạo đơn hàng ZaloPay", error: error.response?.data || error.message });
  }
};

const handleZaloPayCallback = async (req, res) => {
  console.log("ZaloPay callback đã được gọi");
  console.log("Dữ liệu callback:", req.body);

  try {
    const { data, mac } = req.body;

    const generatedMac = CryptoJS.HmacSHA256(data, config.key2).toString();
    if (mac !== generatedMac) {
      return res.status(400).json({ return_code: -1, return_message: "Invalid MAC" });
    }

    const callbackData = JSON.parse(data);
    const embed_data = JSON.parse(callbackData.embed_data); // Lấy lại embed_data
    const token = embed_data.token;

    const booking = await db.Booking.findOne({ where: { token } });

    if (!booking) {
      return res.status(404).json({ return_code: -1, return_message: "Booking not found" });
    }

    // Cập nhật trạng thái thanh toán
    await booking.update({ paymentStatus: 'PS2' });

    return res.json({ return_code: 1, return_message: "Thanh toán thành công" });
  } catch (error) {
    console.error("Lỗi callback ZaloPay:", error);
    return res.status(500).json({ return_code: -1, return_message: "Lỗi xử lý callback" });
  }
};

module.exports = {
  initiatePayment,
  getDoctorPriceInfo,
  handleMoMoCallback,
  createZaloPayOrder,
  handleZaloPayCallback
};
