export class Bullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 600;
        this.size = 6;
    }

    update(deltaTime) {
        this.y -= this.speed * deltaTime;
    }

    isOffScreen() {
        return this.y + this.size < 0;
    }
}
