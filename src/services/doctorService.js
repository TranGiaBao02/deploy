import axios from '../axios';

 const getDoctorPriceInfo = async (doctorId, token) => {
    console.log('Check token: ', token);
    
  try {
    return axios.get(`http://localhost:8080 /verify-booking?token=${token}&doctorId=${doctorId}`);
  } catch (error) {
    console.error('Failed to fetch price info:', error);
    return null;
  }
};
export {
    getDoctorPriceInfo
}