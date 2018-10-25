const logger = require('../logger');
const axios = require('axios');

module.exports = {
  list(req, res, next) {
    axios.get('https://jsonplaceholder.typicode.com/albums').then(function(response) {
      res.status(200).json({
        albums: response.data.map(album => {
          delete album.userId;
          return album;
        })
      });
    });
  }
};
