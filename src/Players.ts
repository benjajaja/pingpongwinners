



interface IPlayerDetailParams {
	name: string;
}

interface IPlayerListScope extends ng.IScope {
	players: Players.IPlayer[];
}

interface IPlayerScope extends ng.IScope {
	player: Players.IPlayer;
}

interface IPlayerCreateScope extends ng.IScope {
	player: Players.IPlayer;
	submit: Function;
}


module Players {

	export interface IPlayer {
		name: string;
		fullName: string;
	}

	export function PlayerListCtrl($scope: IPlayerListScope, $http: ng.IHttpService) {
		$http.get('api/players').success(function(data: IPlayer[]) {
			$scope.players = data;
		});
	}

	export function PlayerDetailCtrl($scope: IPlayerScope, $routeParams: IPlayerDetailParams, $http: ng.IHttpService, $location: ng.ILocationService) {
		$http.get('api/players/' + $routeParams.name).success(function(data: IPlayer) {
			$scope.player = data;
		}).error(function(error, status) {
			if (status === 404) {
				$location.path('/404');
			} else {
				$location.path('/error');
			}
		});
	}

	export function PlayerCreateCtrl($scope: IPlayerCreateScope, $http: ng.IHttpService, $location: ng.ILocationService) {
		$scope.player = {
			name: '',
			fullName: ''
		};
		$scope.submit = function() {
			$http.post('api/players/' + $scope.player.name, $scope.player).success(function(data: IPlayer) {
				$location.path('players/' + data.name);

			}).error(function(error, status) {
				alert('Error: ' + error);
				console.log(arguments);
			});
		};
	}
}