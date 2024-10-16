const { body, validationResult } = require('express-validator');

exports.updateNotificationSettings = [
  body('senderId').notEmpty().withMessage('Sender ID is required'),
  body('serverKey').notEmpty().withMessage('Server key is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(403).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = exports;


