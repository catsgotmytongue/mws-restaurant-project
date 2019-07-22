import "./sass/restaurant-detail.scss";

import {mapMarkerForRestaurant, log, getParameterByName} from './commonFunctions';

import {ApiHelper} from './apihelper';
import {UrlHelper} from './urlHelper';
import { DBHelper } from "./dbhelper";
const logPrefix='[restaurant_detail.js]';

// update every n milliseconds
const updateInterval = 5000;

let restaurant;
var map;

const currentPage = window.location.href;

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = async function() {
  fetchRestaurantFromURL()
  .then( async restaurant => {
    self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      fillBreadcrumb();
      mapMarkerForRestaurant(self.restaurant, self.map);
      fillRestaurantHTML(restaurant);
      requestAnimationFrame(await update);
  })
  .catch( err => console.error(err) );
}

let lastUpdateTime = 0;
async function update(currentTime) {

  // time our animation frame and animate only while online
  if(navigator.onLine && lastUpdateTime == 0 || currentTime-lastUpdateTime >= updateInterval) {
    log(logPrefix, "update: %o", currentTime);
    
    try {
      let restaurant = await fetchRestaurantFromURL();
      fillRestaurantHTML(restaurant);
      lastUpdateTime = currentTime;
    } catch(err) {
      log(logPrefix, 'Update Error: %o', err);
    }
  }

  // loop forever to keep html up to date (unless we leave the page)
  if(currentPage === window.location.href) {
    requestAnimationFrame(await update);
  }
}

window.saveReview = saveReview;

/**
 * Get current restaurant from page URL.
 */
var fetchRestaurantFromURL = () => {
  return new Promise((resolve, reject) => {
    const id = getParameterByName('id', window.location.href);
    if (!id) { // no id found in URL
      reject('No restaurant id in URL');
    } else {
      return ApiHelper.fetchRestaurantById(id)
      .then( restaurant => {
        self.restaurant = restaurant;

        ApiHelper.fetchRestaurantReviewsByRestaurant(id)
        .then(reviews => {
          self.restaurant.reviews = reviews;

          if (!restaurant) {
            return;
          }

          return resolve(restaurant);
        });
    });
  }
  })
}

/**
 * Create restaurant HTML and add it to the webpage
 */
var fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = `${restaurant.name} ${getFavoriteIcon(restaurant.is_favorite)}`;

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;

  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img'
  
  
  const src1 = UrlHelper.imageUrlForRestaurant(restaurant, "600")+' 600w';
  const src2 = UrlHelper.imageUrlForRestaurant(restaurant, "600")+' 600w';
  const src3 = UrlHelper.imageUrlForRestaurant(restaurant, "1600")+' 800w';
  image.src = src1;
  image.srcset = `${src1}, ${src2}, ${src3}`
  image.alt = `${restaurant.name}`;
  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  fillReviewsHTML();
}

var getFavoriteIcon = (is_favorite) => `<i class="fa fa-heart ${is_favorite === "true"? "": "not-"}favorite"></i>`;

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
var fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');

  let sched = '';
  for (let key in operatingHours) {
    sched += `<tr><td>${key}</td><td>${operatingHours[key]}</td></tr>`;
  }
  hours.innerHTML = sched;
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
var fillReviewsHTML = (reviews = self.restaurant.reviews) => {
  const container = document.getElementById('reviews-container');

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  ul.innerHTML = "";
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
}

/**
 * Create review HTML and add it to the webpage.
 */
var createReviewHTML = (review) => {
  const li = document.createElement('li');
  const name = document.createElement('p');
  name.className = "review_name";
  name.innerHTML = review.name;
  name.tabIndex = 0;
  li.appendChild(name);
  li.tabIndex = 0;

  const date = document.createElement('p');
  date.className ="review_date";
  date.innerHTML = new Date(review.createdAt).toDateString();
  date.tabIndex = 0;
  li.appendChild(date);

  const rating = document.createElement('p');
  rating.className = "review_rating";
  rating.innerHTML = `Rating: ${[...Array(review.rating)].map((_, i) => '<i class="fa fa-star rating"></i>').join('')}`;
  rating.tabIndex = 0;
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  comments.tabIndex = 0;

  li.appendChild(comments);

  return li;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
var fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
  li.tabIndex = 0;
  breadcrumb.appendChild(li);
}

function saveReview(event, form) {
  event.preventDefault();
  let data = new FormData(form);
  let entry = {restaurant_id: self.restaurant.id}; 
  for(var pair of data.entries()) {
    entry = {...entry, [pair[0].toString()]: pair[1]}; 
  }

  ApiHelper.postRestaurantReview(entry).then(review => {
    self.restaurant.reviews.push(review);
    form.reset();
  });
}
