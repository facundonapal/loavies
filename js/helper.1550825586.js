(function(window, $j, undefined) {

    const selectedStoreCookieName = "loavies_store_code",
        days = "365",
        defaultCountryCode = '';

    function getSelectedCountry () {

        var countryCode = Mage.Cookies.get(selectedStoreCookieName);
        return countryCode;

    }

    function setSelectedCountry(countryCode)
    {

        console.log(window.currentStoreCode);
        if (!countryCode) {
            return;
        }

        var d = new Date();
        d.setFullYear(d.getFullYear() + 4);
        Mage.Cookies.set(selectedStoreCookieName, countryCode, d);
    }

    function initStoreSelector()
    {

        const urls = ["http://loavies.magento.localhost/", "https://www.loavies.com/", "https://loavies.elgentos.io/"];

        if (getSelectedCountry()) {

            const selectedCountry = getSelectedCountry();

            if (window.currentStoreCode === selectedCountry) return;

            if (urls.indexOf(window.location.href) > -1) {
                window.location.href = window.location.href + selectedCountry;
            }
        }


        setTimeout(
            function()
            {

                $j.ajax(window.userOnRightShopUrl, {
                    success: function (userOnRightShop) {
                        if (!userOnRightShop) {
                            openPopup(false);
                        }
                    }
                });

            }, 4000);

    }


    function replaceLinks()
    {

        $j(".store-switch-popup .store a").each(function () {

            if ($j('[hreflang='+ $j(this).data('store-code') +']').attr('href')) {
                $j(this).attr("href", $j('[hreflang='+ $j(this).data('store-code') +']').attr('href'));
            }

        });

    }

    window.setCurrentStoreCode = function(currentStoreCode) {
        currentStoreCode = currentStoreCode;
        return this;
    }
    window.setPopupFetchUrl = function(settings) {
        popupFetchUrl = settings;
        return this;
    }

    window.setUserOnRightShopUrl = function(useOnRightShopUrl) {
        useOnRightShopUrl = useOnRightShopUrl;
        return this;
    }

    window.setUrlWithPopupSupport = function(popupUrl) {
        urlWithPopupSupport = popupUrl;
        return this;
    }


    window.openPopup = function (translateBlock) {

        var url = window.popupFetchUrl;

        if (translateBlock) {
            url = url + "?translate"
        }

        $j.fancybox.open({
            src: url,
            type: 'ajax',
            opts : {
                maxWidth    : 800,
                maxHeight   : 800,
                fitToView   : true,
                width       : '90%',
                height      : '80%',
                openEffect  : 'none',
                closeEffect : 'none',
                helpers : {
                    media : true
                },
                beforeShow : function() {
                    $j('.fancybox-container').css('z-index', '1000010');
                },
                afterShow : function() {
                    replaceLinks();
                }
            }
        });

    };

    $j(function(){

        if (urlWithPopupSupport) {
            initStoreSelector();
        }

        $j("body").on('click', '.js-store-view-helper', function (e) {
            e.preventDefault();
            //First set the new cookie for this choice
            window.openPopup(true);
        });

        $j("body").on('click', '.store a', function (e) {
            setSelectedCountry($j(this).data('store-code'));
        });

    });

}).call(window, window, jQuery.noConflict());
