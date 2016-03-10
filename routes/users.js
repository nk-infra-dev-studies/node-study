var express = require('express');
var router = express.Router();

router.get('/dept', function (req, res, next) {
  res.send('유저 팀은 인프라개발팀 입니다.');
});

router.get('/shouldBeDead', function (req, res, next) {

});

router.get('/:nameString', function (req, res, next) {
  var nameString = req.params.nameString;

  var userObject = {
    name: '명락',
    age: 34,
    birth: '1983.12.29'
  };

  res.send('유저 이름은 ' + nameString + ' 입니다.');
  //res.status(201).json(userObject);
});

router.post('/:nameString', function (req, res, next) {
  var nameString = req.params.nameString;
  res.status(201).send('User ' + nameString + ' created!');
});

router.put('/:nameString/:privileges', function (req, res, next) {
  var nameString = req.params.privileges;

});


module.exports = router;
