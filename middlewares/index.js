const { isAuthenticated } = require('./authentication');
const { isAuthorized, isResourceOwner } = require('./authorization');
const { cache, getCached } = require('./cache');

module.exports = {
  isAuthenticated,
  isAuthorized,
  isResourceOwner,
  getCached
};
