'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('Users', 'session_invalidate', Sequelize.BIGINT);
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Users', 'session_invalidate');
  }
};
