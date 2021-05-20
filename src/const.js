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
  TIME: 'time',
  PRICE: 'price',
};

const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};

const UserActions = {
  UPDATE_WAYPOINT: 'UPDATE_WAYPOINT',
  ADD_WAYPOINT: 'ADD_WAYPOINT',
  DELETE_WAYPOINT: 'DELETE_WAYPOINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};
const FilterType = {
  EVERYTHING: 'EVERYTHING',
  FUTURE: 'FUTURE',
  PAST: 'PAST',
};

const MenuItem = {
  TABLE: 'Table',
  STATS: 'Stats',
};

const ButtonState = {
  SAVING: 'Saving...',
  DELETING: 'Deleting...',
};

const ButtonName = {
  CLOSE: 'Close',
  SAVE: 'Save',
  DELETE: 'Delete',
};

export { TYPES, CITIES, OFFERS, DESCRIPTION, SortType, UserActions, UpdateType, FilterType, MenuItem, State, ButtonState, ButtonName };
