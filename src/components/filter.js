import {filterTypes} from "../data";
import AbstractComponent from "./abstract-component";

class Filter extends AbstractComponent {
  constructor(selector, classes) {
    super();
    this._selector = selector;
    this._classes = classes;
  }

  getTemplate() {
    return `
    <form class="trip-filters">
      ${filterTypes.map(this._getFilterTemplate).join(`\n`)}

      <button class="visually-hidden" type="submit">
        Accept filter
      </button>
    </form>
    `;
  }

  _getFilterTemplate(filter) {
    return `
  <div class="trip-filters__filter">
    <input id="filter-${filter}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter}" data-filter="${filter}">
    <label class="trip-filters__filter-label" for="filter-${filter}">
      ${filter}
    </label>
  </div>
  `;
  }
}

export default Filter;
