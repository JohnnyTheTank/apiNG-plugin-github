'use strict';

angular.module('jtt_aping_github', ['jtt_github'])
    .directive('apingGithub', ['apingGithubHelper', 'apingUtilityHelper', 'githubFactory', function (apingGithubHelper, apingUtilityHelper, githubFactory) {
        return {
            require: '?aping',
            restrict: 'A',
            replace: 'false',
            link: function (scope, element, attrs, apingController) {

                var appSettings = apingController.getAppSettings();
                var requests = apingUtilityHelper.parseJsonFromAttributes(attrs.apingGithub, apingGithubHelper.getThisPlatformString(), appSettings);

                requests.forEach(function (request) {

                    //create helperObject for helper function call
                    var helperObject = {
                        model: appSettings.model,
                    };
                    if (angular.isDefined(appSettings.getNativeData)) {
                        helperObject.getNativeData = appSettings.getNativeData;
                    } else {
                        helperObject.getNativeData = false;
                    }

                    //create requestObject for api request call
                    var requestObject = {
                        access_token: apingUtilityHelper.getApiCredentials(apingGithubHelper.getThisPlatformString(), "access_token"),
                    };

                    if (angular.isDefined(request.items)) {
                        requestObject.per_page = request.items;
                    } else {
                        requestObject.per_page = appSettings.items;
                    }

                    if (requestObject.per_page === 0 || requestObject.per_page === '0') {
                        return false;
                    }

                    // -1 is "no explicit limit". same for NaN value
                    if (requestObject.per_page < 0 || isNaN(requestObject.per_page)) {
                        requestObject.per_page = undefined;
                    }

                    // the api has a limit of 100 items per request
                    if (requestObject.per_page > 100) {
                        requestObject.per_page = 100;
                    }

                    if (request.user) {

                        requestObject.user = request.user;

                        switch (appSettings.model) {
                            case 'repo':

                                if (request.repo) {
                                    requestObject.repo = request.repo;

                                    githubFactory.getRepoByUserAndName(requestObject)
                                        .then(function (_data) {
                                            apingController.concatToResults(apingGithubHelper.getObjectByJsonData(_data, helperObject));
                                        });
                                } else {
                                    githubFactory.getReposByUser(requestObject)
                                        .then(function (_data) {
                                            apingController.concatToResults(apingGithubHelper.getObjectByJsonData(_data, helperObject));
                                        });
                                }
                                break;

                            case 'activity':
                                githubFactory.getEventsByUser(requestObject)
                                    .then(function (_data) {
                                        apingController.concatToResults(apingGithubHelper.getObjectByJsonData(_data, helperObject));
                                    });
                                break;

                            case 'user':
                                githubFactory.getUser(requestObject)
                                    .then(function (_data) {
                                        apingController.concatToResults(apingGithubHelper.getObjectByJsonData(_data, helperObject));
                                    });

                                break;
                        }
                    } else if (request.search) {

                        requestObject.q = request.search;

                        if (angular.isDefined(request.sort)) {
                            requestObject.sort = request.sort;
                        }
                        if (angular.isDefined(request.order)) {
                            requestObject.order = request.order;
                        }

                        switch (appSettings.model) {
                            case 'repo':

                                githubFactory.getReposByName(requestObject)
                                    .then(function (_data) {
                                        apingController.concatToResults(apingGithubHelper.getObjectByJsonData(_data, helperObject));
                                    });

                                break;

                            case 'user':
                                githubFactory.getUsers(requestObject)
                                    .then(function (_data) {
                                        apingController.concatToResults(apingGithubHelper.getObjectByJsonData(_data, helperObject));
                                    });

                                break;
                        }
                    }
                });
            }
        };
    }]);