import dayjs from 'dayjs';
import {TYPES, CITIES, OFFERS, DESCRIPTION} from '../const.js';
import {getRandomInteger, generateFromArray, generateFromArraySlice} from '../utils/common.js';


const generatePhoto = () => {
  const randomIndex = getRandomInteger(1, 5);

  const photos = [];

  for (let i = 1; i <= randomIndex; i++) {
    const photoWithDescription = {
      src: `http://picsum.photos/248/152?r=${getRandomInteger(1, 100)}`,
      description: 'sdsdsddssdsds',
    };
    photos.push(photoWithDescription);
  }
  return photos;
};

const generateDate = () => {
  const daysGap = getRandomInteger(-5, 5);
  const minutesGap = getRandomInteger(1, 300);
  return dayjs().add(daysGap, 'day').add(minutesGap, 'm');
};


const generateRoute = () => {
  const getDate = generateDate();
  const getType = generateFromArray(TYPES);

  return {
    type: getType,
    basePrice: getRandomInteger(1000, 10000),
    destination: generateFromArray(CITIES),
    isFavorite: Boolean(getRandomInteger()),
    photo: generatePhoto(),
    description: generateFromArraySlice(DESCRIPTION, 1),
    dateFrom: getDate,
    dateTo: getDate.add(getRandomInteger(40, 200), 'm'),
    offers: generateFromArraySlice(OFFERS),
  };
};

const generateOffers = () => {
  const typesAndOffers = [];

  for (let i = 0; i < TYPES.length; i++) {
    const typeAndOffers = {
      type: TYPES[i],
      offers: generateFromArraySlice(OFFERS),
    };
    typesAndOffers.push(typeAndOffers);
  }
  return typesAndOffers;
};

const generatePhotoAndDescription = () => {
  const arrayOfDestination = [];

  for (let i = 0; i < CITIES.length; i++) {
    const objectOfDestination = {
      name: CITIES[i],
      description: generateFromArraySlice(DESCRIPTION, 1),
      picture: generatePhoto(),
    };
    arrayOfDestination.push(objectOfDestination);
  }
  return arrayOfDestination;
};


export {generateRoute, generateOffers, generatePhotoAndDescription};
