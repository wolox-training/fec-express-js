const { validationResult } = require('express-validator/check');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const logger = require('../logger');
const config = require('../../config').common.session;

module.exports = {
  userCreate(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error('User input invalid.');
      logger.error(errors.array());
      return res.status(422).json({ errors: errors.array() });
    }
    const userRaw = req.body;
    userRaw.password = bcrypt.hashSync(userRaw.password, 10);
    User.create(userRaw)
      .then(user => {
        logger.info(`User ${user.name} successfuly created!`);
        res.status(200).json(user);
      })
      .catch(error => {
        logger.error(`DB: ${error.errors[0]}`);
        res.status(500).json({ error: error.errors[0].message });
      });
  },

  userNewSession(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error('User input invalid.');
      logger.error(errors.array());
      return res.status(422).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    User.findOne({ where: { email } })
      .then(user => {
        if (!user) {
          logger.error('Email is not registered.');
          return res.status(401).json({ error: 'User auth failed. Check your email or password.' });
        }
        if (bcrypt.compareSync(password, user.password)) {
          logger.info(`User ${email} authenticated.`);
          delete user.dataValues.password;
          const token = jwt.sign(JSON.stringify(user), config.secret);
          return res.status(200).json({ secret: token });
        } else {
          logger.error('Password mismatch.');
          return res.status(401).json({ error: 'User auth failed. Check your email or password.' });
        }
      })
      .catch(error => {
        logger.error(`DB: ${error.errors[0]}`);
        res.status(500).json({ error: error.errors[0].message });
      });
  }
};
