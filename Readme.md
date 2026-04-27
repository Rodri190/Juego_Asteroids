# Juego Asteroids

Autor: Rodrigo Paniagua Camacho

## Descripción

Un juego clásico de Asteroids desarrollado con JavaScript , el jugador controla una nave espacial que debe destruir asteroides mientras evita ser golpeado y enfrenta enemigos.

## Características

### Mecánicas de Juego
- **Control de nave**: Usa las flechas del teclado para movimiento (arriba, izquierda, derecha)
- **Disparo**: Presiona la barra espaciadora para disparar balas hacia los asteroides
- **Asteroides**: Aparecen en pantalla y se destruyen al ser impactados por balas
- **Sistema de puntuación**: Gana puntos por cada asteroide destruido y enemigo derrotado
- **Enemigos**: Aparecen cuando alcanzas cierta puntuación (100 puntos por defecto)
- **Campo de estrellas**: Fondo animado con estrellas que crean un efecto de profundidad

### Características Técnicas

- **Sistema de Colisiones**: Detección de colisiones entre nave, asteroides, balas y enemigos
- **Explosiones**: Efectos visuales al destruir objetos
- **Persistencia de puntuación**: Almacenamiento de puntuación en localStorage
- **Responsive**: Se adapta al tamaño de la ventana del navegador

## Archivos Principales

- index.html - HTML base con canvas para el juego
- styles.css - Estilos CSS
- script.js - Punto de entrada JavaScript

## Cómo Jugar

1. Abre index.html en tu navegador web
2. Usa las flechas del teclado para controlar la nave
3. Presiona la barra espaciadora para disparar
4. Destruye asteroides para ganar puntos
5. Cuando alcances 100 puntos, aparecerá un enemigo
6. Intenta sobrevivir y conseguir la máxima puntuación