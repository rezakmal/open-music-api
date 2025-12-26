const InvariantError = require('../../exceptions/InvariantError');

const UploadsValidator = {
  validateImageHeaders: (headers) => {
    if (headers['content-type'].indexOf('image/') === -1) {
       throw new InvariantError('Invalid Content-Type');
    }
  },
};

module.exports = UploadsValidator;
