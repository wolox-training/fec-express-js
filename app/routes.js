const { check } = require('express-validator/check');
const userController = require('./controllers/users');
const albumController = require('./controllers/albums');
const { tokenCheck } = require('./middlewares/validations');

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

  app.post('/users/sessions/invalidate_all', [tokenCheck], userController.invalidateAllSessions);
  app.get('/users', [tokenCheck], userController.usersList);
  app.get('/users/:id/albums', [tokenCheck], albumController.albumList);
  app.get('/users/albums/:id/photos', [tokenCheck], albumController.albumPhotosList);
  app.post('/admin/users', [tokenCheck].concat(userValidations), userController.userAdminCreate);
  app.get('/albums', [tokenCheck], albumController.list);
  app.post('/albums/:id', [tokenCheck], albumController.buy);
};
