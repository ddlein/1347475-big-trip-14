import dayjs from 'dayjs';

const MINUTES_IN_HOURS = 60;

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

const getWeightForNullDate = (date1, date2) => {
  if (date1 === null && date2 === null) {
    return 0;
  }

  if (date1 === null) {
    return 1;
  }

  if (date2 === null) {
    return -1;
  }

  return null;
};

const sortByDay = (point1, point2) => {
  const weight = getWeightForNullDate(point1.dateFrom, point2.dateFrom);

  if (weight !== null) {
    return weight;
  }

  return dayjs(point1.dateFrom).diff(dayjs(point2.dateFrom));
};

const sortByPrice = (price1, price2) => {
  if (price1.basePrice < price2.basePrice) {
    return 1;
  }
  if (price1.basePrice > price2.basePrice) {
    return -1;
  }
  return 0;
};

const sortByTime = (point1, point2) => {
  if ((point1.dateTo - point1.dateFrom) < (point2.dateTo - point2.dateFrom)) {
    return 1;
  }

  if ((point1.dateTo - point1.dateFrom) > (point2.dateTo -point2.dateFrom)) {
    return -1;
  }
  return 0;
};

const sortByOffers = (point1, point2) => {
  if (point1.offers.length < point2.offers.length) {
    return 1;
  }

  if (point1.offers.length > point2.offers.length) {
    return -1;
  }
  return  0;
};

const sortByEvent = (point1, point2) => {
  if (point1.type > point2.type) {
    return 1;
  }

  if (point1.type < point2.type) {
    return -1;
  }
  return  0;
};


export {
  getTime, formatDateForEditPoint, getDiffTime, getDateForList, getTotalDate, sortByDay, sortByPrice, sortByTime, sortByOffers, sortByEvent
};
