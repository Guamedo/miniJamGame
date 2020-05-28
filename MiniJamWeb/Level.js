class Level{
    constructor(level){
        this.tileSize = 50;
        this.tiles = level;
    }

    draw(){
        push();
        for(let y = 0; y < this.tiles.length; y++){
            for(let x = 0; x < this.tiles[0].length; x++){
                if(this.tiles[y][x] === "1"){
                    noStroke();
                    fill(255)//fill(50, 50, 200);
                    rect(x*this.tileSize, y*this.tileSize, this.tileSize, this.tileSize);
                }
            }
        }
        noFill();
        stroke(0);
        strokeWeight(4);
        rect(0, 0, width, height);
        pop();
    }
}