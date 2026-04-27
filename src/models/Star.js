export class Star {
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
}
