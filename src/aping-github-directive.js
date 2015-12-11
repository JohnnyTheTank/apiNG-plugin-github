"use strict";

/**
 @author Jonathan Hornung (https://github.com/JohnnyTheTank)
 @url https://github.com/JohnnyTheTank/apiNG-plugin-github
 @licence MIT
 */

var jjtApingGithub = angular.module("jtt_aping_github", ['jtt_github'])
    .directive('apingGithub', ['apingGithubHelper', 'apingUtilityHelper', 'githubFactory', function (apingGithubHelper, apingUtilityHelper, githubFactory) {
        return {
            require: '?aping',
            restrict: 'A',
            replace: 'false',
            link: function (scope, element, attrs, apingController) {

                var appSettings = apingController.getAppSettings();

                var requests = apingUtilityHelper.parseJsonFromAttributes(attrs.apingGithub, apingGithubHelper.getThisPlattformString(), appSettings);

                requests.forEach(function (request) {

                    var githubSearchObject = {
                        access_token: apingUtilityHelper.getApiCredentials(apingGithubHelper.getThisPlattformString(), "access_token"),
                        per_page: request.items || appSettings.items,
                    };

                    if(request.user) {

                        githubSearchObject.user = request.user;

                        switch(appSettings.model) {
                            case "repo":

                                if(request.repo) {
                                    githubSearchObject.repo = request.repo;

                                    githubFactory.getRepoByUserAndName(githubSearchObject).success(function(_data){
                                        apingController.concatToResults(apingGithubHelper.getObjectByJsonData(_data, appSettings.model));
                                    }).error(function (_data) {
                                        //on error
                                    });
                                } else {
                                    githubFactory.getReposByUser(githubSearchObject).success(function(_data){
                                        apingController.concatToResults(apingGithubHelper.getObjectByJsonData(_data, appSettings.model));
                                    }).error(function (_data) {
                                        //on error
                                    });
                                }
                                break;

                            case "activity":
                                githubFactory.getEventsByUser(githubSearchObject).success(function(_data){
                                    apingController.concatToResults(apingGithubHelper.getObjectByJsonData(_data, appSettings.model));
                                }).error(function (_data) {
                                    //on error
                                });
                                break;
                        }
                    } else if(request.search) {

                        githubSearchObject.q = request.search;

                        if(typeof request.sort !== "undefined") {
                            githubSearchObject.sort = request.sort;
                        }
                        if(typeof request.order !== "undefined") {
                            githubSearchObject.order = request.order;
                        }

                        switch(appSettings.model) {
                            case "repo":

                                githubFactory.getReposByName(githubSearchObject).success(function(_data){
                                    apingController.concatToResults(apingGithubHelper.getObjectByJsonData(_data, appSettings.model));
                                }).error(function (_data) {
                                    //on error
                                });

                                break;
                        }
                    }



                    /*
                    githubFactory.getReposByUser({
                        user:"<USER_NAME>",
                        q:"<SEARCH_STRING>", // (optional)
                        sort:"<SORT_STRING>", // (optional) 'stars', 'forks', or 'updated'
                        order:"<SORT_ORDER>", // (optional) 'desc', 'asc'
                        per_page:"<ITEMS_PER_PAGE>", // (optional) default: 20
                        access_token:"<ACCESS_TOKEN>"
                    }).success(function(_data){
                        //on success
                    }).error(function (_data) {
                        //on error
                    });
                    */


                    //get _data for each request
                        // on success:
                            // apingController.concatToResults(apingGithubHelper.getObjectByJsonData(_data, appSettings.model));
                });
            }
        }
    }]);