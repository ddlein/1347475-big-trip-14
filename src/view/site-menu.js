import AbstractView from './abstract';
import {MenuItem} from '../const.js';

const createMenuTemplate = () => {
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
            <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" id="${MenuItem.TABLE}">${MenuItem.TABLE}</a>
            <a class="trip-tabs__btn" href="#" id="${MenuItem.STATS}">${MenuItem.STATS}</a>
          </nav>`;
};


export default class SiteMenu extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate();
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this.setMenuItem(evt.target.id);
    this._callback.menuClick(evt.target.id);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener('click', this._menuClickHandler);
  }

  setMenuItem(menuItem) {
    const items = this.getElement().querySelectorAll('.trip-tabs__btn');
    items.forEach((item) => item.classList.remove('trip-tabs__btn--active'));

    const item = this.getElement().querySelector(`[id=${menuItem}]`);

    if (item !== null) {
      item.classList.add('trip-tabs__btn--active');
    }
  }
}

