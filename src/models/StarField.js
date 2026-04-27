import { Star } from "./Star.js";

export class StarField {
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
}
