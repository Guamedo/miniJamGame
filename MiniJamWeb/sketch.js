let player;
let enemies = [];
let bullets = [];
let keys = Array(100).fill(false);
let level_string;
let level;
let ui;
let enemySpawn;

let nav;
let sc;

let STATE = 2;

let cam_shot;
let grr_sound;

function preload(){
    cam_shot = loadSound('sounds/camera.mp3');
    grr_sound = loadSound('sounds/gruñido2.mp3')
    level_string = loadStrings("levels/map0.txt");
}

function setup() {
    sc = Math.min((windowHeight-10)/800, 1);
    createCanvas(1200*sc, 800*sc);
    noCursor();

    level = new Level(level_string);
    ui = new UI(20, 20);
    player = new Player(width/2, height/2, 40);
    enemySpawn = new EnemySpawn();
    //enemies.push(new Enemy(200, 200, 40));
    //enemies.push(new Enemy(500, 200, 40));
    nav = new Navigator();
}

function draw() {
    let dt = deltaTime/1000.0;

    if(STATE === 0){
        // Manage key and mouse inputs
        player.processInput(keys);
        player.flash = false;
        if(mouseIsPressed){
            if(mouseButton === LEFT && player.life > 0 && player.fireTimeout <= 0){
                cam_shot.play();
                player.flash = true;
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
        if(player.life <= 0){
            for(let i = 0; i < enemies.length; i++){
                enemies[i].die();
            }
        }
        if(player.life <= 0){
            let end = true;
            for(let i = 0; i < enemies.length; i++){
                if(enemies[i].endTimer > 0.0){
                    end = false;
                }
            }
            if(end){
                //console.log("END");
                STATE = 1;
            }
        }

        // Update enemies
        for(let i = 0; i < enemies.length; i++){
            enemies[i].update(dt, level, player, enemies, i, nav);
        }

        // Update bullets
        bullets.forEach(b => b.update(dt, level, enemies));

        // Remove dead enemies
        for(let i = 0; i < enemies.length; i++){
            if(enemies[i].dead && enemies[i].endTimer <= 0.0){
                enemySpawn.spawnFrec = Math.max(0.5, enemySpawn.spawnFrec-0.005);
                //console.log(enemySpawn.spawnFrec);
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
    }else if(STATE === 1){
        ui.updateButton(createVector(mouseX, mouseY));
    }else if(STATE === 2){
        ui.updateButton(createVector(mouseX, mouseY));
    }

    /********
     * DRAW *
     ********/

    background(0);
    enemies.forEach(e => e.draw());
    bullets.forEach(b => b.draw());
    player.draw();

    level.draw();
    ui.draw(player, createVector(mouseX, mouseY), STATE);


}

function mousePressed() {
    if(ui.inButton && mouseButton === LEFT && (STATE === 1 || STATE === 2)){
        enemies = [];
        enemySpawn.spawnFrec = 1.0;
        player.life = 3;
        STATE = 0;
        player.points = 0;
        player.damageTimer = -1;
    }
}

function keyPressed(){
    if(keyCode < 100)
        keys[keyCode] = true;
}

function keyReleased(){
    if(keyCode < 100)
        keys[keyCode] = false;
}