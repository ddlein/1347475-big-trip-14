import AbstractView from './abstract';

const DISABLED_ATTRIBUTE = 'disabled';

const createNewPointButtonTemplate = () => {
  return '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button" >New event</button>';
};

export default class NewPointButton extends AbstractView {
  constructor() {
    super();
    this._active = false;
    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createNewPointButtonTemplate();
  }

  setClickHandler(callback) {
    this._callback._click = callback;
    this.getElement().addEventListener('click', this._clickHandler);
  }

  setDisabled() {
    this.getElement().setAttribute(DISABLED_ATTRIBUTE, true);
    this._active = true;
  }

  removeDisabled() {
    this.getElement().removeAttribute(DISABLED_ATTRIBUTE);
    this._active = false;
  }

  isActive() {
    return this._active;
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback._click(evt.target.value);
  }
}
