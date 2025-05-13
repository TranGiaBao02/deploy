import patientService from '../services/patientService';

let postBookAppointment = async (req, res) => {
    console.log("DATA SEND CHECK - patientController:", req.body);
    try {
        console.log("👉 Verify input:", req.body);
        let infor = await patientService.postBookAppointment(req.body);
        return res.status(200).json(
            infor
        )
    } catch(e){
        console.log("❌ Error in verify-book-appointment:", e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
        
    }
}
//
let postVerifyBookAppointment = async (req, res) => {
    try {
        let infor = await patientService.postVerifyBookAppointment(req.body);        
        return res.status(200).json(infor)
    } catch(e){
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
        
    }
}

module.exports = {
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment,
}