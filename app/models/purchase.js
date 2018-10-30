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
      userId: {
        type: DateTypes.INTEGER,
        allowNull: false,
        field: 'user_id'
      },
      date: {
        type: DateTypes.DATE,
        defaultValue: DateTypes.NOW
      }
    },
    {
      timestamps: true,
      underscored: true
    }
  );
  return Purchase;
};
