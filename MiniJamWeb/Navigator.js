class Cell{
    constructor(x, y, isWall){
        this.pos = createVector(x, y);
        this.isWall = isWall;

        this.cameFrome = null;
        this.fScore = Infinity;
        this.gScore = Infinity;

        this.visited = false;
        this.evaluated = false;
    }
}

class Navigator{
    constructor(){

    }

    findPath(startPos0, goalPos0, level){

        let greed = [];
        for(let y = 0; y < level.tiles.length; y++){
            let row = [];
            for(let x = 0; x < level.tiles[0].length; x++){
                if(level.tiles[y][x] === "1"){
                    row.push(new Cell(x, y, true));
                }else{
                    row.push(new Cell(x, y, false));
                }
            }
            greed.push(row);
        }

        let startPos = createVector(Math.floor(startPos0.x/level.tileSize), Math.floor(startPos0.y/level.tileSize))
        let goalPos = createVector(Math.floor(goalPos0.x/level.tileSize), Math.floor(goalPos0.y/level.tileSize))

        let actualPos = startPos.copy();

        let openSet = [];
        let found = false;

        openSet.push(greed[startPos.y][startPos.x]);

        greed[startPos.y][startPos.x].gScore = 0;
        greed[startPos.y][startPos.x].fScore = greed[startPos.y][startPos.x].gScore + this.heuristicCost(startPos, goalPos);

        let current;

        while(openSet.length > 0 && !found){
            //console.log("OOK");
            openSet.sort(function (a, b) {
                return b.fScore - a.fScore;
            });
            current = openSet.pop();

            if (current.pos.x === goalPos.x && current.pos.y === goalPos.y) {
                found = true;
            }
            current.visited = true;
            let neighbors = this.getNeighbors(current, greed, level);
            //console.log(neighbors);
            for (let i = 0; i < neighbors.length; i++) {
                neighbors[i].evaluated = true;
                if (!neighbors[i].visited) {
                    if (openSet.indexOf(neighbors[i]) < 0) {
                        openSet.push(neighbors[i]);
                    }

                    let newG = current.gScore + current.pos.dist(neighbors[i].pos);
                    if (newG < neighbors[i].gScore) {
                        neighbors[i].cameFrome = current;
                        neighbors[i].gScore = newG;
                        neighbors[i].fScore = newG + this.heuristicCost(neighbors[i].pos, goalPos);
                    }
                }
            }
        }

        let path = [];



        path.push(goalPos0.copy());

        /*path.push(createVector(current.pos.x*level.tileSize + level.tileSize/2,
                                current.pos.y*level.tileSize + level.tileSize/2));*/


        let next = current.cameFrome;
        while(next != null && next.cameFrome != null){
            path.push(createVector(next.pos.x*level.tileSize + level.tileSize/2,
                                    next.pos.y*level.tileSize + level.tileSize/2));
            next = next.cameFrome;
        }
        path.push(startPos0.copy());

        /*if(openSet.length === 0 && !found) {
            console.log("Failed to find a way to the goal");
        } else {
            console.log("Found the way to the goal");
        }*/

        return path;
    }

    getNeighbors(cell, greed, level){
        let neighbors = [];

        if(cell.pos.x > 0){
            if(!greed[cell.pos.y][cell.pos.x-1].isWall) {
                neighbors.push(greed[cell.pos.y][cell.pos.x - 1]);
            }else{
                greed[cell.pos.y][cell.pos.x-1].evaluated = true;
            }
        }

        if(cell.pos.x > 0 && cell.pos.y < greed.length-1){
            if(!greed[cell.pos.y+1][cell.pos.x-1].isWall) {
                neighbors.push(greed[cell.pos.y+1][cell.pos.x-1]);
            }else{
                greed[cell.pos.y+1][cell.pos.x-1].evaluated = true;
            }
        }

        if(cell.pos.x < greed[0].length - 1){
            if(!greed[cell.pos.y][cell.pos.x + 1].isWall) {
                neighbors.push(greed[cell.pos.y][cell.pos.x + 1]);
            }else{
                greed[cell.pos.y][cell.pos.x+1].evaluated = true;
            }
        }

        if(cell.pos.x < greed[0].length-1 && cell.pos.y < greed.length-1){
            if(!greed[cell.pos.y+1][cell.pos.x+1].isWall) {
                neighbors.push(greed[cell.pos.y+1][cell.pos.x+1]);
            }else{
                greed[cell.pos.y+1][cell.pos.x+1].evaluated = true;
            }
        }

        if(cell.pos.y > 0){
            if(!greed[cell.pos.y-1][cell.pos.x].isWall) {
                neighbors.push(greed[cell.pos.y - 1][cell.pos.x]);
            }else{
                greed[cell.pos.y-1][cell.pos.x].evaluated = true;
            }
        }

        if(cell.pos.x < greed[0].length-1 && cell.pos.y > 0){
            if(!greed[cell.pos.y-1][cell.pos.x+1].isWall) {
                neighbors.push(greed[cell.pos.y-1][cell.pos.x+1]);
            }else{
                greed[cell.pos.y-1][cell.pos.x+1].evaluated = true;
            }
        }

        if(cell.pos.y < greed.length-1){
            if(!greed[cell.pos.y+1][cell.pos.x].isWall) {
                neighbors.push(greed[cell.pos.y + 1][cell.pos.x]);
            }else{
                greed[cell.pos.y+1][cell.pos.x].evaluated = true;
            }
        }

        if(cell.pos.x > 0 && cell.pos.y > 0){
            if(!greed[cell.pos.y-1][cell.pos.x-1].isWall) {
                neighbors.push(greed[cell.pos.y-1][cell.pos.x-1]);
            }else{
                greed[cell.pos.y-1][cell.pos.x-1].evaluated = true;
            }
        }

        return neighbors;
    }

    heuristicCost(pos1, pos2){
        return Math.abs(pos1.x-pos2.x)+Math.abs(pos1.y-pos2.y); // Manhattan distance
    }

    drawNavigationMesh(greed, level){
        push();
        noStroke();
        for(let y = 0; y < greed.length; y++){
            for(let x = 0; x < greed[0].length; x++){
                if(greed[y][x].isWall){
                    fill(0);
                    ellipse(greed[y][x].pos.x*level.tileSize+level.tileSize/2,
                        greed[y][x].pos.y*level.tileSize+level.tileSize/2, 10);
                }else{
                    fill(50, 50, 200);
                    ellipse(greed[y][x].pos.x*level.tileSize+level.tileSize/2,
                        greed[y][x].pos.y*level.tileSize+level.tileSize/2, 10);
                }
            }
        }
        pop();
    }


    drawPath(path){
        push();
        beginShape();
        noStroke();
        noFill();
        strokeWeight(5);
        stroke(50, 50, 200);
        for(let i = 0; i < path.length; i++){
            vertex(path[i].x, path[i].y);
        }

        endShape();
        pop();
    }
}