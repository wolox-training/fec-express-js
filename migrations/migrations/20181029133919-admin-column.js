'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('Users', 'admin', Sequelize.BOOLEAN, {
      defaultValue: false,
      allowNull: false
    });
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Users', 'admin');
  }
};
