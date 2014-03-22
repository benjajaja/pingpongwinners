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

var data = require('./data.js');

server.get('/api/matches', function (req, res, next) {
 	res.send(data.matches);
 	return next();
});


server.get('/api/players', function (req, res, next) {
 	res.send(data.players);
 	return next();
});

server.get('/api/players/:name', function (req, res, next) {
	var player = _.find(data.players, function(player) {
 		return player.name === req.params.name;
 	});

 	if (typeof player !== 'undefined') {
 		res.send(player);
 		return next();
 	} else {
 		res.send(404, new Error('player not found'));
 	}
 	
});


server.get(/\/?.*/, restify.serveStatic({
   directory: '../',
   default: 'index.html'
}));

server.listen(parseInt(process.env.PORT || 5000), function () {
	console.log('%s listening at %s', server.name, server.url);
});