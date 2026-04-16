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
        this.lastTime = 0;

        this.resizeCanvas();
        this.starField = new StarField(this.canvas.width, this.canvas.height);
        this.ship = new Ship(this.canvas.width, this.canvas.height);

        window.addEventListener("resize", () => this.handleResize());
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
        this.starField.update(deltaTime);
        this.ship.update(deltaTime);
    }

    draw() {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.starField.draw(this.ctx);
        this.ship.draw(this.ctx);
    }

    loop = (time) => {
        const deltaTime = Math.min((time - this.lastTime) / 1000 || 0, 0.033);
        this.lastTime = time;

        this.update(deltaTime);
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
