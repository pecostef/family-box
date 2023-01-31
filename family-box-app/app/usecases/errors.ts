export function unauthenticatedError() {
  return new Error('unauthenticated');
}

export function serverError() {
  return new Error('server');
}

export function domainValidationError() {
  return new Error('domainValidation');
}
