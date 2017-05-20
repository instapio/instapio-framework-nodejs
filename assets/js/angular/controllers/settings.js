/*!
 * https://www.instapio.com
 * Copyright(c) 2013-2017 Instapio, Inc
 * MIT Licensed
 */
angular.module('app').controller('SettingsCtrl', ['$scope', '$rootScope', '$routeParams', '$http', '$cookies', '$window', '$mdDialog', '$mdMedia', '$timeout', '$location',
    function($scope, $rootScope, $routeParams, $http, $cookies, $window, $mdDialog, $mdMedia, $timeout, $location) {
        console.log("Starting SettingsCtrl Controller");
        console.log(page_data);
        $scope.form = page_data.form;
        $scope.entity = page_data.entity;
        $scope.$watch('entity', function(newVal, oldVal) {
            console.log("Entity Changed");
            console.log(newVal);
            $http({ method: 'POST', url: '/settings/validate?jwt=' + page_data.TOKEN, data: $scope.entity }).then(function(json) {
                console.log("Validated");
                console.log(json.data);
            });
        }, true)
        $scope.save = function(cb) {
            console.log("Saving Settings");
            console.log($scope.entity);
            $http({ method: 'PUT', url: '/settings/?jwt=' + page_data.TOKEN, data: $scope.entity }).then(function(json) {
                console.log("Saved");
                console.log(json);
                $rootScope.$applyAsync();
                return cb();
            });
        }
        var refresh = function() {
            $http({ method: 'GET', url: '/settings/?json=true&jwt=' + page_data.TOKEN, data: $scope.entity }).then(function(json) {
                console.log("Received Update");
                $scope.entity = json.entity;
                $timeout(refresh, 5000);
            });
        }
        instapio.OnSave = function(cb) {
            $scope.save(cb);
        }
    }
]);