import React from 'react';

const PriceDisplay = ({ usd, rate = 3.8 }) => {
  const pen = usd * rate;
  return (
    <div>
      <span>${usd.toFixed(2)} USD</span>
      {' | '}
      <span>S/ {pen.toFixed(2)}</span>
    </div>
  );
};

export default PriceDisplay;
