;(function($, Mozilla) {
    'use strict';

    var firstTime = 'True';

    //Only run the tour if user is on Firefox 29 for desktop.
    if (window.isFirefox() && !window.isFirefoxMobile() && window.getFirefoxMasterVersion() >= 29) {

        // Query if the UITour API is working before we start the tour
        Mozilla.UITour.getConfiguration('sync', function (config) {
            var $syncButton = $('.sync-cta').find('.button');
            var visible = '';

            // if user has submitted newsletter don't show the tour again
            if (window.location.hash !== '#footer-email-form') {
                // add a callback when user finishes tour to update the cta
                // id is used for Telemetry
                var tour = new Mozilla.BrowserTour({
                    id: $('#tour-page').data('telemetry')
                });

                tour.init();
            }

            // if user has Sync already, don't show the page prommo
            if (config.setup === false) {
                $syncButton.attr('role', 'button');
                $syncButton.addClass('menu-cta');
                visible = 'YES';
            } else if (config.setup === true) {
                // Hide Sync section in post tour-page
                $('.main-container').addClass('hide-sync');
                // hide Sync link in last step of tour
                $('#sync-link').hide();
                visible = 'NO';
            }

            // Push custom GA variable to track Sync visibility
            gaTrack(['_setCustomVar', 6, 'Sync Visible', visible, 2]);
        });

        //track if this is the first time a user has seen any tour (firstrun or whatsnew)
        try {
            if (localStorage.getItem('mozUITourGlobalFlag') === 'taken') {
                firstTime = 'False';
            } else {
                localStorage.setItem('mozUITourGlobalFlag', 'taken');
            }
            gaTrack(['_trackEvent', 'Tour Interaction', 'First Time Seeing Tour', firstTime, 0, true]);
        } catch (e) {}

        // track default search engine for Firefox 34
        if (window.getFirefoxMasterVersion() >= 34) {
            Mozilla.UITour.getConfiguration('selectedSearchEngine', function (data) {
                var selectedEngineID = data.searchEngineIdentifier;

                if (!selectedEngineID) {
                    return;
                }

                if (selectedEngineID === 'yahoo') {
                    Mozilla.UITour.setTreatmentTag('srch-chg-treatment', 'firstrun_yahooDefault');
                    Mozilla.UITour.setTreatmentTag('srch-chg-action', 'ViewPage');
                    gaTrack(['_trackEvent', 'firstrun srch-chg interactions', 'yahooDefault', 'ViewPage']);
                } else {
                    Mozilla.UITour.setTreatmentTag('srch-chg-treatment', 'firstrun_otherDefault');
                    Mozilla.UITour.setTreatmentTag('srch-chg-action', 'ViewPage');
                    gaTrack(['_trackEvent', 'firstrun srch-chg interactions', 'otherDefault', 'ViewPage']);
                }
            });
        }

    }

})(window.jQuery, window.Mozilla);
