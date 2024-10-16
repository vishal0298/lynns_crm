export const ErrorFocus = (errors, setFocus) => {
  const firstError = Object.keys(errors).reduce((field, a) => {
    return !errors[field] ? field : a;
  }, null);

  if (firstError) {
    setFocus(firstError);
  }
};
