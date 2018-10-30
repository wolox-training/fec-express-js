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

module.exports.photoRequest = () => {
  return nock(config.albumApiUrl)
    .get('/photos?albumId=7')
    .reply(
      200,
      `[
          {
            "albumId": 1,
            "id": 1,
            "title": "accusamus beatae ad facilis cum similique qui sunt",
            "url": "https://via.placeholder.com/600/92c952",
            "thumbnailUrl": "https://via.placeholder.com/150/92c952"
          }
        ]`
    );
};
