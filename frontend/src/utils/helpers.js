export const formatCurrency = (amount, currency = 'ETB') => {
  return `${currency} ${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
};

export const calculateBill = (subtotal, settings = {}) => {
  const serviceChargePct = settings.serviceChargePercentage || 0;
  const vatPct = settings.vatPercentage || 0;
  const discount = 0;

  const serviceCharge = Math.round((subtotal * serviceChargePct) / 100 * 100) / 100;
  const taxableAmount = subtotal + serviceCharge - discount;
  const vat = Math.round((taxableAmount * vatPct) / 100 * 100) / 100;
  const total = Math.round((taxableAmount + vat) * 100) / 100;

  return { subtotal, serviceCharge, vat, discount, total };
};

export const getFoodName = (food, lang = 'en') => {
  if (lang === 'am' && food.nameAm) return food.nameAm;
  return food.name;
};

export const getCategoryName = (category, lang = 'en') => {
  if (lang === 'am' && category.nameAm) return category.nameAm;
  return category.name;
};

export const downloadQR = (qrCodeDataUrl, tableNumber) => {
  const link = document.createElement('a');
  link.download = `table-${tableNumber}-qr.png`;
  link.href = qrCodeDataUrl;
  link.click();
};
