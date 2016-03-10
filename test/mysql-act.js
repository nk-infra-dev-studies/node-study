'use strict';
var qs = require('querystring');
var config = require('../config/config');
var request = require('supertest');
var expect = require('chai').expect;
var server = require('../app');

var randNum = Math.floor(Math.random() * 100000);
var randAge = Math.floor(Math.random() * 100);
var randDigit = Math.round(Math.random());

var userId = 'user-' + randNum;
var userName = '유저-' + randNum;
var gender = null;

if (randDigit === 0) gender = 'MALE';
else gender = 'FEMALE';

var insertParams = {
  id: userId,
  email: qs.escape(userId + '@mail.or.kr'),
  username: qs.escape(userName),
  passwd: qs.escape(userId.concat(userName)),
  age: randAge,
  gender: gender
};

var serverHost = 'http://localhost:8080';
var uriString = '/mysqlact/set';
var insertString = '/' + insertParams.id + '/' + insertParams.email + '/' + insertParams.username
  + '/' + insertParams.passwd + '/' + insertParams.age + '/' + insertParams.gender;
var requestUrl = uriString.concat(insertString);

describe('mysql-act route 파일을 테스트 한다 >', function () {
  describe('유저를 등록하고 캐쉬에 등록한다 >', function () {
    before(function () {
      console.log(requestUrl);
      server.listen(8080);
    });

    it('GET /mysqlact/set', function (done) {
      request(serverHost)
        .get(requestUrl)
        .expect(200)
        .end(function (err, res) {
          expect(err).to.be.null;
          console.log(res.body);
          expect(res.body).to.have.property('id', insertParams.id);
          expect(res.body).to.have.property('gender', insertParams.gender);
          expect(res.body).to.have.property('age', insertParams.age);
          done();
        });
    });
  });
});
