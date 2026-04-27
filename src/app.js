import { GameController } from "./controllers/GameController.js";

export function bootstrap() {
    const canvas = document.getElementById("gameCanvas");

    if (!canvas) {
        return;
    }

    const gameController = new GameController(canvas);
    gameController.start();
}
