var passwordValidator = require("password-validator");

// Create a schema
var schema = new passwordValidator();

// Add properties to it
// prettier-ignore
schema
  .is().min(8)
  .is().max(100)
  .has().uppercase()
  .has().lowercase()
  .has().digits(1)
  .has().not().spaces();
//.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

// Get a full list of rules which failed
//console.log(schema.validate('joke', { list: true }));
// => [ 'min', 'uppercase', 'digits' ]

module.exports = (password) => {
  if (!password) return false;
  if (!schema.validate(password)) return false;
  return true;
};
