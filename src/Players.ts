



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


interface IDetailPlayer extends Players.IPlayer {
	matches: Matches.IMatch[];
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
		$http.get('api/players/' + $routeParams.name).success(function(player: IDetailPlayer) {
			$scope.player = player;

			var score = 0;
			var data = player.matches.map(function(match) {
				console.log(match.date, score, score + (match.winner.name === player.name ? 1 : -1), match.winner.name);
				return {
					date: new Date(match.date),
					score: score += (match.winner.name === player.name ? 1 : -1)
				};
			});


			var margin = {top: 20, right: 20, bottom: 30, left: 50},
			    width = document.getElementById('chart-tendence').clientWidth - margin.left - margin.right,
			    height = 200 - margin.top - margin.bottom;

			var x = d3.time.scale()
			    .range([0, width]);

			var y = d3.scale.linear()
			    .range([height, 0]);

			var line = d3.svg.line()
				.interpolate("cardinal")
			    .x(function(d) { return x(d.date); })
			    .y(function(d) { return y(d.score); });


			var svg = d3.select("#chart-tendence")
				//.attr("width", width + margin.left + margin.right)
    			.attr("height", height + margin.top + margin.bottom)
				.append('g');

			x.domain(d3.extent(data, function(d) { return d.date; }));
			y.domain(d3.extent(data, function(d) { return d.score; }));


			var path = svg.append("path")
				//.datum(data)
				.attr("class", "line")
				.attr("d", line(data))
			
			var totalLength = (<any>path.node()).getTotalLength();
			path.attr("stroke-dasharray", totalLength + " " + totalLength)
				.attr("stroke-dashoffset", totalLength)
				.transition()
				.duration(2000)
				.ease("linear")
				.attr("stroke-dashoffset", 0);
				
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
			});
		};
	}
}