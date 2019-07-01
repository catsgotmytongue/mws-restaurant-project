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
    return `http://localhost:8001/restaurants`;
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
      return restaurants || fetch(DBHelper.ApiUrl).then( res => res.json());
    })
    // return fetch(DBHelper.ApiUrl)
    // .then( res => res.json())
    .catch(err => console.log("Error in fetchRestaurants(): %o", err));
  }
  
  /**
   * Fetch a restaurant by its ID.
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
  
  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine) {
    // Fetch all restaurants  with proper error handling
    return DBHelper.fetchRestaurants()
    .then(restaurants => restaurants.filter(r => r.cuisine_type == cuisine))
    .catch(err => null);
  }
  
  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood) {
    // Fetch all restaurants
    return DBHelper.fetchRestaurants()
    .then(restaurants => restaurants.filter(r => r.neighborhood == neighborhood))
    .catch(err => null);
  }
  
  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
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
      console.log("Put to indexedDB: %o", restaurants);
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