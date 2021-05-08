'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('restaurants', "deletedAt", { type: Sequelize.DATE });
    await queryInterface.addColumn('reviews', "deletedAt", { type: Sequelize.DATE });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('restaurants', "deletedAt");
    await queryInterface.removeColumn('reviews', "deletedAt");
  }
};
