const { validationResult } = require('express-validator/check');
const { User } = require('../models');
const bcrypt = require('bcrypt');
const logger = require('../logger');

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
  }
};
