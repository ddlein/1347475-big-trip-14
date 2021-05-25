import TripInfoView from '../view/trip-info';
import {render, RenderPosition, replace, remove} from '../utils/render.js';

export default class TripInfo {
  constructor(tripInfoContainer, waypointsModel) {
    this._tripInfoContainer = tripInfoContainer;
    this._waypointsModel = waypointsModel;

    this._points = null;
    this._tripInfoComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._waypointsModel.addObserver(this._handleModelEvent);
  }

  init() {
    const prevTripInfoComponent = this._tripInfoComponent;
    this._points = this._waypointsModel.get();
    if (this._points.length) {
      this._tripInfoComponent = new TripInfoView(this._points);

      if (prevTripInfoComponent === null) {
        render(this._tripInfoContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
        return;
      }

      replace(this._tripInfoComponent, prevTripInfoComponent);
      remove(prevTripInfoComponent);

    }
    if (!this._points.length) {
      remove(prevTripInfoComponent);
    }
  }

  _handleModelEvent() {
    this.init();
  }

}
