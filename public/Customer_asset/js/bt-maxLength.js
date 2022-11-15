(function ($) {
  "use strict";
  $("#category_name").maxlength({
    warningClass: "badge mt-1 badge-success",
    limitReachedClass: "badge mt-1 badge-danger",
  });

  $("#defaultconfig-2").maxlength({
    alwaysShow: true,
    threshold: 20,
    warningClass: "badge mt-1 badge-success",
    limitReachedClass: "badge mt-1 badge-danger",
  });

  $("#defaultconfig-3").maxlength({
    alwaysShow: true,
    threshold: 10,
    warningClass: "badge mt-1 badge-success",
    limitReachedClass: "badge mt-1 badge-danger",
    separator: " of ",
    preText: "You have ",
    postText: " chars remaining.",
    validate: true,
  });

  $("#category_description").maxlength({
    alwaysShow: true,
    warningClass: "badge mt-1 badge-success",
    limitReachedClass: "badge mt-1 badge-danger",
  });

  $("#product_name").maxlength({
    alwaysShow: true,
    warningClass: "badge mt-1 badge-success",
    limitReachedClass: "badge mt-1 badge-danger",
  });

  $("#product_description").maxlength({
    alwaysShow: true,
    warningClass: "badge mt-1 badge-success",
    limitReachedClass: "badge mt-1 badge-danger",
  });
})(jQuery);