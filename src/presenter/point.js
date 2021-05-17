import WaypointView from '../view/waypoint';
import WaypointEditView from '../view/waypoint-edit';
import {remove, render, replace} from '../utils/render';
import {isEscEvent} from '../utils/common';
import {UserActions, UpdateType} from '../const';


const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class Point {
  constructor(tripListContainer, changeData, changeMode) {
    this._tripListContainer = tripListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._typesAndOffers = [];
    this._citiesWithPhotosAndDescription = [];

    this._waypointComponent = null;
    this._waypointEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleFormCancel = this._handleFormCancel.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);

    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(waypoint, typesAndOffers, citiesWithPhotosAndDescription) {
    this._waypoint = waypoint;

    this._typesAndOffers = typesAndOffers;
    this._citiesWithPhotosAndDescription = citiesWithPhotosAndDescription;

    const prevWaypointComponent = this._waypointComponent;
    const prevWaypointEditComponent = this._waypointEditComponent;

    this._waypointComponent = new WaypointView(waypoint);
    this._waypointEditComponent = new WaypointEditView( typesAndOffers, citiesWithPhotosAndDescription, waypoint);

    this._waypointComponent.setRollupClickHandler(this._handleEditClick);
    this._waypointEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._waypointEditComponent.setFormClickHandler(this._handleFormCancel);

    this._waypointComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    if (prevWaypointComponent === null || prevWaypointEditComponent === null) {
      render(this._tripListContainer, this._waypointComponent);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._waypointComponent, prevWaypointComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._waypointEditComponent, prevWaypointEditComponent);
    }
    remove(prevWaypointComponent);
    remove(prevWaypointEditComponent);
  }

  destroy() {
    remove(this._waypointComponent);
    remove(this._waypointEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceWaypointToList();
    }
  }

  _replaceWaypointToEdit() {
    replace(this._waypointEditComponent, this._waypointComponent);
    document.addEventListener('keydown', this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceWaypointToList() {
    replace(this._waypointComponent, this._waypointEditComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _escKeyDownHandler(evt) {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this._waypointEditComponent.reset(this._waypoint, this._typesAndOffers, this._citiesWithPhotosAndDescription);
      this._replaceWaypointToList();
    }
  }

  _handleFavoriteClick() {
    this._changeData(
      UserActions.UPDATE_WAYPOINT,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._waypoint,
        {
          isFavorite: !this._waypoint.isFavorite,
        },
      ),
    );
  }

  _handleEditClick() {
    this._replaceWaypointToEdit();
  }

  _handleDeleteClick(task) {
    this._changeData(
      UserActions.DELETE_TASK,
      UpdateType.MINOR,
      task,
    );
  }

  _handleFormCancel() {
    this._waypointEditComponent.reset(this._waypoint, this._typesAndOffers, this._citiesWithPhotosAndDescription);
    this._replaceWaypointToList();
  }

  _handleFormSubmit(waypoint) {
    this._changeData(
      UserActions.UPDATE_WAYPOINT,
      UpdateType.MINOR, waypoint);
    this._replaceWaypointToList();
  }
}
