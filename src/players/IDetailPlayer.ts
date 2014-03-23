module players {
	export interface IDetailPlayer extends players.IPlayer {
		matches: matches.IMatch[]; // should be the lates matches where player participated
	}
}