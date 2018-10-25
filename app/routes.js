const { check } = require('express-validator/check');
const jwt = require('express-jwt');
const userController = require('./controllers/users');
const albumController = require('./controllers/albums');
const config = require('../config').common.session;

exports.init = app => {
  // app.get('/endpoint/get/path', [], controller.methodGET);
  // app.put('/endpoint/put/path', [], controller.methodPUT);
  // app.post('/endpoint/post/path', [], controller.methodPOST);
  const userValidations = [
    check('name')
      .isLength({ min: 1 })
      .withMessage('Name Required'),
    check('surname')
      .isLength({ min: 1 })
      .withMessage('Surname Required'),
    check('password')
      .isLength({ min: 8 })
      .withMessage('Password must contain more than 8 characters.'),
    check('email')
      .isEmail()
      .withMessage('Invalid email.')
      .custom(email => {
        if (!email.endsWith('wolox.com.ar')) {
          throw new Error('Email is not from wolox domain!');
        }
        return true;
      })
  ];

  app.post('/users', userValidations, userController.userCreate);

  app.post(
    '/users/sessions',
    [
      check('password')
        .isLength({ min: 8 })
        .withMessage('Password must contain more than 8 characters.'),
      check('email')
        .isEmail()
        .withMessage('Invalid email.')
        .custom(email => {
          if (!email.endsWith('wolox.com.ar')) {
            throw new Error('Email is not from wolox domain!');
          }
          return true;
        })
    ],
    userController.userNewSession
  );

  app.get('/users', [jwt({ secret: config.secret })], userController.usersList);
  app.get('/users/:id/albums', [jwt({ secret: config.secret })], userController.albumList);

  app.post(
    '/admin/users',
    [jwt({ secret: config.secret })].concat(userValidations),
    userController.userAdminCreate
  );

  app.get('/albums', [jwt({ secret: config.secret })], albumController.list);
  app.post('/albums/:id', [jwt({ secret: config.secret })], albumController.buy);
};
