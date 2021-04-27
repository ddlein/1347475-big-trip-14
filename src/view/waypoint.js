import {getTime, getDiffTime, getDateForList} from '../utils/waypoint.js';
import AbstractView from './abstract';


const createOfferForList = (offer, price) => {
  return `<li class="event__offer">
          <span class="event__offer-title">${offer}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${price}</span>
        </li>`;
};


const createWaypointsTemplate = (route) => {

  const {type, basePrice, destination, isFavorite, dateFrom, dateTo, offers} = route;

  const offerList = [];

  const isFavoriteF = () => {
    if (isFavorite) {
      return 'event__favorite-btn--active';
    }
  };


  for (let i = 0; i < offers.length; i++) {
    offerList.push(createOfferForList(offers[i].title, offers[i].price));
  }

  const timeFrom = getTime(dateFrom);
  const timeTo = getTime(dateTo);
  const dateFromForList = getDateForList(dateFrom);
  const diffTime = getDiffTime(dateFrom, dateTo);

  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="2019-03-18">${dateFromForList}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${destination}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="2019-03-18T12:25">${timeFrom}</time>
          &mdash;
          <time class="event__end-time" datetime="2019-03-18T13:35">${timeTo}</time>
        </p>
        <p class="event__duration">${diffTime}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
      ${offerList.join('')}
      </ul>
      <button class="event__favorite-btn ${isFavoriteF()}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};

export default class Waypoint extends AbstractView {
  constructor(route) {
    super();
    this._route = route;

    this._rollupClickHandler = this._rollupClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createWaypointsTemplate(this._route);
  }

  _rollupClickHandler(evt) {
    evt.preventDefault();
    this._callback.rollupClick();
  }

  setRollupClickHandler(callback) {
    this._callback.rollupClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._rollupClickHandler);
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.event__favorite-btn').addEventListener('click', this._favoriteClickHandler);
  }
}


