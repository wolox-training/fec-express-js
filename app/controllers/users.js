const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Purchase } = require('../models');
const axios = require('axios');
const logger = require('../logger');
const config = require('../../config').common.session;
const { dbError, userUnauthorized, needsAdmin, albumNotPurchased } = require('../errors');

function createUser(userParams, res, next) {
  userParams.password = bcrypt.hashSync(userParams.password, 10);
  User.create(userParams)
    .then(user => {
      logger.info(`User ${user.name} successfuly created!`);
      res.status(200).json(user);
    })
    .catch(err => next(dbError(err)));
}

module.exports = {
  userCreate(req, res, next) {
    const userRaw = req.body;
    userRaw.admin = false;
    createUser(userRaw, res, next);
  },

  userNewSession(req, res, next) {
    const { email, password } = req.body;
    User.scope('withPasswd')
      .findOne({ where: { email } })
      .then(user => {
        if (!user) {
          logger.error('Email is not registered.');
          return next(userUnauthorized);
        }
        if (bcrypt.compareSync(password, user.password)) {
          logger.info(`User ${email} authenticated.`);
          const token = jwt.sign(JSON.parse(JSON.stringify(user)), config.secret, {
            expiresIn: config.expirationInSeconds
          });
          return res
            .status(200)
            .json({ token, expirationDate: Math.floor(Date.now() / 1000) + config.expirationInSeconds });
        } else {
          logger.error('Password mismatch.');
          return next(userUnauthorized);
        }
      })
      .catch(err => next(dbError(err)));
  },
  usersList(req, res, next) {
    let page = parseInt(req.query.page) || 1;
    page = page > 0 ? page : 1;
    const pageSize = 10;
    User.findAll({ offset: pageSize * (page - 1), limit: pageSize })
      .then(users => {
        res.status(200).json({ users, page });
      })
      .catch(err => next(dbError(err)));
  },
  userAdminCreate(req, res, next) {
    const userRaw = req.body;
    User.findOne({ where: { email: userRaw.email } })
      .then(user => {
        if (user) {
          User.update({ admin: true }, { returning: true, where: { email: userRaw.email } })
            .then(function([rowsUpdate, [userUpdated]]) {
              res.status(200).json(userUpdated);
            })
            .catch(err => next(dbError(err)));
        } else {
          userRaw.admin = true;
          createUser(userRaw, res, next);
        }
      })
      .catch(err => next(dbError(err)));
  },
  albumList(req, res, next) {
    if (!req.user.admin && req.user.id !== parseInt(req.params.id)) {
      return next(needsAdmin);
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
        next(albumNotPurchased);
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
  },
  invalidateAllSessions(req, res, next) {
    return User.update(
      { sessionInvalidate: Math.floor(Date.now() / 1000) },
      { returning: true, where: { email: req.user.email } }
    )
      .then(function([rowsUpdate, [userUpdated]]) {
        res.status(200).json(userUpdated);
      })
      .catch(next);
  }
};
