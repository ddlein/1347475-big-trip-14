import { formatDateForEditPoint } from '../utils/waypoint.js';
import SmartView from './smart';
import flatpickr from 'flatpickr';
import dayjs from 'dayjs';
import he from 'he';
import { ButtonState, ButtonName } from '../const.js';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';
import { newPointButtonComponent } from '../main.js';


const BLANK_WAYPOINT = {
  type: 'bus',
  basePrice: '',
  destination: null,
  description: '',
  dateFrom: dayjs(),
  dateTo: dayjs(),
  offers: [],
  isFavorite: false,
};

const createOffer = (offer, price, isOfferChecked) => {

  return `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="${offer}" type="checkbox" name="event-offer-luggage" ${isOfferChecked ? 'checked' : ''}>
          <label class="event__offer-label" for="${offer}>
            <span class="event__offer-title" id="${offer}">${offer}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price" id="${offer}">${price}</span>
          </label>
        </div>`;
};

const isAvailableOffer = (defaultOffers, type, offers) => {
  let offerTags = [];
  const offersChanged = defaultOffers.filter(
    (offer) => {
      return offer.type === type;
    },
  );
  for (let i = 0; i < offersChanged.length; i++) {
    offerTags = offersChanged[i].offers.map(({ title, price }) => createOffer(title, price, offers !== undefined ? offers.some((offer) => offer.title === title) : false));
  }
  if (offerTags.length !== 0) {
    return offerTags.join('');
  } else {
    return '';
  }
};


const isPhotoAvailable = (destination, citiesPhotosDescription) => {
  let destinationPhotos = [];

  if (citiesPhotosDescription !== null && destination !== undefined && destination !== null) {
    const destinationChanged = citiesPhotosDescription.filter(
      (cityPhotoDescription) => {
        return cityPhotoDescription.name === destination.name;
      },
    );

    for (let i = 0; i < destinationChanged.length; i++) {
      destinationPhotos = destinationChanged[i].pictures.map(({ src }) => `<img class="event__photo" src="${src}" alt="Event photo">`);
    }
    if (destinationPhotos.length !== 0) {

      return `<div class="event__photos-container">
                <div class="event__photos-tape">
                  ${destinationPhotos.join('')}
                </div>`;
    }
  } else {
    return '';
  }
};

const isDescriptionAvailable = (city, citiesPhotosDescription) => {
  let resultDescription = '';

  if (city !== null && city != undefined && citiesPhotosDescription !== null) {

    const destinationChanged = citiesPhotosDescription.filter(
      (destination) => {
        return destination.name === city.name;
      },
    );

    destinationChanged.forEach((destination) => {
      resultDescription = `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destination.description}</p></p>
    </section>`;
    });

    return resultDescription;
  } else {
    return '';
  }
};


const createTypes = (defaultOffers) => {
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

const createOptionCity = (defaultCities) => {
  const cities = [];
  if (defaultCities !== null) {
    for (let i = 0; i < defaultCities.length; i++) {
      cities.push(`<option value="${defaultCities[i].name}"></option>`);
    }
    return `<datalist id="destination-list-1">${cities.join('')}</datalist>`;
  }
};


const createEditFormTemplate = (data) => {
  const {
    type,
    basePrice,
    destination,
    dateFrom,
    dateTo,
    offers,
    defaultOffers,
    defaultCitiesWithPhotoAndDescription,
    isSaving,
    isDeleting,
  } = data;

  const createdOffers = isAvailableOffer(defaultOffers, type, offers);

  return `<li class="trip-events__item">
<form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
        ${createTypes(defaultOffers)}

      </div>
      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination ? destination.name : ''}" list="destination-list-1" required>
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
        <input class="event__input  event__input--price" id="event-price-1" type="number" min="0" name="event-price" value="${he.encode(basePrice.toString())}" required>
      </div>
      <button class="event__save-btn  btn  btn--blue" type="submit" ${isDeleting ? ButtonState.DISABLED : ''}>
      ${isSaving ? ButtonState.SAVING : ButtonName.SAVE}</button>
      <button class="event__reset-btn" type="reset" ${isSaving ? ButtonState.DISABLED : ''}>
      ${!newPointButtonComponent.isActive() ? (isDeleting ? ButtonState.DELETING : ButtonName.DELETE) : ButtonName.CLOSE}</button>
      ${!newPointButtonComponent.isActive() ? '<button class="event__rollup-btn event__rollup-btn--close" type="button">' : ''}
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
    ${createdOffers ? `<section class="event__section  event__section--offers"><h3 class="event__section-title  event__section-title--offers">Offers</h3><div class="event__available-offers">${createdOffers}</div></section>` : ''}

        ${isDescriptionAvailable(destination, defaultCitiesWithPhotoAndDescription)}
        ${isPhotoAvailable(destination, defaultCitiesWithPhotoAndDescription)}
    </section>
  </form></li>`;
};

export default class WaypointEdit extends SmartView {
  constructor(offers, photos, point = BLANK_WAYPOINT) {
    super();
    this._data = null;
    this._data = WaypointEdit.parseWaypointToData(point, offers, photos);
    this._datepickerFrom = null;
    this._datepickerTo = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formCancelHandler = this._formCancelHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._offersClickHandler = this._offersClickHandler.bind(this);
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

    if (this.getElement().querySelector('.event__available-offers') != null) {
      this.getElement()
        .querySelector('.event__available-offers')
        .addEventListener('click', this._offersClickHandler);
    }
  }


  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setFormCancelClickHandler(this._callback.formCancel);
    this._setDatepickerFrom();
    this._setDatepickerTo();
    this.setDeleteClickHandler(this._callback.formDelete);
  }

  _setDatepickerFrom() {
    return this._setDatepicker(this._datepickerFrom, '#event-start-time-1', this._data.dateFrom, this._dateFromChangeHandler);
  }

  _setDatepickerTo() {
    return this._setDatepicker(this._datepickerTo, '#event-end-time-1', this._data.dateTo, this._dateToChangeHandler);
  }

  _setDatepicker(datepicker, inputId, date, dateChangeHandler) {
    if (datepicker) {
      datepicker.destroy();
      datepicker = null;
    }

    datepicker = flatpickr(
      this.getElement().querySelector(inputId),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: formatDateForEditPoint(date),
        onChange: dateChangeHandler,
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
      offers: [],
    });
  }

  _destinationPointToggleHandler(evt) {
    evt.preventDefault();
    const destinationByCityName = this._data.defaultCitiesWithPhotoAndDescription.filter(
      (cityDescription) => {
        return cityDescription.name === evt.target.value;
      },
    )[0];
    this.updateData({
      destination: destinationByCityName,
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
    newPointButtonComponent.removeDisabled();
    this._callback.formSubmit(WaypointEdit.parseDataToWaypoint(this._data));
  }

  _formCancelHandler(evt) {
    evt.preventDefault();
    this._callback.formCancel(WaypointEdit.parseDataToWaypoint(this._data));
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    newPointButtonComponent.removeDisabled();
    this._callback.formDelete(WaypointEdit.parseDataToWaypoint(this._data));
  }

  _offersClickHandler(evt) {
    evt.preventDefault();
    const offersByType = this._data.defaultOffers.filter(
      (offer) => {
        return offer.type === this._data.type;
      },
    )[0].offers;
    const changedOffers = this._data.offers.slice();
    const offerInPointOffers = changedOffers.find((offer) => offer.title === evt.target.id);
    const indexOfferFromPointOffer = changedOffers.indexOf(offerInPointOffers);
    if (indexOfferFromPointOffer !== -1) {
      changedOffers.splice(indexOfferFromPointOffer, 1);
    }
    else {
      const optionChecked = offersByType.find((offer) => offer.title === evt.target.id);
      if (optionChecked) {
        changedOffers.push(optionChecked);
      }
    }
    this.updateData({
      offers: changedOffers,
    });
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._formSubmitHandler);
  }


  setFormCancelClickHandler(callback) {
    this._callback.formCancel = callback;
    if (this.getElement().querySelector('.event__rollup-btn') != null) {
      this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._formCancelHandler);
    }
  }

  setDeleteClickHandler(callback) {
    this._callback.formDelete = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._formDeleteClickHandler);
  }

  static parseWaypointToData(point, defaultOffers, defaultPhotos) {
    return Object.assign(
      {},
      point,
      {
        defaultOffers: defaultOffers,
        defaultCitiesWithPhotoAndDescription: defaultPhotos,
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      },
    );
  }

  static parseDataToWaypoint(data) {
    data = Object.assign({}, data);

    delete data.defaultOffers;
    delete data.defaultCitiesWithPhotoAndDescription;
    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;
    return data;
  }

}

