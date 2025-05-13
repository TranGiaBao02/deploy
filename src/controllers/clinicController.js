import clinicService from '../services/clinicService';

let createClinic = async (req, res) => {
    try {
        let infor = await clinicService.createClinic(req.body);
        return res.status(200).json(infor)
    } catch(e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}
//
let getAllClinic = async (req, res) => {
    try {
        let infor = await clinicService.getAllClinic();
        return res.status(200).json(infor)
    } catch(e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
        
    }
}
//
let getDetailClinicById = async (req, res) => {
    try {
        let infor = await clinicService.getDetailClinicById(req.query.id);
        return res.status(200).json(infor)
    } catch(e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
        
    }
}
//
let handleDeleteClinic = async (req, res) => {
    try {
        let data = await clinicService.deleteClinic(req.body.id);
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server',
        });
    }
};
//
let handleUpdateClinic = async (req, res) => {
    try {
        let data = await clinicService.updateClinic(req.body);
        return res.status(200).json(data);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        });
    }
};

module.exports = {
    createClinic: createClinic,
    getAllClinic: getAllClinic,
    getDetailClinicById: getDetailClinicById,
    handleDeleteClinic: handleDeleteClinic,
    handleUpdateClinic: handleUpdateClinic
}