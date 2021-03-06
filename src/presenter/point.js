import WaypointView from '../view/waypoint';
import WaypointEditView from '../view/waypoint-edit';
import {remove, render, replace} from '../utils/render';
import {isEscEvent} from '../utils/common';
import {UserActions, UpdateType, State, ToastMessages} from '../const';
import {newPointButtonComponent} from '../main.js';
import {isOnline} from '../utils/common';
import {showToast} from '../utils/toast';


const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

const Messages = {
  NEW_POINT: 'You can\'t delete point offline',
  EDIT_POINT: 'You can\'t edit point offline',
};
export default class Point {
  constructor(tripListContainer, changeData, changeMode, offersModel, destinationModel) {
    this._tripListContainer = tripListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._offersModel = offersModel;
    this._destinationModel = destinationModel;

    this._waypointComponent = null;
    this._waypointEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleFormCancel = this._handleFormCancel.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(waypoint) {
    this._waypoint = waypoint;


    const prevWaypointComponent = this._waypointComponent;
    const prevWaypointEditComponent = this._waypointEditComponent;

    this._waypointComponent = new WaypointView(waypoint);
    this._waypointEditComponent = new WaypointEditView(this._offersModel.get(), this._destinationModel.get(), waypoint);

    this._waypointComponent.setRollupClickHandler(this._handleEditClick);
    this._waypointEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._waypointEditComponent.setFormCancelClickHandler(this._handleFormCancel);
    this._waypointEditComponent.setDeleteClickHandler(this._handleDeleteClick);
    this._waypointComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    if (prevWaypointComponent === null || prevWaypointEditComponent === null) {
      render(this._tripListContainer, this._waypointComponent);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._waypointComponent, prevWaypointComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._waypointComponent, prevWaypointEditComponent);
      this._mode = Mode.DEFAULT;
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

  setViewState(state) {
    const resetFormState = () => {
      this._waypointEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this._waypointEditComponent.updateData({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case State.DELETING:
        this._waypointEditComponent.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this._waypointComponent.shake(resetFormState);
        this._waypointEditComponent.shake(resetFormState);
        break;
    }
  }

  _replaceWaypointToEdit() {
    newPointButtonComponent.removeDisabled();
    this._waypointEditComponent.reset(this._waypoint, this._offersModel.get(), this._destinationModel.get());
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
      this._waypointEditComponent.reset(this._waypoint, this._offersModel.get(), this._destinationModel.get());
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
    if (!isOnline()) {
      showToast(Messages.EDIT_POINT);
      return;
    }
    this._replaceWaypointToEdit();
  }

  _handleDeleteClick(waypoint) {
    if (!isOnline()) {
      showToast(ToastMessages.DELETE_POINT);
      return;
    }
    this._changeData(
      UserActions.DELETE_WAYPOINT,
      UpdateType.MINOR,
      waypoint,
    );
  }

  _handleFormCancel() {
    this._waypointEditComponent.reset(this._waypoint, this._offersModel.get(), this._destinationModel.get());
    this._replaceWaypointToList();
  }

  _handleFormSubmit(waypoint) {
    if (!isOnline()) {
      showToast(ToastMessages.SAVE_POINT);
      return;
    }
    this._changeData(
      UserActions.UPDATE_WAYPOINT,
      UpdateType.MINOR, waypoint);
  }
}
