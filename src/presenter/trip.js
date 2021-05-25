import WaypointListView from '../view/waypoint-list';
import NoWaypointView from '../view/no-waypoint';
import {render, RenderPosition, remove} from '../utils/render';
import SortView from '../view/sort';
import PointPresenter from './point';
import NewPointPresenter from './new-point-presenter.js';
import {SortType, UpdateType, UserActions, FilterType, State as PointPresenterViewState} from '../const';
import {filter} from '../utils/filter.js';
import {sortByDay, sortByPrice, sortByTime} from '../utils/waypoint';
import LoadingView from '../view/loading.js';
import {newPointButtonComponent} from '../main.js';


export default class Trip {
  constructor(tripContainer, waypointsModel, offersModel, destinationModel, filterModel, api) {
    this._waypointsModel = waypointsModel;
    this._offersModel = offersModel;
    this._destinationModel = destinationModel;


    this._filterModel = filterModel;
    this._tripContainer = tripContainer;
    this._pointPresenter = {};
    this._currentSortType = SortType.DAY;
    this._isLoading = true;
    this._api = api;

    this._sortComponent = null;


    this._waypointListComponent = new WaypointListView();
    this._noTripComponent = new NoWaypointView();
    this._loadingComponent = new LoadingView();


    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);


    this._newPointPresenter = new NewPointPresenter(this._waypointListComponent, this._handleViewAction);
  }


  init() {
    render(this._tripContainer, this._waypointListComponent);

    this._waypointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderTrip();
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
    this._newPointPresenter.init(this._offersModel.get(), this._destinationModel.get());
  }

  _getWaypoints() {
    const filterType = this._filterModel.getCurrent();
    const waypoints = this._waypointsModel.get();
    const filteredWaypoints = filter[filterType](waypoints);

    switch (this._currentSortType) {
      case SortType.DAY:
        return filteredWaypoints.sort(sortByDay);
      case SortType.PRICE:
        return filteredWaypoints.sort(sortByPrice);
      case SortType.TIME:
        return filteredWaypoints.sort(sortByTime);
    }
    return filteredWaypoints;
  }


  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._tripContainer, this._sortComponent, RenderPosition.AFTERBEGIN);

  }

  _renderWaypoint(waypoint) {
    const pointPresenter = new PointPresenter(this._waypointListComponent, this._handleViewAction, this._handleModeChange, this._offersModel, this._destinationModel);
    pointPresenter.init(waypoint);
    this._pointPresenter[waypoint.id] = pointPresenter;
  }

  _renderNoWaypoints() {
    render(this._tripContainer, this._noTripComponent, RenderPosition.AFTERBEGIN);
  }

  _renderWaypoints(waypoints) {
    waypoints.forEach((waypoint) => this._renderWaypoint(waypoint));
  }


  _handleModeChange() {
    this._newPointPresenter.destroy();
    Object.values(this._pointPresenter).forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserActions.UPDATE_WAYPOINT:
        this._pointPresenter[update.id].setViewState(PointPresenterViewState.SAVING);
        this._api.updatePoint(update)
          .then((response) => {
            this._waypointsModel.update(updateType, response);
          })
          .catch(() => {
            this._pointPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
          });
        break;
      case UserActions.ADD_WAYPOINT:
        this._newPointPresenter.setSaving();
        this._api.addPoint(update)
          .then((response) => {
            this._waypointsModel.add(updateType, response);
          })
          .catch(() => {
            this._newPointPresenter.setAborting();
          });
        break;
      case UserActions.DELETE_WAYPOINT:
        this._pointPresenter[update.id].setViewState(PointPresenterViewState.DELETING);
        this._api.deletePoint(update)
          .then(() => {
            this._waypointsModel.delete(updateType, update);
          })
          .catch(() => {
            this._pointPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
          });
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearTrip();
        this._renderTrip();
        break;
      case UpdateType.MAJOR:
        this._clearTrip({resetSortType: true});
        this._renderTrip();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderTrip();
        break;
    }
  }

  _clearTrip({resetSortType = false} = {}) {
    this._newPointPresenter.destroy();
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};

    remove(this._sortComponent);
    remove(this._noTripComponent);
    remove(this._loadingComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }
  }


  _renderTrip() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const waypoints = this._getWaypoints();
    const waypointCount = waypoints.length;
    if (waypointCount === 0) {
      this._renderNoWaypoints();
      return;
    }
    this._renderSort();

    this._renderWaypoints(waypoints);

  }

  _renderLoading() {
    render(this._tripContainer, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }


  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType || sortType === 'undefined') {
      return;
    }
    newPointButtonComponent.removeDisabled();
    this._currentSortType = sortType;
    this._clearTrip();
    this._renderTrip();
  }
}
