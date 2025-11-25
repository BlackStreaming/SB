export const formatCurrency = (value, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(value);
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-GB').format(new Date(date));
};
