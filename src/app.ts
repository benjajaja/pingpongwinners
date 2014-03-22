/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angularjs/angular-route.d.ts" />
/// <reference path="../typings/moment/moment.d.ts" />
/// <reference path="../typings/d3/d3.d.ts" />

/// <reference path="Navbar.ts" />
/// <reference path="Matches.ts" />
/// <reference path="Players.ts" />

interface IProgress {
	start: () => void;
	complete: () => void;
	stop: () => void;
	reset: () => void;
}

interface IServerError {
	code:string;
	message:string;
}

moment.lang('es');

var pingpong = angular.module('pingpong', ['ngRoute', 'ui.bootstrap', 'ngProgress']);

pingpong.config(function($routeProvider: ng.route.IRouteProvider, $httpProvider: ng.IHttpProvider) {

	$routeProvider
	.when('/', {
		redirectTo: '/matches'
	})
	.when('/matches', {
		templateUrl: 'partials/match-list.html',
		controller: 'MatchListCtrl'
	})
	.when('/matches/create', {
		templateUrl: 'partials/match-create.html',
		controller: 'MatchCreateCtrl'
	})
	.when('/players', {
		templateUrl: 'partials/player-list.html',
		controller: 'PlayerListCtrl'
	})
	.when('/players/create', {
		templateUrl: 'partials/player-create.html',
		controller: 'PlayerCreateCtrl'
	})
	.when('/players/:name', {
		templateUrl: 'partials/player-detail.html',
		controller: 'PlayerDetailCtrl'
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

	$httpProvider.interceptors.push(function($q: ng.IQService, $injector: ng.auto.IInjectorService) {

	    return {
	    	'request': function(config: any) {
	    		if (config.url.indexOf('api/') === 0) {
		        	$injector.invoke(function(ngProgress: IProgress) {
		        		ngProgress.stop();
		        		ngProgress.start();
		        	});
		        }

	        	return config || $q.when(config);
	    	},

	    	'response': function(response: ng.IHttpPromiseCallbackArg<any>) {
	    		if (response.config.url.indexOf('api/') === 0) {
	    			$injector.invoke(function(ngProgress: IProgress) {
		        		ngProgress.complete();
		        	});
		        }

				return response || $q.when(response);
			},

			'responseError': function(rejection: ng.IHttpPromiseCallbackArg<IServerError>) {
				if (rejection.config.url.indexOf('api/') === 0) {
					window.alert('Error: ' + rejection.data.message);
					$injector.invoke(function(ngProgress: IProgress) {
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
