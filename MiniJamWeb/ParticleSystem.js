class Particle{
    constructor(x, y, size = 5, col = color(255)){
        this.pos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.size = size;
        this.col = col
    }

    update(dt){
        this.pos.add(p5.Vector.mult(this.vel, dt));
        this.vel.add(p5.Vector.mult(this.acc, dt));
        //this.acc.mult(0.9);

        return (this.pos.x < this.size/2.0) || (this.pos.x > width-this.size/2.0) ||
                (this.pos.y < this.size/2.0) || (this.pos.y > height-this.size/2.0);
    }

    draw(){
        push();
        rectMode(CENTER);
        noStroke();
        fill(this.col);
        rect(this.pos.x, this.pos.y, this.size, this.size);
        pop();
    }

    applyForce(F){
        this.acc.add(F);
    }
}

class ParticleSystem{
    constructor(x, y, pNum, pSize, range, col = color(255)){
        this.pos = createVector(x, y);
        this.particles = [];
        for(let i = 0; i < pNum; i++){
            this.particles.push(new Particle(x + random(-range/2, range/2),
                                                y + random(-range/2, range/2),
                                                pSize, col));
            let dir = p5.Vector.sub(this.particles[i].pos, this.pos);
            dir.normalize();
            dir.mult(300.);
            this.particles[i].applyForce(dir);
            this.particles[i].vel = dir;
        }
    }

    update(dt){
        //this.particles.forEach(p => p.update(dt));
        for(let i = 0; i < this.particles.length; i++){
            let out = this.particles[i].update(dt);
            if(out){
                this.particles.splice(i, 1);
                i--;
            }
        }
    }

    draw(){
        this.particles.forEach(p => p.draw());
    }
}