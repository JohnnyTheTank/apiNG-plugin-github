[logo]: http://aping.io/logo/320/aping-plugin.png "apiNG Plugin"
![apiNG][logo]

[![npm version](https://badge.fury.io/js/aping-plugin-github.png)](https://badge.fury.io/js/aping-plugin-github)
[![Bower version](https://badge.fury.io/bo/apiNG-plugin-github.png)](https://badge.fury.io/bo/apiNG-plugin-github)

**_apiNG-plugin-github_** is a [GitHub Data API v3](https://developer.github.com/v3/) plugin for [**apiNG**](https://github.com/JohnnyTheTank/apiNG).

# Information
* **Supported apiNG models: `repo`**
* This plugin supports the [`get-native-data` parameter](https://aping.readme.io/docs/advanced#parameters)
* This plugin needs an [access token](#2-access-token) :warning:
* Used promise library: [angular-github-api-factory](https://github.com/JohnnyTheTank/angular-github-api-factory) _(included in distribution files)_

# Documentation

1. [INSTALLATION](#1-installation)
    1. Get file
    2. Include file
    3. Add dependency
    4. Add plugin
2. [ACCESS TOKEN](#2-access-token)
    1. Generate your `access_token`
    2. Insert your `access_token` into `aping-config.js`
3. [USAGE](#3-usage)
    1. Models
    2. Requests
    3. Rate limit

## 1. INSTALLATION
    a) Get file
    b) Include file
    c) Add dependency
    d) Add the plugin

### I. Get file
Install via either [bower](http://bower.io/), [npm](https://www.npmjs.com/) or downloaded files:

* `bower install apiNG-plugin-github --save`
* `npm install aping-plugin-github --save`
* download [apiNG-plugin-github.zip](https://github.com/JohnnyTheTank/apiNG-plugin-github/zipball/master)

### II. Include file
Include `aping-plugin-github.min.js` in your apiNG application

```html
<!-- when using bower -->
<script src="bower_components/apiNG-plugin-github/dist/aping-plugin-github.min.js"></script>

<!-- when using npm -->
<script src="node_modules/aping-plugin-github/dist/aping-plugin-github.min.js"></script>

<!-- when using downloaded files -->
<script src="aping-plugin-github.min.js"></script>
```

### III. Add dependencies
Add the module `jtt_aping_github` as a dependency to your app module:
```js
var app = angular.module('app', ['jtt_aping', 'jtt_aping_github']);
```

### IV. Add the plugin
Add the plugin's directive `aping-github="[]"` to your apiNG directive and [configure your requests](#ii-requests)
```html
<aping
    template-url="templates/repo.html"
    model="repo"
    items="20"
    aping-github="[{'user':'JohnnyTheTank'}]">
</aping>
```

## 2. ACCESS TOKEN

### I. Generate your `access_token`
1. Login on [github.com](https://github.com)
2. Open [github.com/settings/tokens/new](https://github.com/settings/tokens/new)
    * Remove all scopes except **public_repo**
    * Generate your access_token

### II. Insert your `access_token` into `aping-config.js`
Create and open `js/apiNG/aping-config.js` in your application folder. It should be look like this snippet:
```js
apingApp.config(['$provide', function ($provide) {
    $provide.value("apingDefaultSettings", {
        apingApiKeys : {
            //...
            github: [
                {'access_token':'<YOUR_GITHUB_ACCESS_TOKEN>'}
            ],
            //...
        }
    });
}]);
```

:warning: Replace `<YOUR_GITHUB_ACCESS_TOKEN>` with your github `access_token`

## 3. USAGE

### I. Models
Supported apiNG models

|  model   | content | support | max items<br>per request | (native) default items<br>per request |
|----------|---------|---------|--------|---------|
| `rep` | **repositories** | full    | `100`   | `30`   |

**support:**
* full: _the source platform provides a full list with usable results_ <br>
* partly: _the source platfrom provides just partly usable results_


### II. Requests
Every **apiNG plugin** expects an array of **requests** as html attribute.


#### Requests by User
|  parameter  | sample | default | description | optional |
|----------|---------|---------|---------|---------|
| **`user`** | `JohnnyTheTank` |  | GitHub username | no |
| **`repo`** | `apiNG` |  | Limits the request to specific GitHub repository name | yes |
| **`items`**  | `75` | `30` | Items per request (`0`-`100`) |  yes  |

Sample requests:
* `[{'user':'JohnnyTheTank'}, {'user':'xremix', 'items':10}]`
* `[{'user':'JohnnyTheTank', 'repo':'apiNG'}]`

#### Requests by Search
|  parameter  | sample | default | description | optional |
|----------|---------|---------|---------|---------|
| **`search`** | `bootstrap` |  | The search keywords, as well as any qualifierse | no |
| **`sort`** | `stars` |  | The sort field. One of `stars`, `forks`, or `updated`. Default: results are sorted by best match | yes |
| **`order`** | `asc` | `desc` | The sort order if `sort` parameter is provided. One of `asc` or `desc` | yes |
| **`items`**  | `75` | `30` | Items per request (`0`-`100`) |  yes  |

Sample requests:
* `[{'search':'apiNG', 'sort':'stars', 'order':'desc', 'items':50}]`

### III. Rate limit
Visit the official [GitHub Data API documentation](https://developer.github.com/v3/#rate-limiting)
> For requests using Basic Authentication or OAuth, you can make up to 5,000 requests per hour.

# Licence
MIT

