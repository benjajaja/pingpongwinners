/// <reference path="players/IPlayer.ts" />
/// <reference path="players/IDetailPlayer.ts" />


interface IPlayerDetailParams {
	name: string;
}

interface IPlayerListScope extends ng.IScope {
	players: players.IPlayer[];
}

interface IPlayerScope extends ng.IScope {
	player: players.IDetailPlayer;
	archenemies: {
		mostPlayed: IEnemy;
		mostDefeated: IEnemy;
	};
}

interface IPlayerCreateScope extends ng.IScope {
	player: players.IPlayer;
	submit: Function;
}


interface IEnemy {
	player: players.IPlayer;
	victories:number;
	defeats:number;
	score: number;
	total:number;
}

function lineGraph(id:string, data:{x:any;y:any}[]) {
	var width = document.getElementById(id).clientWidth;
	var height = Math.floor(width / 3);

	var x = d3.time.scale()
	    .range([0, width - 10]);

	var y = d3.scale.linear()
	    .range([height - 10, 0]);

	var line = d3.svg.line()
		.interpolate("cardinal")
	    .x(function(d) { return x(d.x); })
	    .y(function(d) { return y(d.y); });


	var svg = d3.select('#' + id)
		.attr("height", height)
		.append('g')
		.attr('width', width - 10)
		.attr('height', height - 10)
		.attr("transform", "translate(5, 5)");

	x.domain(d3.extent(data, function(d) { return d.x; }));
	y.domain(d3.extent(data, function(d) { return d.y; }));


	var path = svg.append("path")
		//.datum(data)
		.attr("class", "line")
		.attr("d", line(data))
	
	var totalLength = (<any>path.node()).getTotalLength();
	path
		.attr("stroke-dasharray", totalLength + " " + totalLength)
		.attr("stroke-dashoffset", totalLength)
		.transition()
		.duration(500)
		.ease("cubic")
		.attr("stroke-dashoffset", 0);
}

function donutGraph(id:string, data:{name:string;value:any}[], score:number) {
	var width = document.getElementById(id).clientWidth;
	var height = width;
	var radius = Math.min(width, height) / 2;

	var color = d3.scale.ordinal().range(["#cc0000", "#00cc00"]);

    var arc = d3.svg.arc()
	    .outerRadius(radius - 10)
	    .innerRadius(radius - 70);

	var pie = d3.layout.pie()
	    .sort(null)
	    .value(function(d) { return d.value; });

	var svg = d3.select('#' + id)
	    .attr("width", width)
	    .attr("height", height)
	  	.append("g")
	    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	  var g = svg.selectAll(".arc")
	      .data(pie(data))
	    .enter().append("g")
	      .attr("class", "arc");

	  g.append("path")
	      .attr("d", arc)
	      .style("fill", function(d:any) { return color(d.data.name); });

	  g.append("text")
	      .attr("transform", function(d:any) { return "translate(" + arc.centroid(d) + ")"; })
	      .attr("dy", ".35em")
	      .style("text-anchor", "middle")
	      .text(function(d:any) { return d.data.name; });

	  g.append("text")
	  	  .attr("dy", "20px")
	  	  .style("font-size", "60px")
	      .style("text-anchor", "middle")
	      .text(''+score);

}

module players {

	export function PlayerListCtrl($scope: IPlayerListScope, $http: ng.IHttpService) {
		$http.get('api/players').success(function(data: IPlayer[]) {
			$scope.players = data;
		});
	}

	export function PlayerDetailCtrl($scope: IPlayerScope, $routeParams: IPlayerDetailParams, $http: ng.IHttpService, $location: ng.ILocationService) {
		$http.get('api/players/' + $routeParams.name).success(function(player: IDetailPlayer) {
			$scope.player = player;

			var score = 0;
			var matchEvolutionData = player.matches.map(function(match) {
				return {
					x: new Date(match.date),
					y: score += (match.winner.name === player.name ? 1 : -1)
				};
			});
			lineGraph('chart-tendence', matchEvolutionData);


			var enemies = player.matches.reduce(function(enemies:IEnemy[], match:matches.IMatch) : IEnemy[] {
				var isOpponentLoser = match.winner.name === player.name;
				var opponent = (isOpponentLoser ? match.loser : match.winner);

				var enemy = enemies.reduce(function(match:IEnemy, enemy:IEnemy) {
					if (enemy.player.name === opponent.name) return enemy;
					else return match;
				}, null);

				if (enemy === null) {
					enemy = {
						player: opponent,
						victories: 0,
						defeats: 0,
						score: 0,
						total: 0
					};
					enemies.push(enemy);
				}

				enemy.total += 1;
				if (isOpponentLoser) {
					enemy.defeats += 1;
				} else {
					enemy.victories += 1;
				}
				enemy.score = enemy.defeats - enemy.victories;

				return enemies;
			}, []);
			
			var mostPlayed = enemies.reduce(function(most:IEnemy, enemy:IEnemy) {
				if (most === null || enemy.total > most.total) {
					return enemy;
				} else {
					return most;
				}
			}, null);
			
			var mostDefeated = enemies.reduce(function(most:IEnemy, enemy:IEnemy) {
				if (most === null || enemy.victories > most.victories || 
						(enemy.victories === most.victories && enemy.defeats < most.defeats)) {
					return enemy;
				}
				return most;
			}, null);

			$scope.archenemies = {
				mostPlayed: mostPlayed,
				mostDefeated: mostDefeated
			};
			console.log(mostDefeated)
			donutGraph('chart-archenemy-played', [{name:'Derrotas', value: mostPlayed.victories}, {name:'Victorias', value: mostPlayed.defeats}], mostPlayed.score);
			donutGraph('chart-archenemy-lost', [{name:'Derrotas', value: mostDefeated.victories}, {name:'Victorias', value: mostDefeated.defeats}], mostDefeated.score);
		});
	}

	export function PlayerCreateCtrl($scope: IPlayerCreateScope, $http: ng.IHttpService, $location: ng.ILocationService) {
		$scope.player = {
			name: '',
			fullName: ''
		};
		$scope.submit = function() {
			$http.post('api/players', $scope.player).success(function(data: IPlayer) {
				$location.path('players/' + $scope.player.name);
			});
		};
	}
}
