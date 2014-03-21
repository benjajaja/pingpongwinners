var Navbar;
(function (Navbar) {
    function NavbarCtrl($scope) {
        $scope.isCollapsed = true;
    }
    Navbar.NavbarCtrl = NavbarCtrl;
})(Navbar || (Navbar = {}));
var Matches;
(function (Matches) {
    function MatchListCtrl($scope, $http) {
        $http.get('api/matches').success(function (data) {
            $scope.matches = data;
        });
    }
    Matches.MatchListCtrl = MatchListCtrl;

    function MatchCreateCtrl($scope, $http, $location) {
        $scope.players = [
            {
                "name": "benja",
                "fullName": "Benjamin der Grosse",
                "totalMatches": 9001,
                "victories": 9000,
                "defeats": 1,
                "avatarURL": "http://img1.wikia.nocookie.net/__cb20130514210844/sarugetchu/images/b/b1/ApeWelcome.png"
            }, {
                "name": "oscar",
                "fullName": "Oscar bob esponja",
                "totalMatches": 9001,
                "victories": 9000,
                "defeats": 1,
                "avatarURL": "http://img1.wikia.nocookie.net/__cb20130514210844/sarugetchu/images/b/b1/ApeWelcome.png"
            }];

        $scope.submit = function () {
            var data = {
                date: $scope.date,
                winner: $scope.winner,
                loser: $scope.loser,
                result: $scope.result
            };

            console.log(JSON.stringify(data));

            $http.post('api/matches', data).success(function (data) {
                //$location.path('players/' + data.name);
            }).error(function (error, status) {
                alert('Error: ' + error);
                console.log(arguments);
            });
        };

        $http.get('api/players').success(function (data) {
            // FIXME: uncomment if when API is ready
            if (typeof data === 'object')
                $scope.players = data;
        });
    }
    Matches.MatchCreateCtrl = MatchCreateCtrl;
})(Matches || (Matches = {}));
var Players;
(function (Players) {
    function PlayerDetailCtrl($scope, $routeParams, $http, $location) {
        $http.get('api/players/' + $routeParams.name).success(function (data) {
            $scope.player = data;
        }).error(function (error, status) {
            if (status === 404) {
                $location.path('/404');
            } else {
                $location.path('/error');
            }
        });
    }
    Players.PlayerDetailCtrl = PlayerDetailCtrl;

    function PlayerCreateCtrl($scope, $http, $location) {
        $scope.player = {
            name: '',
            fullName: ''
        };
        $scope.submit = function () {
            $http.post('api/players/' + $scope.player.name, $scope.player).success(function (data) {
                $location.path('players/' + data.name);
            }).error(function (error, status) {
                alert('Error: ' + error);
                console.log(arguments);
            });
        };
    }
    Players.PlayerCreateCtrl = PlayerCreateCtrl;
})(Players || (Players = {}));
/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angularjs/angular-route.d.ts" />
/// <reference path="Navbar.ts" />
/// <reference path="matches/Matches.ts" />
/// <reference path="players/Players.ts" />
var pingpong = angular.module('pingpong', ['ngRoute', 'ui.bootstrap']);

pingpong.config([
    '$routeProvider', function ($routeProvider) {
        $routeProvider.when('/matches', {
            templateUrl: 'partials/match-list.html',
            controller: 'MatchListCtrl'
        }).when('/matches/create', {
            templateUrl: 'partials/match-create.html',
            controller: 'MatchCreateCtrl'
        }).when('/players/create', {
            templateUrl: 'partials/player-create.html',
            controller: 'PlayerCreateCtrl'
        }).when('/players/:name', {
            templateUrl: 'partials/player-detail.html',
            controller: 'PlayerDetailCtrl'
        }).when('/', {
            redirectTo: '/matches'
        }).when('/404', {
            templateUrl: 'partials/404.html'
        }).when('/error', {
            templateUrl: 'partials/error.html'
        }).otherwise({
            redirectTo: '/404'
        });
    }]);

pingpong.controller('NavbarCtrl', Navbar.NavbarCtrl);

pingpong.controller('MatchListCtrl', Matches.MatchListCtrl);

pingpong.controller('MatchCreateCtrl', ['$scope', '$http', '$location', Matches.MatchCreateCtrl]);

pingpong.controller('PlayerDetailCtrl', ['$scope', '$routeParams', '$http', '$location', Players.PlayerDetailCtrl]);

pingpong.controller('PlayerCreateCtrl', ['$scope', '$http', '$location', Players.PlayerCreateCtrl]);
//# sourceMappingURL=app.js.map
