const { check } = require('express-validator/check');

const userController = require('./controllers/users');

exports.init = app => {
  // app.get('/endpoint/get/path', [], controller.methodGET);
  // app.put('/endpoint/put/path', [], controller.methodPUT);
  // app.post('/endpoint/post/path', [], controller.methodPOST);
  app.post(
    '/users',
    [
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
    ],
    userController.userCreate
  );

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
};
