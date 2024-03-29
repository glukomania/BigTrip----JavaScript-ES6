import {
  Sort,
  Day,
  AddEdit
} from "./index";

import {
  appendSection,
  createElement,
  unrender,
  addSection
} from "../utils/dom";

import {
  groupByKey,
  sortToChange
} from "../utils/util";

import PointController from "./point-controller";

import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/light.css";

class TripController {
  constructor(container, onDataChange, getNewPointAddView) {
    this._container = container;
    this._dates = null;
    this.onChangeSort = this.onChangeSort.bind(this);
    this._onDataChange = onDataChange;
    this._getNewPointAddView = getNewPointAddView;
    this._daysContainer = null;
    this._subscriptions = [];
    this._onChangeView = this._onChangeView.bind(this);
    this._pointAdd = null;
    this._renderSorting = this._renderSorting.bind(this);
    this._destinations = null;
    this._allOffers = null;
    this.onError = this.onError.bind(this);
  }

  init(filterType, dates) {
    if (dates) {
      this._dates = dates;
    } else if (this._dates.length === 1) {
      this._dates = null;
    }

    this._datesToFilter = this._getFilteredPoints(this._dates, filterType);

    // Rendering
    if (this._datesToFilter) {
      this._renderSorting();
      this._daysContainer = createElement(null, `ul`, [`trip-days`]);
      appendSection(this._container, this._daysContainer);
      this._renderGroupedPoints();

    } else {
      this._showStubMessage();
    }
  }

  getDestinations(items) {
    this._allDestinations = items;
  }

  getOffers(items) {
    this._allOffers = items;
  }

  _getFilteredPoints(datesToFilter, filterType) {
    const dateNow = new Date();
    if (datesToFilter) {
      if (filterType === `Future`) {
        return datesToFilter.filter((item) => item.timeStart > dateNow);
      } else if (filterType === `Past`) {
        return datesToFilter.filter((item) => item.timeStart < dateNow);
      }
    }
    return datesToFilter;
  }

  onChangeSort(typeSort) {
    document.querySelectorAll(`.day`).forEach(unrender);
    const sortedPoints = sortToChange[typeSort]([...this._dates]);
    if (typeSort === `time` || typeSort === `price`) {
      sortedPoints.forEach((point) => {
        return this._renderDate(point.number, [point], false);
      });
    } else {
      this._renderGroupedPoints();
    }
  }

  hide() {
    this._container.classList.add(`visually-hidden`);
  }

  show() {
    this._container.classList.remove(`visually-hidden`);
  }

  createPoint(clearNewPointAddView) {

    const defaultPoint = {
      number: 1,
      type: {type: `Taxi`, label: `Taxi to airport`},
      city: ``,
      pointText: ``,
      timeStart: new Date(),
      timeEnd: new Date(),
      price: 0,
      offers: []
    };
    this._pointAdd = new AddEdit(defaultPoint, true, this._onDataChange, this._allDestinations, this._allOffers, this.onError, clearNewPointAddView);

    addSection(this._container, this._pointAdd.getTemplate(), `afterbegin`);


    flatpickr(this._container.querySelector(`#event-start-time-1`), {
      altInput: true,
      allowInput: false,
      enableTime: true,
      format: `d.m.Y h:m`,
      altFormat: `d.m.Y  h:m`,
      defaultDate: new Date(),
    });

    flatpickr(this._container.querySelector(`#event-end-time-1`), {
      altInput: true,
      allowInput: false,
      enableTime: true,
      format: `d.m.Y h:m`,
      altFormat: `d.m.Y  h:m`,
      defaultDate: new Date(),
    });

    this._pointAdd.addListeners();
    return this._pointAdd;
  }

  _showStubMessage() {
    const stubText = document.createElement(`p`);
    stubText.classList.add(`trip-events__msg`);
    stubText.textContent = `Click New Event to create your first point`;
    this._container.appendChild(stubText);
  }

  _renderSorting() {
    this._sorting = new Sort(this.onChangeSort);
    appendSection(this._container, this._sorting.getElement());
  }

  _renderGroupedPoints() {
    const groupeByDayNumber = groupByKey(`number`);
    const groupedPoints = groupeByDayNumber(this._datesToFilter);
    //

    for (const [key, value] of Object.entries(groupedPoints)) {
      this._renderDate(key, value);
    }
  }

  _sortByTime(points) {
    return points.sort((a, b) => a.timeStart < b.timeStart ? 1 : -1);
  }

  _renderDate(dayNumber, points, displayDate = true) {
    let date = null;
    if (displayDate) {
      date = new Day(dayNumber, points[0].timeStart, `li`, [`trip-days__item`, `day`], points);
    } else {
      date = new Day(``, ``, `li`, [`trip-days__item`, `day`], points);
    }
    points.forEach((point) => {
      const pointController = new PointController(date.getElement(), point, this._onDataChange, this._onChangeView, this._allDestinations, this._allOffers, this._getNewPointAddView, this.onError);
      pointController.init();
      this._subscriptions.push(pointController.setDefaultView.bind(pointController));
    });
    appendSection(this._daysContainer, date.getElement());
  }

  unrenderAllPoints() {
    if (this._container.querySelector(`.event--edit`)) {
      unrender(this._container.querySelector(`.event--edit`));
    }
    this._daysContainer.innerHTML = ``;
    unrender(this._sorting.getElement());
  }

  removeAddPoint() {
    this._pointAdd = null;
  }


  onError() {
    this._shake();
    document.querySelectorAll(`input`).forEach((item) => {
      item.disabled = false;
    });

  }

  _shake() {
    document.querySelector(`.event--edit`).classList.add(`apply-shake`);
  }

  _onChangeView() {
    this._subscriptions.forEach((it) => it());
  }
}

export default TripController;
