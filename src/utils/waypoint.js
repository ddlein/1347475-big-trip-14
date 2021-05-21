import dayjs from 'dayjs';

const MINUTES_IN_HOURS = 60;
const HOURS_IN_DAY = 24;

const getTime = (date) => {
  return dayjs(date).format('HH:mm');
};

const getDiffTime = (dateFrom, dateTo) => {
  let minutes = dayjs(dateTo).diff(dayjs(dateFrom), 'm');

  const hours = Math.floor(minutes / MINUTES_IN_HOURS);
  minutes = minutes - (hours * MINUTES_IN_HOURS);

  return hours === 0 ? `${minutes}M` : `${hours}H ${minutes}M`;
};

const getDiffTimeInMinutes = (dateFrom, dateTo) => {
  return dayjs(dateTo).diff(dayjs(dateFrom), 'm');
};

const getParsedDurationFromMinutes = (minutes) => {
  const hours = Math.floor(minutes / MINUTES_IN_HOURS);
  const days = Math.floor(hours / HOURS_IN_DAY);
  minutes = minutes - (hours * MINUTES_IN_HOURS);

  if (days === 0) {
    if (hours === 0) {
      return `${minutes}M`;
    }
    return `${hours}H ${minutes}M`;
  }
  return `${days}D ${hours}H ${minutes}M`;
};


const getDateForList = (dateTo) => {
  return dayjs(dateTo).format('MMM D');
};

const formatDateForEditPoint = (date) => {
  return date !== null ? dayjs(date).format('D/MM/YY HH:mm') : '';
};

const getTotalDate = (dateFrom, dateTo) => {
  return `${dayjs(dateFrom).format('MMM D')} - ${dayjs(dateTo).format('D')}`;
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
  const weight = getWeightForNullDate(dayjs(point1.dateFrom), dayjs(point2.dateFrom));

  return weight !== null ? weight : dayjs(point1.dateFrom).diff(dayjs(point2.dateFrom));
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
  if ((dayjs(point1.dateTo) - dayjs(point1.dateFrom)) < (dayjs(point2.dateTo) - dayjs(point2.dateFrom))) {
    return 1;
  }

  if ((dayjs(point1.dateTo) - dayjs(point1.dateFrom)) > (dayjs(point2.dateTo) - dayjs(point2.dateFrom))) {
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
  return 0;
};

const sortByEvent = (point1, point2) => {
  if (point1.type > point2.type) {
    return 1;
  }

  if (point1.type < point2.type) {
    return -1;
  }
  return 0;
};

const isDateFromMoreDateTo = (dateFrom, dateTo) => {
  return dayjs(dateFrom) > dayjs(dateTo);
};

const isFuture = (dateFrom, dateTo) => {
  return (dayjs(dateFrom) > dayjs() || (dayjs(dateFrom) < dayjs() && dayjs(dateTo) > dayjs()));
};

const isPast = (dateFrom, dateTo) => {
  return (dayjs(dateFrom) < dayjs() || (dayjs(dateFrom) < dayjs() && dayjs(dateTo) > dayjs()));
};

export {
  getTime,
  formatDateForEditPoint,
  getDiffTime,
  getDateForList,
  getTotalDate,
  sortByDay,
  sortByPrice,
  sortByTime,
  sortByOffers,
  sortByEvent,
  isDateFromMoreDateTo,
  isFuture,
  isPast,
  getDiffTimeInMinutes,
  getParsedDurationFromMinutes
};
