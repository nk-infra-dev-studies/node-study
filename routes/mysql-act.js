var express = require('express'),
  async = require('async'),
  hash = require('../lib/hash-password'),
  mysqlClient = require('../lib/database/mysql'),
  redisClient = require('../lib/database/redis'),
  router = express.Router();

router.get('/', function (req, res, next) {
  res.send('hello!');
});

router.get('/set/:id/:email/:username/:passwd/:age/:gender', function (req, res, next) {
  var params = req.params;
  console.log('파라미터: ', params);

  params.passwd = hash(params.passwd);

  mysqlClient.query(
    'INSERT INTO `user` (id, email, username, passwd, age, gender) VALUES (?, ?, ?, ?, ?, ?)',
    [params.id, params.email, params.username, params.passwd, params.age, params.gender],
    function (err, results, fields) {
      if (err) {
        err.at = 'insert';
        console.error('유저 데이터 DB Insert 실패: ', err);
        res.json(err);
        console.log(Date.now());
        return;
      }
      console.log('유저 데이터 DB Insert 성공: ', results);
      console.log('필드 정보: ', fields);
      mysqlClient.query(
        'SELECT * FROM `user` WHERE id = ?', [params.id],
        function (err, result) {
          if (err) {
            err.at = 'select';
            console.error('유저 데이터 DB Select 실패: ', err);
            res.json(err);
            return;
          }
          console.log('유저 데이터 DB Select 성공: ', result);
          console.log(Date.now());

          redisClient.set(params.id, JSON.stringify(result[0]), function (err, results) {
            if (err) {
              err.at = 'redis.set';
              console.error('[Caching] 유저 데이터 Redis set 실패: ', err);
              res.json(err);
              return;
            }
            console.log('[Caching] 유저 데이터 Redis set 성공: ', results);
            res.json(result[0]);
          });
        });
    });
});


router.get('/set-async/:id/:email/:username/:passwd/:age/:gender', function (req, res, next) {
  var params = req.params;
  params.passwd = hash(params.passwd);
  console.log('파라미터: ', params);

  async.waterfall([

      function (callback) {
        console.log('2번째 콜백 인자: ', arguments);
        mysqlClient.query(
          'SELECT * FROM `user` WHERE id = ?', [params.id],
          function (err, result) {
            callback(err, result);
          });
      },
      function (result, callback) {
        mysqlClient.query(
          'INSERT INTO `user` (id, email, username, passwd, age, gender) VALUES (?, ?, ?, ?, ?, ?)',
          [params.id, params.email, params.username, params.passwd, params.age, params.gender],
          function (err, result) {
            err.errorOccuredAt = 'insert';
            callback(err, result);
          });
      },
      function (result, callback) {
        console.log('3번째 콜백 인자: ', arguments);
        redisClient.set(params.id, JSON.stringify(result[0]), function (err, reply) {
          callback(null, reply)
        });
      }
    ],
    /**
     * Task가 모두 처리되거나 error 발생 후 최종 처리 콜백
     * @param err
     * @param result
     */
    function (err, result) {
      if (err) {
        console.error('Async 에러: ', err);
        res.json(err);
        return;
      }

      console.log('Async 성공: ', result);
      res.json(result);
    });
});


router.get('/get/:id', function (req, res, next) {
  var id = req.params.id;

  redisClient.get(id, function (err, reply) {
    if (err) {
      console.error('Redis에 ' + id + ' Key 데이터 get 실패: ', err);
      res.json(err);
      return;
    }

    if (reply !== null) {
      console.log('[Caching] Redis get 성공: ', reply);
      res.json(reply);
    } else {
      console.log('Redis에 데이터가 없으므로 MySQL에서 가져온다.');
      mysqlClient.query(
        'SELECT * FROM user WHERE id=?', [id],
        function (err, result) {
          if (err) {
            console.error('유저 데이터 DB Select 실패: ', err);
            res.json(err);
            return;
          }
          console.log('유저 데이터 DB Select 성공: ', result);
          console.log(Date.now());

          redisClient.set(id, JSON.stringify(result[0]), function (err, results) {
            if (err) {
              console.error('[Caching] 유저 데이터 Redis set 실패: ', err);
              res.json(err);
              return;
            }
            console.log('[Caching] 유저 데이터 Redis set 성공: ', results);
            res.json(results);
          });
        }
      );
    }
  })
});

module.exports = router;
