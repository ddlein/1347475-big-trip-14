import dayjs from 'dayjs';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const generateType = () => {
  const types = [
    'taxi',
    'bus',
    'train',
    'ship',
    'transport',
    'drive',
    'flight',
    'check-in',
    'sightseeing',
    'restaurant',
  ];

  const randomIndex = getRandomInteger(0, types.length - 1);

  return types[randomIndex];
};

const generateCity = () => {
  const cities = [
    'Venice',
    'Milan',
    'Roma',
    'Dubai',
    'Berlin',
  ];

  const randomIndex = getRandomInteger(0, cities.length - 1);

  return cities[randomIndex];
};


const offers = [
  {
    'title': 'Upgrade to a business class',
    'price': 120,
  },
  {
    'title': 'Choose the radio station',
    'price': 60,
  },
  {
    'title': 'Wi-Fi',
    'price': 50,
  },
  {
    'title': 'Choose film',
    'price': 30,
  },
];

const generateOffers = () => {
  const randomIndex = getRandomInteger(1, offers.length);
  return offers.slice(0, randomIndex);


  // const x = [];
  // let isChecked;
  // generateNewOffers.forEach((element) => {
  //   if (getRandomInteger() === 1) {
  //     isChecked = 'checked';
  //   } else {isChecked = '';}
  //   x.push(`<div class="event__offer-selector">
  //         <input class="event__offer-checkbox  visually-hidden" id="event-offer-comfort-1" type="checkbox" name="event-offer-comfort" ${isChecked}>
  //         <label class="event__offer-label" for="event-offer-comfort-1">
  //           <span class="event__offer-title">${element.title}</span>
  //           &plus;&euro;&nbsp;
  //           <span class="event__offer-price">${element.price}</span>
  //         </label>
  //       </div>`);
  // });
  // return x;
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
  const descriptions = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Aliquam erat volutpat.',
    'In rutrum ac purus sit amet tempus.',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  ];

  const randomIndex = getRandomInteger(1, descriptions.length);

  return descriptions.slice(0, randomIndex);
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
  const daysGap = getRandomInteger(1, 100);
  return dayjs().add(daysGap, 'day');
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
    'dateFrom': getDate.format('D/MM/YY HH:mm'),
    'dateTo': getDate.add(getRandomInteger(1, 20), 'day').format('D/MM/YY HH:mm'),
    'offers': generateOffers(),
  };
};


export {generateRoute};
