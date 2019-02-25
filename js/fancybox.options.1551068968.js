// Avoid PrototypeJS conflicts, assign jQuery to $j instead of $
var $j = jQuery.noConflict();

function initializeQuickViewFancyboxes() {

    $j(".js-quick-view").fancybox({
        smallBtn: false,
        toolbar  : false,
        afterShow: function () {

            $j('.fancybox-slide').animate({
                scrollTop: $j('.related__details').position().top
            }, 750);

        },
        type: 'ajax',
        openEffect  : 'none',
        scrolling : 'yes',
        closeEffect  : 'none',
        autoSize : false,
        helpers   : {
            title : null,
            overlay : {
                locked: true
            }
        }
    });

    $j(".js-instashop__thumbnail").fancybox({
        smallBtn: false,
        toolbar  : false
    });

}

$j(document).ready(function () {

    initializeQuickViewFancyboxes();

    $j(".js-product__shop-the-look--button").fancybox({
        smallBtn: false,
        toolbar  : false,
        scrolling: 'yes',
        afterShow: function () {

            $j('.fancybox-slide').animate({
                scrollTop: $j('.related__items').position().top
            }, 750);

        },
        beforeClose: function () {

            if ($j('.select--related .select2-container').length > 0) {
                $j('.select--related .js-select2').select2('close');
            }
        }

    });

    $j(".js-product__usp__item").fancybox({
        smallBtn: false,
        toolbar  : false
    });

});
