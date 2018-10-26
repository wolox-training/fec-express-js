const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);

exports.ALBUM_ALREADY_PURCHASED = 'album_already_purchased';
exports.albumAlreadyPurchased = internalError(
  'The album was already purchased.',
  exports.ALBUM_ALREADY_PURCHASED
);

exports.ALBUM_NOT_PURCHASED = 'album_not_purchased';
exports.albumNotPurchased = internalError('The album has not been purchased.', exports.ALBUM_NOT_PURCHASED);

exports.USER_NOT_FOUND = 'user_not_found_in_db';
exports.userNotFound = id => internalError(`The user ${id} was not found`, exports.USER_NOT_FOUND);

exports.DATABASE_ERROR = 'database_error';
exports.dbError = error =>
  internalError(error.errors ? error.errors[0].message : 'Database Error', exports.DATABASE_ERROR);

exports.USER_UNAUTHORIZED = 'user_unauthorized';
exports.userUnauthorized = internalError('The album was already purchased.', exports.USER_UNAUTHORIZED);

exports.INVALID_INPUT = 'input_invalid';
exports.invalidInput = internalError('Input invalid.', exports.INVALID_INPUT);

exports.NEEDS_ADMIN = 'needs_admin';
exports.needsAdmin = internalError('User is not admin.', exports.NEEDS_ADMIN);
