// Format currency to VND
export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
};

export const newFormatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN').format(value);
};