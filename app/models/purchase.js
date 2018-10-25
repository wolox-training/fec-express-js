module.exports = function(sequelize, DateTypes) {
  const Purchase = sequelize.define(
    'Purchase',
    {
      id: {
        type: DateTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true
      },
      albumId: {
        type: DateTypes.INTEGER,
        allowNull: false
      },
      date: {
        type: DateTypes.DATE,
        defaultValue: DateTypes.NOW
      }
    },
    {
      timestamps: false
    }
  );
  Purchase.associate = function(models) {
    Purchase.belongsTo(models.User, { as: 'user' });
  };
  return Purchase;
};
