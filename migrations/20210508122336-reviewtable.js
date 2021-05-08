'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('reviews', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
      },
      restaurant_id: {
        type: Sequelize.INTEGER,
        reference: {
          model: "restuarants",
          key: "id"
        }
      },
      name: { type: Sequelize.STRING, allowNull: false },
      review: { type: Sequelize.STRING, allowNull: false },
      rating: {
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
    await queryInterface.dropTable('reviews');

  }
};
