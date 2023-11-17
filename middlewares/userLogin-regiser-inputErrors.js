//not Found
const { body } = require('express-validator')

const validateRegister = [
    body('firstname')
      .notEmpty()
      .withMessage('First name cannot be empty'),
      
    body('lastname')
      .notEmpty()
      .withMessage('Last name cannot be empty'),

    body('mobile')
      .notEmpty()
      .withMessage('Mobile number cannot be empty')
      .matches(/^[0-9]{10}$/)
      .withMessage('Invalid mobile number format. It should be a 10-digit number without spaces or dashes'),
    
  ];

  const emailvalidate = [
    body('email')
      .notEmpty()
      .withMessage('Email cannot be empty')
      .isEmail()
      .withMessage('Invalid email format'),
  ]


  const passWordValidate = [
    body('password')
      .notEmpty()
      .withMessage('Password cannot be empty')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'),
  ]

  const titleValidate = [
    body('title')
       .notEmpty()
       .withMessage('Title can not be empty')
  ]

  const starValidate  = [
    body('star')
    .notEmpty()
    .withMessage('Star can not be empty')
    .isFloat({ gt: 0 })
    .withMessage('Invalid number. Must be a positive number.')
    .custom((value) => {
      if (value > 5) {
        throw new Error('Invalid number. Must be within 1 to 5.');
      }
      return true;
    }),
  ]

  const couponValidate = [
    body('couponname') 
      .notEmpty()
      .withMessage('Coupon name can not be empty'),

    body('expirytime')
      .notEmpty()
      .withMessage('Expiry time can not be empty')
      .isISO8601().withMessage('Invalid date and time format'),

    body('discount')
      .notEmpty()
      .withMessage('Number is required')
      .isNumeric()
      .withMessage('Must be a number')
      .custom((value) => {
        if (value <= 0) {
          throw new Error('Must be a positive number');
        }
        return true;
      }),
  ]
  const validateOtp = [
    body('registerotp')
    .notEmpty()
    .withMessage('OTP can not be empty')
    .isLength({ min: 6, max: 6 }).isInt().withMessage('OTP must be 6 digist') 
  ]
  
  const checkBooleanMiddleware = [
    body('COD')
      .isBoolean(),
    body('couponApplied')
      .isBoolean()
  ]
  
  

  
  
  

  module.exports = { validateRegister , emailvalidate , passWordValidate, titleValidate,starValidate,couponValidate, validateOtp,checkBooleanMiddleware}

