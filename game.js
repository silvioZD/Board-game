//game class declaration
class Game{
	constructor(width, height, accessibility){
		//create board
		this.board = new Board(width, height, accessibility);
		//create weapons (start & real)
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