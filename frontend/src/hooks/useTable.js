import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

export const useTable = () => {
  const [searchParams] = useSearchParams();
  const { tableNumber, setTableNumber } = useCart();

  useEffect(() => {
    const table = searchParams.get('table');
    if (table) setTableNumber(table);
  }, [searchParams, setTableNumber]);

  return tableNumber;
};
