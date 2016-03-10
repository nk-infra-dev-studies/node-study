var crypto = require('crypto');

function hash(passwd) {
  return crypto.createHash("md5")
    .update(passwd)
    .digest('hex');
}

module.exports = hash;