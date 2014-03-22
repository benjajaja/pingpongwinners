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
            $scope.matches = data.map(function (match) {
                var date = moment(match.date);
                match.date = date.calendar();
                return match;
            });
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
                date: new Date($scope.date.getTime() + ($scope.time.getHours() * 3600000 + $scope.time.getMinutes() * 60000)),
                winner: $scope.winner,
                loser: $scope.loser,
                result: $scope.result
            };

            console.log(JSON.stringify(data));

            $http.post('api/matches', data).success(function (data) {
                $location.path('matches');
            });
        };

        $http.get('api/players').success(function (data) {
            $scope.players = data;
        });
    }
    Matches.MatchCreateCtrl = MatchCreateCtrl;
})(Matches || (Matches = {}));
var Players;
(function (Players) {
    function PlayerListCtrl($scope, $http) {
        $http.get('api/players').success(function (data) {
            $scope.players = data;
        });
    }
    Players.PlayerListCtrl = PlayerListCtrl;

    function PlayerDetailCtrl($scope, $routeParams, $http, $location) {
        $http.get('api/players/' + $routeParams.name).success(function (data) {
            $scope.player = data;
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
            });
        };
    }
    Players.PlayerCreateCtrl = PlayerCreateCtrl;
})(Players || (Players = {}));
/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angularjs/angular-route.d.ts" />
/// <reference path="../typings/moment/moment.d.ts" />
/// <reference path="Navbar.ts" />
/// <reference path="Matches.ts" />
/// <reference path="Players.ts" />

moment.lang('es');

var pingpong = angular.module('pingpong', ['ngRoute', 'ui.bootstrap', 'ngProgress']);

pingpong.config(function ($routeProvider, $httpProvider) {
    $routeProvider.when('/', {
        redirectTo: '/matches'
    }).when('/matches', {
        templateUrl: 'partials/match-list.html',
        controller: 'MatchListCtrl'
    }).when('/matches/create', {
        templateUrl: 'partials/match-create.html',
        controller: 'MatchCreateCtrl'
    }).when('/players', {
        templateUrl: 'partials/player-list.html',
        controller: 'PlayerListCtrl'
    }).when('/players/create', {
        templateUrl: 'partials/player-create.html',
        controller: 'PlayerCreateCtrl'
    }).when('/players/:name', {
        templateUrl: 'partials/player-detail.html',
        controller: 'PlayerDetailCtrl'
    }).when('/404', {
        templateUrl: 'partials/404.html'
    }).when('/error', {
        templateUrl: 'partials/error.html'
    }).otherwise({
        redirectTo: '/404'
    });

    $httpProvider.interceptors.push(function ($q, $injector) {
        return {
            'request': function (config) {
                if (config.url.indexOf('api/') === 0) {
                    $injector.invoke(function (ngProgress) {
                        ngProgress.stop();
                        ngProgress.start();
                    });
                }

                return config || $q.when(config);
            },
            'response': function (response) {
                if (response.config.url.indexOf('api/') === 0) {
                    $injector.invoke(function (ngProgress) {
                        ngProgress.complete();
                    });
                }

                return response || $q.when(response);
            },
            'responseError': function (rejection) {
                if (rejection.config.url.indexOf('api/') === 0) {
                    window.alert('Error: ' + rejection.data.message);
                    $injector.invoke(function (ngProgress) {
                        ngProgress.reset();
                    });
                }

                return $q.reject(rejection);
            }
        };
    });
});

pingpong.controller('NavbarCtrl', Navbar.NavbarCtrl);

pingpong.controller('MatchListCtrl', Matches.MatchListCtrl);

pingpong.controller('MatchCreateCtrl', Matches.MatchCreateCtrl);

pingpong.controller('PlayerListCtrl', Players.PlayerListCtrl);

pingpong.controller('PlayerDetailCtrl', Players.PlayerDetailCtrl);

pingpong.controller('PlayerCreateCtrl', Players.PlayerCreateCtrl);
//# sourceMappingURL=app.js.map
