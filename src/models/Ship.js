export class Ship {
    constructor(width, height) {
        this.speed = 340;
        this.size = 20;
        this.x = width / 2;
        this.y = height / 2;
        this.bounds = { width, height };
    }

    resize(width, height) {
        this.bounds.width = width;
        this.bounds.height = height;
        this.x = Math.min(Math.max(this.size, this.x), width - this.size);
        this.y = Math.min(Math.max(this.size, this.y), height - this.size);
    }

    resetPosition(width, height) {
        this.x = width / 2;
        this.y = height / 2;
    }

    update(deltaTime, inputState) {
        let moveX = 0;
        let moveY = 0;

        if (inputState.isPressed("ArrowUp") || inputState.isPressed("w")) moveY -= 1;
        if (inputState.isPressed("ArrowDown") || inputState.isPressed("s")) moveY += 1;
        if (inputState.isPressed("ArrowLeft") || inputState.isPressed("a")) moveX -= 1;
        if (inputState.isPressed("ArrowRight") || inputState.isPressed("d")) moveX += 1;

        if (moveX !== 0 && moveY !== 0) {
            moveX *= Math.SQRT1_2;
            moveY *= Math.SQRT1_2;
        }

        this.x += moveX * this.speed * deltaTime;
        this.y += moveY * this.speed * deltaTime;

        this.x = Math.max(this.size, Math.min(this.bounds.width - this.size, this.x));
        this.y = Math.max(this.size, Math.min(this.bounds.height - this.size, this.y));
    }
}
