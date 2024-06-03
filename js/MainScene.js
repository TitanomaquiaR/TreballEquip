import DuelScene from './DuelScene.js';
import StoreScene from './StoreScene.js';

class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
        // Variables y estado del juego
        this.boardSize = 10;
        this.currentPlayerIndex = 0;
        this.turn = 'god'; // Alterna entre 'god' y 'titan'
        this.duelPlayers = [];
        this.storePlayer = null;
        this.duelActive = false;
        this.storeActive = false;
    }

    create() {
        const options = JSON.parse(localStorage.options);
        const initialGold = options.goldini || 0;
        const armorPrice = options.price || 10;
        const godsPlayers = JSON.parse(localStorage.getItem('godsPlayers')) || [];
        const titansPlayers = JSON.parse(localStorage.getItem('titansPlayers')) || [];

        //Mensajes
        this.messageElement = this.add.text(100, 50, '', { fill: '#ffffff' });

        // Inicializa las posiciones de los jugadores, monedas y piezas de armadura
        this.gods = godsPlayers.map(player => ({ ...player, position: 1, gold: initialGold, armorPieces: 0 }));
        this.titans = titansPlayers.map(player => ({ ...player, position: 1, gold: initialGold, armorPieces: 0 }));

        // Crear el tablero visualmente
        this.createBoard();

        // Botón para tirar el dado
        this.rollDiceButton = this.add.text(400, 550, 'Tirar Dado', { fontSize: '18px', color: '#000' }).setOrigin(0.5);
        this.rollDiceButton.setInteractive();
        this.rollDiceButton.on('pointerdown', () => this.rollDice());

        // Botón de pausa
        this.pauseButton = this.add.text(400, 580, 'Pausa', { fontSize: '18px', color: '#000' }).setOrigin(0.5);
        this.pauseButton.setInteractive();
        this.pauseButton.on('pointerdown', () => this.pauseGame());

        // Menú de pausa
        this.pauseMenu = this.add.container(400, 300).setVisible(false);
        this.createPauseMenu();
    }

    createBoard() {
        this.godsSection = this.add.text(100, 100, 'Dioses', { fontSize: '24px', color: '#000' });
        this.titansSection = this.add.text(100, 300, 'Titanes', { fontSize: '24px', color: '#000' });
        this.updateBoard();
    }

    updateBoard() {
        this.godsSection.setText('Dioses\n' + this.gods.map(player => `${player.name} (${player.type}) - Casilla ${player.position}, Monedas: ${player.gold}, Piezas de armadura: ${player.armorPieces}`).join('\n'));
        this.titansSection.setText('Titanes\n' + this.titans.map(player => `${player.name} (${player.type}) - Casilla ${player.position}, Monedas: ${player.gold}, Piezas de armadura: ${player.armorPieces}`).join('\n'));
    }

    rollDice() {

        this.updateBoard();

        if (this.duelActive) {
            console.log("Duelo activo")
            console.log(this.gods)
            console.log(this.titans)
            return;
        }

        if (this.storeActive) {
            console.log("Tienda activa")
            console.log(this.gods)
            console.log(this.titans)
            return;
        }

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

        this.checkForDuel(currentPlayer);
        this.checkForStore(currentPlayer);

        if (this.turn === 'god') {
            this.turn = 'titan';
        } else {
            this.turn = 'god';
        }

        this.updateBoard();
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
            //this.storeActive = true;
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
        if (savedGameState) {
            this.gods = savedGameState.gods;
            this.titans = savedGameState.titans;
            this.currentPlayerIndex = savedGameState.currentPlayerIndex;
            this.turn = savedGameState.turn;
            this.updateBoard();
            this.messageElement.setText('Partida cargada exitosamente.');
        } else {
            alert('No hay partidas guardadas.');
        }
    }
}

export default MainScene;
