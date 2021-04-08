import dayjs from 'dayjs';
import {TYPES, CITIES, OFFERS, DESCRIPTION} from '../const.js';
import {getRandomInteger, generateFromArray, generateFromArraySlice} from '../utils';

const generatePhoto = () => {
  const randomIndex = getRandomInteger(1, 5);
  const photos = [];
  for (let i = 1; i <= randomIndex; i++) {
    const photo = `http://picsum.photos/248/152?r=${getRandomInteger(1, 100)}`;
    photos.push(photo);
  }
  return photos;
};

const generateDate = () => {
  const daysGap = getRandomInteger(1, 10);
  const minutesGap = getRandomInteger(1, 300);
  return dayjs().add(daysGap, 'day').add(minutesGap, 'm');
};


const generateRoute = () => {
  const getDate = generateDate();
  const getType = generateFromArray(TYPES);

  return {
    'type': getType,
    'basePrice': getRandomInteger(1000, 10000),
    'destination': generateFromArray(CITIES),
    'isFavorite': Boolean(getRandomInteger()),
    'photo': generatePhoto(),
    'description': generateFromArraySlice(DESCRIPTION),
    'dateFrom': getDate,
    'dateTo': getDate.add(getRandomInteger(40, 200), 'm'),
    'offers': generateFromArraySlice(OFFERS),
  };
};


export {generateRoute};
