module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn('Users', 'img', {
                type: Sequelize.BLOB('long'),
                allowNull: true,
            })
        ])
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn('Users', 'img', {
                type: Sequelize.STRING,
                allowNull: true,
            })
        ])
    }
};