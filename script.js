class SpaceBoard {
    constructor(boardElement) {
        this.boardElement = boardElement;
        this.stars = [];
        this.init();
        this.setupResponsive();
    }

    init() {
        this.generateStars();
    }

    generateStars() {
        // Limpiar estrellas anteriores
        this.stars = [];
        this.boardElement.innerHTML = '';

        // Obtener dimensiones del tablero
        const boardWidth = window.innerWidth;
        const boardHeight = window.innerHeight;
        const starCount = Math.floor((boardWidth * boardHeight) / 1000);

        // Generar estrellas
        for (let i = 0; i < starCount; i++) {
            this.createStar(boardWidth, boardHeight);
        }
    }

    createStar(boardWidth, boardHeight) {
        const x = Math.random() * boardWidth;
        const y = Math.random() * boardHeight;

        // Tamaño aleatorio entre 1px y 3px
        const size = Math.random() * 2 + 1;

        // Opacidad variable para crear profundidad
        const opacity = Math.random() * 0.7 + 0.3;

        // Crear elemento de estrella
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${x}px`;
        star.style.top = `${y}px`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.opacity = opacity;

    const speed = Math.random() * 2 + 1;

    star.style.animationDuration = `${speed}s`;

        // Agregar al tablero
        this.boardElement.appendChild(star);
        this.stars.push(star);
    }

    /* Configura la regeneración de estrellas al cambiar el tamaño de la ventana */
    setupResponsive() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.generateStars();
            }, 1); 
        });
    }
}

class Ship {
    constructor(element) {
        this.el = element;

        this.x = window.innerWidth / 2;
        this.y = window.innerHeight / 2;

        this.speed = 5;

        this.keys = {};

        this.init();
    }

    init() {
        this.bindEvents();
        this.update();
    }

    bindEvents() {
        window.addEventListener("keydown", (e) => {
            this.keys[e.key] = true;
        });

        window.addEventListener("keyup", (e) => {
            this.keys[e.key] = false;
        });
    }

    update() {
        const loop = () => {

            if (this.keys["ArrowUp"]) this.y -= this.speed;
            if (this.keys["ArrowDown"]) this.y += this.speed;
            if (this.keys["ArrowLeft"]) this.x -= this.speed;
            if (this.keys["ArrowRight"]) this.x += this.speed;

            // limite
            this.x = Math.max(1, Math.min(window.innerWidth, this.x));
            this.y = Math.max(0, Math.min(window.innerHeight, this.y));
            this.render();

            requestAnimationFrame(loop);
        };

        loop();
    }

    render() {
        this.el.style.left = this.x + "px";
        this.el.style.top = this.y + "px";
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const shipElement = document.querySelector(".ship");
    new Ship(shipElement);
});

/* Inicializar el juego cuando el DOM esté listo */
document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('space-board');
    
    const spaceBoard = new SpaceBoard(boardElement);

});
