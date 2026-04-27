export class Asteroid {
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

    isOffScreen(height) {
        return this.y - this.radius > height;
    }

    generateShape() {
        const points = [];
        const vertices = Math.floor(Math.random() * 5) + 6;

        for (let i = 0; i < vertices; i++) {
            const angle = (Math.PI * 2 / vertices) * i;
            const variation = Math.random() * 10 - 5;
            const radius = this.radius + variation;

            points.push({
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius,
            });
        }

        return points;
    }
}
