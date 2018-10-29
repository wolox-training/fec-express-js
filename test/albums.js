const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  expect = chai.expect,
  nock = require('nock');

describe('/albums GET', () => {
  it('should list albums', () => {
    const albumRequest = nock('https://jsonplaceholder.typicode.com/')
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
    return chai
      .request(server)
      .post('/users/sessions')
      .send({
        email: 'federico.casares@wolox.com.ar',
        password: '12345678'
      })
      .then(res => {
        return chai
          .request(server)
          .get('/albums')
          .set('authorization', `Bearer ${res.body.token}`);
      })
      .catch(err => {
        expect(err).to.be.null;
        expect(err.response).to.have.status(200);
        expect(err.response).to.be.a.json;
        expect(err.response.body).to.have.property('albums');
        albumRequest.isDone();
        dictum.chai(err.response, 'Albums list endpoint');
      });
  });

  it('should fail if no auth', () => {
    return chai
      .request(server)
      .get('/albums')
      .catch(err => {
        expect(err).not.to.be.null;
        expect(err.response).to.have.status(401);
        expect(err.response).to.be.a.json;
      });
  });
});

describe('/albums/:id POST', () => {
  it('should create a purchase', () => {
    return chai
      .request(server)
      .post('/users/sessions')
      .send({
        email: 'federico.casares@wolox.com.ar',
        password: '12345678'
      })
      .then(res => {
        return chai
          .request(server)
          .post('/albums/1')
          .set('authorization', `Bearer ${res.body.token}`);
      })
      .then(res => {
        expect(res).to.have.status(200);
        expect(res).to.be.a.json;
        expect(res.body).to.have.property('userId');
        expect(res.body).to.have.property('albumId');
        dictum.chai(res, 'Album purchase endpoint');
      });
  });

  it('should fail if purchase exists already', () => {
    let token = '';
    return chai
      .request(server)
      .post('/users/sessions')
      .send({
        email: 'federico.casares@wolox.com.ar',
        password: '12345678'
      })
      .then(res => {
        token = res.body.token;
        return chai
          .request(server)
          .post('/albums/1')
          .set('authorization', `Bearer ${token}`);
      })
      .then(res => {
        return chai
          .request(server)
          .post('/albums/1')
          .set('authorization', `Bearer ${token}`);
      })
      .catch(err => {
        expect(err).not.to.be.null;
        expect(err.response).to.have.status(500);
        expect(err.response).to.be.a.json;
      });
  });
});
