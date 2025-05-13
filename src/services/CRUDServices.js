import bcrypt from 'bcrypt';
import db from '../models/index';

const salt = bcrypt.genSaltSync(10);

// tạo mới user
let createNewUser = async (data) => {
    
    return new Promise(async(resolve, reject) => {
        try {
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
                //avatar: data.avatar
            })

            resolve('Tạo user mới thành công!')
        } catch (e) {
            reject (e);
        }
    })
}
// mã hóa password
let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try{
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    })
}
// lấy info toàn bộ user
let getAllUser = () => {
    return new Promise(async(resolve, reject) => {
        try {
            let users = db.User.findAll({
                raw: true
            });
            resolve(users);
        } catch(e){
            reject(e);
        }
    })
}
// tìm user qua id
let getUserInfoById = async (userId) => {
    return new Promise(async(resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
                raw: true,
            });
    
            if (user) {
                resolve(user); 
            } else {
                resolve({ message: 'Người dùng không tồn tại!' });
            }
        } catch (error) {
           reject(error);
        }
})}
// cập nhật info user
let updateUserData = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            if (!data) {
                return reject(new Error("ID người dùng không hợp lệ."));
            }

            let user = await db.User.findOne({
                where: { id: data.id }
            });
            if(user){
                user.firstName = data.firstName; // info cần cập nhật
                user.lastName = data.lastName;
                user.address = data.address;

                await user.save();

                let allUser = await db.User.findAll();
                resolve(allUser);
            } else {
                resolve({ message: "Không tìm thấy người dùng với ID này." });            }

        } catch(e){
            console.log(e);
        }
    })
}
//
let deleteUserById = (userId) => {
    return new Promise(async(resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {id: userId}
            })
            if(user){
                await user.destroy();
            }

            resolve();
        } catch(e){
            reject(e);
        }
    })
}
module.exports = {
    createNewUser: createNewUser,
    getAllUser: getAllUser,
    getUserInfoById: getUserInfoById,
    updateUserData: updateUserData,
    deleteUserById: deleteUserById,
}