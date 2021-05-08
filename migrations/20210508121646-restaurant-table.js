'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('restaurants', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false
      },
      name: Sequelize.STRING,
      price_range: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('restaurants');

  }
};
