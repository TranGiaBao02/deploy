const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('kltn', 'root', null, {
  host: 'localhost',
  dialect:'mysql',
  logging: false
});

let connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Kết nối database thành công.');
      } catch (error) {
        console.error('Kết nối database không thành công:', error);
      }
}

module.exports = connectDB;