export const validateEmail = (email) => {
  return /.+@.+\..+/.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};
