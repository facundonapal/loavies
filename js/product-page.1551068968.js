$j(document).ready(function() {


    enquire.register("screen and (max-width: "+ mobileBreakpoint +")", {

        match : function() {

            $j('.js-media-images').cycle({
                fx: "carousel",
                carouselVisible: 1,
                carouselFluid: true,
                slides: "img",
                swipe: false,
                swipefx: 'scrollHorz'
            }).cycle('pause');


            var manager = new Hammer.Manager(document.querySelector('.js-media-images'));

            manager.add( new Hammer.Swipe({ direction: Hammer.DIRECTION_VERTICAL, threshold: 15 }) );
            manager.add( new Hammer.Swipe( { direction: Hammer.DIRECTION_HORIZONTAL } ) );

            manager.on('swipeleft swiperight', function(e) {
                var direction = e.offsetDirection;

                if (direction === 4) {
                    $j('.js-media-images').cycle('prev');
                }

                if (direction === 2) {
                    $j('.js-media-images').cycle('next');
                }
            });

            manager.on('swipedown swipeup', function(e) {});

            $j('.js-recommendations').detach().insertAfter('.js-append-recommendations');

            $j('.js-influencers').detach().insertAfter('.js-append-recommendations');

            $j('.js-influencers-wrapper').cycle({
                fx: "carousel",
                carouselFluid: true,
                slides: "> div",
                swipe: true,
                swipefx: 'scrollHorz'
            }).cycle('pause');


        },
        unmatch : function() {
            $j('.js-media-images').cycle('destroy');

            $j('.js-recommendations').detach().insertAfter('.js-media');

            $j('.js-influencers').detach().insertAfter('.js-media');

            $j('.js-influencers-wrapper').cycle('destroy');


        }
    });

    enquire.register("screen and (min-width: "+ tabletBreakpointBegin +") and (max-width: "+ tabletBreakpointEnd +")", {
        match : function() {

            $j('.js-media-images').cycle({
                fx: "carousel",
                carouselVisible: 1,
                next: "> .cycle-next",
                prev: "> .cycle-prev",
                carouselFluid: true,
                slides: "img",
                swipe: true,
                swipefx: 'scrollHorz'
            }).cycle('pause');

        },

        unmatch : function() {
        }
    });

    enquire.register("screen and (min-width: "+ tabletBreakpointBegin +")", {
        match : function() {


            $j( '.js-media-image-zoom img' ).on('click', function() {
                $j('.media__main-image').trigger('zoom.destroy');

                var clickedImageElement = $j(this).attr('src');
                var targetImageElement = $j('.js-media-image-zoomed').find('img');

                targetImageElement.attr('src', clickedImageElement);

                $j('.media__main-image').zoom();
            });

            $j('.media__main-image').zoom();

            $j(".js-go-left").on('click', function () {
                slideAction("left");
            });

            $j(".js-go-right").on('click', function () {
                slideAction("right");
            });

            $j('.select--related .js-select2').select2({
                width: '100%'
            });

        },

        unmatch : function() {
            $j('.media__main-image').trigger('zoom.destroy');

            $j(".js-go-left").off();
            $j(".js-go-right").off();

        }
    });

    replaceDropDowns();

    $j('.js-options .item-in-stock').trigger('click');
    if ($j('.box__item .box__item--active').length < 1) {
        $j('.js-options .box__item:first-child a').trigger('click');
    }

    $j('.description__text').data('height-description', $j('.description__text').height());
    $j('.description__text').parent().addClass('description--closed');

    $j('.js-read-more').on('click', function(e) {
        e.preventDefault();

        var parentElement = $j(this).parent();
        var textElement = $j(this).prev();

        if (parentElement.hasClass('description--closed')) {
            textElement.css('max-height', textElement.data('height-description'));
            parentElement.removeClass('description--closed');
            parentElement.addClass('description--open');
        } else {
            textElement.removeAttr('style');
            parentElement.removeClass('description--open');
            parentElement.addClass('description--closed');
        }

    });

});


var openTable = function() {

    var clickedElement = $j(this);
    var targetElement = clickedElement.next();

    clickedElement.toggleClass('table-open');
    targetElement.toggleClass('data-table--size-guide--open');
};

function replaceDropDowns() {
    jQuery('.js-options .box ol').remove();
    jQuery('.js-options #selected_combination').text('');
    jQuery(".js-options .super-attribute-select").each(function() {

        var drop_down = jQuery(this);

        jQuery("<ol>").appendTo(drop_down.parent());

        drop_down.find("option[value!='']").each(function() {
            var option = jQuery(this);
            var text = option.text().split(" ")[0];

            if(stStatus.options[option.val()].is_in_stock != 0) {
                var stockclass = "item-in-stock";
            } else {
                var stockclass = "item-no-stock";
            }

            var newLi = jQuery("<li>", {
                class: 'box__item'
            });

            var newA = jQuery("<a>", {
                text: text,
                href: '#',
                class: 'required-entry ' + stockclass,
                'data-id': drop_down.attr('id'),
                'data-name': drop_down.attr('name'),
                'data-value': option.val(),
                'data-label': option.text(),
                click: function(e) {
                    e.preventDefault();
                    drop_down.val(option.val());
                    var obj = drop_down.get();
                    Event.observe(obj[0],'change',function(){});
                    fireEvent(obj[0],'change');
                    replaceDropDowns();
                    var selected_combination = [];
                    jQuery(".super-attribute-select").each(function() {
                        if(jQuery(this).val()) {
                            jQuery(".box__item a[data-value="+jQuery(this).val()+"]").addClass('box__item--active');
                            selected_combination.push(jQuery(this).find("option:selected").text());
                        }
                    });
                    jQuery.each(selected_combination, function(index, selection) {
                        jQuery('#selected_combination').append(selection);
                        if(index+1 < selected_combination.length)
                            jQuery('#selected_combination').append(" - ");
                    })

                }
            }).appendTo(newLi);

            newLi.appendTo(drop_down.parent().find("ol"));

        })
    });
}

function slideAction(direction){

    const targetElement = $j('.js-slider');
    const length = $j('.js-slider .media__image').length;

    const theClass = $j('.js-slider').attr("class").match(/page[\w-]*\b/);

    let thePage = 1;
    if (theClass && theClass[0]) {
        thePage = theClass[0].slice(-1);
        targetElement.removeClass(theClass[0]);
        targetElement.removeClass('last');

    }

    let newPage;
    switch (direction) {
        case "left":

            newPage = +thePage - 1;

            break;
        case "right":

            newPage = +thePage + 1;

            break;
    }

    if (newPage == length) {
        targetElement.addClass('last');
    }

    if (newPage == 0) {
        newPage = 1;
    }

    if (newPage < 0) {
        newPage = length;
    }

    if (newPage > length) {
        newPage = 1;
    }

    targetElement.addClass('page-' + newPage);
    
}