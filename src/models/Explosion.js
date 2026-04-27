export class Explosion {
    constructor(x, y) {
        this.particles = [];

        for (let i = 0; i < 15; i++) {
            this.particles.push({
                x,
                y,
                dx: (Math.random() - 0.5) * 200,
                dy: (Math.random() - 0.5) * 200,
                life: 1,
            });
        }
    }

    update(deltaTime) {
        for (const particle of this.particles) {
            particle.x += particle.dx * deltaTime;
            particle.y += particle.dy * deltaTime;
            particle.life -= deltaTime;
        }

        this.particles = this.particles.filter((particle) => particle.life > 0);
    }

    isDone() {
        return this.particles.length === 0;
    }
}
