class EnemySpawn{
    constructor(){
        this.spawnPoints = [];
        /*this.spawnPoints.push(createVector(-40, -40));
        this.spawnPoints.push(createVector(width+40, -40));
        this.spawnPoints.push(createVector(-40, height+40));
        this.spawnPoints.push(createVector(width+40, height+40));
        this.spawnPoints.push(createVector(width/2, -40));
        this.spawnPoints.push(createVector(width/2, height+40));*/
        this.spawnPoints.push(createVector(1, 1));
        this.spawnPoints.push(createVector(width-1, 1));
        this.spawnPoints.push(createVector(1, height-1));
        this.spawnPoints.push(createVector(width-1, height-1));
        this.spawnPoints.push(createVector(width/2, 1));
        this.spawnPoints.push(createVector(width/2, height-1));
        this.spawnFrec = 1.0;
        this.spawnTimer = 0.0;
    }

    update(dt, enemies, player){
        this.spawnTimer = Math.max(0.0, this.spawnTimer-dt);
        if(this.spawnTimer <= 0 && player.life > 0){
            this.spawnTimer = this.spawnFrec;
            let newEnemyPos = this.getRandomSpawnPoint();
            enemies.push(new Enemy(newEnemyPos.x, newEnemyPos.y, 40));
            //player.points++;
            //this.spawnFrec = Math.max(0.5, this.spawnFrec-0.01);
            //console.log(this.spawnFrec);
        }
    }

    getRandomSpawnPoint(){
        return this.spawnPoints[Math.floor(random(this.spawnPoints.length))];
    }
}