/*!
 * https://www.instapio.com
 * Copyright(c) 2013-2017 Instapio, Inc
 * MIT Licensed
 */
var loadModules = [
    'ngRoute',
    'ngAnimate',
    'ngCookies',
    'ngAria',
    'ngMaterial',
    'ngMessages',
    'ngMdIcons',
    'highcharts-ng'
];
var settingsApp = angular.module('app', loadModules).run(['$http', '$cookies', '$rootScope', '$mdMedia', '$location', function($http, $cookies, $rootScope, $mdMedia, $location) {
    $rootScope.Math = Math;
    $rootScope.$mdMedia = $mdMedia;
    $rootScope.moment = moment;
    $rootScope.numeral = numeral;
    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });
    //$http['defaults']['headers']['common']['Content-Type'] = 'application/json;charset=utf-8';
}]);

angular.module('app').config(["$mdThemingProvider", function($mdThemingProvider) {

    $mdThemingProvider
        .theme('default')
        .primaryPalette('blue')
        .accentPalette('teal')
        .warnPalette('red')
        .backgroundPalette('grey');

    $mdThemingProvider.alwaysWatchTheme(true);
}]);
angular.module('app').config(["$mdIconProvider", function($mdIconProvider) {
    $mdIconProvider.fontSet('mdi', 'mdi');
}]);
angular.module('app').config(["$sceProvider", function($sceProvider) {
    $sceProvider.enabled(false);
}]);
angular.module('app').config(['$compileProvider', function($compileProvider) {
    $compileProvider.debugInfoEnabled(false);
}]);
angular.module('app').config(['$compileProvider',
    function($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
    }
]);