/*!
 * https://www.instapio.com
 * Copyright(c) 2013-2017 Instapio, Inc
 * MIT Licensed
 */
angular.module('app').controller('DashboardCtrl', ['$scope', '$rootScope', '$routeParams', '$http', '$cookies', '$window', '$mdDialog', '$mdMedia', '$timeout', '$location',
    function($scope, $rootScope, $routeParams, $http, $cookies, $window, $mdDialog, $mdMedia, $timeout, $location) {
        console.log("Starting DashboardCtrl Controller");
        console.log(page_data);
        $scope.locations = [{
            id: "/",
            name: "All",
            path: "/",
            path_name: "/"
        }];
        $scope.selectedLocation = {
            id: "/"
        };
        for (var j = 0; j < page_data.connections.length; j++) {
            var l_id = page_data.connections[j].location.id;
            for (var x = 0; x < page_data.locations.length; x++) {
                if (page_data.locations[x].id == l_id) {
                    page_data.connections[j].location = page_data.locations[x];
                    if (page_data.connectiondbs[page_data.connections[j].id]) {
                        page_data.connections[j].data = page_data.connectiondbs[page_data.connections[j].id]
                    }
                    break;
                }
            }
        }
        for (var i = 0; i < page_data.locations.length; i++) {
            if (page_data.locations[i].depth == page_data.account.depth) {
                var location = page_data.locations[i];
                $scope.locations.push(location);
            }
        }

        $scope.connections = page_data.connections;
        console.log("Locations");
        console.log($scope.locations);
        console.log("Connections");
        console.log($scope.connections);

    }
]);