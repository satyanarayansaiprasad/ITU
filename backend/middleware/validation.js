const { body, validationResult } = require('express-validator');

/**
 * Handle validation errors
 */
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

/**
 * Login validation rules - Simplified to not block valid logins
 */
exports.validateLogin = [
  body('email')
    .optional({ checkFalsy: true })
    .trim()
    .normalizeEmail(),
  body('playerId')
    .optional({ checkFalsy: true })
    .trim(),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required'),
  // Custom validation: at least email or playerId must be present
  body().custom((value) => {
    if (!value.email && !value.playerId) {
      throw new Error('Either email or playerId is required');
    }
    return true;
  }),
  exports.handleValidationErrors
];

/**
 * Sanitize input to prevent XSS
 */
exports.sanitizeInput = (req, res, next) => {
  const sanitize = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key].trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitize(obj[key]);
      }
    }
  };

  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  if (req.params) sanitize(req.params);

  next();
};

