import dayjs from 'dayjs';

const MINUTES_IN_HOURS = 60;

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getTime = (date) => {
  return dayjs(date).format('HH:mm');
};

const getDiffTime = (dateFrom, dateTo) => {
  let minutes = dateTo.diff(dateFrom, 'm');
  const hours = Math.floor(minutes / MINUTES_IN_HOURS);
  minutes = minutes - (hours * MINUTES_IN_HOURS);

  if (hours === 0) {
    return `${minutes}M`;
  }
  return `${hours}H ${minutes}M`;
};

const generateFromArray = (array) => {
  return array[getRandomInteger(0, array.length - 1)];
};

const generateFromArraySlice = (array) => {
  return array.slice(0, getRandomInteger(1, array.length));
};

const getDateForList = (dateTo) => {
  return dayjs(dateTo).format('MMM D');
};

const formatDateForEditPoint = (date) => {
  if (date !== null) {
    return dayjs(date).format('D/MM/YY HH:mm');
  } else {
    return '';
  }
};

const getTotalDate = (dateFrom, dateTo) => {
  return `${dateFrom.format('MMM D')} - ${dateTo.format('D')}`;
};


export {
  getRandomInteger,
  getTime,
  formatDateForEditPoint,
  getDiffTime,
  getDateForList,
  getTotalDate,
  generateFromArray,
  generateFromArraySlice
};
