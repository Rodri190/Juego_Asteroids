export class EnemyShip {
    constructor(width, height) {
        this.size = 24;
        this.radius = 22;
        this.hitsTaken = 0;
        this.maxHits = 10;
        this.y = Math.max(this.size + 16, 60);
        this.bounds = { width, height };
        this.x = width / 2;
    }

    update() {
    }

    resize(width, height) {
        this.bounds.width = width;
        this.bounds.height = height;
        this.x = Math.min(Math.max(this.size, this.x), width - this.size);
        this.y = Math.min(Math.max(this.size + 16, this.y), Math.max(this.size + 16, height * 0.25));
    }
}
