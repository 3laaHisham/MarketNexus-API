const isAuthenticated = require("./authentication");
const { isAuthorized, isResourceOwner } = require("./authorization");
const cache = require("./cache");

module.exports = {
  isAuthenticated,
  isAuthorized,
  isResourceOwner,
  cache,
};
