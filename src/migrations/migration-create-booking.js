'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Tạo bảng 'bookings' với các cột ban đầu
    await queryInterface.createTable('bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      statusId: {
        type: Sequelize.STRING
      },
      doctorId: {
        type: Sequelize.INTEGER
      },
      patientId: {
        type: Sequelize.STRING
      },
      date: {
        type: Sequelize.STRING
      },
      timeType: {
        type: Sequelize.BOOLEAN
      },
      token: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addColumn('bookings', 'paymentMethod', {
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn('bookings', 'paymentStatus', {
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn('bookings', 'orderId', {
      type: Sequelize.STRING,  
      allowNull: true,        
      unique: true,           
    });
  },

  async down(queryInterface, Sequelize) {
    // Xóa bảng 'bookings' nếu rollback migration
    await queryInterface.dropTable('bookings');
  }
};
