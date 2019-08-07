class BadRequestError extends Error {
  constructor(message = 'Bad Request') {
    super(message);

    this.name = 'BadRequestError';
    this.status = 400;
  }
}

class NotFoundError extends Error {
  constructor(message = 'Not Found') {
    super(message);

    this.name = 'NotFoundError';
    this.status = 404;
  }
}

module.exports = {
  BadRequestError,
  NotFoundError,
};