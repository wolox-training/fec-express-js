module.exports = function(sequelize, DateTypes) {
  return sequelize.define(
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
};
