export class InputController {
    constructor() {
        this.keys = {};
        this.boundKeyDown = (event) => {
            this.keys[event.key.toLowerCase()] = true;
        };
        this.boundKeyUp = (event) => {
            this.keys[event.key.toLowerCase()] = false;
        };
    }

    connect() {
        window.addEventListener("keydown", this.boundKeyDown);
        window.addEventListener("keyup", this.boundKeyUp);
    }

    isPressed(key) {
        return Boolean(this.keys[key.toLowerCase()]);
    }
}
