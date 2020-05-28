let player;
let enemies = [];
let bullets = [];
let keys = Array(100).fill(false);
let level_string;
let level;
let ui;
let enemySpawn;

let nav;

function preload(){
    level_string = loadStrings("levels/map0.txt");
}

function setup() {
    createCanvas(1200, 800);
    noCursor();

    level = new Level(level_string);
    ui = new UI(20, 15);
    player = new Player(width/2, height/2, 40);
    enemySpawn = new EnemySpawn();
    //enemies.push(new Enemy(200, 200, 40));
    //enemies.push(new Enemy(500, 200, 40));
    nav = new Navigator();
}

function draw() {
    let dt = deltaTime/1000.0;

    // Manage key and mouse inputs
    player.processInput(keys);
    if(mouseIsPressed){
        if(mouseButton === LEFT && player.life > 0 && player.fireTimeout <= 0){
            //console.log("PAÑUM PAÑUM");
            let v = createVector(mouseX, mouseY).sub(player.pos);
            v.normalize();
            v.mult(600.);
            bullets.push(new Bullet(player.pos.x, player.pos.y, v.copy()));
            player.fireTimeout = player.fireRate;
        }
    }

    /*********
    * UPDATE *
    **********/
    //let path = nav.findPath(enemies[0].pos, player.pos, level);

    // Spawn new enemies
    enemySpawn.update(dt, enemies, player);

    // Update player
    player.update(dt, level, enemies, keys);

    // Update enemies
    for(let i = 0; i < enemies.length; i++){
        enemies[i].update(dt, level, player, enemies, i, nav);
    }

    // Update bullets
    bullets.forEach(b => b.update(dt, level, enemies));

    // Remove dead enemies
    for(let i = 0; i < enemies.length; i++){
        if(enemies[i].dead){
            enemySpawn.spawnFrec = Math.max(0.5, enemySpawn.spawnFrec-0.005);
            console.log(enemySpawn.spawnFrec);
            player.points +=100;
            enemies.splice(i, 1);
            i--;
        }
    }
    // Remove bullets
    for(let i = 0; i < bullets.length; i++){
        if(bullets[i].end) {
            bullets.splice(i, 1);
            i--;
        }
    }

    /********
     * DRAW *
     ********/

    background(0);
    //nav.drawPath(path);
    enemies.forEach(e => e.draw());
    bullets.forEach(b => b.draw());
    player.draw();

    level.draw();
    ui.draw(player, createVector(mouseX, mouseY));


}

function keyPressed(){
    if(keyCode < 100)
        keys[keyCode] = true;
}

function keyReleased(){
    if(keyCode < 100)
        keys[keyCode] = false;
}