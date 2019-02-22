// ==============================================
// jQuery Init
// ==============================================

// Avoid PrototypeJS conflicts, assign jQuery to $j instead of $
var $j = jQuery.noConflict();

// Use $j(document).ready() because Magento executes Prototype inline
$j(document).ready(function () {

    // FAQ - Toggle function for faq categories
    $j(".js-accordion .accordion__item").on('click', function (e) {
        e.preventDefault();
        $j(this).toggleClass('accordion__item--open');

    });

});