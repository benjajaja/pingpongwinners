var fs = require('fs');
var _ = require('underscore');
var restify = require('restify');

var server = restify.createServer({
	name: 'pingpong',
	version: '1.0.0'
});
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());

server.use(function(req, res, next) {
	if (req.url.indexOf('/api') === 0) {
		setTimeout(next, 500);
		
	} else {
		next();
	}
});

var data = require('./data.js');

function playerData(player) {
	return _.extend({
		victories: data.matches.reduce(function(count, match) {
			if (match.winner.name === player.name) {
				count += 1;
			}
			return count;
		}, 0),
		defeats: data.matches.reduce(function(count, match) {
			if (match.loser.name === player.name) {
				count += 1;
			}
			return count;
		}, 0),
		totalMatches: data.matches.reduce(function(count, match) {
			if (match.winner.name === player.name || match.loser.name === player.name) {
				count += 1;
			}
			return count;
		}, 0)
	}, player);
}

server.get('/api/matches', function (req, res, next) {
 	res.send(data.matches);
 	return next();
});

server.get('/api/players', function (req, res, next) {
	res.send(_.sortBy(data.players.map(playerData), function(player) {
		return 0 - (player.victories - player.defeats);
	}));
 	
 	return next();
});

server.get('/api/players/:name', function (req, res, next) {
	var player = _.find(data.players, function(player) {
 		return player.name === req.params.name;
 	});

 	if (typeof player !== 'undefined') {
 		res.send(_.extend(playerData(player), {
 			matches: _.sortBy(_.filter(data.matches, function(match) {
 				return match.winner.name === player.name || match.loser.name === player.name;
 			}), 'date')
 		}));
 		//res.send(player);
 		return next();
 	} else {
 		res.send(404, new Error('player not found'));
 	}
 	
});


server.get(/\/?.*/, restify.serveStatic({
   directory: './dist',
   default: 'index.html'
}));

server.listen(parseInt(process.env.PORT || 5000), function () {
	console.log('%s listening at %s', server.name, server.url);
});