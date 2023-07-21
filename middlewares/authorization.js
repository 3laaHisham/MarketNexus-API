const { StatusCodes } = require('http-status-codes');

const isAuthorized = (authorizedRole) => (req, res, next) => {
  try {
    const { role } = req.session.user;
    if (role == authorizedRole) return next();

    res.status(StatusCodes.FORBIDDEN).json('Unauthorized');
  } catch (e) {
    console.log(e.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e.message);
  }
};

const isResourceOwner = (res, next) => async (resourceModel, resourceId, userId) => {
  try {
    const resource = await resourceModel.findById(resourceId);
    if (!resource) return res.status(StatusCodes.NOT_FOUND).json('Resource not found');

    const ownerId = resourceModel.modelName === 'Product' ? resource.seller : resource.userId;

    if (ownerId == userId) return next();
    res.status(StatusCodes.FORBIDDEN).json('Unauthorized');
  } catch (e) {
    console.log(e.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(e.message);
  }
};
module.exports = { isAuthorized, isResourceOwner };
