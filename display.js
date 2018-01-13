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