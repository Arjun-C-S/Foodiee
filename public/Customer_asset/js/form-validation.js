(function ($) {
  "use strict";
  $(function () {
    // validate the comment form when it is submitted
    $("#commentForm").validate({
      errorPlacement: function (label, element) {
        label.addClass("mt-2 text-danger");
        label.insertAfter(element);
      },
      highlight: function (element, errorClass) {
        $(element).parent().addClass("has-danger");
        $(element).addClass("form-control-danger");
      },
    });
    // validate signup form on keyup and submit
    $("#signupForm").validate({
      rules: {
        name: {
          required: true,
          minlength: 2,
        },
        password: {
          required: true,
          minlength: 5,
        },
        email: {
          required: true,
          email: true,
        },
        phone: {
          required: true,
          minlength: 10,
        },
      },
      messages: {
        name: "Please enter your firstname",
        password: {
          required: "Please provide a password",
          minlength: "Your password must be at least 5 characters long",
        },
        phone: {
          required: "Please provide your phone number",
          minlength: "Please provide a valid phone number",
        },
        email: "Please enter a valid email address",
      },
      errorPlacement: function (label, element) {
        label.addClass("mt-2 text-danger");
        label.insertAfter(element);
      },
      highlight: function (element, errorClass) {
        $(element).parent().addClass("has-danger");
        $(element).addClass("form-control-danger");
      },
    });

    $("#addProductform").validate({
      rules: {
        product_image1: {
          required: true,
        },
        product_image2: {
          required: true,
        },
        product_image3: {
          required: true,
        },
        product_image4: {
          required: true,
        },
        name: {
          required: true,
          minlength: 2,
        },
        description: {
          required: true,
          minlength: 5,
        },
        category: {
          required: true,
        },
        quantity: {
          required: true,
          min: 1,
        },
        price: {
          required: true,
          min: 8,
        },
      },
      messages: {
        product_image1: "Please enter a image",
        product_image2: "Please enter a image",
        product_image3: "Please enter a image",
        product_image4: "Please enter a image",
        name: {
          required: "Please enter product name",
          minlength: "Product name must be at least 2 characters long",
        },
        description: {
          required: "Please provide some description",
          minlength: "Product description must be at least 2 characters long",
        },
        category: "Please select a category",
        quantity: {
          required: "Please enter product quantity",
          min: "Product quantity should be atleast 1",
        },
        price: {
          required: "Please enter product price",
          min: "Product price should be atleast 5 rupees",
        },
      },
      errorPlacement: function (label, element) {
        label.addClass("mt-2 text-danger");
        label.insertAfter(element);
      },
      highlight: function (element, errorClass) {
        $(element).parent().addClass("has-danger");
        $(element).addClass("form-control-danger");
      },
    });

    $("#loginForm").validate({
      rules: {
        email: {
          required: true,
          email: true,
        },
        password: {
          required: true,
          minlength: 5,
        },
      },
      messages: {
        email: "Please enter a valid email address",
        password: {
          required: "Please provide a password",
          minlength: "Your password must be at least 5 characters long",
        },
      },
      errorPlacement: function (label, element) {
        label.addClass("mt-2 text-danger");
        label.insertAfter(element);
      },
      highlight: function (element, errorClass) {
        $(element).parent().addClass("has-danger");
        $(element).addClass("form-control-danger");
      },
    });
    $("#addCategoryForm").validate({
      rules: {
        category_name: {
          required: true,
        },
        category_description: {
          required: true,
        },
      },
      messages: {
        category_name: "Please provide a category name",
        category_description: "Please provide a category description",
      },
      errorPlacement: function (label, element) {
        label.addClass("mt-2 text-danger");
        label.insertAfter(element);
      },
      highlight: function (element, errorClass) {
        $(element).parent().addClass("has-danger");
        $(element).addClass("form-control-danger");
      },
    });

    $("#addressForm").validate({
      rules: {
        name: {
          required: true,
          minlength: 2,
        },
        phoneNumber: {
          required: true,
          minlength: 10,
        },
        alternativePhoneNumber: {
          required: true,
          minlength: 10,
        },
        city: {
          required: true,
          minlength: 2,
        },
        street: {
          required: true,
          minlength: 2,
        },
        houseName: {
          required: true,
          minlength: 2,
        },
        landMark: {
          required: true,
          minlength: 2,
        },
      },
      messages: {
        name: {
          required: "Please provide a Name",
          minlength: "Your name must be at least 2 characters long",
        },
        phoneNumber: {
          required: "Please provide a phone Number",
          minlength: "Please provide a valid phone number",
        },
        alternativePhoneNumber: {
          required: "Please provide your alternative phone number",
          minlength: "Please provide a valid phone number",
        },
        city: {
          required: "Please provide a city name",
          minlength: "Your city name must be at least 2 characters long",
        },
        street: {
          required: "Please provide a street name",
          minlength: "Your street name must be at least 2 characters long",
        },
        houseName: {
          required: "Please provide your house name or buliding name",
          minlength: "Your house name must be at least 2 characters long",
        },
        landMark: {
          required: "Please provide some land mark",
          minlength: "Your landmark must be at least 2 characters long",
        },
      },
      errorPlacement: function (label, element) {
        label.addClass("mt-2 text-danger");
        label.insertAfter(element);
      },
      highlight: function (element, errorClass) {
        $(element).parent().addClass("has-danger");
        $(element).addClass("form-control-danger");
      },
    });

    $("#ForgotPhoneForm").validate({
      rules: {
        phone: {
          required: true,
        },
        email: {
          email: true,
          required: true,
        },
      },
      messages: {
        phone: "Please provide a phone number",
        email: {
          required: "Please provide a email address",
          email: "Enter a valid mail",
        },
      },
      errorPlacement: function (label, element) {
        label.addClass("mt-2 text-danger");
        label.insertAfter(element);
      },
      highlight: function (element, errorClass) {
        $(element).parent().addClass("has-danger");
        $(element).addClass("form-control-danger");
      },
    });

    $("#OTPlogin").validate({
      rules: {
        otp: {
          required: true,
        },
      },
      messages: {
        otp: "Please provide OTP",
      },
      errorPlacement: function (label, element) {
        label.addClass("mt-2 text-danger");
        label.insertAfter(element);
      },
      highlight: function (element, errorClass) {
        $(element).parent().addClass("has-danger");
        $(element).addClass("form-control-danger");
      },
    });
  });

  $("#selectAddress").validate({
    rules: {
      address: {
        required: true,
      },
    },
    messages: {
      address: "Please select a delivery address",
    },
    errorPlacement: function (label, element) {
      label.addClass("mt-2 text-danger");
      label.insertAfter(element);
    },
    highlight: function (element, errorClass) {
      $(element).parent().addClass("has-danger");
      $(element).addClass("form-control-danger");
    },
  });

  $("#editProfileForm").validate({
    rules: {
      name: {
        required: true,
      },
      email: {
        required: true,
        email: true,
      },
      address: {
        required: true,
      },
    },
    messages: {
      name: "Please select a delivery address",
      email: {
        required: "Please provide a email address",
        email: "Enter a valid mail",
      },
      address: "Please select a delivery address",
    },
    errorPlacement: function (label, element) {
      label.addClass("mt-2 text-danger");
      label.insertAfter(element);
    },
    highlight: function (element, errorClass) {
      $(element).parent().addClass("has-danger");
      $(element).addClass("form-control-danger");
    },
  });
})(jQuery);
