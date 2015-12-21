"use strict";

/**
 @author Jonathan Hornung (https://github.com/JohnnyTheTank)
 @url https://github.com/JohnnyTheTank/apiNG-plugin-github
 @licence MIT
 */

jjtApingGithub.service('apingGithubHelper', ['apingModels', 'apingTimeHelper', 'apingUtilityHelper', function (apingModels, apingTimeHelper, apingUtilityHelper) {
    this.getThisPlattformString = function () {
        return "github";
    };

    this.getThisPlattformLink = function () {
        return "https://github.com/";
    };

    this.getObjectByJsonData = function (_data, _helperObject) {
        var requestResults = [];
        if (_data) {

            var _this = this;

            if(_data.constructor === Array) {

                angular.forEach(_data, function (value, key) {
                    var tempResult;
                    if(_helperObject.getNativeData === true || _helperObject.getNativeData === "true") {
                        tempResult = value;
                    } else {
                        tempResult = _this.getItemByJsonData(value, _helperObject.model);
                    }
                    if(tempResult) {
                        requestResults.push(tempResult);
                    }
                });
            } else {

                var result = [];

                if(_data.items) {
                    angular.forEach(_data.items, function (value, key) {
                        var tempResult;
                        if(_helperObject.getNativeData === true || _helperObject.getNativeData === "true") {
                            tempResult = value;
                        } else {
                            tempResult = _this.getItemByJsonData(value, _helperObject.model);
                        }
                        if(tempResult) {
                            requestResults.push(tempResult);
                        }
                    });
                } else {
                    var tempResult;
                    if(_helperObject.getNativeData === true || _helperObject.getNativeData === "true") {
                        tempResult = _data;
                    } else {
                        tempResult = _this.getItemByJsonData(_data, _helperObject.model);
                    }
                    if(tempResult) {
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
                case "repo":
                    returnObject = this.getRepoItemByJsonData(_item);
                    break;
                /*
                case "activity":
                    returnObject = this.getActivityItemByJsonData(_item);
                    break;
                */

                default:
                    return false;
            }
        }
        return returnObject;
    };

    this.getRepoItemByJsonData = function (_item) {
        var repoObject = apingModels.getNew("repo", this.getThisPlattformString());

        $.extend(true, repoObject, {
            owner_name : _item.owner ? _item.owner.login : undefined,
            owner_id : _item.owner ? _item.owner.id : undefined,
            owner_link : _item.owner ? _item.owner.html_url : undefined,
            owner_img_url : _item.owner ? _item.owner.avatar_url : undefined,
            name : _item.name,
            id: _item.id,
            fullname: _item.full_name,
            description : _item.description || undefined,
            url : _item.html_url,
            homepage : _item.homepage || undefined,
            language : _item.language || undefined,
            clone_url : _item.clone_url,
            git_url : _item.git_url,
            ssh_url : _item.ssh_url,
            svn_url : _item.svn_url,
            isFork : _item.fork,
            openIssues : _item.open_issues_count,
            watchers : _item.watchers_count,
            stargazers : _item.stargazers_count,
            forks : _item.forks_count,
            created_timestamp : apingTimeHelper.getTimestampFromDateString(_item.created_at, 1000, 3600*1000),
            created_date_time: new Date(_item.created_at),
            updated_timestamp: _item.updated_at ? apingTimeHelper.getTimestampFromDateString(_item.updated_at, 1000, 3600*1000) : undefined,
            updated_date_time: _item.updated_at ? new Date(_item.updated_at) : undefined,
            pushed_timestamp: _item.pushed_at ? apingTimeHelper.getTimestampFromDateString(_item.pushed_at, 1000, 3600*1000) : undefined,
            pushed_date_time: _item.pushed_at ? new Date(_item.pushed_at) : undefined,
        });

        return repoObject;
    };
    /*
    this.getActivityItemByJsonData = function (_item) {
        var activityObject = apingModels.getNew("activity", this.getThisPlattformString());

        $.extend(true, activityObject, {
            body : undefined,

            actor_name : _item.actor ? _item.actor.login : undefined, //who?
            actor_id : _item.actor ? _item.actor.id : undefined,
            actor_url : _item.actor ? this.getThisPlattformLink()+_item.actor.login : undefined,
            actor_img_url : _item.actor ? _item.actor.avatar_url : undefined,
            actor_type: undefined,

            //action_name : undefined,
            //action_message : undefined,
            action_id : _item.id,
            //action_url : undefined,
            //action_img : undefined,
            action_type: _item.type,

            object_name : _item.repo ? _item.repo.name : undefined,
            object_id : _item.repo ? _item.repo.id : undefined,
            object_img : undefined,
            object_url : _item.repo ? this.getThisPlattformLink()+_item.repo.name : undefined,
            object_type: _item.repo ? "repository" : undefined,

            //context : undefined,
            timestamp : apingTimeHelper.getTimestampFromDateString(_item.created_at, 1000, 3600*1000),
            date_time: new Date(_item.created_at),

        });

        var actionTempObject = this.getActionMessageByTypeAndPayload(_item.type, _item.payload);

        activityObject.action_message = actionTempObject.message;
        activityObject.action_name = actionTempObject.name;
        activityObject.action_url = actionTempObject.url;

        return activityObject;
    };

    this.getActionMessageByTypeAndPayload = function (_type, _payload) {

        var returnObject ={
            name : undefined,
            message : "",
            url : undefined,
        };

        switch(_type) {
            case "PushEvent":

                returnObject.name = "pushed";

                if(_payload.commits && _payload.commits.constructor === Array) {
                    angular.forEach(_payload.commits, function (value, key) {
                        if(returnObject.message === "") {
                            returnObject.message += value.message;
                        } else {
                            returnObject.message += "\n"+value.message;
                        }
                    });
                }
                break;

            case "PullRequestReviewCommentEvent":
                returnObject.name = _payload.action + " pull request review comment";
                returnObject.message = _payload.pull_request.title;
                returnObject.url = _payload.pull_request.html_url;

                break;
        }

        if(returnObject.message === "") {
            returnObject.message = undefined;
        }

        return returnObject;
    };
    */

}]);