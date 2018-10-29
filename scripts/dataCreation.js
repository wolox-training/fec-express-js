const { User } = require('../app/models');

exports.execute = () => {
  // This function should create data for testing and return a promise
  return User.create({
    name: 'Federico',
    surname: 'Casares',
    email: 'federico.casares@wolox.com.ar',
    password: '$2b$10$FoKOu6OIHD20/6C8E86YjueiahPtZwSxLFRJJucC7o0wY3bkVmXHS',
    updatedAt: '2018-10-24T18:51:59.125Z',
    createdAt: '2018-10-24T18:51:59.125Z'
  });
};
