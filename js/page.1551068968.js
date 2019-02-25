// Define global breakpoints
var mobileBreakpoint = "767px";
var tabletBreakpointBegin = "768px";
var tabletBreakpointEnd = "991px";
var desktopBreakpointBegin = "992px";

// ==============================================
// jQuery Init
// ==============================================

// Avoid PrototypeJS conflicts, assign jQuery to $j instead of $
var $j = jQuery.noConflict();

// Use $j(document).ready() because Magento executes Prototype inline
$j(document).ready(function () {

    if (isTouchDevice()) {
        $j('html').addClass('touch');
    } else {
        $j('html').addClass('no-touch');

    }

    if ($j('div.account-create form#form-validate')) {
        var fieldNames = ['email', 'firstname', 'lastname', 'password'];

        $j.each(fieldNames, function (key, value) {
            field = $j('form#form-validate input[name=' + value + ']');
            if (!field.val()) {
                field.focus();
                return false;
            }
        });
    }

    $j('.js-exit-off-viewport').on('touchstart click', function(e) {
        e.preventDefault();
        $j("body").removeClass("js-menu-open");
        $j(".js-popup-box").removeClass("store-switch-popup--open");
    });

    $j('.js-trigger-search').on('touchstart click', function(e) {
        $j(".js-popup-box").removeClass("store-switch-popup--open");
        $j('.js-trigger-search').prop("disabled",true);
        $j('#search').prop("readonly",false);
        $j("body").toggleClass("js-search-open");
    });

    $j('.js-close-search').on('touchstart click', function(e) {
        closeSearch();
    });

    function closeSearch () {
        document.activeElement.blur();
        $j('.js-trigger-search').prop("disabled",false);
        $j('#search').prop("readonly",true);
        $j("body").removeClass("js-search-open");
    }

    document.addEventListener('keydown', function(event) {
        if (event.keyCode == 27) {
            closeSearch();
        }
    });

    $j(".js-trigger-navigation").on('touchstart click',  function(e) {
        e.preventDefault();
        $j(".js-popup-box").removeClass("store-switch-popup--open");
        $j("body").toggleClass("js-menu-open");
        document.activeElement.blur();
    });

    $j(".js-collapsible").on('click', function () {
        $j(this).toggleClass('js-collapsible-collapsed');
    });

    enquire.register("screen and (max-width: "+ mobileBreakpoint +")", {

        match: function () {

            $j( ".navigation .level0.parent > a" ).click(function() {
                event.preventDefault();

                if ($j(this).parent().hasClass("js-open")) {
                    // This element is open; lets close
                    $j( ".navigation .level0.parent" ).removeClass('js-open');
                    $j( ".navigation .level0.parent ul" ).removeAttr("style");

                } else {
                    $j( ".navigation .level0.parent" ).removeClass("js-open");
                    // This element is closed; lets open
                    $j( ".navigation .level0.parent > a" ).removeClass('js-open');
                    $j( ".navigation .level0.parent ul" ).removeAttr("style");
                    $j(this).siblings('.level0').css("max-height", ($j(this).siblings('.level0').children().length * 34) + "px"); // 34 is the lineheight we use in menu
                    $j(this).parent().addClass("js-open");
                }

            });

            $j('.js-page-message-slider').cycle({
                carouselVisible: 1,
                slides: '> li',
                carouselFluid: true,
                swipe: true,
                swipefx: 'scrollHorz',
                retainStylesOnDestroy: true
            });


            $j("[data-store-switch-fancybox]").fancybox({
                beforeShow: function( instance, slide ) {

                    $j("body").removeClass("js-menu-open");

                }
            });


        },
        unmatch: function () {
            $j('.js-page-message-slider').cycle('destroy');
        }

    });

    enquire.register("screen and (min-width: "+ tabletBreakpointBegin +")", {

        match: function () {

            $j( ".navigation .level0.parent > a" ).click(function() {
                event.preventDefault();
            });

            $j('.js-country-input .js-select2').select2({
                width: '100%',
                dropdownParent: $j('.store-switch-wrapper')
            });

            $j('.select--full-width .js-select2').select2({
                minimumResultsForSearch: Infinity,
                width: '100%'
            });

            $j('.select--full-width .validate-select').select2({
                minimumResultsForSearch: Infinity,
                width: '100%'
            });


            $j('.select--limiter .js-select2').select2({
                minimumResultsForSearch: Infinity,
                width: 300
            });

            $j('.navigation .level0.parent').hover(
                function() {
                    $j( this ).addClass('menu-active');
                }, function() {
                    $j( this ).removeClass('menu-active');
                }
            );

            $j('.js-cart-slider').cycle({
                fx: 'carousel',
                carouselVisible: 3,
                carouselVertical: true,
                slides: '.cart__item',
                next: "#next-cart",
                prev: "#prev-cart",
                swipe: true,
                swipefx: 'scrollVert',
                manualSpeed: 350,
                allowWrap: false,
                retainStylesOnDestroy: true
            }).cycle('pause');
            
            $j('.js-store-switch-popup-toggle').on('click', function (e) {

                $j('.js-country-input .js-select2').select2('destroy');

                $j('.js-country-input .js-select2').select2({
                    width: '100%'
                });

                $j('.js-popup-box').parent().toggleClass('store-switch-popup--open');

            });

            $j(document).on({
                mouseenter: function () {
                    $j(this).find('.js-multiple:first').removeClass('product__item__picture--show');
                    $j(this).find('.js-multiple:last').addClass('product__item__picture--show');
                },
                mouseleave: function () {
                    $j(this).find('.js-multiple:first').addClass('product__item__picture--show');
                    $j(this).find('.js-multiple:last').removeClass('product__item__picture--show');
                }
            }, '.js-product-image');

        },
        unmatch: function () {


            $j('.select--full-width .validate-select').select2('destroy');

            $j('.select--store-switch .js-country-input').select2('destroy');

            $j('.select--full-width .js-select2').select2('destroy');

            $j('.select--limiter .js-select2').select2('destroy');

            $j('.select--dob.dob-day .js-select2').select2('destroy');

            $j('.select--dob.dob-month .js-select2').select2('destroy');

            $j('.select--dob.dob-year .js-select2').select2('destroy');
        }

    });


});

function isTouchDevice () {
    if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
        return true;
    }
    return false;
}