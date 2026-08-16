/**
 * Base class for all "expected" application errors - errors that represent
 * a known failure mode (bad input, missing resource, etc.) rather than a
 * bug. Each subclass carries an HTTP status code so the error-handling
 * middleware can map it to the right response without any if/else chain.
 *
 * Anything that ISNT an AppError (a genuine bug, a null pointer, a DB
 * connection failure) falls through to a generic 500 in the middleware -
 * that distinction is what lets us return safe, specific messages for
 * expected errors while never leaking internal details for unexpected ones.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Invalid request data') {
    super(message, 400);
  }
}

export class UnauthorisedError extends AppError {
  constructor(message = 'Unauthorised') {
    super(message, 401);
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, 409);
  }
}
