class Star {
    constructor(width, height) {
        this.reset(width, height, true);
    }

    reset(width, height, randomY = false) {
        this.x = Math.random() * width;
        this.y = randomY ? Math.random() * height : -Math.random() * Math.max(height * 0.2, 40);
        this.speed = 60 + Math.random() * 220;
        this.size = 1 + Math.random() * 2;
        this.opacity = 0.35 + Math.random() * 0.65;
    }

    update(deltaTime, width, height) {
        this.y += this.speed * deltaTime;

        if (this.y - this.size > height) {
            this.reset(width, height, false);
        }
    }

    draw(ctx) {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}

class StarField {
    constructor(width, height) {
        this.stars = [];
        this.resize(width, height);
    }

    getStarCount(width, height) {
        return Math.max(80, Math.floor((width * height) / 9000));
    }

    resize(width, height) {
        this.width = width;
        this.height = height;

        const targetCount = this.getStarCount(width, height);

        if (this.stars.length < targetCount) {
            while (this.stars.length < targetCount) {
                this.stars.push(new Star(width, height));
            }
        } else if (this.stars.length > targetCount) {
            this.stars.length = targetCount;
        }

        for (const star of this.stars) {
            star.x = Math.min(star.x, width);
            star.y = Math.min(star.y, height);
        }
    }

    update(deltaTime) {
        for (const star of this.stars) {
            star.update(deltaTime, this.width, this.height);
        }
    }

    draw(ctx) {
        for (const star of this.stars) {
            star.draw(ctx);
        }
    }
}
//las balas
class Bullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 600;
        this.size = 6;
    }

    update(deltaTime) {
        this.y -= this.speed * deltaTime;
    }

    draw(ctx) {
        ctx.fillStyle = "gray";
        ctx.fillRect(this.x - 2, this.y, 4, 12);
    }

    isOffScreen() {
        return this.y + this.size < 0;
    }
}

class Asteroid {
    constructor(width) {
        this.size = Math.random() * 30 + 20;
        this.radius = this.size / 2;
        this.x = this.radius + Math.random() * (width - this.size);
        this.y = -this.radius;
        this.speed = 100 + Math.random() * 200;
        this.points = this.generateShape();
    }

    update(deltaTime) {
        this.y += this.speed * deltaTime;
    }

    draw(ctx) {
    ctx.fillStyle = "#888";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "gray";

    ctx.beginPath();

    ctx.moveTo(
        this.x + this.points[0].x,
        this.y + this.points[0].y
    );

    for (let i = 1; i < this.points.length; i++) {
        ctx.lineTo(
            this.x + this.points[i].x,
            this.y + this.points[i].y
        );
    }

    ctx.closePath();
    ctx.fill();

    ctx.shadowBlur = 0;
}

    isOffScreen(height) {
        return this.y - this.radius > height;
    }

    generateShape() {
    const points = [];
    const vertices = Math.floor(Math.random() * 5) + 6; // 6 a 10 lados

    for (let i = 0; i < vertices; i++) {
        const angle = (Math.PI * 2 / vertices) * i;

        const variation = Math.random() * 10 - 5;
        const radius = this.radius + variation;

        points.push({
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius
        });
    }

    return points;
}
}

class Explosion {
    constructor(x, y) {
        this.particles = [];

        for (let i = 0; i < 15; i++) {
            this.particles.push({
                x: x,
                y: y,
                dx: (Math.random() - 0.5) * 200,
                dy: (Math.random() - 0.5) * 200,
                life: 1
            });
        }
    }

    update(deltaTime) {
        for (const p of this.particles) {
            p.x += p.dx * deltaTime;
            p.y += p.dy * deltaTime;
            p.life -= deltaTime;
        }

        this.particles = this.particles.filter(p => p.life > 0);
    }

    draw(ctx) {
        for (const p of this.particles) {
            ctx.fillStyle = `rgba(255,150,0,${p.life})`;
            ctx.fillRect(p.x, p.y, 3, 3);
        }
    }

    isDone() {
        return this.particles.length === 0;
    }
}

class Ship {
    constructor(width, height) {
        this.speed = 340;
        this.size = 20;
        this.x = width / 2;
        this.y = height / 2;
        this.bounds = { width, height };
        this.keys = {};

        this.bindEvents();
    }

    bindEvents() {
        window.addEventListener("keydown", (event) => {
            this.keys[event.key] = true;
        });

        window.addEventListener("keyup", (event) => {
            this.keys[event.key] = false;
        });
    }

    resize(width, height) {
        this.bounds.width = width;
        this.bounds.height = height;
        this.x = Math.min(Math.max(this.size, this.x), width - this.size);
        this.y = Math.min(Math.max(this.size, this.y), height - this.size);
    }

    update(deltaTime) {
        let moveX = 0;
        let moveY = 0;

        if (this.keys["ArrowUp"] || this.keys["w"] || this.keys["W"]) moveY -= 1;
        if (this.keys["ArrowDown"] || this.keys["s"] || this.keys["S"]) moveY += 1;
        if (this.keys["ArrowLeft"] || this.keys["a"] || this.keys["A"]) moveX -= 1;
        if (this.keys["ArrowRight"] || this.keys["d"] || this.keys["D"]) moveX += 1;

        if (moveX !== 0 && moveY !== 0) {
            moveX *= Math.SQRT1_2;
            moveY *= Math.SQRT1_2;
        }

        this.x += moveX * this.speed * deltaTime;
        this.y += moveY * this.speed * deltaTime;

        this.x = Math.max(this.size, Math.min(this.bounds.width - this.size, this.x));
        this.y = Math.max(this.size, Math.min(this.bounds.height - this.size, this.y));
    }

    draw(ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - 20);
        ctx.lineTo(this.x - 15, this.y + 15);
        ctx.lineTo(this.x + 15, this.y + 15);
        ctx.closePath();
        ctx.fill();
    }
}

class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.keys = {};
        this.bullets = [];
        this.asteroids = [];
        this.explosions = [];
        this.scoreStorageKey = "currentScore";
        this.score = this.loadScore();
        this.scoreSavePending = false;
        this.pointsPerAsteroid = 10;
        this.lastTime = 0;
        this.lastShot = 0;
        this.lastAsteroid = 0;
        this.shootDelay = 200;
        this.asteroidDelay = 2000;

        this.resizeCanvas();
        this.starField = new StarField(this.canvas.width, this.canvas.height);
        this.ship = new Ship(this.canvas.width, this.canvas.height);

        this.bindEvents();
        window.addEventListener("resize", () => this.handleResize());
    }
//bala
    bindEvents() {
        window.addEventListener("keydown", (event) => {
            this.keys[event.key] = true;

            if (event.key === " " || event.code === "Space") {
                event.preventDefault();
                this.shoot();
            }
        });

        window.addEventListener("keyup", (event) => {
            this.keys[event.key] = false;

            if (event.key === " " || event.code === "Space") {
                event.preventDefault();
            }
        });
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    handleResize() {
        this.resizeCanvas();
        this.starField.resize(this.canvas.width, this.canvas.height);
        this.ship.resize(this.canvas.width, this.canvas.height);
    }

    update(deltaTime) {
        const now = Date.now();

        this.starField.update(deltaTime);
        this.ship.update(deltaTime);
        //asteroide
        if (now - this.lastAsteroid > this.asteroidDelay) {
            this.lastAsteroid = now;
            this.asteroids.push(new Asteroid(this.canvas.width));
        }
//bala
        this.bullets = this.bullets.filter((bullet) => !bullet.isOffScreen(this.canvas.height));
        //asteroide
        this.asteroids = this.asteroids.filter((asteroid) => !asteroid.isOffScreen(this.canvas.height));

        for (const bullet of this.bullets) {
            bullet.update(deltaTime);
        }
//asteroide
        for (const asteroid of this.asteroids) {
            asteroid.update(deltaTime);
        }

        // explosiones de esteroide
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            for (let j = this.asteroids.length - 1; j >= 0; j--) {

                const bullet = this.bullets[i];
                const asteroid = this.asteroids[j];

                const dx = bullet.x - asteroid.x;
                const dy = bullet.y - asteroid.y;
                const distanceSquared = dx * dx + dy * dy;
                const radiusSquared = asteroid.radius * asteroid.radius;

                if (distanceSquared < radiusSquared) {

                    this.createExplosion(asteroid.x, asteroid.y);

                    this.bullets.splice(i, 1);
                    this.asteroids.splice(j, 1);
                    this.score += this.pointsPerAsteroid;
                    this.scoreSavePending = true;

                    break;
                }
            }
        }

        // Update explosiones
        this.explosions = this.explosions.filter(e => !e.isDone());

        for (const explosion of this.explosions) {
            explosion.update(deltaTime);
        }
    }

    draw() {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.starField.draw(this.ctx);
        //asteroide
        for (const asteroid of this.asteroids) {
            asteroid.draw(this.ctx);
        }
        //bala
        for (const bullet of this.bullets) {
            bullet.draw(this.ctx);
        }
     // explosion
        for (const explosion of this.explosions) {
            explosion.draw(this.ctx);
        }
        this.ship.draw(this.ctx);
//score
        this.drawScore();
    }

    drawScore() {
        this.ctx.save();
        this.ctx.fillStyle = "#ffffff";
        this.ctx.font = "20px Arial";
        this.ctx.textAlign = "right";
        this.ctx.textBaseline = "top";
        this.ctx.shadowColor = "rgba(255, 255, 255, 0.35)";
        this.ctx.shadowBlur = 8;
        this.ctx.fillText(`Score: ${this.score}`, this.canvas.width - 20, 20);
        this.ctx.restore();
    }
//agregando el localstorage
    loadScore() {
        try {
            const storedScore = localStorage.getItem(this.scoreStorageKey); //carga el valor score
            const parsedScore = Number.parseInt(storedScore ?? "0", 10);
            return Number.isFinite(parsedScore) ? parsedScore : 0;
        } catch (error) {
            return 0;
        }
    }

    saveScore() { //guardamos el score
        try {
            localStorage.setItem(this.scoreStorageKey, String(this.score));
        } catch (error) {
            this.scoreSavePending = false;
            return;
        }

        this.scoreSavePending = false;
    }

    resetScore() {//reinicia el juego 
        this.score = 0;
        this.scoreSavePending = false;

        try {
            localStorage.removeItem(this.scoreStorageKey);
        } catch (error) {
            return;
        }
    }

    createExplosion(x, y) {
        this.explosions.push(new Explosion(x, y));
    }

    restart() {
        this.bullets = [];
        this.asteroids = [];
        this.explosions = [];
        this.lastTime = 0;
        this.lastShot = 0;
        this.lastAsteroid = 0;
        this.ship.x = this.canvas.width / 2;
        this.ship.y = this.canvas.height / 2;
        this.resetScore();
    }

//bala
    shoot() {
        const now = Date.now();
        if (now - this.lastShot < this.shootDelay) {
            return;
        }

        this.lastShot = now;
        this.bullets.push(new Bullet(this.ship.x, this.ship.y - this.ship.size));
    }

    loop = (time) => {
        const deltaTime = Math.min((time - this.lastTime) / 1000 || 0, 0.033);
        this.lastTime = time;

        this.update(deltaTime);
        if (this.scoreSavePending) {
            this.saveScore();
        }
        this.draw();
        requestAnimationFrame(this.loop);
    };

    start() {
        requestAnimationFrame(this.loop);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    const game = new Game(canvas);
    game.start();
});
