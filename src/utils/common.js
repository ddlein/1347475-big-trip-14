
const isEscEvent = (evt) => {
  return evt.key === 'Escape' || evt.key === 'Esc';
};

const isOnline = () => {
  return window.navigator.onLine;
};


export {isEscEvent, isOnline};
