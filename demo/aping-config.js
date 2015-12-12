"use strict";
apingApp.config(['$provide', function ($provide) {

    $provide.constant("apingApiKeys", {
        'github': [{'access_token':'<YOUR_GITHUB_ACCESS_TOKEN>'}]
    });

    $provide.constant("apingDefaultSettings", {
        templateUrl : "template.html",
        items : 40, //items per request
        maxItems: 100, //max items per aping
        orderBy : "updated_timestamp",
        orderReverse : "true",
        model: "repo",
    });

}]);