import {openDB} from 'idb';

const dbVersion = 19;
const dbName = 'restaurants';

export var OpenDatabase = () => {
  console.log("DBHELPER: OPEN DB");
  return openDB(dbName, dbVersion, {
    upgrade(db, oldVersion, newVersion, transaction) {
      console.log(`OpenDB: upgrade... ${{db, oldVersion, newVersion, transaction}}`);
      if(!db.objectStoreNames.contains(dbName)) {
        db.createObjectStore(dbName, {keyPath: 'id'});
      }
    },
    blocked() {
      console.log(`OpenDB: blocked...`);
    },
    blocking() {
      console.log(`OpenDB: blocking...`);
    }
  });
}

var dbPromise = OpenDatabase();

/**
 * Common database helper functions.
 */
export class DBHelper {
  /**
   * Url of the api server
   */
  static get ApiUrl() {
    return `http://localhost:1337/restaurants`;
  }
  
  static get IMAGE_ROOT() {
    return "/img/" 
  };
  
  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants() {
    return dbPromise.then(db => {
      var store = db.transaction(dbName, 'readonly').objectStore(dbName);
      return store.getAll();
    })
    .then( restaurants => {
      console.log('[] from db: %o', restaurants);
      if(restaurants && restaurants.length > 0)
        return restaurants;

      return fetch(DBHelper.ApiUrl).then(res=> res.json()).then(json => json);
      // return restaurants || fetch(DBHelper.ApiUrl).then(res=> res.json()).then(json => json);
    })
    .catch(err => console.log("Error in fetchRestaurants(): %o", err));
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
    return dbPromise.then(db => {
      var store = db.transaction(dbName, 'readonly').objectStore(dbName);
      return store.get(parseInt(id));
    })
    .then( restaurant => {
      console.log('{} from db: %o', restaurant);
      return restaurant || fetch(`${DBHelper.ApiUrl}/${id}`).then( res => res.json());
    })
    .catch( err=> console.log('Restaurant does not exist') );
  }

  
  /*
   * Fetch all restaurant reviews - /reviews
   */
  static fetchAllRestaurantReviews() {
    
  }
  
  /**
   * Fetch restaurant reviews by Restaurant ID - /reviews/?restaurant_id=<restaurant_id>
   * @param {number} restaurantId
   */
  static fetchRestaurantReviewsByRestaurant(restaurantId) {
    
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
  static favoriteRestaurant(restaurantId, isFavorite){
    
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
    return DBHelper.fetchRestaurants()
    .then(restaurants => restaurants.filter(r => r.cuisine_type == cuisine))
    .catch(err => null);
  }
  
  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   * @param {string} neighborhood
   */
  static fetchRestaurantByNeighborhood(neighborhood) {
    // Fetch all restaurants
    return DBHelper.fetchRestaurants()
    .then(restaurants => restaurants.filter(r => r.neighborhood == neighborhood))
    .catch(err => null);
  }
  
  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   * @param {string} cuisine
   * @param {string} neighborhood
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood) {
    return DBHelper.fetchRestaurants()
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
    .catch(err => null);
  }
  
  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods() {
    return DBHelper.fetchRestaurants()
    .then(restaurants => {
      return restaurants.map((v, i) => restaurants[i].neighborhood)
      .filter((v, i, neighborhoods) => neighborhoods.indexOf(v) == i); 
    } )
    .catch(err => null);
  }
  
  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines() {
    return DBHelper.fetchRestaurants()
    .then(restaurants => restaurants
      .map((v, i) => restaurants[i].cuisine_type)
      .filter((v, i, cuisines) => cuisines.indexOf(v) == i))
      .catch(err => null);
    }
    
    /**
     * Restaurant page URL.
     */
    static urlForRestaurant(restaurant) {
      return (`./restaurant.html?id=${restaurant.id}`);
    }
    
    /**
     * Restaurant image URL.
     */
    static imageUrlForRestaurant(restaurant, suffix = "") {
      var photoSplit = restaurant.photograph.includes('.') ? restaurant.photograph.split('.') : [restaurant.photograph, 'jpg'];
      return (`${DBHelper.IMAGE_ROOT}${photoSplit[0]}${suffix ? '-'+suffix: ''}.${photoSplit[1]}`);
    }
    
    /**
     * Map marker for a restaurant.
     */
    static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
      );
      return marker;
    }
      
    static putRestaurants(restaurants) {
      //console.log("Put to indexedDB: %o", restaurants);
      for( var key in restaurants) {
        const restaurant = restaurants[key];
        //console.log("restaurant: %o", restaurant);
        dbPromise.then( db => {
          var tx = db.transaction(dbName, 'readwrite');
          var store = tx.objectStore(dbName);
          store.put(restaurant);
          return tx.done;
        });              
      }
     }
}