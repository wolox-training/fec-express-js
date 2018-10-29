const nock = require('nock');

module.exports.albumRequest = () => {
  return nock('https://jsonplaceholder.typicode.com/')
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
