import { where } from "sequelize";
import db from "../models/index";
import bcrypt from "bcrypt";

const salt = bcrypt.genSaltSync(10);

let handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      let isExist = await checkUserEmail(email);
      if (isExist) {
        // user already exist
        let user = await db.User.findOne({
          attributes: ["id","email", "roleId", "password", "firstName", "lastName", "img", "gender"],
          where: { email: email },
          raw: true,
        });
        if (user) {
          // compare password
          let check = bcrypt.compareSync(password, user.password); //false
          if (check) {
            userData.errCode = 0;
            userData.errMessage = "Đăng nhập thành công!";
            delete user.password;
            userData.user = user;
          } else {
            userData.errCode = 3;
            userData.errMessage = "Sai mật khẩu";
          }
        } else {
          userData.errCode = 2;
          userData.errMessage = "Người dùng không tồn tại";
        }
        resolve(userData);
      } else {
        userData.errCode = 1;
        userData.errMessage = "Tài khoản email của bạn không tồn tại!";
        resolve(userData);
      }
    } catch (e) {
      reject(e);
    }
  });
};
//

let checkUserEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: userEmail },
      });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
};
//
let getAllUsers = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = "";
      if (userId === "ALL") {
        users = await db.User.findAll({
          attributes: {
            exclude: ["password"],
          },
        });
      }
      if (userId && userId !== "ALL") {
        users = await db.User.findOne({
          where: { id: userId },
          attributes: {
            exclude: ["password"],
          },
        });
      }
      resolve(users);
    } catch (e) {
      reject(e);
    }
  });
};

//
let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};
// api tạo mới user
  let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        let check = await checkUserEmail(data.email);
        if (check === true) {
          return resolve({
            errCode: 1,
            errMessage:
              "Địa chỉ email của bạn đã được dùng. Vui lòng dùng email khác!",
          });
        } else {
          let hashPasswordFromBcrypt = await hashUserPassword(data.password);
          await db.User.create({
            email: data.email,
            password: hashPasswordFromBcrypt,
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address,
            phoneNumber: data.phoneNumber,
            gender: data.gender,
            roleId: data.roleId,
            positionId: data.positionId,
            img: data.img   
          });
          
          resolve({
            errCode: 0,
            message: "Tạo người dùng thành công",
          });
        }
      } catch (e) {
        reject(e);
      }
    });
  };

//
let deleteUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    let foundUser = await db.User.findOne({
      where: { id: userId },
    });
    if (!foundUser) {
      resolve({
        errCode: 2,
        errMessage: "Người dùng không tồn tại!",
      });
    }
    await db.User.destroy({
      where: { id: userId },
    });

    resolve({
      errCode: 0,
      message: "Người dùng đã bị xóa!",
    });
  });
};
//
let updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id || !data.roleId || !data.positionId || !data.gender) {
        resolve({
          errCode: 2,
          errMessage: "Nhập thiếu tham số - BE",
        });
      }
      let user = await db.User.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (user) {        
        user.email = data.email;
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;
        user.roleId = data.roleId;
        user.positionId = data.positionId;
        user.gender = data.gender;
        user.phoneNumber = data.phoneNumber;
        if(data.img){
          user.img = data.img;
        }
        await user.save();
        resolve({
          errCode: 0,
          errMessage: "Cập nhật người dùng thành công!",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "Người dùng không tồn tại!",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
//
let getAllCodeService = (typeInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!typeInput) {
        resolve({
          errCode: 1,
          errMessage: "Thiếu tham số!",
        });
      } else {
        let res = {};
        let allCode = await db.Allcode.findAll({
          where: { type: typeInput },
        });
        res.errCode = 0;
        res.data = allCode;
        resolve(res);
      }
    } catch (e) {
      reject(e);
    }
  });
};
//
let updateUserInfo = async (id, data) => {
  try {
    let user = await db.User.findOne({ where: { id } });

    if (!user) {
      return {
        errCode: 1,
        errMessage: 'Người dùng không tồn tại',
      };
    }

    user.phoneNumber = data.phoneNumber || user.phoneNumber;
    user.address = data.address || user.address;
    await user.save();

    return {
      errCode: 0,
      message: 'Cập nhật thành công',
    };
  } catch (error) {
    console.error(error);
    return {
      errCode: -1,
      errMessage: 'Lỗi server',
    };
  }
};
module.exports = {
  handleUserLogin: handleUserLogin,
  checkUserEmail: checkUserEmail,
  getAllUsers: getAllUsers,
  createNewUser: createNewUser,
  deleteUser: deleteUser,
  updateUserData: updateUserData,
  getAllCodeService: getAllCodeService,
  updateUserInfo: updateUserInfo
};
