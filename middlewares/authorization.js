const { StatusCodes } = require('http-status-codes');

const isAuthorized = (authorizedRole) => (req, res, next) => {
  try {
    const { role } = req.session.user;
    if (role == authorizedRole) return next();

    res.status(StatusCodes.FORBIDDEN).json('Unauthorized');
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json('Error');
  }
};

const isResourceOwner = (resourceModel, resourceId, userId) => (req, res, next) => {
  try {
    const resource = resourceModel.findById(resourceId);
    const ownerId = resource.modelName === 'Product' ? resource.sellerId : resource.userId;

    if (ownerId == userId) next();

    res.status(StatusCodes.FORBIDDEN).json('Unauthorized');
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json('Error');
  }
};
module.exports = { isAuthorized, isResourceOwner };
