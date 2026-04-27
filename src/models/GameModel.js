import { Asteroid } from "./Asteroid.js";
import { Bullet } from "./Bullet.js";
import { EnemyShip } from "./EnemyShip.js";
import { Explosion } from "./Explosion.js";
import { Ship } from "./Ship.js";
import { StarField } from "./StarField.js";

export class GameModel {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.bullets = [];
        this.asteroids = [];
        this.explosions = [];
        this.scoreStorageKey = "currentScore";
        this.score = this.loadScore();
        this.scoreSavePending = false;
        this.pointsPerAsteroid = 10;
        this.pointsPerEnemyHit = 10;
        this.enemy = null;
        this.enemyActive = false;
        this.enemySpawnScore = 100;//cuando aparecera el enemigo
        this.enemyDefeated = false;
        this.gameOver = false;
        this.lastShot = 0;
        this.lastAsteroid = 0;
        this.shootDelay = 200;
        this.asteroidDelay = 2000;
        this.starField = new StarField(width, height);
        this.ship = new Ship(width, height);
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
        this.starField.resize(width, height);
        this.ship.resize(width, height);

        if (this.enemyActive) {
            this.enemy.resize(width, height);
        }
    }

    update(deltaTime, inputState, now = Date.now()) {
        if (this.gameOver) {
            return;
        }

        this.starField.update(deltaTime);
        this.ship.update(deltaTime, inputState);
        this.spawnEnemyIfNeeded();

        if (this.enemyActive) {
            this.enemy.update(deltaTime);
        }

        if (!this.enemyActive && now - this.lastAsteroid > this.asteroidDelay) {
            this.lastAsteroid = now;
            this.asteroids.push(new Asteroid(this.width));
        }

        this.bullets = this.bullets.filter((bullet) => !bullet.isOffScreen());
        this.asteroids = this.asteroids.filter((asteroid) => !asteroid.isOffScreen(this.height));

        for (const bullet of this.bullets) {
            bullet.update(deltaTime);
        }

        for (const asteroid of this.asteroids) {
            asteroid.update(deltaTime);
        }

        this.handleEnemyBulletCollisions();
        this.handleBulletAsteroidCollisions();
        this.checkShipAsteroidCollisions();

        this.explosions = this.explosions.filter((explosion) => !explosion.isDone());

        for (const explosion of this.explosions) {
            explosion.update(deltaTime);
        }
    }

    handleBulletAsteroidCollisions() {
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
    }

    spawnEnemyIfNeeded() {
        if (this.enemyActive || this.enemyDefeated || this.score < this.enemySpawnScore) {
            return;
        }

        this.enemy = new EnemyShip(this.width, this.height);
        this.enemyActive = true;
    }

    handleEnemyBulletCollisions() {
        if (!this.enemyActive) {
            return;
        }

        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            const dx = bullet.x - this.enemy.x;
            const dy = bullet.y - this.enemy.y;
            const distanceSquared = dx * dx + dy * dy;
            const radiusSquared = this.enemy.radius * this.enemy.radius;

            if (distanceSquared < radiusSquared) {
                this.bullets.splice(i, 1);
                this.enemy.hitsTaken += 1;
                this.score += this.pointsPerEnemyHit;
                this.scoreSavePending = true;

                if (this.enemy.hitsTaken >= this.enemy.maxHits) {
                    this.createExplosion(this.enemy.x, this.enemy.y);
                    this.enemy = null;
                    this.enemyActive = false;
                    this.enemyDefeated = true;
                }

                break;
            }
        }
    }

    checkShipAsteroidCollisions() {
        const shipRadius = this.ship.size * 0.9;

        for (const asteroid of this.asteroids) {
            const dx = this.ship.x - asteroid.x;
            const dy = this.ship.y - asteroid.y;
            const collisionDistance = shipRadius + asteroid.radius;

            if (dx * dx + dy * dy < collisionDistance * collisionDistance) {
                this.createExplosion(this.ship.x, this.ship.y);
                this.gameOver = true;
                return;
            }
        }
    }

    shoot(now = Date.now()) {
        if (this.gameOver) {
            return;
        }

        if (now - this.lastShot < this.shootDelay) {
            return;
        }

        this.lastShot = now;
        this.bullets.push(new Bullet(this.ship.x, this.ship.y - this.ship.size));
    }

    restart() {
        this.bullets = [];
        this.asteroids = [];
        this.explosions = [];
        this.enemy = null;
        this.enemyActive = false;
        this.gameOver = false;
        this.lastShot = 0;
        this.lastAsteroid = 0;
        this.ship.resetPosition(this.width, this.height);
        this.resetScore();
    }

    createExplosion(x, y) {
        this.explosions.push(new Explosion(x, y));
    }

    loadScore() {
        try {
            const storedScore = localStorage.getItem(this.scoreStorageKey);
            const parsedScore = Number.parseInt(storedScore ?? "0", 10);
            return Number.isFinite(parsedScore) ? parsedScore : 0;
        } catch (error) {
            return 0;
        }
    }

    saveScore() {
        try {
            localStorage.setItem(this.scoreStorageKey, String(this.score));
        } catch (error) {
            this.scoreSavePending = false;
            return;
        }

        this.scoreSavePending = false;
    }

    resetScore() {
        this.score = 0;
        this.scoreSavePending = false;
        this.enemyDefeated = false;

        try {
            localStorage.removeItem(this.scoreStorageKey);
        } catch (error) {
            return;
        }
    }
}
