import {UrlHelper} from './urlHelper';

export function mapMarkerForRestaurant(restaurant, map) {
  const marker = new google.maps.Marker({
    position: restaurant.latlng,
    title: restaurant.name,
    url: UrlHelper.urlForRestaurant(restaurant),
    map: map,
    animation: google.maps.Animation.DROP}
    );
    return marker;
  }
