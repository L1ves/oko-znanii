import dayjs from 'dayjs';
import 'dayjs/locale/ru';

dayjs.locale('ru');

/**
 * Форматирует дату в локализованный формат
 */
export const formatDate = (date: string): string => {
  return dayjs(date).format('DD MMMM YYYY');
};

/**
 * Форматирует число как денежную сумму
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Форматирует число как процент
 */
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
}; 