/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angularjs/angular-route.d.ts" />

/// <reference path="Navbar.ts" />
/// <reference path="matches/Matches.ts" />
/// <reference path="players/Players.ts" />

var pingpong = angular.module('pingpong', ['ngRoute', 'ui.bootstrap']);

pingpong.config(['$routeProvider', function($routeProvider: ng.route.IRouteProvider) {

	$routeProvider
	.when('/matches', {
		templateUrl: 'partials/match-list.html',
		controller: 'MatchListCtrl'
	})
	.when('/matches/create', {
		templateUrl: 'partials/match-create.html',
		controller: 'MatchCreateCtrl'
	})
	.when('/players/create', {
		templateUrl: 'partials/player-create.html',
		controller: 'PlayerCreateCtrl'
	})
	.when('/players/:name', {
		templateUrl: 'partials/player-detail.html',
		controller: 'PlayerDetailCtrl'
	})
	.when('/', {
		redirectTo: '/matches'
	})
	.when('/404', {
		templateUrl: 'partials/404.html',
	})
	.when('/error', {
		templateUrl: 'partials/error.html',
	})
	.otherwise({
		redirectTo: '/404'
	});

}]);


pingpong.controller('NavbarCtrl', Navbar.NavbarCtrl);

pingpong.controller('MatchListCtrl', Matches.MatchListCtrl);

pingpong.controller('MatchCreateCtrl', ['$scope', '$http', '$location', Matches.MatchCreateCtrl]);

pingpong.controller('PlayerDetailCtrl', ['$scope', '$routeParams', '$http', '$location', Players.PlayerDetailCtrl]);

pingpong.controller('PlayerCreateCtrl', ['$scope', '$http', '$location', Players.PlayerCreateCtrl]);
