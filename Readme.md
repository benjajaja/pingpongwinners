# Ping pong API and types description

---

## Types
#### Match
https://github.com/gipsy-king/pingpongwinners/blob/master/src/matches/IMatch.ts

#### Result
https://github.com/gipsy-king/pingpongwinners/blob/master/src/matches/IResult.ts

#### Player
https://github.com/gipsy-king/pingpongwinners/blob/master/src/players/IPlayer.ts

#### NewMatch
https://github.com/gipsy-king/pingpongwinners/blob/master/src/matches/INewMatch.ts  
extends `Match`

#### DetailedPlayer
https://github.com/gipsy-king/pingpongwinners/blob/master/src/players/IPlayer.ts  
extends `Player`

---

## RESTful API

#### /matches
GET returns: array of `Match`

POST parameters: `NewMatch`, creates a match

#### /players
GET returns: array of `Player`

POST parameters: `Player`, creates a player

#### /players/:name
GET returns: `DetailedPlayer`

## Planned features

* Paging for /players and /matches