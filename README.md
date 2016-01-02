[logo]: http://aping.io/logo/320/aping-plugin.png "apiNG Plugin"
![apiNG][logo]

**_apiNG-plugin-github_** is a [GitHub Data API v3](https://developer.github.com/v3/) plugin for [**apiNG**](https://github.com/JohnnyTheTank/apiNG).

# Information
* **Supported apiNG models: `repo`**
* Used promise library: [angular-github-api-factory](https://github.com/JohnnyTheTank/angular-github-api-factory) _(included in minified distribution file)_

# Documentation
    I.   INSTALLATION
    II.  API KEY
    III. USAGE

## I. INSTALLATION
    a) Get files
    b) Include files
    c) Add dependencies
    d) Add the plugin

### a) Get files
You can choose your preferred method of installation:

* Via bower: `bower install apiNG-plugin-github --save`
* Download from github: [apiNG-plugin-github.zip](https://github.com/JohnnyTheTank/apiNG-plugin-github/zipball/master)

### b) Include files
Include `apiNG-plugin-github.min.js` in your apiNG application
```html
<script src="bower_components/apiNG-plugin-github/dist/apiNG-plugin-github.min.js"></script>
```

### c) Add dependencies
Add the module `jtt_aping_github` as a dependency to your app module:
```js
var app = angular.module('app', ['jtt_aping', 'jtt_aping_github']);
```

### d) Add the plugin
Add the plugin's directive `aping-github="[]"` to your apiNG directive and configure your requests (_**III. USAGE**_)
```html
<aping
    template-url="templates/repo.html"
    model="repo"
    items="20"
    aping-github="[{'user':'JohnnyTheTank'}]">
</aping>
```

## II. API KEY
    a) Generate your `access_token`
    b) Insert your `access_token` into `aping-config.js`

### a) Generate your `access_token`
1. Login on [github.com](https://github.com)
2. Open [github.com/settings/tokens/new](https://github.com/settings/tokens/new)
    * Remove all scopes except **public_repo**
    * Generate your access_token

### b) Insert your `access_token` into `aping-config.js`
Open `js/apiNG/aping-config.js` in your application folder. It should be look like this snippet:
```js
apingApp.config(['$provide', function ($provide) {
    $provide.constant("apingApiKeys", {
        //...
        github: [
            {'access_token':'<YOUR_GITHUB_ACCESS_TOKEN>'}
        ],
        //...
    });

    $provide.constant("apingDefaultSettings", {
        //...
    });
}]);
```

:warning: Replace `<YOUR_GITHUB_ACCESS_TOKEN>` with your github `access_token`

## III. USAGE
    a) Models
    b) Requests
    c) Rate limit

### a) Models
Supported apiNG models

|  model   | content | support | max items<br>per request | (native) default items<br>per request |
|----------|---------|---------|--------|---------|
| `rep` | **repositories** | full    | `100`   | `30`   |

**support:**
* full: _the source platform provides a full list with usable results_ <br>
* partly: _the source platfrom provides just partly usable results_


### b) Requests
Every **apiNG plugin** expects an array of **requests** as html attribute.


#### Requests by User
|  parameter  | sample | default | description | optional |
|----------|---------|---------|---------|---------|
| **`user`** | `JohnnyTheTank` |  | GitHub username | no |
| **`repo`** | `apiNG` |  | Limits the request to specific GitHub repository name | yes |
| **`items`**  | `75` | `30` | Items per request (`0`-`100`) |  yes  |

Sample requests:
* `[{'user':'JohnnyTheTank'}, {'user':'xremix'}]`
* `[{'user':'JohnnyTheTank', 'repo':'apiNG', 'items':10}]`

#### Requests by Search
|  parameter  | sample | default | description | optional |
|----------|---------|---------|---------|---------|
| **`search`** | `bootstrap` |  | The search keywords, as well as any qualifierse | no |
| **`sort`** | `stars` |  | The sort field. One of `stars`, `forks`, or `updated`. Default: results are sorted by best match | yes |
| **`order`** | `asc` | `desc` | The sort order if `sort` parameter is provided. One of `asc` or `desc` | yes |
| **`items`**  | `75` | `30` | Items per request (`0`-`100`) |  yes  |

Sample requests:
* `[{'search':'apiNG', 'sort':'stars', 'order':'desc', 'items':50}]`

### c) Rate limit
Visit the official [GitHub Data API documentation](https://developer.github.com/v3/#rate-limiting)
> For requests using Basic Authentication or OAuth, you can make up to 5,000 requests per hour.

# Licence
MIT

