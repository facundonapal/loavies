(function(window, $j, undefined) {

    function updateRecommendationsBlock (data) {

        $j("#"+window.wrapperId).append(data);

        //Reinit observers on wishlish click element
        window.addObserverToWishListClickElement();

        //Reinit lazyloading, because of new elements
        window.lazyloadInit();
    }

    function getRecommendationsBlock () {

        $j.ajax({
            method: "GET",
            url: window.tweakWiseRecommendationsUrl,
            dataType: "json",
            success: function(returnJson) {
                updateRecommendationsBlock(returnJson);
            }
        });
    }

    $j(function(){
        getRecommendationsBlock();
    });

    window.tweakWiseRecommendationsUrl = function(url) {
        countryFetchUrl = url;
        return this;
    }
    window.wrapperId = function(settings) {
        countrySettings = settings;
        return this;
    }

}).call(window, window, jQuery.noConflict());