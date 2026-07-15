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

export const paginate = (query, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return query.skip(skip).limit(limit);
};
