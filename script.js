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

/* Inicializar el juego cuando el DOM esté listo */
document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('space-board');
    
    const spaceBoard = new SpaceBoard(boardElement);

});
