class UI{
    constructor(x, y){
        this.heartsPos = createVector(x, y);
        this.maxHearts = 3;
        this.heartsSize = 35;
        this.debugPoints = [];
        this.inButton = false;
    }

    draw(player, mousePos){
        push();
        for(let i = 0; i < Math.abs(player.life-this.maxHearts); i++){
            let x = this.heartsPos.x + i*(this.heartsSize+5);
            let y = this.heartsPos.y;

            noStroke();
            fill(200, 50, 50);
            ellipse(x, y, this.heartsSize, this.heartsSize*0.8);
            fill(0);
            ellipse(x, y, this.heartsSize/3)
        }

        noStroke();
        if(player.flash){
            fill(200, 200, 50);
        }else{
            fill(200, 200, 50, 75);
        }
        let dir = createVector(mouseX, mouseY).sub(player.pos);
        let a = Math.atan2(dir.y, dir.x);
        arc(player.pos.x, player.pos.y, player.range*2, player.range*2, a-player.amp/2, a+player.amp/2);

        if(STATE === 1){
            rectMode(CENTER);
            stroke(255);
            fill(0);
            let box_x = width/2;
            let box_y = height/3;
            let box_w = width/1.47;
            let box_h = height/6;
            rect(box_x, box_y, box_w, box_h);
            textSize(box_h);
            stroke(255);
            fill(255);
            text("GAME OVER", box_x-box_w/2, box_y-box_h/2+box_h-box_h*0.1);

            fill(0);
            stroke(255);
            box_x = width/2;
            box_y = height/1.5;
            box_w = width/3.2;
            box_h = height/10;
            rect(box_x, box_y, box_w, box_h);
            textSize(box_h);
            if(!this.inButton){
                stroke(255);
                fill(255);
            }else{
                stroke(200, 200, 50);
                fill(200, 200, 50);
            }
            text("RESTART", box_x-box_w/2, box_y-box_h/2+box_h-box_h*0.1);



        }else if(STATE === 2){
            rectMode(CENTER);
            stroke(255);
            fill(0);
            let box_x = width/2;
            let box_y = height/1.5;
            let box_w = width/3.2;
            let box_h = height/10;
            rect(box_x, box_y, box_w, box_h);
            textSize(box_h);
            if(!this.inButton){
                stroke(255);
                fill(255);
            }else{
                stroke(200, 200, 50);
                fill(200, 200, 50);
            }

            text("START", box_x-box_w/2+box_w*0.15, box_y-box_h/2+box_h-box_h*0.1);
        }

        let playerMouseVec = ((mousePos.copy()).sub(player.pos)).normalize();
        playerMouseVec.mult(70);

        noStroke();
        fill(200, 200, 50);
        ellipse(mousePos.x, mousePos.y, 15, 15);

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

    updateButton(mousePos){
        let box_x = width/2;
        let box_y = height/1.5;
        let box_w = width/3.2;
        let box_h = height/10;

        this.inButton = false;
        if(mousePos.x <= box_x+box_w/2 && mousePos.x >= box_x - box_w/2 &&
            mousePos.y <= box_y+box_h/2 && mousePos.y >= box_y - box_h/2){
            this.inButton = true;
        }
    }




}