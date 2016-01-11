"use strict";
apingApp.config(['$provide', function ($provide) {
    $provide.value("apingDefaultSettings", {
        orderBy: "updated_timestamp",
        orderReverse: "true",
        apingApiKeys: {
            //...
            'github': [
                {'access_token':'<YOUR_GITHUB_ACCESS_TOKEN>'},
            ]
            //...
        }
    });
}]);
