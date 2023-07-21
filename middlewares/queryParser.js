const queryParser = (req, res, next) => {
  for (const key in req.query)
    if (key.includes('.')) {
      const [outerKey, innerKey, other] = key.split('.');

      if (!req.query[outerKey]) req.query[outerKey] = {};

      req.query[outerKey][innerKey] = req.query[key];
      delete req.query[key];
    }

  next();
};

module.exports = { queryParser };
