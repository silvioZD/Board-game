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