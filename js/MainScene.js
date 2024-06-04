import DuelScene from './DuelScene.js';
import StoreScene from './StoreScene.js';

class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
        this.boardSize = 10;
        this.currentPlayerIndex = 0;
        this.turn = 'god'; // Alterna entre 'god' y 'titan'
        this.duelPlayers = [];
        this.storePlayer = null;
        this.duelActive = false;
        this.storeActive = false;
        this.boardPositions = [
            { x: 700, y: 475 },
            { x: 600, y: 410 },
            { x: 550, y: 300 },
            { x: 575, y: 180 },
            { x: 700, y: 100 },
            { x: 825, y: 100 },
            { x: 925, y: 180 },
            { x: 950, y: 300 },
            { x: 900, y: 410 },
            { x: 800, y: 475 }
        ];
    }

    preload() {
        // Cargar imágenes de los personajes y el tablero
        const godsPlayers = JSON.parse(localStorage.getItem('godsPlayers')) || [];
        const titansPlayers = JSON.parse(localStorage.getItem('titansPlayers')) || [];
        
        godsPlayers.forEach(player => {
            this.load.image(player.name, `../assets/Personajes/${player.type}.PNG`);
        });
        titansPlayers.forEach(player => {
            this.load.image(player.name, `../assets/Personajes/${player.type}.PNG`);
        });

        this.load.image('board', '../assets/board.jpg');
    }

    create() {
        const options = JSON.parse(localStorage.options);
        const initialGold = options.goldini || 0;
        const piecesToWin = options.pieces || 5;
        const godsPlayers = JSON.parse(localStorage.getItem('godsPlayers')) || [];
        const titansPlayers = JSON.parse(localStorage.getItem('titansPlayers')) || [];

        // Añadir el tablero
        const board = this.add.image(750, 300, 'board').setScale(0.5);

        this.messageElement = this.add.text(50, 50, '', { fill: '#ffffff' });

        this.gods = godsPlayers.map(player => ({
            ...player, position: 1, gold: initialGold, armorPieces: 0,
            sprite: this.add.sprite(700, 475, player.name).setScale(0.05) // Inicializar sprite en la posición de la casilla 1
        }));
        this.titans = titansPlayers.map(player => ({
            ...player, position: 1, gold: initialGold, armorPieces: 0,
            sprite: this.add.sprite(700, 475, player.name).setScale(0.05) // Inicializar sprite en la posición de la casilla 1
        }));

        this.createBoard();

        this.rollDiceButton = this.add.text(750, 650, 'Tirar Dado', { fontSize: '22px', color: '#000' }).setOrigin(0.5);
        this.rollDiceButton.setInteractive();
        this.rollDiceButton.on('pointerdown', () => this.rollDice());

        this.pauseButton = this.add.text(750, 700, 'Pausa', { fontSize: '18px', color: '#000' }).setOrigin(0.5);
        this.pauseButton.setInteractive();
        this.pauseButton.on('pointerdown', () => this.pauseGame());

        this.pauseMenu = this.add.container(750, 300).setVisible(false);
        this.createPauseMenu();

        this.loadGame();
    }

    createBoard() {
        const godsContainer = this.add.container(50, 50);
        this.godsContainer = godsContainer
        this.titansContainer = this.add.container(1075, 50);

        this.godsText = this.add.text(150, 0, 'Dioses', { fontSize: '24px', color: '#000' });
        this.titansText = this.add.text(150, 0, 'Titanes', { fontSize: '24px', color: '#000' });

        this.godsContainer.add(this.godsText);
        this.titansContainer.add(this.titansText);

        //this.godsSection = this.add.text(50, 100, 'Dioses', { fontSize: '24px', color: '#000' });
        //this.titansSection = this.add.text(750, 100, 'Titanes', { fontSize: '24px', color: '#000' });
        this.updateBoard();
    }

    updateBoard() {
        // Limpiar el contenido existente en los contenedores de dioses y titanes
        this.clearContainer(this.godsContainer);
        this.clearContainer(this.titansContainer);

        this.godsText = this.add.text(150, 0, 'Dioses', { fontSize: '24px', color: '#000' });
        this.titansText = this.add.text(150, 0, 'Titanes', { fontSize: '24px', color: '#000' });

        this.godsContainer.add(this.godsText);
        this.titansContainer.add(this.titansText);

        // Añadir nuevamente la información de los dioses
        this.gods.forEach((player, index) => {
            const playerInfo = `${player.name} (${player.type}):\n${player.gold} Monedas / ${player.armorPieces} Piezas de Armadura`;
            const playerText = this.add.text(60, 70 + index * 100, playerInfo, { fontSize: '16px', color: '#000', wordWrap: { width: 450 } });
            const playerImage = this.add.image(10, 70 + index * 100 + 10, player.name).setScale(0.05);
            this.godsContainer.add([playerText, playerImage]);
        });

        // Añadir nuevamente la información de los titanes
        this.titans.forEach((player, index) => {
            const playerInfo = `${player.name} (${player.type}):\n${player.gold} Monedas / ${player.armorPieces} Piezas de Armadura`;
            const playerText = this.add.text(60, 70 + index * 100, playerInfo, { fontSize: '16px', color: '#000', wordWrap: { width: 450 } });
            const playerImage = this.add.image(10, 70 + index * 100 + 10, player.name).setScale(0.05);
            this.titansContainer.add([playerText, playerImage]);
        });

        //this.godsSection.setText('Dioses\n' + this.gods.map(player => `${player.name} (${player.type}) - Casilla ${player.position}, Monedas: ${player.gold}, Piezas de armadura: ${player.armorPieces}`).join('\n'));
        //this.titansSection.setText('Titanes\n' + this.titans.map(player => `${player.name} (${player.type}) - Casilla ${player.position}, Monedas: ${player.gold}, Piezas de armadura: ${player.armorPieces}`).join('\n'));
    }

    clearContainer(container) {
        container.removeAll(true);
    }

    rollDice() {
        this.updateBoard();

        const diceRoll = Math.floor(Math.random() * 6) + 1;
        let currentPlayer;

        if (this.turn === 'god') {
            currentPlayer = this.gods[this.currentPlayerIndex % this.gods.length];
        } else {
            currentPlayer = this.titans[this.currentPlayerIndex % this.titans.length];
            this.currentPlayerIndex++; // Solo incrementa el índice después de que ambos, dios y titán, hayan jugado
        }

        // Mover al jugador y revisar si pasa por la casilla 1
        const previousPosition = currentPlayer.position;
        currentPlayer.position = (currentPlayer.position + diceRoll - 1) % this.boardSize + 1;

        // Si el jugador pasa por la casilla 1 (pero no en la primera vuelta)
        if (previousPosition > currentPlayer.position) {
            currentPlayer.gold += 3;
        }

        this.messageElement.setText(`${currentPlayer.name} (${currentPlayer.type}) tiró un ${diceRoll} y se movió a la casilla ${currentPlayer.position}.`);

        // Animar el movimiento del sprite del personaje
        this.movePlayerSprite(currentPlayer);

        setTimeout(() => {
            this.checkForDuel(currentPlayer);
            this.checkForStore(currentPlayer);
            this.verifyVictory();
        }, 1000);

    
        if (this.turn === 'god') {
            this.turn = 'titan';
        } else {
            this.turn = 'god';
        }

        this.updateBoard();
    }

    movePlayerSprite(player) {
        // Obtener la nueva posición en el tablero
        const newPosition = this.getBoardPosition(player.position);
        this.tweens.add({
            targets: player.sprite,
            x: newPosition.x,
            y: newPosition.y,
            duration: 500,
            ease: 'Power2'
        });
    }

    getBoardPosition(position) {
        // Convertir la posición de la casilla en coordenadas x, y
        return this.boardPositions[position - 1]; // Ajustar la posición según el índice del array
    }

    checkForDuel(currentPlayer) {
        const godAt2 = this.gods.find(player => player.position === 2);
        const godAt7 = this.gods.find(player => player.position === 7);
        const titanAt2 = this.titans.find(player => player.position === 2);
        const titanAt7 = this.titans.find(player => player.position === 7);

        if (this.turn === 'god') { // Aquí verifica si el jugador actual es dios
            if ((currentPlayer.position === 2 && (titanAt2 || titanAt7)) || (currentPlayer.position === 7 && (titanAt2 || titanAt7))) {
                this.duelPlayers.push(currentPlayer);
                this.duelPlayers.push(titanAt2 || titanAt7);
                this.startDuel();
            }
        } else {
            if ((currentPlayer.position === 2 && (godAt2 || godAt7)) || (currentPlayer.position === 7 && (godAt2 || godAt7))) {
                this.duelPlayers.push(godAt2 || godAt7);
                this.duelPlayers.push(currentPlayer);
                this.startDuel();
            }
        }
    }

    startDuel() {
        this.scene.pause('MainScene');
        this.scene.run('DuelScene', { duelPlayers: this.duelPlayers });
    }

    checkForStore(currentPlayer) {
        if (currentPlayer.position === 5) {
            this.storePlayer = currentPlayer;
            this.scene.pause('MainScene');
            this.scene.run('StoreScene', { storePlayer: this.storePlayer });
        }
    }

    pauseGame() {
        this.pauseMenu.setVisible(true);
        this.rollDiceButton.disableInteractive();
    }

    createPauseMenu() {
        const background = this.add.rectangle(0, 0, 300, 200, 0xffffff).setOrigin(0.5);
        const continueButton = this.add.text(0, -50, 'Continuar', { fontSize: '18px', color: '#000' }).setOrigin(0.5).setInteractive();
        const saveButton = this.add.text(0, 0, 'Guardar y Salir', { fontSize: '18px', color: '#000' }).setOrigin(0.5).setInteractive();
        const exitButton = this.add.text(0, 50, 'Salir sin Guardar', { fontSize: '18px', color: '#000' }).setOrigin(0.5).setInteractive();

        continueButton.on('pointerdown', () => {
            this.pauseMenu.setVisible(false);
            this.rollDiceButton.setInteractive();
        });

        saveButton.on('pointerdown', () => {
            this.saveGame();
            window.location.href = '../index.html';
        });

        exitButton.on('pointerdown', () => {
            window.location.href = '../index.html';
        });

        this.pauseMenu.add([background, continueButton, saveButton, exitButton]);
    }

    saveGame() {
        const gameState = {
            gods: this.gods,
            titans: this.titans,
            currentPlayerIndex: this.currentPlayerIndex,
            turn: this.turn
        };
        localStorage.setItem('savedGameState', JSON.stringify(gameState));
        alert('Partida guardada exitosamente.');
    }

    loadGame() {
        const savedGameState = JSON.parse(localStorage.getItem('savedGameState'));
        const playSavedGame = JSON.parse(localStorage.getItem('playSavedGame'));
        if (playSavedGame && savedGameState) {
            this.gods = savedGameState.gods;
            this.titans = savedGameState.titans;
            this.currentPlayerIndex = savedGameState.currentPlayerIndex;
            this.turn = savedGameState.turn;
            this.updateBoard();
            console.log('Partida cargada exitosamente.');
        } else {
            console.log('No hay partidas guardadas.');
        }
    }

    verifyVictory() {
        const godsArmorPieces = this.gods.reduce((sum, player) => sum + player.armorPieces, 0);
        const titansArmorPieces = this.titans.reduce((sum, player) => sum + player.armorPieces, 0);

        const options = JSON.parse(localStorage.options);
        const piecesToWin = options.pieces || 5;

        if (godsArmorPieces >= piecesToWin) {
            alert('Gods win!');
            window.location.href = '../index.html';
        } else if (titansArmorPieces >= piecesToWin) {
            alert('Titans win!');
            window.location.href = '../index.html';
        }
    }
}

export default MainScene;