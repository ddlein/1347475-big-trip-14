import Observer from '../utils/observer.js';
import {FilterType} from '../const.js';

export default class Filter extends Observer {
  constructor() {
    super();
    this._activeFilter = FilterType.EVERYTHING;
  }

  setCurrent(updateType, filter) {
    this._activeFilter = filter;
    this._notify(updateType, filter);
  }

  getCurrent() {
    return this._activeFilter;
  }
}
