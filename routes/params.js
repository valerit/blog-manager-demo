exports.paramName = function (req, res, next, paramValue) {
  console.log(paramValue);
  next();
};
