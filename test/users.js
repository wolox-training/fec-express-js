const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  should = chai.should(),
  expect = chai.expect;

describe('/users POST', () => {
  it('should signup successfuly', () => {
    return chai
      .request(server)
      .post('/users')
      .send({
        name: 'Juan Ignacio',
        surname: 'Molina',
        email: 'juanignacio.molina@wolox.com.ar',
        password: 'pussy123'
      })
      .then(res => {
        expect(res).to.have.status(200);
        expect(res).to.be.a.json;
        dictum.chai(res, 'User signup endpoint');
      });
  });

  it('should fail if email is not from wolox domain', done => {
    chai
      .request(server)
      .post('/users')
      .send({
        name: 'Juan Ignacio',
        surname: 'Molina',
        email: 'juanignacio.molina@wolx.com.ar',
        password: 'pussy123'
      })
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(err).not.to.be.null;
        expect(res.body).to.have.property('errors');
        expect(res.body.errors[0])
          .to.have.property('param')
          .equals('email');
        done();
      });
  });

  it('should fail if password is less than 8 chars', done => {
    chai
      .request(server)
      .post('/users')
      .send({
        name: 'Juan Ignacio',
        surname: 'Molina',
        email: 'juanignacio.molina@wolox.com.ar',
        password: 'pussy12'
      })
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(err).not.to.be.null;
        expect(res.body).to.have.property('errors');
        expect(res.body.errors[0])
          .to.have.property('param')
          .equals('password');
        done();
      });
  });

  it('should fail if name missing', done => {
    chai
      .request(server)
      .post('/users')
      .send({
        surname: 'Molina',
        email: 'juanignacio.molina@wolox.com.ar',
        password: 'pussy123'
      })
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(err).not.to.be.null;
        expect(res.body).to.have.property('errors');
        expect(res.body.errors[0])
          .to.have.property('param')
          .equals('name');
        done();
      });
  });

  it('should fail if password missing', done => {
    chai
      .request(server)
      .post('/users')
      .send({
        name: 'Juan Ignacio',
        surname: 'Molina',
        email: 'juanignacio.molina@wolox.com.ar'
      })
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(err).not.to.be.null;
        expect(res.body).to.have.property('errors');
        expect(res.body.errors[0])
          .to.have.property('param')
          .equals('password');
        done();
      });
  });

  it('should fail if surname missing', done => {
    chai
      .request(server)
      .post('/users')
      .send({
        name: 'Juan Ignacio',
        email: 'juanignacio.molina@wolox.com.ar',
        password: 'pussy123'
      })
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(err).not.to.be.null;
        expect(res.body).to.have.property('errors');
        expect(res.body.errors[0])
          .to.have.property('param')
          .equals('surname');
        done();
      });
  });

  it('should fail if email missing', done => {
    chai
      .request(server)
      .post('/users')
      .send({
        name: 'Juan Ignacio',
        surname: 'Molina',
        password: 'pussy123'
      })
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(err).not.to.be.null;
        expect(res.body).to.have.property('errors');
        expect(res.body.errors[0])
          .to.have.property('param')
          .equals('email');
        done();
      });
  });

  it('should fail if email is duped', done => {
    chai
      .request(server)
      .post('/users')
      .send({
        name: 'Federico',
        surname: 'Casares',
        email: 'federico.casares@wolox.com.ar',
        password: '12345678'
      })
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(err).not.to.be.null;
        expect(res.body).to.have.property('error');
        done();
      });
  });
});

describe('/users/sessions POST', () => {
  it('should signin successfuly', () => {
    return chai
      .request(server)
      .post('/users/sessions')
      .send({
        email: 'federico.casares@wolox.com.ar',
        password: '12345678'
      })
      .then(res => {
        expect(res).to.have.status(200);
        expect(res).to.be.a.json;
        expect(res.body).to.have.property('secret');
        dictum.chai(res, 'User signin endpoint');
      });
  });

  it('should fail if wrong password', done => {
    chai
      .request(server)
      .post('/users/sessions')
      .send({
        email: 'federico.casares@wolox.com.ar',
        password: 'notmypass'
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(err).not.to.be.null;
        done();
      });
  });

  it('should fail if not password', done => {
    chai
      .request(server)
      .post('/users/sessions')
      .send({
        email: 'federico.casares@wolox.com.ar'
      })
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(res.body).to.have.property('errors');
        expect(res.body.errors[0])
          .to.have.property('param')
          .equals('password');
        expect(err).not.to.be.null;
        done();
      });
  });

  it('should fail if not email', done => {
    chai
      .request(server)
      .post('/users/sessions')
      .send({
        password: 'notmypass'
      })
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(res.body).to.have.property('errors');
        expect(res.body.errors[0])
          .to.have.property('param')
          .equals('email');
        expect(err).not.to.be.null;
        done();
      });
  });

  it('should fail if not from wolox domain', done => {
    chai
      .request(server)
      .post('/users/sessions')
      .send({
        email: 'federico.casares@wol.com.ar',
        password: '12345678'
      })
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(res.body).to.have.property('errors');
        expect(res.body.errors[0])
          .to.have.property('param')
          .equals('email');
        expect(err).not.to.be.null;
        done();
      });
  });
});
