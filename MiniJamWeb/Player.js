class Player{
    constructor(x, y, size = 10){
        this.pos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.size = Math.ceil(size*sc);
        this.deadSeed = round(random(10000000));
        this.damageTimer = -1;
        this.life = 3;
        this.fireRate = 0.5;
        this.fireTimeout = 0.0;
        this.particleSystem = null;
        this.points = 0;
        this.range = 150;
        this.amp = Math.PI/4;
        this.flash = false;
    }

    draw(){
        push();
        if(this.damageTimer <= 0.0){
            fill(200, 50, 50);
        }else{
            fill(200, 50, 50, 255*((Math.sin(40.0*this.damageTimer)+1)/2.0));
        }

        noStroke();
        rectMode(CENTER);
        rect(this.pos.x, this.pos.y, this.size,this.size);
        /*if(this.life > 0){
            if(this.damageTimer <= 0.0){
                fill(200, 50, 50);
            }else{
                fill(200, 50, 50, 255*((Math.sin(40.0*this.damageTimer)+1)/2.0));
            }

            noStroke();
            rectMode(CENTER);
            rect(this.pos.x, this.pos.y, this.size,this.size);
        }else{
            this.particleSystem.draw();
        }*/
        pop();
    }

    processInput(keys){
        let newVel = createVector(0, 0);
        if(keys[65]){ // A
            newVel.x -= 10;
        }
        if(keys[68]){ // D
            newVel.x += 10;
        }
        if(keys[87]){ // W
            newVel.y -= 10;
        }
        if(keys[83]){ // S
            newVel.y += 10;
        }
        player.vel = (newVel.normalize()).mult(400.);
    }

    update(dt, l, enemies){
        if(this.life > 0) {

            this.pos.add(p5.Vector.mult(this.vel, dt));


            for(let i = 0; i < enemies.length; i++){
                if(!enemies[i].dead) {
                    this.collideBox(enemies[i].pos, enemies[i].size);
                    if (this.arcToCircleIntersection(enemies[i]) && this.flash) {
                        enemies[i].die();
                    }
                }
            }
            //enemies.forEach(e => this.collideBox(e.pos, e.size));
            if(this.life <= 0){
                this.particleSystem = new ParticleSystem(this.pos.x,
                                                            this.pos.y,
                                                            50,
                                                            this.size*0.2,
                                                            this.size+this.size*0.7,
                                                            color(200, 50, 50));
            }

            this.damageTimer = max(this.damageTimer - dt, 0.0);
            this.collideLevel(l);
            this.collideEdges();

            this.vel.add(p5.Vector.mult(this.acc, dt));
            this.acc.set(0.0, 0.0);

            this.fireTimeout = Math.max(0.0, this.fireTimeout-dt);
        }else{
            this.particleSystem.update(dt);
        }
    }

    lineCircleIntersection(x1, y1, x2, y2, r){
        let dx = x2 - x1;
        let dy = y2 - y1;
        let dr = Math.sqrt(dx**2 + dy**2);
        let D = x1*y2 - x2*y1;

        let coll = r**2 * dr**2 - D**2;

        return coll >= 0;
    }

    arcToCircleIntersection(enemy){
        let d = enemy.pos.dist(this.pos)
        if(d < this.range+enemy.size/2){
            let pLook = (createVector(mouseX, mouseY).sub(this.pos)).normalize();
            let facingAngle = Math.atan2(pLook.y, pLook.x);
            if(d < this.range-enemy.size/2){
                let p2e = (p5.Vector.sub(enemy.pos, this.pos)).normalize();
                let angleOfTarget = Math.atan2(p2e.y, p2e.x);
                let anglediff = (facingAngle - angleOfTarget + 180 + 360) % 360 - 180

                if (anglediff <= this.amp/2 && anglediff >= -this.amp/2){
                    return true;
                }else{
                    if(this.lineCircleIntersection(this.pos.x-enemy.pos.x, this.pos.y-enemy.pos.y,
                        this.pos.x-enemy.pos.x + Math.cos(facingAngle+this.amp/2)*this.range,
                        this.pos.y-enemy.pos.y + Math.sin(facingAngle+this.amp/2)*this.range,
                        enemy.size/2)){
                        return true;
                    }
                    if(this.lineCircleIntersection(this.pos.x-enemy.pos.x, this.pos.y-enemy.pos.y,
                        this.pos.x-enemy.pos.x + Math.cos(facingAngle-this.amp/2),
                        this.pos.y-enemy.pos.y + Math.sin(facingAngle-this.amp/2),
                        enemy.size/2)){
                        return true;
                    }
                }
            }
            let a = (this.range**2 - (enemy.size/2)**2 + d**2)/(2*d);
            let h = Math.sqrt(this.range**2 - a**2);

            let P2 = (this.pos.copy()).add(p5.Vector.sub(enemy.pos, this.pos).mult(a/d))

            let p1 = createVector(P2.x + (h*(enemy.pos.y - this.pos.y))/d, P2.y - (h*(enemy.pos.x - this.pos.x))/d);
            let p2 = createVector(P2.x - (h*(enemy.pos.y - this.pos.y))/d, P2.y + (h*(enemy.pos.x - this.pos.x))/d);

            let p2p1 = (p5.Vector.sub(p1, this.pos)).normalize();;
            let p2p2 = (p5.Vector.sub(p2, this.pos)).normalize();;

            let angleOfTarget1 = Math.atan2(p2p1.y, p2p1.x);
            let angleOfTarget2 = Math.atan2(p2p2.y, p2p2.x);

            let anglediff1 = (facingAngle - angleOfTarget1 + 180 + 360) % 360 - 180
            let anglediff2 = (facingAngle - angleOfTarget2 + 180 + 360) % 360 - 180

            if (anglediff1 <= this.amp/2 && anglediff1 >= -this.amp/2 || anglediff2 <= this.amp/2 && anglediff2 >= -this.amp/2){
                return true;
            }
        }
        return false;
    }

    collideEdges(){
        if (this.pos.x < this.size / 2.0) {
            this.pos.x = this.size / 2.0;
        }
        if (player.pos.x > width - this.size / 2.0) {
            this.pos.x = width - this.size / 2.0;
        }
        if (this.pos.y < this.size / 2.0) {
            this.pos.y = this.size / 2.0;
        }
        if (player.pos.y > height - this.size / 2.0) {
            this.pos.y = height - this.size / 2.0;
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
            if(this.damageTimer <= 0){
                this.damageTimer = 1.0;
                this.life--;
            }
        }
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
            if(x_i >= 0 && y_i >=0) {
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