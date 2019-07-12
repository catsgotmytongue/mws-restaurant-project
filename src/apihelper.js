/**
 * Common api helper functions.
 */
export class ApiHelper {
  /**
   * Url of the api server
   */
  static get ApiUrl() {
    return `http://localhost:1337`;
  }
  
  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants() {
    return fetch(`${ApiHelper.ApiUrl}/restaurants`).then(res=> res.json()).catch(err => console.log("Error in fetchRestaurants(): %o", err));
  }
  
  /*
   * Fetch favorite restaurants - /restaurants/?is_favorite=true
   */
  static fetchFavoriteRestaurants() {
    
  }

  /**
   * Fetch a restaurant by its ID. - /restaurants/<restaurant_id>
   */
  static fetchRestaurantById(id) {
    console.log(`fetch restaurants by id ${id}`);
    return fetch(`${ApiHelper.ApiUrl}/restaurants/${id}`).then( res => res.json()).catch( err => console.log('Restaurant failed to fetch: %o', err) );;
  }
  
  /*
   * Fetch all restaurant reviews - /reviews
   */
  static fetchAllRestaurantReviews() {
    return fetch(`${ApiHelper.ApiUrl}/reviews`).then(res => res.json()).catch(err=>console.log(err));
  }
  
  /**
   * Fetch restaurant reviews by Restaurant ID - /reviews/?restaurant_id=<restaurant_id>
   * @param {number} restaurantId
   */
  static fetchRestaurantReviewsByRestaurant(restaurantId) {
    console.log(`fetch restaurant reviews by restaurant_id ${restaurantId}`);
    return fetch(`${ApiHelper.ApiUrl}/reviews/?restaurant_id=${restaurantId}`).then(res => 
      res.json()).catch(err => console.log(`fetchRestaurantReviewsByRestaurant(${restaurantId}): ${err}`));
  }

  /**
   * Fetch restaurant reviews by review ID - /reviews/<review_id>
   * @param {number} reviewId
   */
  static fetchRestaurantReviewById(reviewId) {
    
  }

  /**
   * POST a restaurant review - /reviews
   * @param {{restaurant_id: number, name: string, rating: number, comments: string}} review
   */
  static postRestaurantReview(review) {
    
  }

  /**
   * Favorite or Unfavorite a restaurant
   * /restaurants/<restaurant_id>/?is_favorite=true
   * @param {number} restaurantId 
   * @param {boolean} isFavorite
   */
  static favoriteRestaurant(restaurantId, isFavorite) {
    return fetch(`${ApiHelper.ApiUrl}/restaurants/${restaurantId}/?is_favorite=${isFavorite}`, {method: "put"}).then(res => res.json());
  }

  /**
   * Update a restaurant review 
   * /reviews/<review_id>
   * @param {number} reviewId 
   * @param {{name: string, rating: number, comments: string}} review 
   */
  static updateRestaurantReview(reviewId, review) {

  }

  /**
   * Delete a restaurant review 
   * /reviews/<review_id>
   * @param {number} reviewId
   * */
  static deleteRestaurantReview(reviewId) {

  }
    
  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   * @param {string} cuisine
   */
  static fetchRestaurantByCuisine(cuisine) {
    // Fetch all restaurants  with proper error handling
    return ApiHelper.fetchRestaurants().then(restaurants => restaurants.filter(r => r.cuisine_type == cuisine))
    .catch(err => console.log('Error fetching restaurants by cuisine: %o', err));
  }
  
  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   * @param {string} neighborhood
   */
  static fetchRestaurantByNeighborhood(neighborhood) {
    // Fetch all restaurants
    return ApiHelper.fetchRestaurants()
    .then(restaurants => restaurants.filter(r => r.neighborhood == neighborhood))
    .catch(err => console.log('Error fetching restaurants by neighborhood: %o', err));
  }
  
  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   * @param {string} cuisine
   * @param {string} neighborhood
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood) {
    return ApiHelper.fetchRestaurants()
    .then(restaurants => {
      let results = restaurants;
      if (cuisine != 'all') { // filter by cuisine
        results = results.filter(r => r.cuisine_type == cuisine);
      }
      if (neighborhood != 'all') { // filter by neighborhood
        results = results.filter(r => r.neighborhood == neighborhood);
      }
      
      return results;
    })
    .catch(err => console.log('Error with fetchRestaurantByCuisineAndNeighborhood: %o', err));
  }
  
  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods() {
    return ApiHelper.fetchRestaurants()
    .then(restaurants => {
      return restaurants.map((v, i) => restaurants[i].neighborhood)
      .filter((v, i, neighborhoods) => neighborhoods.indexOf(v) == i); 
    } )
    .catch(err => console.log('error with fetchNeighborhoods: %o', err));
  }
  
  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines() {
    return ApiHelper.fetchRestaurants()
    .then(restaurants => restaurants
      .map((v, i) => restaurants[i].cuisine_type)
      .filter((v, i, cuisines) => cuisines.indexOf(v) == i))
      .catch(err => console.log('Error with fetchCuisines: %o', err));
  }
}