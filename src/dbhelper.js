import {openDB} from 'idb';
import {log} from './commonFunctions';

const logPrefix = "[DB Helper]";
const dbVersion = 28;
const dbName = 'restaurants';
const restaurantsCollection = "restaurants";
const reviewsCollection = "reviews";
const objectStores = [restaurantsCollection, reviewsCollection];

let dbPromise;

function dbLog(str, ...args) {
  if(DBHelper.loggingEnabled) {
      log(logPrefix, str, ...args);
  }
}
/**
 * Common database helper functions.
 */
export class DBHelper {
  static get loggingEnabled() { return false; }
  static getDB() {
    dbLog('getDB will create/open: %o', Boolean(dbPromise));
    return dbPromise ? dbPromise : DBHelper.createDB();
  }

  static createDB() {    
    return openDB(dbName, dbVersion, {
        upgrade(db, oldVersion, newVersion, transaction) {
        dbLog(`OpenDB: upgrade... ${{db, oldVersion, newVersion, transaction}}`);
  
        // ensure all object stores exist
        objectStores.forEach(objStore => {
          if(!db.objectStoreNames.contains(objStore)){
            db.createObjectStore(objStore, {keyPath: 'id'});
          }
        });
        
        if(newVersion >= 22) {
          dbLog('create reviews index, if it doesn\'t exist');
          let reviewsStore = transaction.objectStore(reviewsCollection);
          if(!reviewsStore.indexNames.contains('reviewsByRestaurant')) {
            reviewsStore.createIndex('reviewsByRestaurant', 'restaurant_id');
          }
        }
      },
      blocked() {
        dbLog(`OpenDB: blocked...`);
      },
      blocking() {
        dbLog(`OpenDB: blocking...`);
      }
    });
  }
  

  /**
   * Fetch all restaurants.
   */
  static getRestaurants() {
    dbLog('getRestaurants...')
    return DBHelper.getDB().then(db => {
      var store = db.transaction(dbName, 'readonly').objectStore(dbName);
      return store.getAll();
    });
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
  static getRestaurantById(id, mode = 'readonly') {
    return DBHelper.getDB().then( db => {
      var store = db.transaction(restaurantsCollection, mode).objectStore(restaurantsCollection);
      return store.get(parseInt(id));
    })
    .catch( err => dbLog('Restaurant does not exist') );
  }
  
  /**
   * Fetch restaurant reviews by Restaurant ID - /reviews/?restaurant_id=<restaurant_id>
   * @param {number} restaurantId
   */
  static getRestaurantReviewsByRestaurant(restaurantId) {
    dbLog(`get restaurant reviews by restaurant_id ${restaurantId}`);
    return DBHelper.getDB().then(db => db.transaction(reviewsCollection, 'readonly')
        .objectStore(reviewsCollection)
        .index('reviewsByRestaurant')
        .getAll(parseInt(restaurantId)))
        .then( revs => {
          dbLog('reviews from idb: %o', revs)
          return revs;
        })
        .catch(err => dbLog(`getRestaurantReviewsByRestaurant(${restaurantId}): ${err}`));
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
    return DBHelper.getDB().then( db => {
      var tx = db.transaction(reviewsCollection, 'readwrite');
      var store = tx.objectStore(reviewsCollection);
      store.put(review);
      return tx.done;
    });
  }

  /**
   * Favorite or Unfavorite a restaurant
   * /restaurants/<restaurant_id>/?is_favorite=true
   * @param {number} restaurantId 
   * @param {boolean} isFavorite
   */
  static setFavoriteRestaurant(restaurantId, isFavorite) {
    //todo: favorite a restaurant in idb and keep track of which restaurants changed
    let key = parseInt(restaurantId);
    //dbLog('updating favorite on %o to %o', key, isFavorite);
    return DBHelper.getDB().then(async db => {
      let tx = db.transaction(restaurantsCollection, 'readwrite')
      let store = tx.objectStore(restaurantsCollection);
      let restaurant = await store.get(key);
      restaurant.is_favorite = isFavorite;
      store.put(restaurant); // key implicit in record being put
      return tx.done;
    });
  }

  /**
   * Update a restaurant review 
   * /reviews/<review_id>
   * @param {number} reviewId 
   * @param {{name: string, rating: number, comments: string}} review 
   */
  static updateRestaurantReview(reviewId, review) {
    dbLog('%o => %o', reviewId, review);
    return DBHelper.getDB().then( db => {

    // todo: update a restaurant review in idb
    var tx = db.transaction(reviewsCollection, 'readwrite');
    var reviewsStore = tx.objectStore(reviewsCollection);
    
    return reviewsStore.openCursor().then(async cursor => {
          while (cursor) {
            const curReview = { ...cursor.value };
            if(curReview.id === reviewId) {
              cursor.update(review);
              return tx.done;
            }
            cursor = await cursor.continue();
          }
          tx.done;
      });
    });

  }

  /**
   * Delete a restaurant review 
   * /reviews/<review_id>
   * @param {number} reviewId
   * */
  static deleteRestaurantReview(reviewId) {
    //todo: delete restaurant from idb
    dbLog("Delete: %o", reviewId);
    return DBHelper.getDB().then(db => {
      let tx = db.transaction(reviewsCollection, "readwrite");
      let store = tx.objectStore(reviewsCollection);
      store.delete(reviewId);
      return tx.done;
    });
  }
    
  static addRestaurants(restaurants) {
      dbLog('addRestaurants: %o', restaurants);
      DBHelper.getDB().then( db => {
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
      return DBHelper.getDB().then( db => {
        var tx = db.transaction(restaurantsCollection, 'readwrite');
        var store = tx.objectStore(restaurantsCollection);
        store.put(restaurant);
        return tx.done;
      });
    }

    static addRestaurantReviewsforRestaurant(reviews) {
      dbLog("Put to indexedDB reviews: %o", reviews);
      for( var key in reviews) {
        const review = reviews[key];
        DBHelper.getDB().then( db => {
          var tx = db.transaction(reviewsCollection, 'readwrite');
          var store = tx.objectStore(reviewsCollection);
          store.put(review);
          return tx.done;
        });
      }
     }

    static getReviewsForUpdate() {
      //log(logPrefix, 'getReviewForUpload');
      
      return DBHelper.getDB().then(db => {
        var tx = db.transaction(reviewsCollection);
        var reviewsStore = tx.objectStore(reviewsCollection);
        
        let reviewsForUpdate = [];

        return reviewsStore.openCursor().then(async cursor => {
              while (cursor) {
                //log(logPrefix, cursor.key, cursor.value);
                const review = { ...cursor.value };
                
                if(typeof(review.id)==="string") {
                  dbLog("review to upload: %o", review );
                  reviewsForUpdate.push(review);
                }

                cursor = await cursor.continue();
              }
              tx.done;
              //dbLog("Cursored reviews: %o", reviewsForUpdate);
              return reviewsForUpdate;
          });
        })
        .then(reviews => {
          //dbLog("Reviews to return %o", reviews);
          return reviews;
        });
    }
}