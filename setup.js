// When document finish loading, play entry song
$(function() {
	$("#start")[0].play(); 
});
function toggleMovementCell(cell){
	$(`#cell-${cell[0]}-${cell[1]}`).hasClass('cell-movement') ? $(`#cell-${cell[0]}-${cell[1]}`).removeClass("cell-movement")
  : $(`#cell-${cell[0]}-${cell[1]}`).addClass("cell-movement");
}
var currentGame;
var currentMovement;
//start game function creates new game, displays board and gives movement options for player 1
function startGame(){
	currentGame = new Game(10,10,0.85);
	displayGame(currentGame);
	currentGame.nextMovementTurn();
}
//function for movement options
function setupMovementOptions(options){
	currentMovements = options;
	for(var movement in currentMovements){
		$(`#cell-${currentMovements[movement][0]}-${currentMovements[movement][1]}`).bind('click', 
		{row: currentMovements[movement][0], col : currentMovements[movement][1]}, currentGame.makeMovementTurn);
		toggleMovementCell(currentMovements[movement]);
	}
}
//function for battle options
function setupCombatOptions(){
	$('button[name="atack"]').bind('click', {option:'atack'}, currentGame.makeCombatTurn);
	$('button[name="defend"]').bind('click', {option:'defend'}, currentGame.makeCombatTurn);
	$("#fight")[0].play();
}
//stop movement options
function unsetMovementOptions(options){
	for(movement in currentMovements){
		$(`#cell-${currentMovements[movement][0]}-${currentMovements[movement][1]}`).unbind("click");
		toggleMovementCell(currentMovements[movement]);
	}
	displayPlayer(currentGame.currentPlayer);
	options = null;
}
//function for stop combat
function unsetCombatOptions(){
	$('button[name="atack"]').unbind("click");
	$('button[name="defend"]').unbind("click");
}
//when document is loaded, on play button click, close intro screen, show board and play sound; start game
$(document).ready(function(){
	$("#play").click(function(){
		$(".intro").fadeOut(500, function(){
			$(".gameBoard").fadeIn(200);
			$("#playG")[0].play();
		});
		startGame();
	});
});