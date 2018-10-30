const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);

// exports.userNotFound = {
//   message: 'The user was not found.',
//   internalCode: 'user_not_found'
// };

exports.USER_NOT_FOUND = 'user_not_found_in_db';
exports.userNotFound = id => internalError(`The user ${id} was not found`, exports.USER_NOT_FOUND);
