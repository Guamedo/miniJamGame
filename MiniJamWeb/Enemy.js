class Enemy{
    constructor(x, y, size = 10){
        this.pos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.size = Math.ceil(size*sc);
        this.dead = false;
        this.lookDir = p5.Vector.fromAngle(random(2.0*Math.PI));
        this.initTime = 0.8;
        this.endTimer = 0.2;
        this.path = [];
        this.drawPath = false;
        this.goal = null;
    }

    die(){
        if(!this.dead){
            this.dead = true;

        }
    }

    draw(){
        push();
        if(this.drawPath){
            beginShape();
            noStroke();
            noFill();
            strokeWeight(5);
            stroke(50, 50, 200);
            for(let i = 0; i < this.path.length; i++){
                vertex(this.path[i].x, this.path[i].y);
            }
            endShape();
        }

        fill(255, 255, 255);
        noStroke();
        rectMode(CENTER);
        if(this.dead){
            //console.log("OOK")
            ellipse(this.pos.x, this.pos.y, this.size, this.size*(this.endTimer/0.2));
        }else{
            ellipse(this.pos.x, this.pos.y, this.size, this.size*(1-this.initTime));
        }
        let s = this.size*0.5;
        fill(0, 0, 0);
        ellipse(this.pos.x+this.lookDir.x*s/2,this.pos.y+this.lookDir.y*s/2,(this.size-s)*0.8,(this.size-s)*0.8);
        pop();
    }

    newGoal(){
        let newPosX = Math.floor(random(0, level.tiles[0].length-1));
        let newPosY = Math.floor(random(0, level.tiles.length-1));
        while(level.tiles[newPosY][newPosX] === "1"){
            newPosX = Math.floor(random(0, level.tiles[0].length-1));
            newPosY = Math.floor(random(0, level.tiles.length-1));
        }
        this.goal = createVector(newPosX*level.tileSize+level.tileSize/2,
            newPosY*level.tileSize+level.tileSize/2);
    }

    update(dt, level, target, enemies, index, nav) {


        if(this.dead){
            this.endTimer = Math.max(0.0, this.endTimer-dt);
        }else{

            this.initTime = Math.max(0.0, this.initTime-dt);

            if (this.goal == null || this.goal.dist(this.pos) < this.size){
                this.newGoal();
            }

            if (target.life > 0)
                this.lookDir = (p5.Vector.sub(this.goal, this.pos)).normalize();
            else
                this.lookDir = p5.Vector.fromAngle(frameCount*0.1);

            //this.path = nav.findPath(this.pos, target.pos, level);
            this.path = nav.findPath(this.pos, this.goal, level);

            if(this.path.length > 0){
                this.vel = p5.Vector.sub(this.path[this.path.length-2], this.pos);
                this.vel.normalize();
                this.vel.mult(200.0);
            }else{
                this.vel = createVector(0, 0);
            }


            //TODO: Hola gonzalo he quitado el update de la posicion para hacer pruebas
            // acuerdate de vover a descomntar esto cuando termines que nos cononemos y eres idiota
            // venga un saludo makina
            this.pos.add(p5.Vector.mult(this.vel, dt));

            for(let i = 0; i < enemies.length; i++){
                if(i !== index){
                    if (this.collideBox(enemies[i].pos, enemies[i].size)){
                        this.newGoal();
                    }
                }
            }
            if(target.life > 0)
                this.collideBox(target.pos, target.size);
            this.collideLevel(level);

            if(this.pos.x < this.size/2.0){
                this.pos.x = this.size/2.0;
            }
            if(this.pos.x > width-this.size/2.0){
                this.pos.x = width-this.size/2.0;
            }
            if(this.pos.y < this.size/2.0){
                this.pos.y = this.size/2.0;
            }
            if(this.pos.y > height-this.size/2.0){
                this.pos.y = height-this.size/2.0;
            }

            this.vel.add(p5.Vector.mult(this.acc, dt));
            this.acc.set(0.0, 0.0);
        }
    }

    collideBox(boxPos, boxSize){
        let dx = boxPos.x - this.pos.x;
        let dy = boxPos.y - this.pos.y;

        let depthX = (this.size/2.0 + boxSize/2.0) - Math.abs(dx);
        let depthY = (this.size/2.0 + boxSize/2.0) - Math.abs(dy);

        //console.log(depthX);
        //console.log(depthY);

        if(depthX >= 0 && depthY >= 0){
            if(depthX <= depthY){
                if (dx < 0) {
                    this.pos.x += depthX;
                } else {
                    this.pos.x -= depthX;
                }
            }else{
                if (dy < 0) {
                    this.pos.y += depthY;
                } else {
                    this.pos.y -= depthY;
                }
            }
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

            if(depthX <= depthY){
                if (dX < 0) {
                    this.pos.x += depthX;
                } else {
                    this.pos.x -= depthX;
                }
            }else{
                if (dY < 0) {
                    this.pos.y += depthY;
                } else {
                    this.pos.y -= depthY;
                }
            }
        }
    }

}