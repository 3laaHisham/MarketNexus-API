const { isAuthenticated } = require('./authentication');
const { isAuthorized, isResourceOwner } = require('./authorization');
const { cache, getCached } = require('./cache');
const { queryParser } = require('./queryParser');

module.exports = {
  isAuthenticated,
  isAuthorized,
  isResourceOwner,
  getCached,
  queryParser
};
