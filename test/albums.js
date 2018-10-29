const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  expect = chai.expect,
  { albumRequest } = require('./mocks');

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
      .then(response => {
        chai
          .request(server)
          .get('/albums')
          .set('authorization', `Bearer ${response.body.token}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res).to.be.a.json;
            expect(err).to.be.null;
            expect(res.body).to.have.property('albums');
            albumRequestMock.isDone();
            dictum.chai(res, 'Albums list endpoint');
            done();
          });
      });
  });

  it('should fail if no auth', done => {
    chai
      .request(server)
      .get('/albums')
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(res).to.be.a.json;
        expect(err).not.to.be.null;
        done();
      });
  });
});
