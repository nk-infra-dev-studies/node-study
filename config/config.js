var development = {
  env: 'development',
  database: {
    mysql: {
      connectionLimit: 10,
      host: '192.168.99.100',
      port: 3306,
      user: 'node-study',
      password: 'study@1234',
      database: 'node-study',
      charset: 'UTF8_GENERAL_CI'
    }
  },
  cache: {
    redis: {
      host: '192.168.99.100',
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
      host: '192.168.99.100',
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
