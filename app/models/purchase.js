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
        allowNull: false,
        field: 'album_id'
      },
      date: {
        type: DateTypes.DATE,
        defaultValue: DateTypes.NOW
      }
    },
    {
      timestamps: true
    }
  );
  Purchase.associate = function(models) {
    Purchase.belongsTo(models.User, { as: 'user', foreignKey: 'user_id' });
  };
  return Purchase;
};
