import {formatDateForEditPoint, isDateFromMoreDateTo} from '../utils/waypoint.js';
import SmartView from './smart';
import flatpickr from 'flatpickr';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';


const BLANK_WAYPOINT = {
  type: '',
  basePrice: '',
  destination: '',
  description: '',
  dateFrom: '',
  dateTo: '',
  offers: [],
};

const createOffer = (offer, price) => {
  return `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="${offer}" type="checkbox" name="event-offer-luggage" checked>
          <label class="event__offer-label" for="${offer}">
            <span class="event__offer-title">${offer}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${price}</span>
          </label>
        </div>`;
};

const isAvailableOffer = (offers, type) => {
  let offerTag = [];

  const offersChanged = offers.filter(
    (offer) => {
      return offer.type === type;
    },
  );
  for (let i = 0; i < offersChanged.length; i++) {
    offerTag = offersChanged[i].offers.map(({title, price}) => createOffer(title, price));
  }
  if (offerTag.length !== 0) {
    return `<section class="event__section  event__section--offers"><h3 class="event__section-title  event__section-title--offers">Offers</h3><div class="event__available-offers">${offerTag.join('')}</div></section>`;
  } else {
    return '';
  }
};


const isPhotoAvailable = (destination, citiesPhotosDescription) => {
  let resultPhotos = [];

  if (destination !== '') {
    const destinationChanged = citiesPhotosDescription.filter(
      (cityPhotoDescription) => {
        return cityPhotoDescription.name === destination;
      },
    );

    for (let i = 0; i < destinationChanged.length; i++) {
      resultPhotos = destinationChanged[i].picture.map(({src}) => `<img class="event__photo" src="${src}" alt="Event photo">`);
    }
    if (resultPhotos.length !== 0) {

      return `<div class="event__photos-container">
                      <div class="event__photos-tape">
                        ${resultPhotos.join('')}
                      </div>`;
    }
  } else {
    return '';
  }
};

const isDescriptionAvailable = (city, citiesPhotosDescription) => {
  let resultDescription = '';

  if (city !== '') {

    const destinationChanged = citiesPhotosDescription.filter(
      (destination) => {
        return destination.name === city;
      },
    );

    destinationChanged.forEach((destination) => {
      resultDescription = `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destination.description.join('')}</p></p>
    </section>`;
    });

    return resultDescription;
  } else {
    return '';
  }
};


const createType = (defaultOffers) => {
  const types = [];


  for (let i = 0; i < defaultOffers.length; i++) {
    types.push(`<div class="event__type-item">
             <input id="event-type-${defaultOffers[i].type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${defaultOffers[i].type}">
            <label class="event__type-label  event__type-label--${defaultOffers[i].type}" for="event-type-${defaultOffers[i].type}-1">${defaultOffers[i].type.charAt(0).toUpperCase() + defaultOffers[i].type.slice(1)}</label>
             </div>`);
  }

  return `
    <div class="event__type-list">
    <fieldset class="event__type-group">
        <legend class="visually-hidden">Event type</legend>

        <div class="event__type-item">
        ${types.join('')}
        </div>
    </fieldset>
    </div>`;
};

const createOptionCity = (city) => {
  const cities = [];

  for (let i = 0; i < city.length; i++) {
    cities.push(`<option value="${city[i].name}"></option>`);
  }
  return `<datalist id="destination-list-1">${cities.join('')}</datalist>`;
};


const createEditFormTemplate = (data) => {
  const {
    type,
    basePrice,
    destination,
    dateFrom,
    dateTo,
    defaultOffers,
    defaultCitiesWithPhotoAndDescription,
  } = data;

  return `<li class="trip-events__item">
<form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
        ${createType(defaultOffers)}

      </div>
      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1">
        ${createOptionCity(defaultCitiesWithPhotoAndDescription)}
      </div>
      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatDateForEditPoint(dateFrom)}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatDateForEditPoint(dateTo)}">
      </div>
      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
      </div>
      <button class="event__save-btn  btn  btn--blue" type="submit" ${isDateFromMoreDateTo(dateFrom, dateTo) ? 'disabled' : ''} >Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
        ${isAvailableOffer(defaultOffers, type)}
        ${isDescriptionAvailable(destination, defaultCitiesWithPhotoAndDescription)}
        ${isPhotoAvailable(destination, defaultCitiesWithPhotoAndDescription)}
    </section>
  </form></li>`;
};

export default class WaypointEdit extends SmartView {
  constructor(point = BLANK_WAYPOINT, offers, photos) {
    super();
    this._data = WaypointEdit.parseWaypointToData(point, offers, photos);
    this._datepickerFrom = null;
    this._datepickerTo = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formCancelHandler = this._formCancelHandler.bind(this);
    this._typePointToggleHandler = this._typePointToggleHandler.bind(this);
    this._destinationPointToggleHandler = this._destinationPointToggleHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);
    this._dateFromChangeHandler = this._dateFromChangeHandler.bind(this);
    this._dateToChangeHandler = this._dateToChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setDatepickerFrom();
    this._setDatepickerTo();
  }

  reset(point, defaultOffers, defaultPhotos) {
    this.updateData(
      WaypointEdit.parseWaypointToData(point, defaultOffers, defaultPhotos),
    );
  }

  getTemplate() {
    return createEditFormTemplate(this._data);
  }


  _setInnerHandlers() {
    this.getElement()
      .querySelector('.event__type-item')
      .addEventListener('change', this._typePointToggleHandler);

    this.getElement()
      .querySelector('.event__input--destination')
      .addEventListener('change', this._destinationPointToggleHandler);

    this.getElement()
      .querySelector('.event__input--price')
      .addEventListener('input', this._priceInputHandler);
  }


  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setFormClickHandler(this._callback.formCancel);
    this._setDatepickerFrom();
    this._setDatepickerTo();
  }

  _setDatepickerFrom() {
    if (this._datepickerFrom) {
      this._datepickerFrom.destroy();
      this._datepickerFrom = null;
    }

    this._datepickerFrom = flatpickr (
      this.getElement().querySelector('#event-start-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: formatDateForEditPoint(this._data.dateFrom),
        onChange: this._dateFromChangeHandler,
        enableTime: true,
      },
    );
  }

  _setDatepickerTo() {
    if (this._datepickerTo) {
      this._datepickerTo.destroy();
      this._datepickerTo = null;
    }

    this._datepickerTo = flatpickr (
      this.getElement().querySelector('#event-end-time-1'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: formatDateForEditPoint(this._data.dateTo),
        onChange: this._dateToChangeHandler,
        enableTime: true,
      },
    );
  }

  _dateFromChangeHandler([userDate]) {
    this.updateData({
      dateFrom: userDate,
    });

  }

  _dateToChangeHandler([userDate]) {
    this.updateData({
      dateTo: userDate,
    });
  }

  _typePointToggleHandler(evt) {
    evt.preventDefault();
    this.updateData({
      type: evt.target.value,
    });
  }

  _destinationPointToggleHandler(evt) {
    evt.preventDefault();
    this.updateData({
      destination: evt.target.value,
    });
  }

  _priceInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      basePrice: evt.target.value,
    }, true);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(WaypointEdit.parseDataToWaypoint(this._data));
  }

  _formCancelHandler(evt) {
    evt.preventDefault();
    this._callback.formCancel(WaypointEdit.parseDataToWaypoint(this._data));
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._formSubmitHandler);
  }

  setFormClickHandler(callback) {
    this._callback.formCancel = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._formCancelHandler);
  }

  static parseWaypointToData(point, defaultOffers, defaultPhotos) {
    return Object.assign(
      {},
      point,
      {
        defaultOffers: defaultOffers,
        defaultCitiesWithPhotoAndDescription: defaultPhotos,

      },
    );
  }

  static parseDataToWaypoint(data) {
    data = Object.assign({}, data);

    delete data.defaultOffers;
    delete data.defaultCitiesWithPhotoAndDescription;

    return data;
  }

}

