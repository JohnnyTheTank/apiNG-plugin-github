/**
    @name: aping-plugin-github 
    @version: 0.8.0 (31-08-2018) 
    @author: Jonathan Hornung 
    @url: https://github.com/JohnnyTheTank/apiNG-plugin-github 
    @license: MIT
*/
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
                        access_token: apingUtilityHelper.getApiCredentials(apingGithubHelper.getThisPlatformString(), 'access_token') || undefined,
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
    }]);;'use strict';

angular.module('jtt_aping_github')
    .service('apingGithubHelper', ['apingModels', 'apingTimeHelper', 'apingUtilityHelper', function (apingModels, apingTimeHelper, apingUtilityHelper) {
        this.getThisPlatformString = function () {
            return 'github';
        };

        this.getThisPlatformLink = function () {
            return 'https://github.com/';
        };

        this.getObjectByJsonData = function (_data, _helperObject) {
            var requestResults = [];
            if (_data && _data.data) {

                var _this = this;

                if (_data.data.constructor === Array) {
                    angular.forEach(_data.data, function (value, key) {
                        var tempResult;
                        if (_helperObject.getNativeData === true || _helperObject.getNativeData === 'true') {
                            tempResult = value;
                        } else {
                            tempResult = _this.getItemByJsonData(value, _helperObject.model);
                        }
                        if (tempResult) {
                            requestResults.push(tempResult);
                        }
                    });
                } else {
                    if (_data.data.items) {
                        angular.forEach(_data.data.items, function (value, key) {
                            var tempResult;
                            if (_helperObject.getNativeData === true || _helperObject.getNativeData === 'true') {
                                tempResult = value;
                            } else {
                                tempResult = _this.getItemByJsonData(value, _helperObject.model);
                            }
                            if (tempResult) {
                                requestResults.push(tempResult);
                            }
                        });
                    } else {
                        var tempResult;
                        if (_helperObject.getNativeData === true || _helperObject.getNativeData === 'true') {
                            tempResult = _data.data;
                        } else {
                            tempResult = _this.getItemByJsonData(_data.data, _helperObject.model);
                        }
                        if (tempResult) {
                            requestResults.push(tempResult);
                        }
                    }
                }

            }
            return requestResults;
        };

        this.getItemByJsonData = function (_item, _model) {
            var returnObject = {};
            if (_item && _model) {
                switch (_model) {
                    case 'repo':
                        returnObject = this.getRepoItemByJsonData(_item);
                        break;

                    case 'user':
                        returnObject = this.getUserItemByJsonData(_item);
                        break;

                    default:
                        return false;
                }
            }
            return returnObject;
        };

        this.getRepoItemByJsonData = function (_item) {
            var repoObject = apingModels.getNew('repo', this.getThisPlatformString());

            angular.extend(repoObject, {
                owner_name: _item.owner ? _item.owner.login : undefined,
                owner_id: _item.owner ? _item.owner.id : undefined,
                owner_link: _item.owner ? _item.owner.html_url : undefined,
                owner_img_url: _item.owner ? _item.owner.avatar_url : undefined,
                name: _item.name,
                id: _item.id,
                fullname: _item.full_name,
                description: _item.description || undefined,
                url: _item.html_url,
                homepage: _item.homepage || undefined,
                language: _item.language || undefined,
                clone_url: _item.clone_url,
                git_url: _item.git_url,
                ssh_url: _item.ssh_url,
                svn_url: _item.svn_url,
                isFork: _item.fork,
                openIssues: _item.open_issues_count,
                watchers: _item.watchers_count,
                stargazers: _item.stargazers_count,
                forks: _item.forks_count,
                created_timestamp: apingTimeHelper.getTimestampFromDateString(_item.created_at, 1000, 3600 * 1000),
                created_date_time: new Date(_item.created_at),
                updated_timestamp: _item.updated_at ? apingTimeHelper.getTimestampFromDateString(_item.updated_at, 1000, 3600 * 1000) : undefined,
                updated_date_time: _item.updated_at ? new Date(_item.updated_at) : undefined,
                pushed_timestamp: _item.pushed_at ? apingTimeHelper.getTimestampFromDateString(_item.pushed_at, 1000, 3600 * 1000) : undefined,
                pushed_date_time: _item.pushed_at ? new Date(_item.pushed_at) : undefined,
            });

            return repoObject;
        };

        this.getUserItemByJsonData = function (_item) {
            var userObject = apingModels.getNew('user', this.getThisPlatformString());

            angular.extend(userObject, {
                username: _item.login, //NAME of of the user
                score: _item.score,
                user_id: _item.login, //ID of user (channel / page / account, ...)
                user_url: _item.html_url, //url to user (channel / uploader / page / account, ...)
                intern_id: _item.id, // INTERN ID of user (facebook id, instagram id, ...)
                thumb_url: _item.avatar_url, // best case 200px (min)
                img_url: _item.avatar_url, //preview image url (best case 700px)
                native_url: _item.avatar_url, // best quality
                type: _item.type,
                bio: _item.bio || undefined,
                blog_url: _item.blog || undefined,
                company: _item.company || undefined,
                email: _item.email || undefined,
                created_at: _item.created_at || undefined,
                updated_at: _item.updated_at || undefined,
                followers: _item.followers || undefined,
                following: _item.following || undefined,
                hireable: _item.hireable || undefined,
                location: _item.location || undefined,
                fullname: _item.name || undefined,
                public_gists: _item.public_gists || undefined,
                public_repos: _item.public_repos || undefined,
                source: _item, //different payload
            });

            return userObject;
        };
    }]);;'use strict';

angular.module('jtt_github', [])
    .factory('githubFactory', ['$http', 'githubSearchDataService', function ($http, githubSearchDataService) {

        var githubFactory = {};

        githubFactory.getUsers = function (_params) {
            var searchData = githubSearchDataService.getNew('users', _params);
            return $http({
                method: 'GET',
                url: searchData.url,
                params: searchData.object,
            });
        };

        githubFactory.getUser = function (_params) {
            var searchData = githubSearchDataService.getNew('user', _params);
            return $http({
                method: 'GET',
                url: searchData.url,
                params: searchData.object,
            });
        };

        githubFactory.getReposByUser = function (_params) {
            var searchData = githubSearchDataService.getNew('reposByUser', _params);
            return $http({
                method: 'GET',
                url: searchData.url,
                params: searchData.object,
            });
        };

        githubFactory.getReposByName = function (_params) {
            var searchData = githubSearchDataService.getNew('reposByName', _params);
            return $http({
                method: 'GET',
                url: searchData.url,
                params: searchData.object,
            });
        };

        githubFactory.getRepoByUserAndName = function (_params) {
            var searchData = githubSearchDataService.getNew('repoByUserAndName', _params);
            return $http({
                method: 'GET',
                url: searchData.url,
                params: searchData.object,
            });
        };

        githubFactory.getEventsByUser = function (_params) {
            var searchData = githubSearchDataService.getNew('eventsByUser', _params);
            return $http({
                method: 'GET',
                url: searchData.url,
                params: searchData.object,
            });
        };

        githubFactory.getEventsFromRepoByUserAndName = function (_params) {
            var searchData = githubSearchDataService.getNew('eventsFromRepoByUserAndName', _params);
            return $http({
                method: 'GET',
                url: searchData.url,
                params: searchData.object,
            });
        };

        return githubFactory;
    }])
    .service('githubSearchDataService', function () {
        this.getApiBaseUrl = function () {
            return 'https://api.github.com/';
        };

        this.fillDataInObjectByList = function (_object, _params, _list) {

            angular.forEach(_list, function (value, key) {
                if (angular.isDefined(_params[value])) {
                    _object.object[value] = _params[value];
                }
            });

            return _object;
        };

        this.getNew = function (_type, _params) {
            var githubSearchData = {
                object: {},
                url: '',
            };

            if (angular.isDefined(_params.per_page)) {
                githubSearchData.object.per_page = _params.per_page;
            }

            if (angular.isDefined(_params.access_token)) {
                githubSearchData.object.access_token = _params.access_token;
            }

            switch (_type) {
                case 'user':
                    githubSearchData.object.per_page = undefined;
                    githubSearchData = this.fillDataInObjectByList(githubSearchData, _params, []);
                    githubSearchData.url = this.getApiBaseUrl() + 'users/' + _params.user;
                    break;

                case 'users':
                    githubSearchData = this.fillDataInObjectByList(githubSearchData, _params, [
                        'sort', 'order', 'page'
                    ]);
                    githubSearchData.url = this.getApiBaseUrl() + 'search/users?q=' + _params.q;
                    break;

                case 'reposByUser':
                    githubSearchData = this.fillDataInObjectByList(githubSearchData, _params, [
                        'q', 'sort', 'order', 'page'
                    ]);
                    githubSearchData.url = this.getApiBaseUrl() + 'users/' + _params.user + '/repos';
                    break;

                case 'reposByName':
                    githubSearchData = this.fillDataInObjectByList(githubSearchData, _params, [
                        'sort', 'order', 'page'
                    ]);
                    githubSearchData.url = this.getApiBaseUrl() + 'search/repositories?q=' + _params.q;
                    break;

                case 'repoByUserAndName':
                    githubSearchData.object = {
                        access_token: _params.access_token,
                    };

                    githubSearchData = this.fillDataInObjectByList(githubSearchData, _params, []);

                    githubSearchData.url = this.getApiBaseUrl() + 'repos/' + _params.user + '/' + _params.repo;
                    break;

                case 'eventsByUser':
                    githubSearchData = this.fillDataInObjectByList(githubSearchData, _params, [
                        'q', 'sort', 'order', 'page'
                    ]);
                    githubSearchData.url = this.getApiBaseUrl() + 'users/' + _params.user + '/events';
                    break;

                case 'eventsFromRepoByUserAndName':
                    githubSearchData = this.fillDataInObjectByList(githubSearchData, _params, [
                        'q', 'sort', 'order', 'page'
                    ]);
                    githubSearchData.url = this.getApiBaseUrl() + 'repos/' + _params.user + '/' + _params.repo + '/events';
                    break;
            }
            return githubSearchData;
        };
    });