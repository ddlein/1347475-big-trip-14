const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const generateFromArray = (array) => {
  return array[getRandomInteger(0, array.length - 1)];
};

const generateFromArraySlice = (array, from = 0) => {
  return array.slice(0, getRandomInteger(from, array.length));
};


const isEscEvent = (evt) => {
  return evt.key === 'Escape' || evt.key === 'Esc';
};

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

export {generateFromArray, generateFromArraySlice, isEscEvent, getRandomInteger, updateItem};
