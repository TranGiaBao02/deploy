const db = require("../models");

let createClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!data.name || !data.address || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown){
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                await db.Clinic.create({
                    name: data.name,
                    address: data.address,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown
                })
                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
            }
        } catch(e) {
            reject(e);
        }
    })
}
//
let getAllClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findAll({

            });
            if(data && data.length > 0) {
                data.map(item => {                    
                    item.image = new Buffer(item.image, 'base64').toString('binary')
                    return item
                })
            }
            resolve({
                errCode: 0,
                errMessage: 'OK',
                data
            })
        } catch (e) {
            reject(e);
        }
    })
}
//
let getDetailClinicById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            }
            else {
                let data = await db.Clinic.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: ['name', 'address', 'descriptionHTML', 'descriptionMarkdown']
                })
                if(data) {
                    let doctorClinic = [];
                    doctorClinic = await db.Doctor_Infor.findAll({
                        where: { clinicId: inputId },
                        attributes: ['doctorId', 'provinceId'],
                    })
                    data.dataValues.doctorClinic = doctorClinic;
                } else data = {}
                resolve({
                    errCode: 0,
                    errMessage: 'OK',
                    data: data.dataValues
                })
            }
        } catch(e){
            reject(e);
        }
    })
}
//
let deleteClinic = (clinicId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!clinicId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                });
            } else {
                await db.Clinic.destroy({
                    where: { id: clinicId }
                });
                resolve({
                    errCode: 0,
                    errMessage: 'Delete clinic succeeded'
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};
//
let updateClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing clinic ID',
                });
            }
            let clinic = await db.Clinic.findOne({
                where: { id: data.id },
                raw: false
            });
            if (clinic) {
                clinic.name = data.name;
                clinic.address = data.address;
                clinic.descriptionHTML = data.descriptionHTML;
                clinic.descriptionMarkdown = data.descriptionMarkdown;
                if (data.imageBase64) {
                    clinic.image = data.imageBase64;
                }
                await clinic.save();
                resolve({
                    errCode: 0,
                    errMessage: 'Update succeeded'
                });
            } else {
                resolve({
                    errCode: 2,
                    errMessage: 'Clinic not found'
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    createClinic: createClinic,
    getAllClinic: getAllClinic,
    getDetailClinicById: getDetailClinicById,
    deleteClinic: deleteClinic,
    updateClinic: updateClinic
}