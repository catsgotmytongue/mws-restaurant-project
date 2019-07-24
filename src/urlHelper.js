  import {supportsWebp, log} from './commonFunctions';
  
  export class UrlHelper {
    static get IMAGE_ROOT() {
      return "/img/" 
    };
  
    // static get SupportsWebp() {
    //   return ( async () => {
    //     if(!UrlHelper._supportsWebp) {
    //       try {
    //         UrlHelper._supportsWebp = await supportsWebp();
    //       } catch(err ) {
    //         log('UrlHelper','error: %o',err)
    //       }
    //     }
        
    //     return UrlHelper._supportsWebp;
    //   })();
    // }

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
        let ext = 'jpg';
        if(!restaurant || !restaurant.photograph)
          return "https://placehold.it/300";
        var photoSplit = restaurant.photograph.includes('.') ? restaurant.photograph.split('.') : [restaurant.photograph, ext];
        return (`${UrlHelper.IMAGE_ROOT}${photoSplit[0]}${suffix ? '-'+suffix: ''}.${photoSplit[1]}`);
    }

  }