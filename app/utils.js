const { User } = require('./models');
const logger = require('./logger');

module.exports = {
  isRevokedCallback(req, payload, done) {
    const issuer = payload.iat;
    const tokenId = payload.jti;
    User.findOne({ where: { id: payload.id } }).then(user => {
      if (user.sessionInvalidate && user.sessionInvalidate >= issuer) {
        logger.error('Token Invalidated');
        done(new Error('Token Invalidated'));
      } else {
        done();
      }
    });
  }
};
