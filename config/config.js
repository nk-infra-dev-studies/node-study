var development = {
  env: 'development',
  database: {
    mysql: {
      connectionLimit: 10,
      host: 'study-db.io',
      port: 3306,
      user: 'node-study',
      password: 'study@1234',
      database: 'node-study',
      charset: 'UTF8_GENERAL_CI'
    }
  },
  cache: {
    redis: {
      host: 'study-db.io',
      port: 6379,
      socket_keepalive: true
    }
  }
};

var production = {
  env: 'production',
  database: {
    mysql: {
      connectionLimit: 10,
      host: 'study-db.io',
      user: 'node-study',
      password: 'study@1234',
      database: 'node-study',
      port: 3306
    }
  }
};

switch (process.env.NODE_ENV) {
  case 'development':
    module.exports = development;
    break;
  case 'production':
    module.exports = production;
    break;
  default:
    console.error('please set NODE_ENV value');
    module.exports = development;
}
