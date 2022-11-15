function readURL1(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#imagePreview1').css('background-image', 'url(' + e.target.result + ')');
            $('#imagePreview1').hide();
            $('#imagePreview1').fadeIn(650);
        }
        reader.readAsDataURL(input.files[0]);
    }
}
$("#imageUpload1").change(function () {
    readURL1(this);
});


function readURL2(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#imagePreview2').css('background-image', 'url(' + e.target.result + ')');
            $('#imagePreview2').hide();
            $('#imagePreview2').fadeIn(650);
        }
        reader.readAsDataURL(input.files[0]);
    }
}
$("#imageUpload2").change(function () {
    readURL2(this);
});

function readURL3(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#imagePreview3').css('background-image', 'url(' + e.target.result + ')');
            $('#imagePreview3').hide();
            $('#imagePreview3').fadeIn(650);
        }
        reader.readAsDataURL(input.files[0]);
    }
}
$("#imageUpload3").change(function () {
    readURL3(this);
});

function readURL4(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#imagePreview4').css('background-image', 'url(' + e.target.result + ')');
            $('#imagePreview4').hide();
            $('#imagePreview4').fadeIn(650);
        }
        reader.readAsDataURL(input.files[0]);
    }
}
$("#imageUpload4").change(function () {
    readURL4(this);
});
