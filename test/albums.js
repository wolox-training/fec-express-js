const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  expect = chai.expect,
  { albumRequest, albumGetRequest } = require('./mocks');

describe('/albums GET', () => {
  it('should list albums', done => {
    const albumRequestMock = albumRequest();
    chai
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
      .then(res => {
        expect(res).to.have.status(200);
        expect(res).to.be.a.json;
        expect(res.body).to.have.property('albums');
        albumRequestMock.isDone();
        dictum.chai(res, 'Albums list endpoint');
        done();
      });
  });

  it('should fail if no auth', done => {
    chai
      .request(server)
      .get('/albums')
      .catch(err => {
        expect(err).not.to.be.null;
        expect(err.response).to.have.status(401);
        expect(err.response).to.be.a.json;
        done();
      });
  });
});

describe('/albums/:id POST', () => {
  it('should create a purchase', done => {
    const albumRequestMock = albumGetRequest();
    chai
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
        albumRequestMock.isDone();
        done();
      });
  });

  it('should fail if purchase exists already', done => {
    let token = '';
    const albumRequestMock = albumGetRequest();
    chai
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
        albumRequestMock.isDone();
        done();
      });
  });
});
