import dayjs from 'dayjs';
import {TYPES, CITIES, OFFERS, DESCRIPTION} from '../const.js';
import {getRandomInteger} from '../utils';


const generateType = () => {
  return TYPES[getRandomInteger(0, TYPES.length - 1)];
};

const generateCity = () => {
  return CITIES[getRandomInteger(0, CITIES.length - 1)];
};


const generateOffers = () => {
  return OFFERS.slice(0, getRandomInteger(1, OFFERS.length));
};

// const generateOffer = () => {
//   const listOffers = [{
//     'type': 'taxi',
//     'offers': [
//       {
//         'title': 'Upgrade to a business class',
//         'price': 120,
//       },
//       {
//         'title': 'Choose the radio station',
//         'price': 60,
//       }],
//   },
//   {
//     'type': 'bus',
//     'offers': [
//       {
//         'title': 'Wi-Fi',
//         'price': 50,
//       },
//       {
//         'title': 'Choose film',
//         'price': 30,
//       },
//     ],
//   },
//   {
//     'type': 'train',
//     'offers': [
//       {
//         'title': 'Wi-Fi',
//         'price': 60,
//       },
//       {
//         'title': 'Choose film',
//         'price': 40,
//       },
//     ],
//   },
//   {
//     'type': 'ship',
//     'offers': [
//       {
//         'title': 'Wi-Fi',
//         'price': 50,
//       },
//     ],
//   },
//   {
//     'type': 'drive',
//     'offers': [
//       {
//         'title': 'Choose cabrio-vehicle',
//         'price': 300,
//       },
//       {
//         'title': 'Choose sportcar',
//         'price': 500,
//       },
//     ],
//   },
//   {
//     'type': 'flight',
//     'offers': [
//       {
//         'title': 'Add luggage',
//         'price': 30,
//       },
//       {
//         'title': 'Switch to comfort class',
//         'price': 100,
//       },
//       {
//         'title': 'Add meal',
//         'price': 15,
//       },
//       {
//         'title': 'Choose seats',
//         'price': 5,
//       },
//       {
//         'title': 'Travel by train',
//         'price': 40,
//       },
//     ],
//   },
//   {
//     'type': 'check-in',
//     'offers': [
//       {
//         'title': 'Upgrade to business-room',
//         'price': 200,
//       },
//     ],
//   }, {
//     'type': 'sightseeing',
//     'offers': [],
//   },
//   {
//     'type': 'restaurant',
//     'offers': [
//       {
//         'title': 'Meal by chef',
//         'price': 100,
//       },
//     ],
//   }];
//
// };

const generateDescription = () => {
  return DESCRIPTION.slice(0, getRandomInteger(1, DESCRIPTION.length));
};

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
  const getType = generateType();

  return {
    'type': getType,
    'basePrice': getRandomInteger(1000, 10000),
    'destination': generateCity(),
    'isFavorite': Boolean(getRandomInteger()),
    'photo': generatePhoto(),
    'description': generateDescription(),
    'dateFrom': getDate,
    'dateTo': getDate.add(getRandomInteger(40, 200), 'm'),
    'offers': generateOffers(),
  };
};


export {generateRoute};
