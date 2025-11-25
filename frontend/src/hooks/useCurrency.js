import { useState } from 'react';

const useCurrency = (initialRate = 3.8) => {
  const [rate, setRate] = useState(initialRate);

  const convertUsdToPen = (usd) => usd * rate;

  return { rate, setRate, convertUsdToPen };
};

export default useCurrency;
