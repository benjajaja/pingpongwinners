interface IMatchListScope extends ng.IScope {
	matches: IMatch[];
}

interface IMatchCreateScope extends ng.IScope, INewMatch {
	players: Players.IPlayer[];
	time: Date;
	submit: Function;
}

interface IResult {
	winnerPoints: number;
	loserPoints: number;
}

interface IMatch {
	date: string;
	winner: Players.IPlayer;
	loser: Players.IPlayer;
	result: IResult;
}

interface INewMatch {
	date: Date;
	winner: string;
	loser: string;
	result: IResult;
}

module Matches {
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
		$scope.players = [{
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

		$scope.submit = function() {
			var data:INewMatch = {
				date: new Date($scope.date.getTime() + ($scope.time.getHours() * 3600000 + $scope.time.getMinutes() * 60000)),
			 	winner: $scope.winner,
			 	loser: $scope.loser,
			 	result: $scope.result
			};

			console.log(JSON.stringify(data));

			$http.post('api/matches', data).success(function(data: Players.IPlayer) {
				$location.path('matches');

			});
		};

		$http.get('api/players').success(function(data: Players.IPlayer[]) {
			$scope.players = data;
		});
	}
}