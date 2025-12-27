

// Owlcarousel
$(document).ready(function(){
  $(".owl-carousel").owlCarousel({
    loop:true,
    margin:10,
    nav:true,
    autoplay:true,
    autoplayTimeout:3000,
    autoplayHoverPause:true,
    center: true,
    navText: [
        "<i class='fa fa-angle-left'></i>",
        "<i class='fa fa-angle-right'></i>"
    ],
    responsive:{
        320: {
            items: 1
        },
        360: {
            items: 3
        },
        375: {
            items: 3
        },
        480: {
            items: 3
        },
        768: {
            items: 3
        },
        991: {
            items: 3
        },
        1024: {
            items: 3
        },
        1199: {
            items: 5
        }
    }
  });
});


// Owlcarousel
$(document).ready(function(){
  $(".owl-carousel_subs").owlCarousel({
    loop:true,
    margin:10,
    nav:true,
    autoplay:true,
    autoplayTimeout:3000,
    autoplayHoverPause:true,
    center: true,
    navText: [
        "<i class='fa fa-angle-left'></i>",
        "<i class='fa fa-angle-right'></i>"
    ],
    responsive:{
        320: {
            items: 1
        },
        360: {
            items: 3
        },
        375: {
            items: 3
        },
        480: {
            items: 3
        },
        768: {
            items: 3
        },
        991: {
            items: 3
        },
        1024: {
            items: 3
        },
        1199: {
            items: 3
        }
    }
  });
});