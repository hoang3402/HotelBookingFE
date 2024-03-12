function FormattedPrice(price: any, currency: any) {
  return (price / 1).toLocaleString('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export default FormattedPrice