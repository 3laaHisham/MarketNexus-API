import isAuthenticated from "./authentication";
import { isAuthorized, isResourceOwner } from "./authorization";
import cache from "./cache";
import errorHandler from "./errorHandler";

export default {
  isAuthenticated,
  isAuthorized,
  isResourceOwner,
  cache,
  errorHandler,
};
