var navbar;
(function (navbar) {
    function NavbarCtrl($scope) {
        $scope.isCollapsed = true;
    }
    navbar.NavbarCtrl = NavbarCtrl;
})(navbar || (navbar = {}));
/// <reference path="matches/IMatch.ts" />
/// <reference path="matches/IResult.ts" />
/// <reference path="matches/INewMatch.ts" />

var matches;
(function (matches) {
    function MatchListCtrl($scope, $http) {
        $http.get('api/matches').success(function (data) {
            $scope.matches = data.map(function (match) {
                var date = moment(match.date);
                match.date = date.calendar();
                return match;
            });
        });
    }
    matches.MatchListCtrl = MatchListCtrl;

    function MatchCreateCtrl($scope, $http, $location) {
        $scope.dateDate = new Date();
        $scope.dateTime = new Date();

        $scope.submit = function () {
            if (!$scope.winner || !$scope.loser || !$scope.result) {
                return alert('Debes rellenar todo');
            }
            var data = {
                date: (new Date($scope.dateDate.getTime() + ($scope.dateTime.getHours() * 3600000 + $scope.dateTime.getMinutes() * 60000))).toISOString(),
                winner: $scope.winner,
                loser: $scope.loser,
                result: $scope.result
            };

            console.log(JSON.stringify(data));

            $http.post('api/matches', data).success(function () {
                $location.path('matches');
            });
        };

        $http.get('api/players').success(function (data) {
            $scope.players = data;
        });
    }
    matches.MatchCreateCtrl = MatchCreateCtrl;
})(matches || (matches = {}));
/// <reference path="players/IPlayer.ts" />
/// <reference path="players/IDetailPlayer.ts" />

function lineGraph(id, data) {
    var width = document.getElementById(id).clientWidth;
    var height = Math.floor(width / 3);

    var x = d3.time.scale().range([0, width - 10]);

    var y = d3.scale.linear().range([height - 10, 0]);

    var line = d3.svg.line().interpolate("cardinal").x(function (d) {
        return x(d.x);
    }).y(function (d) {
        return y(d.y);
    });

    var svg = d3.select('#' + id).attr("height", height).append('g').attr('width', width - 10).attr('height', height - 10).attr("transform", "translate(5, 5)");

    x.domain(d3.extent(data, function (d) {
        return d.x;
    }));
    y.domain(d3.extent(data, function (d) {
        return d.y;
    }));

    var path = svg.append("path").attr("class", "line").attr("d", line(data));

    var totalLength = path.node().getTotalLength();
    path.attr("stroke-dasharray", totalLength + " " + totalLength).attr("stroke-dashoffset", totalLength).transition().duration(500).ease("cubic").attr("stroke-dashoffset", 0);
}

function donutGraph(id, data) {
    var width = document.getElementById(id).clientWidth;
    var height = width;
    var radius = Math.min(width, height) / 2;

    var color = d3.scale.ordinal().range(["#cc0000", "#00cc00"]);

    var arc = d3.svg.arc().outerRadius(radius - 10).innerRadius(radius - 70);

    var pie = d3.layout.pie().sort(null).value(function (d) {
        return d.value;
    });

    var svg = d3.select('#' + id).attr("width", width).attr("height", height).append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var g = svg.selectAll(".arc").data(pie(data)).enter().append("g").attr("class", "arc");

    g.append("path").attr("d", arc).style("fill", function (d) {
        return color(d.data.name);
    });

    g.append("text").attr("transform", function (d) {
        return "translate(" + arc.centroid(d) + ")";
    }).attr("dy", ".35em").style("text-anchor", "middle").text(function (d) {
        return d.data.name;
    });
}

var players;
(function (players) {
    function PlayerListCtrl($scope, $http) {
        $http.get('api/players').success(function (data) {
            $scope.players = data;
        });
    }
    players.PlayerListCtrl = PlayerListCtrl;

    function PlayerDetailCtrl($scope, $routeParams, $http, $location) {
        $http.get('api/players/' + $routeParams.name).success(function (player) {
            $scope.player = player;

            var score = 0;
            var matchEvolutionData = player.matches.map(function (match) {
                return {
                    x: new Date(match.date),
                    y: score += (match.winner.name === player.name ? 1 : -1)
                };
            });
            lineGraph('chart-tendence', matchEvolutionData);

            var enemies = player.matches.reduce(function (enemies, match) {
                var isOpponentLoser = match.winner.name === player.name;
                var opponent = (isOpponentLoser ? match.loser : match.winner);

                var enemy = enemies.reduce(function (match, enemy) {
                    if (enemy.player.name === opponent.name)
                        return enemy;
                    else
                        return match;
                }, null);

                if (enemy === null) {
                    enemy = {
                        player: opponent,
                        victories: 0,
                        defeats: 0,
                        total: 0
                    };
                    enemies.push(enemy);
                }

                enemy.total += 1;
                enemy[isOpponentLoser ? 'defeats' : 'victories'] += 1;

                return enemies;
            }, []);

            var mostPlayed = enemies.reduce(function (most, enemy) {
                if (most === null || enemy.total > most.total) {
                    return enemy;
                } else {
                    return most;
                }
            }, null);

            var mostDefeated = enemies.reduce(function (most, enemy) {
                if (most === null || enemy.victories > most.victories || (enemy.victories === most.victories && enemy.defeats < most.defeats)) {
                    return enemy;
                }
                return most;
            }, null);

            $scope.archenemies = {
                mostPlayed: mostPlayed.player,
                mostDefeated: mostDefeated.player
            };
            console.log(mostDefeated);
            donutGraph('chart-archenemy-played', [{ name: 'Derrotas', value: mostPlayed.victories }, { name: 'Victorias', value: mostPlayed.defeats }]);
            donutGraph('chart-archenemy-lost', [{ name: 'Derrotas', value: mostDefeated.victories }, { name: 'Victorias', value: mostDefeated.defeats }]);
        });
    }
    players.PlayerDetailCtrl = PlayerDetailCtrl;

    function PlayerCreateCtrl($scope, $http, $location) {
        $scope.player = {
            name: '',
            fullName: ''
        };
        $scope.submit = function () {
            $http.post('api/players', $scope.player).success(function (data) {
                $location.path('players/' + $scope.player.name);
            });
        };
    }
    players.PlayerCreateCtrl = PlayerCreateCtrl;
})(players || (players = {}));
/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="../typings/angularjs/angular-route.d.ts" />
/// <reference path="../typings/moment/moment.d.ts" />
/// <reference path="../typings/d3/d3.d.ts" />
/// <reference path="navbar.ts" />
/// <reference path="matches.ts" />
/// <reference path="players.ts" />

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

pingpong.controller('NavbarCtrl', navbar.NavbarCtrl);

pingpong.controller('MatchListCtrl', matches.MatchListCtrl);

pingpong.controller('MatchCreateCtrl', matches.MatchCreateCtrl);

pingpong.controller('PlayerListCtrl', players.PlayerListCtrl);

pingpong.controller('PlayerDetailCtrl', players.PlayerDetailCtrl);

pingpong.controller('PlayerCreateCtrl', players.PlayerCreateCtrl);
//# sourceMappingURL=app.js.map
