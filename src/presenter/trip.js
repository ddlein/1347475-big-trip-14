import WaypointListView from '../view/waypoint-list';
import NoWaypointView from '../view/no-waypoint';
import {render, RenderPosition, remove} from '../utils/render';
import SortView from '../view/sort';
import PointPresenter from './point';
import WaypointNewPresenter from './waypoint-new';
import {SortType, UpdateType, UserActions, FilterType} from '../const';
import {filter} from '../utils/filter.js';
import {sortByDay, sortByPrice, sortByTime} from '../utils/waypoint';


export default class Trip {
  constructor(tripContainer, waypointsModel, typeAndOffers, citiesWithPhotosAndDescription, filterModel) {
    this._waypointsModel = waypointsModel;
    this._filterModel = filterModel;
    this._tripContainer = tripContainer;
    this._pointPresenter = {};
    this._currentSortType = SortType.DAY;

    this._sortComponent = null;

    this._typesAndOffers = typeAndOffers;
    this._citiesWithPhotosAndDescription = citiesWithPhotosAndDescription;

    this._waypointListComponent = new WaypointListView();
    this._noTripComponent = new NoWaypointView();


    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._waypointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._waypointNewPresenter = new WaypointNewPresenter(this._waypointListComponent, this._handleViewAction);
  }


  init() {
    render(this._tripContainer, this._waypointListComponent); //UL

    this._waypointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderTrip(this._typesAndOffers, this._citiesWithPhotosAndDescription);
  }


  destroy() {
    this._clearTrip({resetSortType: true});

    remove(this._waypointListComponent);

    this._waypointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }


  createWaypoint() {
    this._currentSortType = SortType.DAY;
    this._filterModel.setCurrent(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._waypointNewPresenter.init(this._typesAndOffers, this._citiesWithPhotosAndDescription);
  }

  _getWaypoints() {
    const filterType = this._filterModel.getCurrent();
    const waypoints = this._waypointsModel.get();
    const filtredWaypoints = filter[filterType](waypoints);

    switch (this._currentSortType) {
      case SortType.DAY:
        return filtredWaypoints.sort(sortByDay);
      case SortType.PRICE:
        return filtredWaypoints.sort(sortByPrice);
      case SortType.TIME:
        return filtredWaypoints.sort(sortByTime);
    }
    return filtredWaypoints;
  }


  _renderSort() {
    if(this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._tripContainer, this._sortComponent, RenderPosition.AFTERBEGIN);

  }

  _renderWaypoint(waypoint, typesAndOffers, citiesWithPhotosAndDescription) {
    const pointPresenter = new PointPresenter(this._waypointListComponent, this._handleViewAction, this._handleModeChange);
    pointPresenter.init(waypoint, typesAndOffers, citiesWithPhotosAndDescription);
    this._pointPresenter[waypoint.id] = pointPresenter;
  }


  _renderNoWaypoints() {
    render(this._tripContainer, this._noTripComponent, RenderPosition.AFTERBEGIN);
  }

  //вывод каждого waipoint'a
  _renderWaypoints(waypoints, typesAndOffers, citiesWithPhotosAndDescription) {
    waypoints.forEach((waypoint) => this._renderWaypoint(waypoint, typesAndOffers, citiesWithPhotosAndDescription));
  }


  _handleModeChange() {
    this._waypointNewPresenter.destroy();
    Object.values(this._pointPresenter).forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserActions.UPDATE_WAYPOINT:
        this._waypointsModel.update(updateType, update);
        break;
      case UserActions.ADD_WAYPOINT:
        this._waypointsModel.add(updateType, update);
        break;
      case UserActions.DELETE_WAYPOINT:
        this._waypointsModel.delete(updateType, update);
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearTrip();
        this._renderTrip(this._typesAndOffers, this._citiesWithPhotosAndDescription);
        break;
      case UpdateType.MAJOR:
        this._clearTrip({resetSortType: true});
        this._renderTrip(this._typesAndOffers, this._citiesWithPhotosAndDescription);
        break;
    }
  }

  _clearTrip({resetSortType = false} = {}) {
    this._waypointNewPresenter.destroy();
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};

    remove(this._sortComponent);
    remove(this._noTripComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }
  }


  _renderTrip(typesAndOffers, citiesWithPhotosAndDescription) {
    const waypoints = this._getWaypoints();
    const waypointCount = waypoints.length;

    if (waypointCount === 0) {
      this._renderNoWaypoints();
      return;
    }

    this._renderSort();

    this._renderWaypoints(this._getWaypoints(), typesAndOffers, citiesWithPhotosAndDescription);

  }


  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType || sortType === 'undefined') {
      return;
    }
    this._currentSortType = sortType;
    this._clearTrip();
    this._renderTrip(this._typesAndOffers, this._citiesWithPhotosAndDescription);
  }


  _clearWaypointList() {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};
  }
}
