(function(window, $j, undefined) {

    function setLocalStorage (key, obj) {

        if (typeof localStorage === 'object') {
            try {
                localStorage.setItem(key, JSON.stringify(obj))
            } catch (e) {
            }
        }

    }

    function getLocalStorage (key) {

        if (localStorage.getItem(key)) {
            return JSON.parse(localStorage.getItem(key))
        }

        return false;
    }

    function setNotificationBubbles (targetElement, notificationNumber) {

        $j("<span class='notification-bubble'>" + notificationNumber + "</span>").insertAfter(targetElement.children('a'));

        if ($j('.js-trigger-navigation .notification-button').length < 1) {
            $j('.js-trigger-navigation').append("<span class='notification-button'></span>");
        }

    }

    function initNotificationBubbles (currentCollection) {

        $j('.navigation__main .level0[data-notification-number]').each(function() {

            var targetElement = $j(this);

            if (getLocalStorage('visited_categories') && (getLocalStorage('visited_categories')[currentCollection].indexOf(targetElement.data('notification-category-id')) > -1)) {
                return;
            }

            var totalNotificationNumber = targetElement.data('notification-number');

            if ($j(this).hasClass('parent')) {
                // we need to count the childs

                $j(this).find('li.level1').each(function () {

                    if ($j(this).data('notification-number') && (getLocalStorage('visited_categories')[currentCollection].indexOf($j(this).data('notification-category-id')) === -1)) {

                        var elementNotificationNumber = $j(this).data('notification-number');
                        if (elementNotificationNumber > 0) {
                            setNotificationBubbles($j(this), elementNotificationNumber);
                        }

                        totalNotificationNumber = +totalNotificationNumber + +elementNotificationNumber;
                    }

                });

            }

            if (totalNotificationNumber > 0) {
                setNotificationBubbles(targetElement, totalNotificationNumber);
            }

        });

    }

    function setCollectionIdentifier (currentCollection) {

        var visitedCategoriesByCollection = { [currentCollection] : []};

        if (getLocalStorage('visited_categories')) {
            if (Object.keys(getLocalStorage('visited_categories')).indexOf(currentCollection) < 0) {
                setLocalStorage('visited_categories', visitedCategoriesByCollection);
            }
        }

        return getLocalStorage('visited_categories');

    }

    function setVisitedCategoriesByCollectionInLocalStorage (currentCollection) {


        var array = getLocalStorage('visited_categories');

        if (!array) {
            setLocalStorage('visited_categories', []);
        }

        var localStorage = setCollectionIdentifier(currentCollection);

        if (typeof localStorage != 'object') {
            return;
        }

        var activeCategoryElement = $j('.navigation__main .active');
        var activeCategoryId = activeCategoryElement.data('notification-category-id');
        if (activeCategoryElement.length > 1) {
            var activeCategoryId = $j(activeCategoryElement[activeCategoryElement.length - 1]).data('notification-category-id');
        }

        if (localStorage[currentCollection].indexOf(activeCategoryId) === -1) {
            localStorage[currentCollection].push(activeCategoryId);
            setLocalStorage('visited_categories', localStorage);
        }

        initNotificationBubbles(currentCollection);

    }



    $j(function(){

        var currentCollection = window.currentCollection; //THis has to be a settable var from magento backend

        setVisitedCategoriesByCollectionInLocalStorage(currentCollection);

    });

    window.currentCollection = function(currentCollection) {
        currentCollection = currentCollection;
        return this;
    }

}).call(window, window, jQuery.noConflict());