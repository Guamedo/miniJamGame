class UI{
    constructor(x, y){
        this.heartsPos = createVector(x, y);
        this.maxHearts = 3;
        this.heartsSize = 25;
    }

    draw(player, mousePos){
        push();
        for(let i = 0; i < this.maxHearts; i++){
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
        }

        let playerMouseVec = ((mousePos.copy()).sub(player.pos)).normalize();
        playerMouseVec.mult(70);

        stroke(200, 50, 50);
        fill(200, 50, 50, 100);
        ellipse(mousePos.x, mousePos.y, 15, 15);
        ellipse(player.pos.x + playerMouseVec.x, player.pos.y + playerMouseVec.y, 10, 10);

        stroke(255);
        fill(255);
        textSize(24);
        text("Points: " + player.points, width-200, 30);

        pop();

    }




}