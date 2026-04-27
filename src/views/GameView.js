export class GameView {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
    }

    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
    }

    render(model) {
        this.clear();
        this.drawStarField(model.starField);
        this.drawAsteroids(model.asteroids);

        if (model.enemyActive) {
            this.drawEnemy(model.enemy);
        }

        this.drawBullets(model.bullets);
        this.drawExplosions(model.explosions);
        this.drawShip(model.ship);
        this.drawScore(model.score);

        if (model.gameOver) {
            this.drawGameOver(model.score);
        }
    }

    clear() {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawStarField(starField) {
        for (const star of starField.stars) {
            this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            this.ctx.fillRect(star.x, star.y, star.size, star.size);
        }
    }

    drawAsteroids(asteroids) {
        for (const asteroid of asteroids) {
            this.ctx.fillStyle = "#888";
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = "gray";
            this.ctx.beginPath();
            this.ctx.moveTo(asteroid.x + asteroid.points[0].x, asteroid.y + asteroid.points[0].y);

            for (let i = 1; i < asteroid.points.length; i++) {
                this.ctx.lineTo(asteroid.x + asteroid.points[i].x, asteroid.y + asteroid.points[i].y);
            }

            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        }
    }

    drawBullets(bullets) {
        this.ctx.fillStyle = "gray";

        for (const bullet of bullets) {
            this.ctx.fillRect(bullet.x - 2, bullet.y, 4, 12);
        }
    }

    drawExplosions(explosions) {
        for (const explosion of explosions) {
            for (const particle of explosion.particles) {
                this.ctx.fillStyle = `rgba(255,150,0,${particle.life})`;
                this.ctx.fillRect(particle.x, particle.y, 3, 3);
            }
        }
    }

    drawShip(ship) {
        this.ctx.fillStyle = "#ffffff";
        this.ctx.beginPath();
        this.ctx.moveTo(ship.x, ship.y - 20);
        this.ctx.lineTo(ship.x - 15, ship.y + 15);
        this.ctx.lineTo(ship.x + 15, ship.y + 15);
        this.ctx.closePath();
        this.ctx.fill();
    }

    drawEnemy(enemy) {
        this.ctx.save();
        this.ctx.fillStyle = "#ff3b30";
        this.ctx.shadowBlur = 12;
        this.ctx.shadowColor = "rgba(255, 59, 48, 0.65)";
        this.ctx.beginPath();
        this.ctx.moveTo(enemy.x, enemy.y + 18);
        this.ctx.lineTo(enemy.x - 18, enemy.y - 14);
        this.ctx.lineTo(enemy.x + 18, enemy.y - 14);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
    }

    drawScore(score) {
        this.ctx.save();
        this.ctx.fillStyle = "#ffffff";
        this.ctx.font = "20px Arial";
        this.ctx.textAlign = "right";
        this.ctx.textBaseline = "top";
        this.ctx.shadowColor = "rgba(255, 255, 255, 0.35)";
        this.ctx.shadowBlur = 8;
        this.ctx.fillText(`Score: ${score}`, this.canvas.width - 20, 20);
        this.ctx.restore();
    }

    drawGameOver(score) {
        this.ctx.save();
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.72)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "#ffffff";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.shadowColor = "rgba(255, 255, 255, 0.3)";
        this.ctx.shadowBlur = 12;
        this.ctx.font = "bold 52px Arial";
        this.ctx.fillText("GAME OVER", this.canvas.width / 2, this.canvas.height / 2 - 50);
        this.ctx.font = "24px Arial";
        this.ctx.fillText(`Puntaje final: ${score}`, this.canvas.width / 2, this.canvas.height / 2 + 10);
        this.ctx.font = "20px Arial";
        this.ctx.fillText("Presiona ESPACIO para reiniciar", this.canvas.width / 2, this.canvas.height / 2 + 60);
        this.ctx.restore();
    }
}
