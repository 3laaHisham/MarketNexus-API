import isAuthenticated from "./authentication";
import { isAuthorized, isResourceOwner } from "./authorization";
import cache from "./cache";

export default {
  isAuthenticated,
  isAuthorized,
  isResourceOwner,
  cache,
};
