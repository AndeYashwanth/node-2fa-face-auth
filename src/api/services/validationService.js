export default (Joi, PasswordComplexity) => ({
  /**
     * @param {JSON} user
     */
  registerValidation: (user) => {
    const passwordComplexityOptions = {
      min: 8,
      max: 250,
      lowerCase: 1,
      upperCase: 1,
      numeric: 1,
      symbol: 1,
      requirementCount: 2,
    };
    const registerSchema = Joi.object({
      username: Joi.string().min(1).max(50).required(),
      email: Joi.string().max(255).email().required(),
      password: PasswordComplexity(passwordComplexityOptions).required(),
      confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
      faceOpt: Joi.boolean(), // but it's still a string, not boolean
      // imageBase64: Joi.when('faceOpt', {
      //   is: Joi.boolean().required().valid(true), // If faceOpt is present
      //   then: Joi.string().required(),
      //   otherwise: Joi.optional(),
      // }).error((errors) => {
      //   errors[0].message = 'Face image not provided';
      //   return errors;
      // })
    });

    const { error } = registerSchema.validate(user);
    if (error) {
      // status 422 the data is understood, but is still not valid
      const err = new Error(error.details[0].message);
      err.status = 422;
      throw err;
    }
    return true;
  },
  /**
     * @param {JSON} user
     */
  loginValidation: (user) => {
    const loginSchema = Joi.object({
      email: Joi.string().max(255).email().required(),
      password: Joi.string().required(),
      remember: Joi.boolean().strict().required(),
    });

    const { error } = loginSchema.validate(user);
    if (error) {
      const err = new Error(error.details[0].message);
      err.status = 422;
      throw err;
    }
    return true;
  },
});
