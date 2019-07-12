  export class UrlHelper {
    static get IMAGE_ROOT() {
      return "/img/" 
    };

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
      if(!restaurant || !restaurant.photograph)
        return "https://placehold.it/300";
      var photoSplit = restaurant.photograph.includes('.') ? restaurant.photograph.split('.') : [restaurant.photograph, 'jpg'];
      return (`${UrlHelper.IMAGE_ROOT}${photoSplit[0]}${suffix ? '-'+suffix: ''}.${photoSplit[1]}`);
    }

  }