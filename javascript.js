
/*if (!String.prototype.startsWith) {
  String.prototype.startsWith = function (searchString, position) {
      position = position || 0;
      return this.indexOf(searchString, position) === position;
  };
}*/
// When document finish loading, play entry song
$(function() {
	$("#start")[0].play(); 
});
//board class declaration (create grid) - width:10, height:10, accessibility: 0.85
class Board{
	constructor(width, height, accessibility){
		this.width = width;
		this.height = height;
		this.grid = (function(width, height){
			let grid = new Array(new Array());
			for(var i = 1; i<= height; i++){
				grid[i-1] = [];
				for(var j=1; j<= width; j++){
					grid[i-1][j-1] = new Cell(i-1, j-1, accessibility)
				}
			}
			return grid
		})(width, height)
	}
	//calculating is the position for the weapon available. If weapon or wall is on cell then false, else true
	isPosWeaponSuitable(pos){
		if((this.grid[pos[0]][pos[1]].getWeaponOnCell() > 0) || 
		   (this.grid[pos[0]][pos[1]].getWallOnCell() === true)) {
			return false;
		} else {
			return true;
		}
	}
	//putting weapons on board, finding horizontal and vertical position and cell id
	putWeaponOnBoard(id, pos){
		this.grid[pos[0]][pos[1]].setWeaponOnCell(id);
	}
	//calculating is the position for the player available. If something is allready on that cell, or player on cell near, then false
	isPosPlayerSuitable(pos){
		if(this.grid[pos[0]][pos[1]].getWallOnCell() === true || 
		   this.grid[pos[0]][pos[1]].getWeaponOnCell() > 0 || 
		   this.grid[pos[0]][pos[1]].getPlayerOnCell() > 0 || 
		   this.grid[pos[0]][pos[1]].getCellNearPlayer() === true){
			return false;
		}
		else{
			if((pos[0] > 1 && pos[0] < 9) && (pos[1] > 1 && pos[1] < 9)){
				this.grid[pos[0] - 1][pos[1]].setCellNearPlayer(true);
				this.grid[pos[0] + 1][pos[1]].setCellNearPlayer(true);
				this.grid[pos[0]][pos[1] + 1].setCellNearPlayer(true);
				this.grid[pos[0]][pos[1] - 1].setCellNearPlayer(true);
			}else if(pos[0] == 0 && pos[1] == 0){
				this.grid[pos[0] + 1][pos[1]].setCellNearPlayer(true);
				this.grid[pos[0]][pos[1] + 1].setCellNearPlayer(true);
			}else if(pos[0] == 9 && pos[1] == 9){
				this.grid[pos[0] - 1][pos[1]].setCellNearPlayer(true);
				this.grid[pos[0]][pos[1] - 1].setCellNearPlayer(true);
			}else if(pos[0] == 0 && pos[1] == 9){
				this.grid[pos[0] + 1][pos[1]].setCellNearPlayer(true);
				this.grid[pos[0]][pos[1] - 1].setCellNearPlayer(true);
			}else if(pos[0] == 9 && pos[1] == 0){
				this.grid[pos[0] - 1][pos[1]].setCellNearPlayer(true);
				this.grid[pos[0]][pos[1] + 1].setCellNearPlayer(true);
			}else if(pos[0] == 0 && (pos[1] > 1 && pos[1] < 9)){
				this.grid[pos[0] + 1][pos[1]].setCellNearPlayer(true);
				this.grid[pos[0]][pos[1] + 1].setCellNearPlayer(true);
				this.grid[pos[0]][pos[1] - 1].setCellNearPlayer(true);
			}else if(pos[0] == 9 && (pos[1] > 1 && pos[1] < 9)){
				this.grid[pos[0] - 1][pos[1]].setCellNearPlayer(true);
				this.grid[pos[0]][pos[1] + 1].setCellNearPlayer(true);
				this.grid[pos[0]][pos[1] - 1].setCellNearPlayer(true);
			}else if((pos[0]> 1 && pos[0] < 9) && pos[1] == 0){
				this.grid[pos[0] + 1][pos[1]].setCellNearPlayer(true);
				this.grid[pos[0] - 1][pos[1]].setCellNearPlayer(true);
				this.grid[pos[0]][pos[1] + 1].setCellNearPlayer(true);
			}else if((pos[0] > 1 && pos[0] < 9) && pos[1] == 9){
				this.grid[pos[0] + 1][pos[1]].setCellNearPlayer(true);
				this.grid[pos[0] - 1][pos[1]].setCellNearPlayer(true);
				this.grid[pos[0]][pos[1] - 1].setCellNearPlayer(true);
			}
			return true;
		}
	}
	//player movement on board. 
	movePlayerOnBoard(id, lastPos, newPos){
		if(lastPos !== 0){
			this.grid[lastPos[0]][lastPos[1]].setPlayerOnCell(0);
			if(lastPos[0] > 0){
			this.grid[lastPos[0] - 1][lastPos[1]].toggleTrigger();	
			}
			if(lastPos[0] < this.height - 1){
			this.grid[lastPos[0] + 1][lastPos[1]].toggleTrigger();	
			}
			if(lastPos[1] > 0){
			this.grid[lastPos[0]][lastPos[1] - 1].toggleTrigger();	
			}
			if(lastPos[1] < this.width - 1){
			this.grid[lastPos[0]][lastPos[1] + 1].toggleTrigger();	
			}
		}
			this.grid[newPos[0]][newPos[1]].setPlayerOnCell(id);
		if(newPos[0] > 0) {
			this.grid[newPos[0] - 1][newPos[1]].toggleTrigger();	
		}
		if(newPos[0] < this.height - 1) {
			this.grid[newPos[0] + 1][newPos[1]].toggleTrigger();	
		}
		if(newPos[1] > 0) {
			this.grid[newPos[0]][newPos[1] - 1].toggleTrigger();	
		}
		if(newPos[1] < this.width - 1) {
			this.grid[newPos[0]][newPos[1] + 1].toggleTrigger();	
		}
	}
	//calculating player movement options
	checkPlayerMovementOptions(pos, movement){
		let movementOptions = new Array(new Array()), numOptions = 0;
		for(var top=pos[0]-1; top >= Math.max(pos[0] - movement, 0); top--){
			if(top>=0 && (this.grid[top][pos[1]].getWallOnCell() === false) && (this.grid[top][pos[1]].getPlayerOnCell() === 0)){
				movementOptions[numOptions] = [top, pos[1]];
				numOptions++;
			}else{
				break;
			}
		}
		for(var bottom=pos[0]+1; bottom <= Math.max(pos[0] + movement, 0); bottom++){
			if(bottom <= 9 && (this.grid[bottom][pos[1]].getWallOnCell() === false) && (this.grid[bottom][pos[1]].getPlayerOnCell() === 0)){
				movementOptions[numOptions] = [bottom, pos[1]];
				numOptions++;
			}else{
				break;
			}
		}
		for(var left=pos[1]-1; left >= Math.max(pos[1] - movement, 0); left--){
			if(left >= 0 &&(this.grid[pos[0]][left].getWallOnCell() === false) && (this.grid[pos[0]][left].getPlayerOnCell() === 0)){
				movementOptions[numOptions] = [pos[0] ,left];
				numOptions++;
			}else{
				break;
			}
		}
		for(var right=pos[1]+1; right <= Math.max(pos[1] + movement, 0); right++){
			if(right <= 9 && (this.grid[pos[0]][right].getWallOnCell() === false) && (this.grid[pos[0]][right].getPlayerOnCell() === 0)){
				movementOptions[numOptions] = [pos[0] ,right];
				numOptions++;
			}else{
				break;
			}
		}
		return movementOptions;
	}
}
//cell class declaration
class Cell{
	constructor(rowIndex, colIndex, Accessibility){
		this.row = rowIndex;
		this.col = colIndex;
		this.playerOnCell = 0;
		this.weaponOnCell = 0;
		this.cellNearPlayer = false;
		this.wallOnCell = Math.random() < Accessibility ? false : true;
		this.triggerCombat = false;
	}
	getWallOnCell(){
		return this.wallOnCell;
	}
	getWeaponOnCell(){
		return this.weaponOnCell;
	}
	getPlayerOnCell(){
		return this.playerOnCell;
	}
	getCellNearPlayer(){
		return this.cellNearPlayer;
	}
	getRow(){
		return this.row;
	}
	getCol(){
		return this.col;
	}
	getTriggerCombat(){
		return this.triggerCombat;
	}
	setPlayerOnCell(value){
		this.playerOnCell = value;
	}
	setWeaponOnCell(value){
		this.weaponOnCell = value;
	}
	setCellNearPlayer(value){
		this.cellNearPlayer = value;
	}
	toggleTrigger() {
		if (this.triggerCombat === true) {
			this.triggerCombat = false;
		} else {
			this.triggerCombat = true;
		}
	};
}
//player class declaration
class Player{
	constructor(id, weapon, board){
		this.id = id;
		this.hp = 100;
		this.weapon = weapon;

		this.lastPosition = 0;
		this.position = (function(id, last, board){
			let rndPos, suitable=false;
			while(suitable === false){
				rndPos = [Math.floor(Math.random() * board.width), Math.floor(Math.random() * board.height)];
				suitable = board.isPosPlayerSuitable(rndPos);
			}
			board.movePlayerOnBoard(id, last, rndPos);
			return rndPos;
		})(this.id, this.lastPosition, board);
		this.movement = 3;
		this.defensePosture = false
	}
	getID(){
		return this.id;
	}
	getLastPosition(){
		return this.lastPosition;
	}
	getMovement(){
		return this.movement;
	}
	getPosition(){
		return this.position;
	}
	getHP(){
		return this.hp
	}
	getDefensePosture(){
		return this.defensePosture
	}
	setLastPosition(value){
		this.lastPosition = value;
	}
	setPosition(value){
		this.position = value;
	}
	setWeapon(value){
		this.weapon = value;
	}
	setDefensePosture(value){
		this.defensePosture = value;
	}
	makeMovement(newPos, board){
		this.lastPosition = this.position;
		board.movePlayerOnBoard(this.id,this.lastPosition, newPos);
		this.position = newPos;
	}
	lastMovementCells(){
		var lastMovement = new Array(new Array()), deltaRow, deltaCol;
		deltaRow = this.position[0] - this.lastPosition[0];
		deltaCol = this.position[1] - this.lastPosition[1];
		if(deltaRow > 0){
			for (var right = 1; right <= deltaRow; right++){
				lastMovement[right-1] = [this.lastPosition[0] + right, this.lastPosition[1]]
			}
		}else if (deltaRow < 0) {
			for (var left = 1; left <= Math.abs(deltaRow); left += 1) {
				lastMovement[left - 1] = [this.lastPosition[0] - left, this.lastPosition[1]];	
			}
		}else if (deltaCol > 0) {
			for (var bottom = 1; bottom <= deltaCol; bottom += 1) {
				lastMovement[bottom - 1] = [this.lastPosition[0], this.lastPosition[1] + bottom];	
			}
		}else if (deltaCol < 0) {
			for (var top = 1; top <= Math.abs(deltaCol); top += 1) {
				lastMovement[top - 1] = [this.lastPosition[0], this.lastPosition[1] - top];	
			}
		}
		return lastMovement;
	}
	//defining damage for players (if player is in defense posture take half of damage, else take full damage)
	takeDamage(dmg){
		if(this.defensePosture === true){
			this.hp -= (dmg /2);
		}else{
			this.hp -= dmg;
		}
	}
}
//weapon class declaration
class Weapon{
	constructor(id, name, damage){
		this.id = id;
		this.name = name,
		this.damage = damage;
		this.position = 0; 
	}
	getPosition(){
		return this.position;
	}
	getID(){
		return this.id;
	}
	getDamage(){
		return this.damage;
	}
	setPosition(value){
		this.position = value;
	}
	initializePosOnPlayer(player){
		this.position = "player" + player.id;
	}
	initializePosOnBoard(board){
		let rndPos, suitable=false;
		while(suitable === false){
			rndPos = [Math.floor(Math.random() * board.width), Math.floor(Math.random() * board.height)];
			suitable = board.isPosWeaponSuitable(rndPos);
		}
		board.putWeaponOnBoard(this.id, rndPos);
		this.position = rndPos;
	}
}
//game class declaration
class Game{
	constructor(width, height, accessibility){
		//create board
		this.board = new Board(width, height, accessibility);
		//create weapons
		var startWeapons = [new Weapon(1, "arm", 10), new Weapon(2, "leg", 10)];
		var realWeapons = [new Weapon(3, "hammer", 20), new Weapon(4, "slingshot", 30), new Weapon(5, "revolver", 40), new Weapon(6, "gun", 50)];
		//create player
		this.players = [new Player(1, startWeapons[0], this.board), new Player(2, startWeapons[1], this.board)];
		for(var weapon in startWeapons){
			startWeapons[weapon].initializePosOnPlayer(this.players[weapon]);
		}
		//give real weapons position
		for (var weapon in realWeapons){
			realWeapons[weapon].initializePosOnBoard(this.board);
		}
		this.weapons = startWeapons.concat(realWeapons);
		this.currentPlayer = this.players[0];
		this.continueMovementPhase = true;
	}
	getNextPlayer() {
		if(this.currentPlayer.id === this.players.length) {
			return this.players[0];
		} else {
			return this.players[this.currentPlayer.id];
		}
	}
	setContinueMovementPhase(value){
		this.continueMovementPhase = value;
	}
	setNextPlayer(){	
		if(this.currentPlayer.id === this.players.length){
			this.currentPlayer = this.players[0];
		}else{
			this.currentPlayer = this.players[this.currentPlayer.getID()]
		}
	}
	//if player has movement options then display them; if not then show who is on combat turn; or end game
	nextMovementTurn(){
		if(this.continueMovementPhase === true){
			displayCurrent(this.currentPlayer);
			let movementOption = this.board.checkPlayerMovementOptions(this.currentPlayer.getPosition(), this.currentPlayer.getMovement());
			if(movementOption.length > 0){
				setupMovementOptions(movementOption)
			}else{
				this.endGame();
			}
		}else{
			this.nextCombatTurn();
		}	
	}
	//moving players accross the board; switching weapons; setting next player on move
	makeMovementTurn(e){
		var pos = [e.data.row, e.data.col];
		currentGame.currentPlayer.makeMovement(pos, currentGame.board);
		unsetMovementOptions();
		var weaponSwitchOptions = currentGame.currentPlayer.lastMovementCells();
		for (movement in weaponSwitchOptions){
			currentGame.switchPlayerWeapon(weaponSwitchOptions[movement], currentGame.currentPlayer);
		}
		if (currentGame.board.grid[currentGame.currentPlayer.position[0]][currentGame.currentPlayer.position[1]].getTriggerCombat() === true) {
			currentGame.setContinueMovementPhase(false);	
		} else {
			currentGame.setContinueMovementPhase(true);
		}
		currentGame.setNextPlayer();
		currentGame.nextMovementTurn();
		$("#move")[0].play();
	}
	//switching weapons (old - new weapon); when taking a new weapon display it in weapon icon and drop old weapon
	switchPlayerWeapon(pos, player){
		var oldWeaponId = player.weapon.getID();
		var newWeaponId = this.board.grid[pos[0]][pos[1]].getWeaponOnCell();
		if(newWeaponId > 0){	
			var oldWeapon, newWeapon;
			for (var i=0; i<this.weapons.length; i++){
				if(this.weapons[i].getID() === oldWeaponId){
					oldWeapon = this.weapons[i];
				}else if(this.weapons[i].getID() === newWeaponId){
					newWeapon = this.weapons[i];
				}
			}		
			newWeapon.setPosition(`player${player.getID()}`);
			oldWeapon.setPosition(pos);
			this.board.grid[pos[0]][pos[1]].setWeaponOnCell(oldWeaponId);
			player.setWeapon(newWeapon);
			displayWeapon(oldWeapon);
			displayWeapon(newWeapon);
		}
	}

	//setting next player turn if he has health more than 0, else end game
	nextCombatTurn(){
		$('.btn-combat').css('display', 'inline-block');
		displayCurrent(this.currentPlayer);
		if(this.currentPlayer.getHP() > 0){
			setupCombatOptions();
		}else{
			this.endGame()
		}
	}
	//Combat options: if player click atack button play sound, if defense play another sound. Take off enemy's health depending of the damage of the weapon;
	makeCombatTurn(e){
		var option = e.data.option;
		unsetCombatOptions();
		if(option === 'atack'){
			var enemy = currentGame.getNextPlayer();
			currentGame.currentPlayer.setDefensePosture(false);
			enemy.takeDamage(currentGame.currentPlayer.weapon.getDamage());
			displayHP(enemy);
			$("#bart1")[0].play();
		}else if(option === 'defend'){
			currentGame.currentPlayer.setDefensePosture(true);
			$("#bart2")[0].play();
		}
		currentGame.setNextPlayer();
		currentGame.nextCombatTurn();

	}
	//When game ends we take id of the player who survived, add his id to winner in intro with the message that he won the game
	//We go to intro screen, hide welcome and display Game over, play sound. We go slow from board to intro screen
	endGame() {
		var winner = this.getNextPlayer().id;
		$('.winner').remove();
		$(`<div class="winner"><p><span>player ${winner}</span></p><p>Won the game!</p></div>`).appendTo('.intro');
		$("#welcome").hide();
		$("#game_over").show();
		$("#fight")[0].pause();
		$("#homer1")[0].play();
		$(".gameBoard").fadeOut(500, function(){
		$('.intro').fadeIn(500);});
		$("#play").click(function(){
			$(".intro").fadeOut(500, function(){
				$(".gameBoard").fadeIn(500);
			});
			$('#board').empty();
			startGame();
		});
	};
}
//Show game with players and their health and weapons
function displayGame(game){
	displayBoard(game.board);
	for (var weapon in game.weapons){
		displayWeapon(game.weapons[weapon]);
	}
	for(var player in game.players){
		displayPlayer(game.players[player]);
		displayHP(game.players[player]);
	}
}
//Show game board, add rows, cells and cols into the board with walls and accessible and not accessible cells, and get data from them
function displayBoard(board){
	let $row, $cell;
	$('#board').html('');
	for(var i=0; i<board.grid.length;i++){
		$row = $('<div class="row"></div>');
		for(var j=0; j<board.grid[i].length;j++){
			$cell = $('<div class="cell"></div>');
			$cell.attr('id', `cell-${board.grid[i][j].getRow()}-${board.grid[i][j].getCol()}`);
			board.grid[i][j].getWallOnCell() ? $cell.addClass('cell-not-accessible') : $cell.addClass('cell-accessible');
			$cell.appendTo($row);
		}
		$row.appendTo($('#board'));
	}
}
//function for displaying current weapons in weapon icon area
function displayWeapon(weapon){
	let classList;
	if(weapon.getPosition() == 0){
	}else if(typeof weapon.getPosition() == 'string' && weapon.getPosition().startsWith("player")){
		classList = $(`#${weapon.getPosition()}-controls .player-weapon-icon`).attr("class").split(/\s+/);
		$.each(classList, function(index, item){
			if(item != 'player-weapon-icon'){
				$(`#${weapon.getPosition()}-controls .player-weapon-icon`).removeClass(item);
			}
		});
		$(`#${weapon.position}-controls .player-weapon-icon`).addClass(`cell-weapon-${weapon.id}`);
	}else{
		classList = $("#cell-" + weapon.position[0] + "-" + weapon.position[1]).attr("class").split(/\s+/);
		$.each(classList, function(index, item){
    		if ((item === "cell") || (item === "cell-accessible") || (item === "cell-not-accessible") || (item.startsWith("cell-player"))) {
    		} else {
				$(`#cell-${weapon.position[0]}-${weapon.position[1]}`).removeClass(item);
			}
		});
		$(`#cell-${weapon.position[0]}-${weapon.position[1]}`).addClass(`cell-weapon-${weapon.id}`);
	}
}
//show player on board
function displayPlayer(player){
	if(player.getLastPosition() !== 0){
		$(`#cell-${player.lastPosition[0]}-${player.lastPosition[1]}`).removeClass(`cell-player-${player.id}`);	
	}
		$(`#cell-${player.position[0]}-${player.position[1]}`).addClass(`cell-player-${player.id}`);
}
// show player on the move
function displayCurrent(player){
		$(`#currentPlayer`).html(`<p>MOVE: <span>Player ${player.id}</span></p>`);
}
//show players health
function displayHP(player){
	$(`#player${player.id}-controls .progress-bar`).html(`${player.hp}/100`);	
}
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