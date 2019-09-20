const { ConflictError, UnprocessableEntityError } = require('./errors');

const parseDetails = errors =>
  Object.keys(errors).reduce((acc, field) => {
    const path = errors[field].path;
    const message = errors[field].message;

    return Object.assign(acc, { [path]: message });
  }, {});

module.exports = (error, doc, next) => {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new ConflictError('Has already been taken'));
  }

  if (error.name === 'ValidationError') {
    const errorDetails = parseDetails(error.errors);
    next(new UnprocessableEntityError(error.message, errorDetails));
  }

  next();
};