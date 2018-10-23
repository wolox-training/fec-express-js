module.exports = function (sequelize, DateTypes) {
  return sequelize.define('user', {
    id: {
      type: DateTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
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
    }
  });
};
