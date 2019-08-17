import {getMarkup} from "../utils";
import {
  date,
  event,
} from "../data";

import {
  formatDate,
  formatTime,
  getDuration
} from "../getDateFormat";


const getEventTemplate = ({
  type,
  eventText,
  timeStart,
  timeEnd,
  price,
  offers = []
}) => `
<li class="trip-events__item">
  <div class="event">
    <div class="event__type">
      <img
        class="event__type-icon"
        width="42" height="42"
        src="img/icons/${type}.png"
        alt="Event type icon">
    </div>
    <h3 class="event__title">
      ${eventText}
    </h3>

    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${timeStart}">${formatTime(timeStart)}</time>
        &mdash;
        <time class="event__end-time" datetime="${timeEnd}">${formatTime(timeEnd)}</time>
      </p>
      <p class="event__duration">${getDuration(timeStart, timeEnd)}</p>
    </div>

    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${price}</span>
    </p>

    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
      <li class="event__offer">
        <span class="event__offer-title">${offers.offer}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${offers.price}</span>
        </li>
    </ul>

    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
</li>
`;

const getEventsBlock = () => {
  // const dayEvent = eventData[number];
  return getMarkup(event, getEventTemplate);
};

const dayTemplate = ({number, dayDate} = {}) => `
<li class="trip-days__item  day">
  <div class="day__info">
    <span class="day__counter">${number}</span>
    <time class="day__date" datetime="${formatDate(dayDate)}">${formatDate(dayDate)}</time>
  </div>

  <ul class="trip-events__list">

    ${getEventsBlock(number)}
  </ul>
</li>
`;

const dateBlock = getMarkup(date, dayTemplate);

const getCardsMarkup = () => `
<ul class="trip-days">
  ${dateBlock}
</ul>
`;


export {getCardsMarkup};
