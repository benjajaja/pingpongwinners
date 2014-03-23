module players {

	export interface IPlayer {
		
		name: string; // internal id, used in URLs

		fullName: string; // display name, should be short to avoid breaking layout

	}

}