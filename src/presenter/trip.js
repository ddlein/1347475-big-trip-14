import WaypointListView from '../view/waypoint-list';
import NoWaypointView from '../view/no-waypoint';
import {render, RenderPosition} from '../utils/render';
import SortView from '../view/sort';
import Point from './point';
import {updateItem} from '../utils/common';


export default class Trip {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;
    this._pointPresenter = {};

    this._tripListComponent = new WaypointListView();
    this._noTripComponent = new NoWaypointView();
    this._sortComponent = new SortView();

    this._handleWaypointChange = this._handleWaypointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(tripWaypoints) {
    this._tripWaypoints = tripWaypoints.slice();
    render(this._tripContainer, this._tripListComponent); //UL
    this._renderWaypoints();
  }

  _handleModeChange() {
    Object.values(this._pointPresenter).forEach((presenter) => presenter.resetView());
  }

  _handleWaypointChange(updatedWaypoint) {
    this._tripWaypoints = updateItem(this._tripWaypoints, updatedWaypoint);
    this._pointPresenter[updatedWaypoint.id].init(updatedWaypoint);
  }

  _renderSort() {
    render(this._tripContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTrip(waypoint) {
    const pointPresenter = new Point(this._tripListComponent, this._handleWaypointChange, this._handleModeChange);
    pointPresenter.init(waypoint);
    this._pointPresenter[waypoint.id] = pointPresenter;
  }

  _renderTripList() {
    this._tripWaypoints.forEach((element) => this._renderTrip(element));
  }

  _renderNoWaypoints() {
    render(this._tripContainer, this._noTripComponent, RenderPosition.AFTERBEGIN);
  }

  _clearWaypointList() {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};
  }

  _renderWaypoints() {
    if (this._tripWaypoints.length === 0) {
      this._renderNoWaypoints();
      return;
    }

    this._renderSort();

    this._renderTripList();
  }
}
