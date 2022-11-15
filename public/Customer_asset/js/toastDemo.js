(function($) {
  showSuccessToast = function() {
    'use strict';
    resetToastPosition();
    $.toast({
      heading: 'Success',
      text: 'And these were just the basic demos! Scroll down to check further details on how to customize the output.',
      showHideTransition: 'slide',
      icon: 'success',
      loaderBg: '#f96868',
      position: 'top-right'
    })
  };
  showInfoToast = function() {
    'use strict';
    resetToastPosition();
    $.toast({
      heading: 'Info',
      text: 'And these were just the basic demos! Scroll down to check further details on how to customize the output.',
      showHideTransition: 'slide',
      icon: 'info',
      loaderBg: '#46c35f',
      position: 'top-right'
    })
  };
  showWarningToast = function() {
    'use strict';
    resetToastPosition();
    $.toast({
      heading: 'Warning',
      text: 'And these were just the basic demos! Scroll down to check further details on how to customize the output.',
      showHideTransition: 'slide',
      icon: 'warning',
      loaderBg: '#57c7d4',
      position: 'top-right'
    })
  };
  showDangerToast = function() {
    'use strict';
    resetToastPosition();
    $.toast({
      heading: 'Danger',
      text: 'And these were just the basic demos! Scroll down to check further details on how to customize the output.',
      showHideTransition: 'slide',
      icon: 'error',
      loaderBg: '#f2a654',
      position: 'top-right'
    })
  };
  showToastPosition = function(position) {
    'use strict';
    resetToastPosition();
    $.toast({
      heading: 'Positioning',
      text: 'Specify the custom position object or use one of the predefined ones',
      position: String(position),
      icon: 'info',
      stack: false,
      loaderBg: '#f96868'
    })
  }
  showToastInCustomPosition = function() {
    'use strict';
    resetToastPosition();
    $.toast({
      heading: 'Custom positioning',
      text: 'Specify the custom position object or use one of the predefined ones',
      icon: 'info',
      position: {
        left: 50,
        top: 120
      },
      stack: false,
      loaderBg: '#f96868'
    })
  }
  resetToastPosition = function() {
    $('.jq-toast-wrap').removeClass('bottom-left bottom-right top-left top-right mid-center'); // to remove previous position class
    $(".jq-toast-wrap").css({
      "top": "",
      "left": "",
      "bottom": "",
      "right": ""
    }); //to remove previous position style
  }


  //custom toastAlert

  showCartAddedSuccessToast = function() {
    'use strict';
    resetToastPosition();
    $.toast({
      heading: 'Added to Cart',
      text: 'Selected product is successfully added to cart please checkout to buy',
      showHideTransition: 'slide',
      icon: 'success',
      loaderBg: '#f96868',
      position: 'bottom-right'
    })
  };

  showCartRemoveWarningToast = function() {
    'use strict';
    resetToastPosition();
    $.toast({
      heading: 'Item Deleted from cart',
      text: 'Selected item is successfully removed from your cart please checkout your cart to buy',
      showHideTransition: 'slide',
      icon: 'warning',
      loaderBg: '#57c7d4',
      position: 'bottom-right'
    })
  };

  showWishlistAddedSuccessToast = function() {
    'use strict';
    resetToastPosition();
    $.toast({
      heading: 'Added to Wishlist',
      text: 'Selected product is successfully added to wishlist please checkout to buy',
      showHideTransition: 'slide',
      icon: 'success',
      loaderBg: '#f96868',
      position: 'bottom-right'
    })
  };

  showWishlistRemoveWarningToast = function() {
    'use strict';
    resetToastPosition();
    $.toast({
      heading: 'Item Deleted from wishlist',
      text: 'Selected item is successfully removed from your wishlist please checkout to buy',
      showHideTransition: 'slide',
      icon: 'warning',
      loaderBg: '#57c7d4',
      position: 'bottom-right'
    })




  };
})(jQuery);