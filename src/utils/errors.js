class BadRequestError extends Error {
  constructor(message = 'Bad Request') {
    super(message);

    this.name = 'BadRequest';
    this.status = 400;
  }
}

class NotFoundError extends Error {
  constructor(message = 'Not Found') {
    super(message);

    this.name = 'NotFound';
    this.status = 404;
  }
}

class ConflictError extends Error {
  constructor(message = 'Conflict') {
    super(message);

    this.name = 'Conflict';
    this.status = 409;
  }
}

class UnprocessableEntityError extends Error {
  constructor(message = 'Unprocessable Entity', details = []) {
    super(message);

    this.name = 'UnprocessableEntity';
    this.status = 422;
    this.details = details;
  }
}

module.exports = {
  BadRequestError,
  NotFoundError,
  ConflictError,
  UnprocessableEntityError,
};