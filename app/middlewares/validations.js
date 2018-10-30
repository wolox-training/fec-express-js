const config = require('../../config').common.session;
const jwt = require('express-jwt');
const { validationResult } = require('express-validator/check');
const { isRevokedCallback } = require('../utils');
const { invalidInput, needsAdmin, tokenError } = require('../errors');
const { check } = require('express-validator/check');

const paramValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(invalidInput);
  } else {
    next();
  }
};

module.exports = {
  tokenCheck: [
    jwt({ secret: config.secret, isRevoked: isRevokedCallback }),
    (err, req, res, next) => {
      if (err && err.message) {
        next(tokenError(err.message));
      }
    }
  ],
  paramValidation,
  checkAdmin(req, res, next) {
    if (!req.user.admin) {
      next(needsAdmin);
    } else {
      next();
    }
  },
  userParamsValidations: [
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
      }),
    paramValidation
  ],
  newSessionParamsValidation: [
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
      }),
    paramValidation
  ]
};
