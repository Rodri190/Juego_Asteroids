/**
 * Clase SpaceBoard
 * Encargada de crear y gestionar el tablero del juego espacial
 */
class SpaceBoard {
    constructor(boardElement) {
        this.boardElement = boardElement;
        this.stars = [];
        this.init();
        this.setupResponsive();
    }

    /**
     * Inicializa el tablero generando estrella
     */
    init() {
        this.generateStars();
    }

    /**
     * Genera las estrellas aleatoriamente en el tablero
     */
    generateStars() {
        // Limpiar estrellas anteriores
        this.stars = [];
        this.boardElement.innerHTML = '';

        // Obtener dimensiones del tablero
        const boardWidth = this.boardElement.offsetWidth;
        const boardHeight = this.boardElement.offsetHeight;

        // Calcular cantidad de estrellas basado en el área del tablero
        // Aproximadamente 1 estrella cada 1000px²
        const starCount = Math.floor((boardWidth * boardHeight) / 1000);

        // Generar estrellas
        for (let i = 0; i < starCount; i++) {
            this.createStar(boardWidth, boardHeight);
        }
    }

    /**
     * Crea una estrella individual con posición y tamaño aleatorio
     * @param {number} boardWidth - Ancho del tablero
     * @param {number} boardHeight - Alto del tablero
     */
    createStar(boardWidth, boardHeight) {
        // Posición aleatoria dentro del tablero
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

        // Agregar al tablero
        this.boardElement.appendChild(star);
        this.stars.push(star);
    }

    /**
     * Configura la regeneración de estrellas al cambiar el tamaño de la ventana
     */
    setupResponsive() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.generateStars();
            }, 250); // Esperar 250ms después de que termine el resize
        });
    }
}

/**
 * Inicializar el juego cuando el DOM esté listo
 */
document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('space-board');
    
    // Crear instancia de SpaceBoard
    const spaceBoard = new SpaceBoard(boardElement);

    // Hacer la instancia global para debugging (opcional)
    window.spaceBoard = spaceBoard;
});
