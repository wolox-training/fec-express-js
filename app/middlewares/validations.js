const config = require('../../config').common.session;
const jwt = require('express-jwt');
const { isRevokedCallback } = require('../utils');

module.exports = {
  tokenCheck: jwt({ secret: config.secret, isRevoked: isRevokedCallback })
};
