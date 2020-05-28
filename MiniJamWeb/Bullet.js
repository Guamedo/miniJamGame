class Bullet{
    constructor(x, y, dir){
        this.pos = createVector(x, y);
        this.vel = dir;
        this.acc = createVector(0, 0);
        this.size = 10;
        this.end = false;
    }

    draw(){
        push();
        noStroke();
        fill(255);//fill(200, 200, 50);
        ellipse(this.pos.x, this.pos.y, this.size);
        pop();
    }

    update(dt, l, enemies){
        this.pos.add(p5.Vector.mult(this.vel, dt));

        for(let i = 0; i < enemies.length; i++){
            if(this.collideBox(enemies[i].pos, enemies[i].size)){
                enemies[i].die();
            }
        }

        //enemies.forEach(e => this.collideBox(e.pos, e.size));
        this.damageTimer = max(this.damageTimer - dt, 0.0);
        this.collideLevel(l);

        if (this.pos.x <= this.size / 2.0) {
            this.end = true;
        }
        if (player.pos.x >= width - this.size / 2.0) {
            this.end = true;
        }
        if (this.pos.y <= this.size / 2.0) {
            this.end = true;
        }
        if (player.pos.y >= height - this.size / 2.0) {
            this.end = true;
        }

        this.vel.add(p5.Vector.mult(this.acc, dt));
        this.acc.set(0.0, 0.0);
    }

    collideBox(boxPos, boxSize){
        let dx = boxPos.x - this.pos.x;
        let dy = boxPos.y - this.pos.y;

        let depthX = (this.size/2.0 + boxSize/2.0) - Math.abs(dx);
        let depthY = (this.size/2.0 + boxSize/2.0) - Math.abs(dy);

        if(depthX >= 0 && depthY >= 0){
            this.end = true;
            return true;
        }
        return false;
    }

    collideLevel(l){
        let playerCorners = [];
        playerCorners.push(createVector(this.pos.x-this.size/2, this.pos.y-this.size/2))
        playerCorners.push(createVector(this.pos.x+this.size/2, this.pos.y-this.size/2))
        playerCorners.push(createVector(this.pos.x+this.size/2, this.pos.y+this.size/2))
        playerCorners.push(createVector(this.pos.x-this.size/2, this.pos.y+this.size/2))

        let collidingTiles = []
        for(let i = 0; i < playerCorners.length; i++){
            let x_i = Math.floor(playerCorners[i].x/l.tileSize);
            let y_i = Math.floor(playerCorners[i].y/l.tileSize);
            //TODO: Comprobar que los indices estran dentro del mapa
            if(x_i >= 0 && y_i >=0 && y_i < l.tiles.length && x_i < l.tiles[0].length) {
                if (l.tiles[y_i][x_i] === "1") {
                    collidingTiles.push(createVector(x_i * l.tileSize + l.tileSize / 2.0,
                        y_i * l.tileSize + l.tileSize / 2.0))
                }
            }
        }

        function areaSort(p) {
            return function(a, b) {
                let dXA = a.x-p.pos.x;
                let dYA = a.y-p.pos.y;

                let dXB = b.x-p.pos.x;
                let dYB = b.y-p.pos.y;

                let depthXA = (p.size/2 + l.tileSize/2) - Math.abs(dXA);
                let depthYA = (p.size/2 + l.tileSize/2) - Math.abs(dYA);

                let depthXB = (p.size/2 + l.tileSize/2) - Math.abs(dXB);
                let depthYB = (p.size/2 + l.tileSize/2) - Math.abs(dYB);

                return Math.max(depthXA, depthYA) < Math.max(depthXB, depthYB);
            }
        }
        collidingTiles.sort(areaSort(this));

        for(let i = 0; i < collidingTiles.length; i++){

            let dX = collidingTiles[i].x-this.pos.x;
            let dY = collidingTiles[i].y-this.pos.y;

            let depthX = (this.size/2 + l.tileSize/2) - Math.abs(dX);
            let depthY = (this.size/2 + l.tileSize/2) - Math.abs(dY);

            if(depthX >= 0 && depthY >= 0){
                this.end = true;
            }
        }
    }

}