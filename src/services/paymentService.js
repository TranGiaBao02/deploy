import db from "../models/index";

let handleMomoPaymentSuccess = async (bookingId) => {
  try {
    let booking = await db.Booking.findOne({
      where: { id: bookingId },
      include: [
        {
          model: db.DoctorInfor, 
          as: 'doctor_infor', 
          attributes: ['priceId'] 
        }
      ]
    });

    if (!booking) {
      return {
        errCode: 1,
        errMessage: 'Không tìm thấy booking'
      };
    }

    const priceId = booking.doctor_infor.priceId;

    let priceInfo = await db.AllCode.findOne({
      where: { keyMap: priceId },
      attributes: ['valueVi', 'valueEn'] 
    });

    if (!priceInfo) {
      return {
        errCode: 2,
        errMessage: 'Không tìm thấy thông tin giá'
      };
    }

    booking.paymentStatus = 'PS2'; 
    await booking.save();

    return {
      errCode: 0,
      errMessage: 'Cập nhật trạng thái thanh toán thành công',
      priceVi: priceInfo.valueVi,
      priceEn: priceInfo.valueEn
    };
  } catch (e) {
    console.error('Lỗi cập nhật paymentStatus:', e);
    return {
      errCode: -1,
      errMessage: 'Lỗi server'
    };
  }
};

export default {
  handleMomoPaymentSuccess,
};
