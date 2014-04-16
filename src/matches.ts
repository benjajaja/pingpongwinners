/// <reference path="matches/IMatch.ts" />
/// <reference path="matches/IResult.ts" />
/// <reference path="matches/INewMatch.ts" />

interface IMatchListScope extends ng.IScope {
	matches: matches.IMatch[];
}

interface IMatchCreateScope extends ng.IScope, matches.INewMatch {
	players: players.IPlayer[];
	dateDate: Date;
	dateTime: Date;
	submit: Function;
}

module matches {

	export function MatchListCtrl($scope: IMatchListScope, $http: ng.IHttpService) {
		$http.get('api/matches').success(function(data: IMatch[]) {
			$scope.matches = data.map(function(match) {
				var date = moment(match.date);
				match.date = date.calendar();
				return match;
			});
		});
	}

	export function MatchCreateCtrl($scope: IMatchCreateScope, $http: ng.IHttpService, $location: ng.ILocationService) {

		$scope.submit = function() {
			var data:matches.INewMatch = {
				date: (new Date($scope.dateDate.getTime() + ($scope.dateTime.getHours() * 3600000 + $scope.dateTime.getMinutes() * 60000))).toISOString(),
			 	winner: $scope.winner,
			 	loser: $scope.loser,
			 	result: $scope.result
			};

			console.log(JSON.stringify(data));

			$http.post('api/matches', data).success(function() {
				$location.path('matches');

			});
		};

		$http.get('api/players').success(function(data: players.IPlayer[]) {
			$scope.players = data;
		});
	}
}