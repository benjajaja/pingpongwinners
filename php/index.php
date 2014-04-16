<?php

require 'Slim/Slim.php';
\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

$app->get('/players', function () {
				   $con=mysqli_connect("localhost","root","","idkpong");
				// Check connection
				if (mysqli_connect_errno())
				  {
				  echo "Failed to connect to MySQL: " . mysqli_connect_error();
				  }

				$result = mysqli_query($con,"SELECT * FROM players");

				$players = array();

				while($row = mysqli_fetch_array($result))
				  {
				  	$player["name"] = $row["name"];
				  	$player["fullName"] = $row["fullName"];
				  array_push($players, $player);
				  }

				mysqli_close($con);

				echo json_encode($players);
});

$app->get('/players/:player', function ($playerID) {
				$con=mysqli_connect("localhost","root","","idkpong");
				// Check connection
				if (mysqli_connect_errno())
				  {
				  echo "Failed to connect to MySQL: " . mysqli_connect_error();
				  }

				$result = mysqli_query($con,"SELECT * FROM players WHERE name = '" . $playerID . "'");

				$players = array();
				while($row = mysqli_fetch_array($result))
				 {
				  	$player["name"] = $row["name"];
				  	$player["fullName"] = $row["fullName"];
				  	$player["matches"] = getMatchesForUser($row["id"]);
				  	//mysqli_close($con);
				  echo json_encode($player);
				  break;
				 }
});

$app->post('/players', function () use ($app){
				   $con=mysqli_connect("localhost","root","","idkpong");
				// Check connection
				if (mysqli_connect_errno())
				  {
				  echo "Failed to connect to MySQL: " . mysqli_connect_error();
				  }
				  $json = json_decode(file_get_contents('php://input'),true);
				mysqli_query($con,"INSERT INTO players (name, fullName) VALUES ('" . $json["name"] . "', '". $json["fullName"] . "')");
				mysqli_close($con);
				$matches["code"] = 200;
				echo json_encode($matches);
});

function getMatchesForUser($user)
{
	   $con=mysqli_connect("localhost","root","","idkpong");
				// Check connection
				if (mysqli_connect_errno())
				  {
				  echo "Failed to connect to MySQL: " . mysqli_connect_error();
				  }
				$result = mysqli_query($con,"SELECT * FROM matches WHERE loser = '" . $user . "' OR winner = '" . $user . "'");
				$matches = array();

				while($row = mysqli_fetch_array($result))
				  {
				  	$match["winner"] = getPlayerWithID($row["winner"]);
				  	$match["loser"] = getPlayerWithID($row["loser"]);
				  	$match["date"] = gmdate("c", strtotime($row["fecha"]));
				  	$resultado = array();
				  	$resultado["winnerPoints"] = intval($row["winnerpoints"]);
				  	$resultado["loserPoints"] = intval($row["loserpoints"]);
				  	$match["result"] = $resultado;
				  array_push($matches, $match);
				  }

				mysqli_close($con);
				return $matches;
}

$app->get('/matches', function () {
				   $con=mysqli_connect("localhost","root","","idkpong");
				// Check connection
				if (mysqli_connect_errno())
				  {
				  echo "Failed to connect to MySQL: " . mysqli_connect_error();
				  }
				$result = mysqli_query($con,"SELECT * FROM matches");

				$matches = array();

				while($row = mysqli_fetch_array($result))
				  {
				  	$match["winner"] = getPlayerWithID($row["winner"]);
				  	$match["loser"] = getPlayerWithID($row["loser"]);
				  	$match["date"] = gmdate("c", strtotime($row["fecha"]));
				  	$resultado["winnerPoints"] = intval($row["winnerpoints"]);
				  	$resultado["loserPoints"] = intval($row["loserpoints"]);
				  	$match["result"] = $resultado;
 				  array_push($matches, $match);
				  }

				mysqli_close($con);

				echo json_encode($matches);
});

$app->post('/matches', function () use ($app){
				  $con=mysqli_connect("localhost","root","","idkpong");
				// Check connection
				if (mysqli_connect_errno())
				  {
				  echo "Failed to connect to MySQL: " . mysqli_connect_error();
				  }


				  $json = json_decode(file_get_contents('php://input'),true);
				  $winnerID = getPlayerWithName($json["winner"]);
				  $loserID = getPlayerWithName($json["loser"]);
				  $fecha = date('Y-m-d H:i:s',strtotime($json["date"]));
				  $winnerPoints = $json["result"]["winnerPoints"];
				  $loserPoints = $json["result"]["loserPoints"];


				mysqli_query($con,"INSERT INTO matches (winner, loser,fecha,winnerPoints,loserPoints) VALUES ('" . $winnerID . "', '". $loserID . "' , '". $fecha . "', '". $winnerPoints . "', '". $loserPoints . "')");
				mysqli_close($con);
				$matches["code"] = 200;
				echo json_encode($matches);
});



$app->run();

function getPlayerWithID($id)
{
	$con=mysqli_connect("localhost","root","","idkpong");
				// Check connection
				if (mysqli_connect_errno())
				  {
				  echo "Failed to connect to MySQL: " . mysqli_connect_error();
				  }

				$result = mysqli_query($con,"SELECT * FROM players WHERE id = '" . $id . "'");

				$players = array();

				while($row = mysqli_fetch_array($result))
				  {
				  	$player["name"] = $row["name"];
				  	$player["fullName"] = $row["fullName"];
				  	mysqli_close($con);
				  return $player;
				  }
}

function getPlayerWithName($name)
{
	$con=mysqli_connect("localhost","root","","idkpong");
				// Check connection
				if (mysqli_connect_errno())
				  {
				  echo "Failed to connect to MySQL: " . mysqli_connect_error();
				  }

				$result = mysqli_query($con,"SELECT * FROM players WHERE name = '" . $name . "'");

				$players = array();

				while($row = mysqli_fetch_array($result))
				  {
				  	mysqli_close($con);
				  return $row["id"];
				  }
}

?>