const { User } = require('../app/models');

exports.execute = () => {
  // This function should create data for testing and return a promise
  return User.create({
    name: 'Federico',
    surname: 'Casares',
    email: 'federico.casares@wolox.com.ar',
    password: '12345678'
  });
};
