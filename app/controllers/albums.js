const logger = require('../logger'),
  { getAlbums } = require('../services/albumsApi');

module.exports = {
  list(req, res, next) {
    getAlbums().then(function(albums) {
      return res.status(200).json({ albums });
    });
  }
};
