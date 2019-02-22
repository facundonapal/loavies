var ajaxcart = {
    loadingDiv: '<div class="loading-ajax">' +
        '<svg class="icon icon--loader">' +
        '<use xlink:href="#icon--loader-1"></use>' +
        '</svg></div>',

    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function () {
        this.addSubmitEvent();
    },
    quantityModification: function(alpha, element) {
        var currentQuantityElement = $j(element).siblings('span.qty__unit');

        if (currentQuantityElement.length < 1) {
            return;
        }

        var currentQuantity = parseInt(currentQuantityElement.text());
        var previousQuantity = currentQuantity;

        if (currentQuantity + alpha < 1) {
            return;
        }

        currentQuantity += alpha;
        currentQuantityElement.text(currentQuantity);

        var _this = this;
        var $that = $j(element);

        $j('.totals').fadeOut(5000);

        $j.post($that.attr('href'), {'qty': currentQuantity}, function(data) {
            // Hide the cart__item and so the user know that the product has been removed

            if (data.r == 'success') {
                _this.updateBlocks(data.update_blocks);
            } else {
                if(typeof data.message != 'undefined') {

                    _this.showError(data.message);
                } else {

                    _this.showError("Something bad happened");
                }

                currentQuantityElement.text(previousQuantity);
            }
        }, 'json').fail(function() {

            _this.showError("Something bad happened");
        });

        return false;
    },
    quantitySubtract: function(element) {
        this.quantityModification(-1, element);
    },
    quantityAdd: function(element) {
        this.quantityModification(1, element);
    },
    giftcardSubmit: function(element) {
        var _this = this;
        var $that = $j(element);

        var input = $that.siblings('#id_giftcard');

        if (input.val().length < 1) {
            // todo: do something
            return;
        }

        $j('.onestepcheckout-summary').hide().before(ajaxcart.loadingDiv);
        $j('.payment-methods').hide().before(ajaxcart.loadingDiv);
        $j('.shipment-methods').hide().before(ajaxcart.loadingDiv);

        $j.post($that.attr('href'), {code: input.val()}, function(data) {
            $j('.loading-ajax').remove();

            if (data.r === 'success') {
                _this.updateBlocks(data.update_blocks);

                if (data.user_error) {
                    $j('#giftcard-notice').text(data.message).show();
                }
            } else {
                $j('.onestepcheckout-summary').show();

                if (typeof data.message !== 'undefined') {
                    _this.showError(data.message);
                } else {
                    _this.showError('Something went wrong');
                }
            }
        }, 'json').fail(function() {
            _this.showError('Something went wrong');
        });

        return false;
    },
    couponCodeSubmit: function(element, isRemoving) {
        if (typeof isRemoving === undefined) {
            isRemoving = false;
        }

        var _this = this;
        var $that = $j(element);

        var input = $that.siblings('#id_couponcode');

        if (input.val().length < 1) {
            // todo: do something
            return;
        }

        $j('.onestepcheckout-summary').hide().before(ajaxcart.loadingDiv);
        $j('.payment-methods').hide().before(ajaxcart.loadingDiv);
        $j('.shipment-methods').hide().before(ajaxcart.loadingDiv);

        $j.post($that.attr('href'), {code: input.val(), remove: isRemoving}, function(data) {
            $j('.loading-ajax').remove();

            if (data.r === 'success') {
                _this.updateBlocks(data.update_blocks);

                if (data.user_error) {
                    $j('#coupon-notice').text(data.message).parent('.messages').show();
                } else {
                    $j('#coupon-notice').toggleClass('message--error message--success');
                    $j('#coupon-notice').text(data.message).parent('.messages').show();
                }

                $j('.payment-methods').show();
                $j('.shipment-methods').show();
                $j('.onestepcheckout-summary').show();


            } else {
                $j('.onestepcheckout-summary').show();

                if (typeof data.message !== 'undefined') {
                    _this.showError(data.message);
                } else {
                    _this.showError('Something went wrong');
                }
            }
        }, 'json').fail(function() {
            _this.showError('Something went wrong');
        });

        return false;
    },
    ajaxCartDelete: function(element) {
        var _this = this;

        // Get and store the element that has been clicked upon for later use
        const url = $j(element).attr('href');
        const datalayerDeleteOptions = encodeURIComponent(JSON.stringify($j(element).data('delete-data-layer')));

        $j.fancybox.open(
            "<div>" +
            "<div class='fancybox-button'>" +
            "<button class='button--close button button--fancybox' data-fancybox-close>" +
            "<svg class='icon'>" +
            "<use xlink:href='#icon--close'></use>" +
            "</svg>" +
            "</button>" +
            "</div>" +
            "<div class='fancybox__padding-frame fanxybox__delete-item'>" +
            "<p>" + Translator.translate("Are you sure you want to remove this item from the cart?") + "</p>" +
            "<div class='button--set'>" +
            "<button onclick='$j.fancybox.close()' class='button button--white button--cta'>" + Translator.translate("Cancel") + "</button>" +
            "<button onclick='ajaxcart.deleteAction(this)' data-url="+ url +" data-datalayer-delete-options="+ datalayerDeleteOptions +" class='button button--black button--cta'>" + Translator.translate("Ok") + "</a>" +
            "</div>" +
            "</div>" +
            "</div>", {});
    },


    deleteAction: function(element) {

        $j.fancybox.close();

        var _this = this;

        $j('.totals').fadeOut(5000);

        $j.getJSON($j(element).data('url'), function(data){
            // Hide the cart__item and so the user know that the product has been removed
            if (data.r == 'success') {
                _this.updateBlocks(data.update_blocks);

                if (window.location.href.indexOf('checkout') !== -1 && $j('.cart-items li').length < 1) {
                    window.location.reload();
                }

                const datalayerDeleteOptions = JSON.parse(decodeURIComponent($j(element).data('datalayer-delete-options')));

                if (datalayerDeleteOptions) {
                    dataLayer.push({
                        "event":"EEremoveFromCart",
                        "ecommerce": {
                            "currencyCode": $j('.price_currency_code') ? $j('.price_currency_code').text() : null,
                            "remove": {
                                "products": [{
                                    "id": datalayerDeleteOptions.product_sku,
                                    "name": datalayerDeleteOptions.product_name,
                                    "price": datalayerDeleteOptions.product_price,
                                    "quantity":1
                                }]
                            }
                        }
                    });
                }
            } else {
                if(typeof data.message != 'undefined') {
                    _this.showError(data.message);
                } else {
                    _this.showError("Something bad happened");
                }
            }
        }).fail(function() {
            _this.showError("Something bad happened");
            myItem.slideDown();
        });

    },

    ajaxCartSubmit: function (obj,datalayerData) {
        var _this = this;

        obj.form.down('.button.add-to-cart').removeClassName ("button--done");

        try {
            var url	 = 	obj.form.action,
                data =	obj.form.serialize();

            new Ajax.Request(url, {
                method		: 'post',
                postBody	: data,
                onCreate	: function() {

                },
                onSuccess	: function(response) {
                    // Handle the response content...
                    try {
                        var res = response.responseText.evalJSON();

                        if(res) {
                            if(res.r == 'success') {
                                //update all blocks here
                                _this.updateBlocks(res.update_blocks);

                            } else {
                                _this.showError(res.messages);
                            }
                        } else {
                            _this.showError('Something bad happened, try again');
                        }
                    } catch(e) {
                        _this.showError("Something bad happened, try again");
                    }

                    obj.form.down('.button.add-to-cart').removeClassName("button--loading");
                    obj.form.down('.button.add-to-cart').addClassName("button--done");
                    obj.form.down('.button.add-to-cart').enable();

                    //reinit observer  on cart hover
                    _this.initObserver();

                    if (datalayerData) {
                        dataLayer.push({
                            "event": "EEaddToCart",
                            "ecommerce": {
                                "currencyCode": $j('.price_currency_code') ? $j('.price_currency_code').text() : null,
                                "add": {
                                    "products": [{
                                        "id": datalayerData.product_sku,
                                        "name": datalayerData.product_name,
                                        "price": datalayerData.product_price,
                                        "brand": datalayerData.product_brand,
                                        "variant": $j('#attribute135 option:selected') ? $j('#attribute135 option:selected').text() : null,
                                        "quantity": 1
                                    }]
                                }
                            }
                        });
                    }
                }
            });

        } catch(e) {

            console.log(e);
            obj.form.submit();

        }
    },

    showError: function (error) {
        var _this = this;

        $j.fancybox.open("<div>" +
            "<div class='fancybox-button'>" +
            "<button class='button--close button button--fancybox' data-fancybox-close>" +
            "<svg class='icon'>" +
            "<use xlink:href='#icon--close'></use>" +
            "</svg>" +
            "</button>" +
            "</div>" +
            "<div class='fancybox__padding-frame'>"+ error +"</div>" +
            "</div>", {
        });


    },

    addSubmitEvent: function () {

        if(typeof productAddToCartForm != 'undefined') {
            var _this = this;

            productAddToCartForm.submit = function (url,datalayerData) {

                var button = this;
                if (this === productAddToCartForm) {
                    button = this.form.down('.js-button--add-to-cart');
                }

                if (this.validator && this.validator.validate()) {
                    button.addClassName("button--loading");
                    button.disable();
                    _this.ajaxCartSubmit(this,datalayerData);
                }
                return false;
            }

        }

        var jsRelated = $$('.js-related');

        for (var a = 0; a <jsRelated.length; a++) {
            jsRelated[a].onsubmit = function() {

                var buttonElement = this.down('button');

                buttonElement.validator = {validate: function(){return true;}};
                productAddToCartForm.submit.call(buttonElement, this.action);

                return false;
            }
        }

    },

    updateBlocks: function(blocks) {
        var _this = this;

        if(blocks) {
            try{
                blocks.each(function(block){
                    if(block.key) {
                        var dom_selector = block.key;
                        if($$(dom_selector)) {
                            $$(dom_selector).each(function(e){
                                $(e).replace(block.value);
                            });
                        }
                    }
                });
                _this.bindEvents();

                // show details tooltip
                truncateOptions();
            } catch(e) {
                console.log(e);
            }
        }

        // Cartbox html is updated, so lets re-init the slider.
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

        // Cartbox is updated, so lets popout the cart. And close it after 3 seconds
        $j(".js-header-cart").toggleClass("header-cart--open");

        setTimeout(function(){
            $j(".js-header-cart").removeClass("header-cart--open")
        }, 3000);

    },

    initObserver: function() {
        $j(document).on('mouseenter', '.js-header-cart-toggle',
            function () {
                $j(".js-header-cart").addClass("header-cart--open");
            }
        );
        $j(document).on('mouseleave', '.js-header-cart-toggle',
            function () {
                $j(".js-header-cart").removeClass("header-cart--open");
            }
        );
    }


};

document.observe("dom:loaded", function() {
    ajaxcart.initialize();
    ajaxcart.initObserver();
});
