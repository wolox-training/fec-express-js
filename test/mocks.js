const nock = require('nock'),
  config = require('../config').common.externalApi;

module.exports.albumRequest = () => {
  return nock(config.albumApiUrl)
    .get('/albums')
    .reply(
      200,
      `[
        {
          "userId": 1,
          "id": 1,
          "title": "quidem molestiae enim"
        }
      ]`
    );
};

module.exports.albumGetRequest = () => {
  return nock(config.albumApiUrl)
    .get('/albums/1')
    .reply(
      200,
      `{
          "userId": 1,
          "id": 1,
          "title": "quidem molestiae enim"
        }`
    );
};
