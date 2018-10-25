const { validationResult } = require('express-validator/check');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Purchase } = require('../models');
const axios = require('axios');
const logger = require('../logger');
const config = require('../../config').common.session;
const { defaultError } = require('../errors');

function logDBError(res) {
  return error => {
    logger.error(`DB: ${error.errors[0]}`);
    res.status(500).json({ error: error.errors[0].message });
  };
}

function createUser(userParams, res) {
  userParams.password = bcrypt.hashSync(userParams.password, 10);
  User.create(userParams)
    .then(user => {
      logger.info(`User ${user.name} successfuly created!`);
      res.status(200).json(user);
    })
    .catch(logDBError(res));
}

module.exports = {
  userCreate(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error('User input invalid.');
      logger.error(errors.array());
      return res.status(422).json({ errors: errors.array() });
    }
    const userRaw = req.body;
    userRaw.admin = false;
    createUser(userRaw, res);
  },

  userNewSession(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error('User input invalid.');
      logger.error(errors.array());
      return res.status(422).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    User.scope('withPasswd')
      .findOne({ where: { email } })
      .then(user => {
        if (!user) {
          logger.error('Email is not registered.');
          return res.status(401).json({ error: 'User auth failed. Check your email or password.' });
        }
        if (bcrypt.compareSync(password, user.password)) {
          logger.info(`User ${email} authenticated.`);
          const token = jwt.sign(JSON.stringify(user), config.secret);
          return res.status(200).json({ token });
        } else {
          logger.error('Password mismatch.');
          return res.status(401).json({ error: 'User auth failed. Check your email or password.' });
        }
      })
      .catch(logDBError(res));
  },
  usersList(req, res, next) {
    let page = parseInt(req.query.page) || 1;
    page = page > 0 ? page : 1;
    const pageSize = 10;
    User.findAll({ offset: pageSize * (page - 1), limit: pageSize })
      .then(users => {
        res.status(200).json({ users, page });
      })
      .catch(logDBError(res));
  },
  userAdminCreate(req, res, next) {
    const errors = validationResult(req);
    // TODO: Move to middleware
    if (!errors.isEmpty()) {
      logger.error('User input invalid.');
      logger.error(errors.array());
      return res.status(422).json({ errors: errors.array() });
    }
    // TODO: Move to middleware
    if (!req.user.admin) {
      return res.status(401).json({ message: 'User is not an admin.' });
    }
    const userRaw = req.body;
    User.findOne({ where: { email: userRaw.email } })
      .then(user => {
        if (user) {
          return User.update({ admin: true }, { returning: true, where: { email: userRaw.email } })
            .then(function([rowsUpdate, [userUpdated]]) {
              res.status(200).json(userUpdated);
            })
            .catch(logDBError(res));
        } else {
          userRaw.admin = true;
          createUser(userRaw, res);
        }
      })
      .catch(logDBError(res));
  },
  albumList(req, res, next) {
    if (!req.user.admin && req.user.id !== parseInt(req.params.id)) {
      return res.status(401).json({ message: 'User is not an admin.' });
    }
    Purchase.findAll({ where: { userId: req.params.id } }).then(purchases => {
      res.status(200).json({
        albums: purchases.map(p => {
          return { id: p.albumId };
        })
      });
    });
  },
  albumPhotosList(req, res, next) {
    const purchase = {
      userId: req.user.id,
      albumId: req.params.id
    };
    Purchase.findOne({ where: purchase }).then(p => {
      if (!p) {
        next(defaultError('Album has not been purchased.'));
      } else {
        axios
          .get(`https://jsonplaceholder.typicode.com/photos?albumId=${p.albumId}`)
          .then(function(response) {
            res.status(200).json({
              photos: response.data.map(photo => {
                delete photo.albumId;
                return photo;
              })
            });
          });
      }
    });
  }
};
