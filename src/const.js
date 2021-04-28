const TYPES = [
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

const CITIES = [
  'Venice',
  'Milan',
  'Roma',
  'Dubai',
  'Berlin',
];

const OFFERS = [
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

const DESCRIPTION = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Aliquam erat volutpat.',
  'In rutrum ac purus sit amet tempus.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
];

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers',
};

export {TYPES, CITIES, OFFERS, DESCRIPTION, SortType};
