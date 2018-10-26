const userController = require('./controllers/users');
const albumController = require('./controllers/albums');
const {
  tokenCheck,
  paramValidation,
  userParamsValidations,
  newSessionParamsValidation,
  checkAdmin
} = require('./middlewares/validations');

exports.init = app => {
  app.post('/users', userParamsValidations, userController.userCreate);
  app.post('/users/sessions', newSessionParamsValidation, userController.userNewSession);
  app.post('/users/sessions/invalidate_all', [tokenCheck], userController.invalidateAllSessions);
  app.get('/users', [tokenCheck], userController.usersList);
  app.get('/users/:id/albums', [tokenCheck], userController.albumList);
  app.get('/users/albums/:id/photos', [tokenCheck], userController.albumPhotosList);
  app.post(
    '/admin/users',
    [tokenCheck, checkAdmin].concat(userParamsValidations),
    userController.userAdminCreate
  );
  app.get('/albums', [tokenCheck], albumController.list);
  app.post('/albums/:id', [tokenCheck], albumController.buy);
};
