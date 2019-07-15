import {openDB} from 'idb';

const dbVersion = 28;
const dbName = 'restaurants';
const restaurantsCollection = "restaurants";
const reviewsCollection = "reviews";
const objectStores = [restaurantsCollection, reviewsCollection];

let dbPromise;
/**
 * Common database helper functions.
 */
export class DBHelper {
  static createDB() {
    console.log("DBHELPER: OPEN DB");
    dbPromise = openDB(dbName, dbVersion, {
      upgrade(db, oldVersion, newVersion, transaction) {
        console.log(`OpenDB: upgrade... ${{db, oldVersion, newVersion, transaction}}`);
  
        // ensure all object stores exist
        objectStores.forEach(objStore => {
          if(!db.objectStoreNames.contains(objStore)){
            db.createObjectStore(objStore, {keyPath: 'id'});
          }
        });
        
        if(newVersion >= 22) {
          console.log("create reviews index, if it doesn't exist");
          let reviewsStore = transaction.objectStore(reviewsCollection);
          if(!reviewsStore.indexNames.contains('reviewsByRestaurant')) {
            reviewsStore.createIndex('reviewsByRestaurant', 'restaurant_id');
          }
        }
      },
      blocked() {
        console.log(`OpenDB: blocked...`);
      },
      blocking() {
        console.log(`OpenDB: blocking...`);
      }
    });

    return dbPromise;
  }

  /**
   * Fetch all restaurants.
   */
  static getRestaurants() {
    console.log('getRestaurants...')
    return dbPromise.then(db => {
      var store = db.transaction(dbName, 'readonly').objectStore(dbName);
      return store.getAll();
    });

    // todo: handle this in service worker
    // .then( restaurants => {
    //   console.log('[] from db: %o', restaurants);
    //   if(restaurants && restaurants.length > 0)
    //     return restaurants;

    //   return fetch(`${DBHelper.ApiUrl}/restaurants`).then(res=> res.json());
    //   // return restaurants || fetch(DBHelper.ApiUrl).then(res=> res.json()).then(json => json);
    // })
    // .catch(err => console.log("Error in fetchRestaurants(): %o", err));
  }

  /*
   * Fetch favorite restaurants - /restaurants/?is_favorite=true
   */
  static getFavoriteRestaurants() {
    
  }

  // todo: handle in service worker 
  /**
   * Fetch a restaurant by its ID. - /restaurants/<restaurant_id>
   */
  static getRestaurantById(id) {
    return dbPromise.then( db => {
      var store = db.transaction(restaurantsCollection, 'readonly').objectStore(restaurantsCollection);
      return store.get(parseInt(id));
    })
    .catch( err => console.log('Restaurant does not exist') );
  }

  
  /*
   * Fetch all restaurant reviews - /reviews
   */
  // static getAllRestaurantReviews() {
  //   return dbPromise.then(res => res.json())
  //   .catch(err=>console.log(err));
  // }
  
  /**
   * Fetch restaurant reviews by Restaurant ID - /reviews/?restaurant_id=<restaurant_id>
   * @param {number} restaurantId
   */
  static getRestaurantReviewsByRestaurant(restaurantId) {
    console.log(`get restaurant reviews by restaurant_id ${restaurantId}`);
    return dbPromise.then(db => db.transaction(reviewsCollection, 'readonly')
        .objectStore(reviewsCollection)
        .index('reviewsByRestaurant')
        .getAll(parseInt(restaurantId)))
        .then( revs => {
          console.log('reviews from idb: %o', revs)
          return revs;
        })
        .catch(err => console.log(`getRestaurantReviewsByRestaurant(${restaurantId}): ${err}`));
  }
  
  /**
   * Fetch restaurant reviews by review ID - /reviews/<review_id>
   * @param {number} reviewId
   */
  static getRestaurantReviewById(reviewId) {
    
  }

  /**
   * Add a restaurant review to idb - /reviews
   * @param {{restaurant_id: number, name: string, rating: number, comments: string}} review
   */
  static addRestaurantReview(review) {
    
  }

  /**
   * Favorite or Unfavorite a restaurant
   * /restaurants/<restaurant_id>/?is_favorite=true
   * @param {number} restaurantId 
   * @param {boolean} isFavorite
   */
  static setFavoriteRestaurant(restaurantId, isFavorite) {
    //todo: favorite a restaurant in idb and keep track of which restaurants changed
  }

  /**
   * Update a restaurant review 
   * /reviews/<review_id>
   * @param {number} reviewId 
   * @param {{name: string, rating: number, comments: string}} review 
   */
  static updateRestaurantReview(reviewId, review) {
    // todo: update a restaurant review in idb
  }

  /**
   * Delete a restaurant review 
   * /reviews/<review_id>
   * @param {number} reviewId
   * */
  static deleteRestaurantReview(reviewId) {
    //todo: delete restaurant from idb
  }
    
  // /**
  //  * Fetch restaurants by a cuisine type with proper error handling.
  //  * @param {string} cuisine
  //  */
  // static getRestaurantByCuisine(cuisine) {
  //   // Fetch all restaurants  with proper error handling
  //   return DBHelper.fetchRestaurants()
  //   .then(restaurants => restaurants.filter(r => r.cuisine_type == cuisine))
  //   .catch(err => null);
  // }
  
  // /**
  //  * Fetch restaurants by a neighborhood with proper error handling.
  //  * @param {string} neighborhood
  //  */
  // static fetchRestaurantByNeighborhood(neighborhood) {
  //   // Fetch all restaurants
  //   return DBHelper.fetchRestaurants()
  //   .then(restaurants => restaurants.filter(r => r.neighborhood == neighborhood))
  //   .catch(err => null);
  // }
  
  // /**
  //  * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
  //  * @param {string} cuisine
  //  * @param {string} neighborhood
  //  */
  // static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood) {
  //   return DBHelper.fetchRestaurants()
  //   .then(restaurants => {
  //     let results = restaurants;
  //     if (cuisine != 'all') { // filter by cuisine
  //       results = results.filter(r => r.cuisine_type == cuisine);
  //     }
  //     if (neighborhood != 'all') { // filter by neighborhood
  //       results = results.filter(r => r.neighborhood == neighborhood);
  //     }
      
  //     return results;
  //   })
  //   .catch(err => null);
  // }
  
  // /**
  //  * Fetch all neighborhoods with proper error handling.
  //  */
  // static fetchNeighborhoods() {
  //   return DBHelper.fetchRestaurants()
  //   .then(restaurants => {
  //     return restaurants.map((v, i) => restaurants[i].neighborhood)
  //     .filter((v, i, neighborhoods) => neighborhoods.indexOf(v) == i); 
  //   } )
  //   .catch(err => null);
  // }
  
  // /**
  //  * Fetch all cuisines with proper error handling.
  //  */
  // static fetchCuisines() {
  //   return DBHelper.fetchRestaurants()
  //   .then(restaurants => restaurants
  //     .map((v, i) => restaurants[i].cuisine_type)
  //     .filter((v, i, cuisines) => cuisines.indexOf(v) == i))
  //     .catch(err => null);
  //   }
    
  static addRestaurants(restaurants) {
      console.log('addRestaurants: %o', restaurants);
      dbPromise.then( db => {
        var tx = db.transaction(restaurantsCollection, 'readwrite');
        var store = tx.objectStore(restaurantsCollection);
        for( var key in restaurants) {
          const restaurant = restaurants[key];
          store.put(restaurant);
          
        }
        return tx.done;
      });
    }

    static addRestaurant(restaurant) {
      return dbPromise.then( db => {
        var tx = db.transaction(restaurantsCollection, 'readwrite');
        var store = tx.objectStore(restaurantsCollection);
        store.put(restaurant);
        return tx.done;
      });
    }

    static addRestaurantReviewsforRestaurant(reviews) {
      console.log("Put to indexedDB reviews: %o", reviews);
      for( var key in reviews) {
        const review = reviews[key];
        dbPromise.then( db => {
          var tx = db.transaction(reviewsCollection, 'readwrite');
          var store = tx.objectStore(reviewsCollection);
          store.put(review);
          return tx.done;
        });
      }
     }
}