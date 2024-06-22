document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('mainCanvas');
    const ctx = canvas.getContext("2d");
    const startButton = document.getElementById('btn');
    const generateButton = document.getElementById('generateBtn');
    const stepForwardButton = document.getElementById('stepForwardBtn');
    const stepBackwardButton = document.getElementById('stepBackwardBtn');

    // Configuration initiale
    const config = {
        canvasWidth: canvas.width,
        canvasHeight: canvas.height,
        cellSize: 15,
        cellColor: '#007BFF',
        bgColor: '#000000',
        isRunning: false,
        cells: [], // Tableau pour stocker les cellules
        cellHistory: [], // Historique des états des cellules
        historyLimit: 50
    };

    let frameId; // ID de l'animation pour l'arrêter si nécessaire


    function initialize() {
        resetCanvas();
        startButton.textContent = "Start"; // Définir le texte du bouton Start

        startButton.addEventListener("click", toggleSimulation);

        // Événement pour générer un nouvel état des cellules
        generateButton.addEventListener("click", () => {
            if (!config.isRunning) {
                resetCanvas();
                populateCells(); // Calcul des celluls
                renderCells(); // Affiche les cellules
                config.cellHistory = [JSON.parse(JSON.stringify(config.cells))]; // Initialise l'historique
            }
        });

        // Événement pour avancer ou reculer d'une étape dans la simulation
        stepForwardButton.addEventListener("click", stepForward);
        stepBackwardButton.addEventListener("click", stepBackward);

        populateCells();
        renderCells();
        config.cellHistory.push(JSON.parse(JSON.stringify(config.cells))); // Sauvegarde de l'état initial
    }


    // Fonction pour démarrer ou arrêter l'animation
    function toggleSimulation() {
        if (!config.isRunning) { // Demarrage de la simulation demandée
            config.isRunning = true;
            startButton.textContent = "Pause";
            generateButton.disabled = true;
            stepForwardButton.disabled = true;
            stepBackwardButton.disabled = true;
            requestAnimationFrame(animate);
        } else { // arret de la simulation demandée
            config.isRunning = false;
            startButton.textContent = "Start";
            generateButton.disabled = false;
            stepForwardButton.disabled = false;
            stepBackwardButton.disabled = false;
            cancelAnimationFrame(frameId);
        }
    }


    // Réinitialiser le canevas (vierge)
    function resetCanvas() {
        ctx.fillStyle = config.bgColor;
        ctx.fillRect(0, 0, config.canvasWidth, config.canvasHeight);
        drawGrid();
    }


    // Dessiner la grille sur le canevas
    function drawGrid() {
        ctx.strokeStyle = config.cellColor;
        // creation des cellules en fct de la taille du canva
        for (let x = 0; x < config.canvasWidth; x += config.cellSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, config.canvasHeight);
            ctx.stroke();
        }
        for (let y = 0; y < config.canvasHeight; y += config.cellSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(config.canvasWidth, y);
            ctx.stroke();
        }
    }


    // Iinitialiser les cellules
    function populateCells() {
        const nbCols = Math.floor(config.canvasWidth / config.cellSize);
        const nbRows = Math.floor(config.canvasHeight / config.cellSize);
        config.cells = []; // Réinitialise le tableau des cellules

        for (let x = 0; x < nbCols; x++) {
            for (let y = 0; y < nbRows; y++) {
                config.cells.push({
                    x: x,
                    y: y,
                    state: Math.random() > 0.5 ? 1 : 0 // État initial aléatoire   1 => alive cell      0 => dead cell
                });
            }
        }
    }

    // Fonction pour afficher les cellules sur le canevas
    function renderCells() {
        config.cells.forEach(cell => {
            if (cell.state === 1) {
                ctx.fillStyle = config.cellColor;
                ctx.fillRect(cell.x * config.cellSize, cell.y * config.cellSize, config.cellSize, config.cellSize);
            }
        });
    }

    // fonction de timeLoop
    function animate() {
        if (config.isRunning) {
            stepForward();
            frameId = requestAnimationFrame(animate); // Planifier la prochaine image
        }
    }

    // Avancer d'une étape dans la simulation
    function stepForward() {
        config.cellHistory.push(JSON.parse(JSON.stringify(config.cells))); // Sauvegarder l'état actuel
        if (config.cellHistory.length > config.historyLimit) { // Supprimer le plus ancien état si la limite d'historique est dépassée
            config.cellHistory.shift();
        }
        updateCells();
        resetCanvas();
        renderCells();
    }

    // Reculer d'une étape dans la simulation
    function stepBackward() {
        if (config.cellHistory.length > 1) {
            config.cellHistory.pop(); // Retirer le dernier état
            config.cells = config.cellHistory[config.cellHistory.length - 1]; // Charger l'état précédent
            resetCanvas();
            renderCells();
        }
    }


    // MAJ de l'état des cellules
    function updateCells() {
        const newCells = config.cells.map(cell => {
            const aliveNeighbors = countAliveNeighbors(cell.x, cell.y); // Compter les voisins vivants
            let newState = cell.state;
            if (cell.state === 1 && (aliveNeighbors < 2 || aliveNeighbors > 3)) { // Mourir par sous-population ou surpopulation
                newState = 0;
            } else if (cell.state === 0 && aliveNeighbors === 3) { // Devenir vivant si exactement 3 voisins sont vivants
                newState = 1;
            }
            return { ...cell, state: newState }; // Retourner la nouvelle cellule
        });
        config.cells = newCells; // Mettre à jour le tableau des cellules
    }

    // Fonction pour compter les voisins vivants d'une cellule
    function countAliveNeighbors(x, y) {
        const neighborPositions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];
        return neighborPositions.reduce((count, [dx, dy]) => {
            const neighbor = config.cells.find(c => c.x === x + dx && c.y === y + dy);
            return count + (neighbor && neighbor.state === 1 ? 1 : 0);
        }, 0);
    }


    initialize();
});
