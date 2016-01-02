"use strict";
apingApp.config(['$provide', function ($provide) {

    $provide.constant("apingApiKeys", {
        //'github': [{'access_token':'<YOUR_GITHUB_ACCESS_TOKEN>'}]
        'github': [{'access_token':'3c15edcd2d60a2cfb2c31922ecd88091d46995f0'}]
    });

    $provide.constant("apingDefaultSettings", {
        templateUrl : "template.html",
        items : 40, //items per request
        maxItems: 100, //max items per aping
        orderBy : "updated_timestamp",
        orderReverse : "true",
        model: "repo",
        getNativeData: false
    });

}]);