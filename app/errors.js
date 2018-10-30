const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);

exports.albumAlreadyPurchased = {
  message: 'The album was already purchased.',
  internalCode: 'album_already_purchased'
};

exports.USER_NOT_FOUND = 'user_not_found_in_db';
exports.userNotFound = id => internalError(`The user ${id} was not found`, exports.USER_NOT_FOUND);

exports.ALBUM_NOT_FOUND = 'album_not_found';
exports.albumNotFound = id => internalError(`The album ${id} was not found`, exports.ALBUM_NOT_FOUND);
