class UI{
    constructor(x, y){
        this.heartsPos = createVector(x, y);
        this.maxHearts = 3;
        this.heartsSize = 35;
        this.debugPoints = [];
    }

    draw(player, mousePos){
        push();
        /*for(let i = 0; i < this.maxHearts; i++){
            stroke(255);
            if(player.life <= i){
                noFill();
            }else{
                fill(200, 50, 50);
            }

            let side = this.heartsSize/2;
            let diag = Math.sqrt(Math.pow(side, 2.0) + Math.pow(side, 2.0));

            let x = this.heartsPos.x + i*(diag*2+5);
            let y = this.heartsPos.y



            beginShape();
            vertex(x, y+diag);
            vertex(x-diag, y);
            vertex(x-diag/2, y-diag/2);
            vertex(x, y);
            vertex(x+diag/2, y-diag/2);
            vertex(x+diag, y);
            endShape(CLOSE);

            //rect(x, y, this.heartsSize, this.heartsSize);
        }*/
        for(let i = 0; i < Math.abs(player.life-this.maxHearts); i++){
            let x = this.heartsPos.x + i*(this.heartsSize+5);
            let y = this.heartsPos.y;

            noStroke();
            fill(200, 50, 50);
            ellipse(x, y, this.heartsSize, this.heartsSize*0.8);
            fill(0);
            ellipse(x, y, this.heartsSize/3)
        }

        let playerMouseVec = ((mousePos.copy()).sub(player.pos)).normalize();
        playerMouseVec.mult(70);

        noStroke();
        fill(200, 200, 50);
        ellipse(mousePos.x, mousePos.y, 15, 15);

        noStroke();
        if(player.flash){
            fill(200, 200, 50);
        }else{
            fill(200, 200, 50, 75);
        }

        let dir = createVector(mouseX, mouseY).sub(player.pos);
        let a = Math.atan2(dir.y, dir.x);
        arc(player.pos.x, player.pos.y, player.range*2, player.range*2, a-player.amp/2, a+player.amp/2);

        //ellipse(player.pos.x + playerMouseVec.x, player.pos.y + playerMouseVec.y, 10, 10);

        stroke(255);
        fill(255);
        textSize(24);
        text("Points: " + player.points, width-200, 30);


        for(let i = 0; i < this.debugPoints.length; i++){
            noStroke();
            fill(0, 255, 0);
            ellipse(this.debugPoints[i].x, this.debugPoints[i].y, 5, 5);
        }
        this.debugPoints = [];

        pop();

    }




}