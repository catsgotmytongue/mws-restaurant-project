"use strict";

require("core-js/modules/es6.regexp.constructor");

require("core-js/modules/es6.regexp.replace");

let restaurant;
var map;
/**
 * Initialize Google map, called from HTML.
 */

window.initMap = () => {
  fetchRestaurantFromURL().then(restaurant => {
    self.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 16,
      center: restaurant.latlng,
      scrollwheel: false
    });
    fillBreadcrumb();
    DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
  }).catch(err => console.error(err));
};
/**
 * Get current restaurant from page URL.
 */


fetchRestaurantFromURL = () => {
  return new Promise((resolve, reject) => {
    if (self.restaurant) {
      // restaurant already fetched!
      resolve(self.restaurant);
      return;
    }

    const id = getParameterByName('id');

    if (!id) {
      // no id found in URL
      reject('No restaurant id in URL');
    } else {
      return DBHelper.fetchRestaurantById(id).then(restaurant => {
        self.restaurant = restaurant;

        if (!restaurant) {
          console.error(error);
          return;
        }

        fillRestaurantHTML(restaurant);
        return resolve(restaurant);
      });
    }
  });
};
/**
 * Create restaurant HTML and add it to the webpage
 */


fillRestaurantHTML = function fillRestaurantHTML() {
  let restaurant = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurant;
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;
  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;
  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img';
  const src1 = DBHelper.imageUrlForRestaurant(restaurant, "600") + ' 600w';
  const src2 = DBHelper.imageUrlForRestaurant(restaurant, "600") + ' 600w';
  const src3 = DBHelper.imageUrlForRestaurant(restaurant, "1600") + ' 800w';
  image.src = src1;
  image.srcset = "".concat(src1, ", ").concat(src2, ", ").concat(src3);
  image.alt = "".concat(restaurant.name);
  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type; // fill operating hours

  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  } // fill reviews


  fillReviewsHTML();
};
/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */


fillRestaurantHoursHTML = function fillRestaurantHoursHTML() {
  let operatingHours = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurant.operating_hours;
  const hours = document.getElementById('restaurant-hours');

  for (let key in operatingHours) {
    const row = document.createElement('tr');
    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);
    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);
    hours.appendChild(row);
  }
};
/**
 * Create all reviews HTML and add them to the webpage.
 */


fillReviewsHTML = function fillReviewsHTML() {
  let reviews = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurant.reviews;
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h3');
  title.innerHTML = 'Reviews';
  title.tabIndex = 0;
  container.appendChild(title);

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }

  const ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
};
/**
 * Create review HTML and add it to the webpage.
 */


createReviewHTML = review => {
  const li = document.createElement('li');
  const name = document.createElement('p');
  name.innerHTML = review.name;
  name.tabIndex = 0;
  li.appendChild(name);
  li.tabIndex = 0;
  const date = document.createElement('p');
  date.innerHTML = review.date;
  date.tabIndex = 0;
  li.appendChild(date);
  const rating = document.createElement('p');
  rating.innerHTML = "Rating: ".concat(review.rating);
  rating.tabIndex = 0;
  li.appendChild(rating);
  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  comments.tabIndex = 0;
  li.appendChild(comments);
  return li;
};
/**
 * Add restaurant name to the breadcrumb navigation menu
 */


fillBreadcrumb = function fillBreadcrumb() {
  let restaurant = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurant;
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
  li.tabIndex = 0;
  breadcrumb.appendChild(li);
};
/**
 * Get a parameter by name from page URL.
 */


getParameterByName = (name, url) => {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp("[?&]".concat(name, "(=([^&#]*)|&|#|$)")),
        results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};