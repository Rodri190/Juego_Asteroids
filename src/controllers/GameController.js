import { GameModel } from "../models/GameModel.js";
import { GameView } from "../views/GameView.js";
import { InputController } from "./InputController.js";

export class GameController {
    constructor(canvas) {
        this.canvas = canvas;
        this.view = new GameView(canvas);
        this.input = new InputController();
        this.model = new GameModel(window.innerWidth, window.innerHeight);
        this.lastTime = 0;
        this.loop = this.loop.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    start() {
        this.handleResize();
        this.input.connect();
        window.addEventListener("resize", this.handleResize);
        window.addEventListener("keydown", this.handleKeyDown);
        requestAnimationFrame(this.loop);
    }

    handleResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.view.resize(width, height);
        this.model.resize(width, height);
    }

    handleKeyDown(event) {
        if (event.key !== " " && event.code !== "Space") {
            return;
        }

        event.preventDefault();

        if (this.model.gameOver) {
            this.model.restart();
            return;
        }

        this.model.shoot(Date.now());
    }

    loop(time) {
        const deltaTime = Math.min((time - this.lastTime) / 1000 || 0, 0.033);
        this.lastTime = time;

        this.model.update(deltaTime, this.input, Date.now());

        if (this.model.scoreSavePending) {
            this.model.saveScore();
        }

        this.view.render(this.model);
        requestAnimationFrame(this.loop);
    }
}
