const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const logger = require('../logger');
const moment = require('moment');
const config = require('../../config').common.session;
const { dbError, userUnauthorized, needsAdmin, albumNotPurchased } = require('../errors');

module.exports = {
  userCreate(req, res, next) {
    const userRaw = req.body;
    userRaw.admin = false;
    return User.createWithHashedPw(userRaw)
      .then(user => {
        return res.status(200).json(user);
      })
      .catch(err => next(dbError(err)));
  },

  userNewSession(req, res, next) {
    const { email, password } = req.body;
    return User.scope('withPasswd')
      .findOne({ where: { email } })
      .then(user => {
        if (!user) {
          logger.error('Email is not registered.');
          return next(userUnauthorized);
        }
        if (bcrypt.compareSync(password, user.password)) {
          logger.info(`User ${email} authenticated.`);
          delete user.dataValues.password;
          const token = jwt.sign(JSON.parse(JSON.stringify(user)), config.secret, {
            expiresIn: config.expirationInSeconds
          });
          return res.status(200).json({
            token,
            expirationDate: moment()
              .add(config.expirationInSeconds, 'seconds')
              .unix()
          });
        } else {
          logger.error('Password mismatch.');
          return next(userUnauthorized);
        }
      })
      .catch(err => next(dbError(err)));
  },
  usersList(req, res, next) {
    let page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.size) || 10;
    page = page > 0 ? page : 1;
    return User.findAndCountAll({ offset: pageSize * (page - 1), limit: pageSize })
      .then(result => {
        const users = result.rows;
        return res.status(200).json({ users, page, count: users.length, total: result.count });
      })
      .catch(err => next(dbError(err)));
  },
  userAdminCreate(req, res, next) {
    const userRaw = req.body;
    return User.findOne({ where: { email: userRaw.email } })
      .then(user => {
        if (user) {
          return User.update({ admin: true }, { returning: true, where: { email: userRaw.email } })
            .then(([rowsUpdate, [userUpdated]]) => {
              return res.status(200).json(userUpdated);
            })
            .catch(err => next(dbError(err)));
        } else {
          userRaw.admin = true;
          return User.createWithHashedPw(userRaw)
            .then(userCreated => {
              return res.status(200).json(userCreated);
            })
            .catch(err => next(dbError(err)));
        }
      })
      .catch(err => next(dbError(err)));
  },
  invalidateAllSessions(req, res, next) {
    return User.update(
      { sessionInvalidate: Math.floor(Date.now() / 1000) },
      { returning: true, where: { email: req.user.email } }
    )
      .then(([rowsUpdate, [userUpdated]]) => {
        res.status(200).json(userUpdated);
      })
      .catch(next);
  }
};
