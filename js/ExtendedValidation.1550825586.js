/*
 * INCHOO extend of validation.js
 */

// check if Validation class exists and is property of current window object
// (we use this to double check we're not extending object that doesn't exist)
if('Validation' in window) {
    Object.extend(Validation, {
        insertAdvice : function(elm, advice){

            var container = $(elm).up('.select__wrapper');

            if ($(elm).up(2).hasClassName('payment-methods')) {
                var container = $('checkout-payment-method-load');
            }

            if ($(elm).up(3).hasClassName('shipment-methods')) {
                var container = $('shipping-validation-wrapper');
            }

            if(container){
                Element.insert(container, {after: advice});
            } else if (elm.up('td.value')) {
                elm.up('td.value').insert({bottom: advice});
            } else if (elm.advaiceContainer && $(elm.advaiceContainer)) {
                $(elm.advaiceContainer).update(advice);
            } else {
                switch (elm.type.toLowerCase()) {
                    case 'checkbox':
                    case 'radio':
                        var p = elm.parentNode;
                        if(p) {
                            Element.insert(p, {'bottom': advice});
                        } else {
                            Element.insert(elm, {'after': advice});
                        }
                        break;
                    default:
                        Element.insert(elm, {'after': advice});
                }
            }
        }
    });
}