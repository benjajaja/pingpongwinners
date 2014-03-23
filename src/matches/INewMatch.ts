module matches {
	export interface INewMatch {
		date: string; // ISO 8601 Date: YYYY-MM-DDTHH:mm:ss.sssZ where the timezone is always UTC as denoted by the suffix "Z"
		winner: string; // an existing players.IPlayer.name
		loser: string; // an existing players.IPlayer.name
		result: matches.IResult;
	}
}