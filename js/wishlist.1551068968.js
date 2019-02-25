(function(window, $j, undefined) {

    function setClickedItemInWishlist(clickedElement) {

        if (clickedElement.find('.icon--heart-full').length > 0) {
            removeClickedItemFromWishlist(clickedElement);
            return;
        }

        var url = clickedElement.attr('href').replace("wishlist/index","ajaxwishlist/index");

        clickedElement.addClass("js-wishlist-loading");

        $j.ajax( {
            url : url,
            dataType : 'json',
            type : 'post',
            success : function(data) {

                if (data.status == 'SUCCESS') {

                    clickedElement.find('.icon').attr('class', 'icon icon--heart-full');
                    clickedElement.removeClass("js-wishlist-loading");

                    //Up the number of wishlists with one
                    var productCountElement = clickedElement.siblings('.js-wishlist-count');
                    productCountElement.text(parseInt(productCountElement.text()) + 1);
                }

            }
        });
    }

    function removeClickedItemFromWishlist(clickedElement) {

        var url = clickedElement.attr('href').replace("wishlist/index/add","ajaxwishlist/index/remove");

        clickedElement.addClass("js-wishlist-loading");

        $j.ajax( {
            url : url,
            dataType : 'json',
            type : 'post',
            success : function(data) {

                if (data.status == 'SUCCESS') {

                    clickedElement.find('.icon').attr('class', 'icon icon--heart');
                    clickedElement.removeClass("js-wishlist-loading wishlist--added");

                    //Up the number of wishlists with one
                    var productCountElement = clickedElement.siblings('.js-wishlist-count');
                    productCountElement.text(parseInt(productCountElement.text()) - 1);
                }

            }
        });
    }

    function setInWishlistItemsActive()
    {

        if (wishlistItems.length < 1) {
            return;
        }

        for(var i = 0; i < wishlistItems.length; i++) {
            var productId = wishlistItems[i];

            $j(".wishlist [data-product-id='" + productId + "']").addClass('wishlist--added').find('.icon').attr('class', 'icon icon--heart-full');

        }

    }

    function setWishlistIconInHeaderActive() {

        if (wishlistItems.length > 1) {
            $j(".header__quick-navigation .js-icon--heart").attr('class', 'icon icon--heart-full');
        }

    }

    window.addObserverToWishListClickElement = function() {
        $j(".js-add-to-wish-list").on('touchstart click',  function(e) {

            e.preventDefault();
            var clickedElement = $j(this);

            // First determine if user is logged in
            if (!window.loggedInStatus) {
                //open popup to login
                $j.fancybox.open( $j('.js-wishlist__login-box'), {
                    autoFocus : false,
                    touch: false
                });

                return;
            }

            if ($j(this).hasClass('wishlist--added')) {
                removeClickedItemFromWishlist(clickedElement);

                return;
            }

            setClickedItemInWishlist(clickedElement);

        });
    }


    function getWishListSettingsFromServer () {

        if (window.wishlistItems) {
            return;
        }

        $j.ajax({
            url : wishListUrl,
            dataType : 'json',
            type : 'post',
            success : function(data) {

                if (data[0].user_status) {

                    window.wishlistItems = data[1];

                    window.loggedInStatus = data[0].user_status;
                    //Add active class to products that are in wishlist array
                    setInWishlistItemsActive();

                    //Set activeClass on header wishlist icon
                    setWishlistIconInHeaderActive();

                    return;
                }
            }
        });

    }


    window.setWishListUrl = function(url) {
        wishListUrl = url;
        return this;
    }

    $j(function(){
        //getWishListItemsFromServer
        getWishListSettingsFromServer();

        //Add observer to listen to onclick of add to wishlist button
        window.addObserverToWishListClickElement();

    });

}).call(window, window, jQuery.noConflict());

