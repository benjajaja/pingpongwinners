var data = {};

data.players = [
	{
		"name": "benja",
		"fullName": "Benjamin der Grosse",
		"totalMatches": 9001,
		"victories": 9000,
		"defeats": 1,
		"avatarURL": "http://img1.wikia.nocookie.net/__cb20130514210844/sarugetchu/images/b/b1/ApeWelcome.png"
	},
	{
		"name": "oscar",
		"fullName": "Oscar el de Lleida",
		"totalMatches": 9001,
		"victories": 9000,
		"defeats": 1
	}
];

data.matches = [
	{
		"winner": data.players[0],
		"loser": data.players[1],
		"result": {"winnerPoints": 2, "loserPoints": 1}
	},
	{
		"winner": data.players[1],
		"loser": data.players[0],
		"result": {"winnerPoints": 2, "loserPoints": 0}
	}
];

module.exports = data;