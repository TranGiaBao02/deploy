const db = require("../models");

let createSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!data.name || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                await db.Specialty.create({
                    name: data.name,
                    img: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown,
                })
            resolve({
                errCode: 0,
                errMessage: 'OK'
            })
            }
        } catch(e){
            reject(e);
        }
    })
}
//
let getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll();
            if(data && data.length > 0){
                data.map(item => {                    
                    item.img = new Buffer(item.img, 'base64').toString('binary');
                    return item;
                })
            }
            resolve({
                errMessage: 'OK',
                errCode: 0,
                data
            })
        } catch(e){
            reject(e);
        }
    })
}
//
let getDetailSpecialtyById = (inputId, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!inputId || !location){
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let data = await db.Specialty.findOne({
                    where: {
                        id: inputId,
                    },
                    attributes: ['descriptionHTML', 'descriptionMarkdown'],
                })                
                if(data) {
                   let doctorSpecialty = [];
                   if(location === 'ALL'){
                    doctorSpecialty = await db.Doctor_Infor.findAll({
                        where: {specialtyId: inputId},
                        attributes: ['doctorId', 'provinceId'],
                    })
                   } else {
                    doctorSpecialty = await db.Doctor_Infor.findAll({
                        where: {
                            specialtyId: inputId,
                            provinceId: location
                        },
                        attributes: ['doctorId', 'provinceId'],
                    })
                   }
                   if (doctorSpecialty.length > 0) {
                    data.dataValues.doctorSpecialty = doctorSpecialty;
                   }
                } else data = {}
                resolve({
                    errCode: 0,
                    errMessage: 'OK',
                    data: data.dataValues
                })
            }
        } catch(e) {
            reject(e);
        }
    })
}
//
let handleDeleteSpecialty = (specialtyId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!specialtyId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                });
            } else {
                await db.Specialty.destroy({
                    where: { id: specialtyId }
                });
                resolve({
                    errCode: 0,
                    errMessage: 'Delete specialty succeeded'
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};
//
let handleUpdateSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing specialty ID',
                });
            }
            let specialty = await db.Specialty.findOne({
                where: { id: data.id },
                raw: false
            });            
            if (specialty) {
                specialty.name = data.name;
                specialty.descriptionHTML = data.descriptionHTML;
                specialty.descriptionMarkdown = data.descriptionMarkdown;
                if (data.imageBase64) {
                    specialty.img = data.imageBase64;
                }
                await specialty.save();
                resolve({
                    errCode: 0,
                    errMessage: 'Update succeeded'
                });
            } else {
                resolve({
                    errCode: 2,
                    errMessage: 'Specialty not found'
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};
module.exports = {
    createSpecialty: createSpecialty,
    getAllSpecialty: getAllSpecialty,
    getDetailSpecialtyById: getDetailSpecialtyById,
    handleDeleteSpecialty: handleDeleteSpecialty,
    handleUpdateSpecialty: handleUpdateSpecialty
}