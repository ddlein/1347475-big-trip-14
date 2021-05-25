
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

const ToastMessages = {
  NEW_POINT: 'You can\'t create new point offline',
  EDIT_POINT: 'You can\'t edit point offline',
  DELETE_POINT: 'You can\'t delete point offline',
  SAVE_POINT: 'You can\'t save task offline',
};

export {
  SortType,
  UserActions,
  UpdateType,
  FilterType,
  MenuItem,
  State,
  ButtonState,
  ButtonName,
  ToastMessages
};
