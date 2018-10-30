const { User, Purchase } = require('../app/models');

exports.execute = () => {
  // This function should create data for testing and return a promise
  return User.create({
    name: 'Federico',
    surname: 'Casares',
    email: 'federico.casares@wolox.com.ar',
    admin: true,
    password: '$2b$10$FoKOu6OIHD20/6C8E86YjueiahPtZwSxLFRJJucC7o0wY3bkVmXHS',
    updatedAt: '2018-10-24T18:51:59.125Z',
    createdAt: '2018-10-24T18:51:59.125Z'
  })
    .then(user => {
      return Purchase.create({
        userId: user.id,
        albumId: 7
      });
    })
    .then(() => {
      return User.create({
        name: 'Federico',
        surname: 'NotAdmin',
        email: 'federico.notadmin@wolox.com.ar',
        admin: false,
        password: '$2b$10$FoKOu6OIHD20/6C8E86YjueiahPtZwSxLFRJJucC7o0wY3bkVmXHS',
        updatedAt: '2018-10-24T18:51:59.125Z',
        createdAt: '2018-10-24T18:51:59.125Z'
      });
    });
};
