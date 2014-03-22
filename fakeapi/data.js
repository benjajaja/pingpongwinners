var data = {};

data.players = [
	{
		"name": "benja",
		"fullName": "Benjamin der Grosse",
		"avatarURL": "http://img1.wikia.nocookie.net/__cb20130514210844/sarugetchu/images/b/b1/ApeWelcome.png"
	},
	{
		"name": "oscar",
		"fullName": "Oscar el de Lleida"
	},
	{
		"name": "gabriel",
		"fullName": "Gabriel"
	}
];

data.matches = [
	{
		"date": "2014-03-21T14:45:00.000Z",
		"winner": data.players[0],
		"loser": data.players[1],
		"result": {"winnerPoints": 2, "loserPoints": 0}
	},
	{
		"date": "2014-03-20T14:45:00.000Z",
		"winner": data.players[0],
		"loser": data.players[1],
		"result": {"winnerPoints": 2, "loserPoints": 0}
	},
	{
		"date": "2014-03-19T11:45:00.000Z",
		"winner": data.players[0],
		"loser": data.players[1],
		"result": {"winnerPoints": 2, "loserPoints": 1}
	},

	{
		"date": "2014-03-18T12:45:00.000Z",
		"winner": data.players[1],
		"loser": data.players[0],
		"result": {"winnerPoints": 2, "loserPoints": 1}
	},
	{
		"date": "2014-03-17T15:45:00.000Z",
		"winner": data.players[2],
		"loser": data.players[0],
		"result": {"winnerPoints": 2, "loserPoints": 0}
	},
	{
		"date": "2014-03-15T10:45:00.000Z",
		"winner": data.players[1],
		"loser": data.players[2],
		"result": {"winnerPoints": 2, "loserPoints": 1}
	}
];

module.exports = data;