// ==============================================
// jQuery Init
// ==============================================

// Avoid PrototypeJS conflicts, assign jQuery to $j instead of $
var $j = jQuery.noConflict();

// Use $j(document).ready() because Magento executes Prototype inline
$j(document).ready(function () {

    $j('.js-model-slider').cycle({
        fx: "carousel",
        carouselVisible: 4,
        carouselVisibleOnTablet: 3,
        carouselVisibleOnMobile: 1,
        next: ".js-go-right-model",
        prev: ".js-go-left-model",
        carouselFluid: true,
        slides: ".model",
        swipe: true,
        swipefx: 'scrollHorz',
        paused: true
    });

    $j('.js-widget-products').cycle({
        fx: "carousel",
        carouselVisible: 4,
        carouselVisibleOnTablet: 3,
        carouselVisibleOnMobile: 1,
        next: ".js-go-right-product",
        prev: ".js-go-left-product",
        carouselFluid: true,
        slides: ".product-item",
        swipe: true,
        swipefx: 'scrollHorz',
        paused: true
    });

});
