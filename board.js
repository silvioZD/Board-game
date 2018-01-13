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