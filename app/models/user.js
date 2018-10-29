const bcrypt = require('bcrypt'),
  logger = require('../logger');

module.exports = (sequelize, DateTypes) => {
  const User = sequelize.define(
    'User',
    {
      name: {
        type: DateTypes.STRING,
        allowNull: false
      },
      surname: {
        type: DateTypes.STRING,
        allowNull: false
      },
      email: {
        type: DateTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DateTypes.STRING,
        allowNull: false
      },
      admin: {
        type: DateTypes.BOOLEAN,
        default: false,
        allowNull: false
      }
    },
    {
      defaultScope: {
        attributes: { exclude: ['password'] }
      },
      scopes: {
        withPasswd: {
          attributes: { include: ['password'] }
        }
      }
    }
  );

  User.createWithHashedPw = userParams => {
    userParams.password = bcrypt.hashSync(userParams.password, 10);
    return User.create(userParams).then(user => {
      logger.info(`User ${user.name} successfuly created!`);
      return user;
    });
  };

  return User;
};
