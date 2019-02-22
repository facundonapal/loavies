(function(window, $j, undefined) {

    window.lazyloadInit = function () {

        // Lazyload init
        new LazyLoad({
            data_src: "src",
            data_srcset: "srcset",
            show_while_loading: true, //best for progressive JPEG
            callback_set: function (img) {
                picturefill({
                    elements: [img]
                });
            }
        });
    }


    $j(function(){
        window.lazyloadInit();
    });

}).call(window, window, jQuery.noConflict());