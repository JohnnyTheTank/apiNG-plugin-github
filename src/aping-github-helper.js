'use strict';

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
    }]);