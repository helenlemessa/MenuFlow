import { useSettings } from '../contexts/SettingsContext';
import { formatCurrency, calculateBill } from '../utils/helpers';
import { useTranslation } from 'react-i18next';

const BillSummary = ({ subtotal, showDetails = true }) => {
  const { settings } = useSettings();
  const { t } = useTranslation();
  const bill = calculateBill(subtotal, settings);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">{t('cart.subtotal')}</span>
        <span>{formatCurrency(bill.subtotal, settings?.currency)}</span>
      </div>
      {showDetails && settings?.serviceChargePercentage > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">
            {t('cart.serviceCharge')} ({settings.serviceChargePercentage}%)
          </span>
          <span>{formatCurrency(bill.serviceCharge, settings?.currency)}</span>
        </div>
      )}
      {showDetails && settings?.vatPercentage > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">
            {t('cart.vat')} ({settings.vatPercentage}%)
          </span>
          <span>{formatCurrency(bill.vat, settings?.currency)}</span>
        </div>
      )}
      {bill.discount > 0 && (
        <div className="flex justify-between text-sm text-green-600">
          <span>{t('cart.discount')}</span>
          <span>-{formatCurrency(bill.discount, settings?.currency)}</span>
        </div>
      )}
      <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
        <span>{t('cart.total')}</span>
        <span className="text-primary-600">{formatCurrency(bill.total, settings?.currency)}</span>
      </div>
    </div>
  );
};

export default BillSummary;
