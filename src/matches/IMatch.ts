module matches {

	export interface IMatch {

		date: string; // if talking with API, always a ISO 8601 Date: YYYY-MM-DDTHH:mm:ss.sssZ where the timezone is always UTC as denoted by the suffix "Z"
					  // if displaying in client, a human readable date

		winner: players.IPlayer;
		loser: players.IPlayer;
		result: matches.IResult;

	}

}