import DuelScene from './DuelScene.js';
import StoreScene from './StoreScene.js';

class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
        this.boardSize = 10;
        this.currentPlayerIndex = 0;
        this.turn = 'god'; // Alterna entre 'god' y 'titan'
        this.turnvalid = true
        this.duelPlayers = [];
        this.storePlayer = null;
        this.duelActive = false;
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

        this.load.image('board', '../assets/tablero.png');
        this.load.bitmapFont('greconian', '../assets/FUENTES/Greconian.tff');
        this.load.bitmapFont('selanik', '../assets/FUENTES/Selanik.tff');
    }

    create() {
        //Cargar opciones
        const options = JSON.parse(localStorage.options);
        const initialGold = options.goldini || 0;
        const piecesToWin = options.pieces || 5;
        const godsPlayers = JSON.parse(localStorage.getItem('godsPlayers')) || [];
        const titansPlayers = JSON.parse(localStorage.getItem('titansPlayers')) || [];

        // Añadir el tablero
        const board = this.add.image(750, 315, 'board').setScale(0.5);

        //Mensaje de movimiento
        this.messageElement = this.add.text(10, 780, '', { fill: '#eee7e2' });

        //Verificar partida guardada + cargar fichas
        const savedGameState = JSON.parse(localStorage.getItem('savedGameState'));
        const playSavedGame = JSON.parse(localStorage.getItem('playSavedGame'));

        if (playSavedGame) {
            this.gods = savedGameState.gods.map(player => ({
                ...player,
                sprite: this.add.sprite(this.getBoardPosition(player.position).x, this.getBoardPosition(player.position).y, player.name).setScale(0.05)
            }));
            this.titans = savedGameState.titans.map(player => ({
                ...player,
                sprite: this.add.sprite(this.getBoardPosition(player.position).x, this.getBoardPosition(player.position).y, player.name).setScale(0.05)
            }));
            this.currentPlayerIndex = savedGameState.currentPlayerIndex;
            this.turn = savedGameState.turn;
        } else {
            this.gods = godsPlayers.map(player => ({
                ...player, position: 1, gold: initialGold, armorPieces: 0,
                sprite: this.add.sprite(this.getBoardPosition(1).x, this.getBoardPosition(1).y, player.name).setScale(0.05)
            }));
            this.titans = titansPlayers.map(player => ({
                ...player, position: 1, gold: initialGold, armorPieces: 0,
                sprite: this.add.sprite(this.getBoardPosition(1).x, this.getBoardPosition(1).y, player.name).setScale(0.05)
            }));
        }

        this.createBoard();

        //Botones
        const buttonBackground1 = this.add.graphics();

        buttonBackground1.fillStyle(0x7f4949, 1); 
        buttonBackground1.fillRoundedRect(0, 6, 200, 50, 10);
        buttonBackground1.fillStyle(0xf6d3d0, 1); 
        buttonBackground1.fillRoundedRect(0, 0, 200, 50, 10);

        const buttonTextRD = this.add.text(100, 25, 'Tirar Dado', { fontSize: '22px', color: '#000' }).setOrigin(0.5);
        this.rollDiceButton = this.add.container(650, 600, [buttonBackground1, buttonTextRD]);
        const hitAreaRD = this.add.zone(0, 0, 200, 50).setOrigin(0, 0).setInteractive();
        this.rollDiceButton.add(hitAreaRD);
        hitAreaRD.on('pointerdown', () => this.rollDice());

        hitAreaRD.on('pointerover', () => {
            buttonBackground1.clear();
            buttonBackground1.fillStyle(0x7f4949, 1); 
            buttonBackground1.fillRoundedRect(0, 6, 200, 50, 10);
            buttonBackground1.fillStyle(0xb8dbc0, 1); 
            buttonBackground1.fillRoundedRect(0, 0, 200, 50, 10);
        });
        
        hitAreaRD.on('pointerout', () => {
            buttonBackground1.clear();
            buttonBackground1.fillStyle(0x7f4949, 1); 
            buttonBackground1.fillRoundedRect(0, 6, 200, 50, 10);
            buttonBackground1.fillStyle(0xf6d3d0, 1); 
            buttonBackground1.fillRoundedRect(0, 0, 200, 50, 10);
        });

        const buttonBackground2 = this.add.graphics();
        buttonBackground2.fillStyle(0x7f4949, 1); 
        buttonBackground2.fillRoundedRect(0, 6, 200, 50, 10);
        buttonBackground2.fillStyle(0xf6d3d0, 1); 
        buttonBackground2.fillRoundedRect(0, 0, 200, 50, 10);

        const buttonTextP = this.add.text(100, 25, 'Pausa', { fontSize: '18px', color: '#000' }).setOrigin(0.5);
        this.pauseButton = this.add.container(650, 675, [buttonBackground2, buttonTextP]);
        const hitAreaP = this.add.zone(0, 0, 200, 50).setOrigin(0, 0).setInteractive();
        this.pauseButton.add(hitAreaP)
        hitAreaP.on('pointerdown', () => this.pauseGame());

        hitAreaP.on('pointerover', () => {
            buttonBackground2.clear();
            buttonBackground2.fillStyle(0x7f4949, 1); 
            buttonBackground2.fillRoundedRect(0, 6, 200, 50, 10);
            buttonBackground2.fillStyle(0xb8dbc0, 1); 
            buttonBackground2.fillRoundedRect(0, 0, 200, 50, 10);
        });
        
        hitAreaP.on('pointerout', () => {
            buttonBackground2.clear();
            buttonBackground2.fillStyle(0x7f4949, 1); 
            buttonBackground2.fillRoundedRect(0, 6, 200, 50, 10);
            buttonBackground2.fillStyle(0xf6d3d0, 1); 
            buttonBackground2.fillRoundedRect(0, 0, 200, 50, 10);
        });

        this.pauseMenu = this.add.container(750, 300).setVisible(false);
        this.createPauseMenu();

        this.loadGame();
    }

    createBoard() {
        const godsContainer = this.add.container(50, 50);
        this.godsContainer = godsContainer
        this.titansContainer = this.add.container(1075, 50);

        this.godsText = this.add.text(150, 0, 'Dioses', { fontFamily: 'greconian', fontSize: '24px', color: '#000' });
        this.titansText = this.add.text(150, 0, 'Titanes', { fontFamily: 'greconian', fontSize: '24px', color: '#000' });

        this.godsContainer.add(this.godsText);
        this.titansContainer.add(this.titansText);

        this.updateBoard();
    }

    updateBoard() {
        // Limpiar los contenidores
        this.clearContainer(this.godsContainer);
        this.clearContainer(this.titansContainer);
    
        //Actualizar
        const totalArmorPiecesGods = this.calculateTotalArmorPieces(this.gods);
        this.godsText = this.add.text(150, 0, 'Dioses', { fontSize: '24px', color: '#000' });
        this.totalArmorTextGods = this.add.text(150, 32, `Total de Piezas: ${totalArmorPiecesGods}`, { fontSize: '16px', color: '#000' });
        this.godsContainer.add([this.godsText, this.totalArmorTextGods]);
        this.gods.forEach((player, index) => {
            const playerInfo = `${player.name} (${player.type}):\n${player.gold} Monedas / ${player.armorPieces} Piezas de Armadura\nCasilla Actual: ${player.position}`;
            const playerText = this.add.text(60, 70 + index * 120, playerInfo, { fontSize: '16px', color: '#000', wordWrap: { width: 450 } });
            const playerImage = this.add.image(10, 70 + index * 120 + 10, player.name).setScale(0.05);
            this.godsContainer.add([playerText, playerImage]);
        });
    
        const totalArmorPiecesTitans = this.calculateTotalArmorPieces(this.titans);
        this.titansText = this.add.text(150, 0, 'Titanes', { fontSize: '24px', color: '#000' });
        this.totalArmorTextTitans = this.add.text(150, 32, `Total de Piezas: ${totalArmorPiecesTitans}`, { fontSize: '16px', color: '#000' });
        this.titansContainer.add([this.titansText, this.totalArmorTextTitans]);
        this.titans.forEach((player, index) => {
            const playerInfo = `${player.name} (${player.type}):\n${player.gold} Monedas / ${player.armorPieces} Piezas de Armadura\nCasilla Actual: ${player.position}`;
            const playerText = this.add.text(60, 70 + index * 120, playerInfo, { fontSize: '16px', color: '#000', wordWrap: { width: 450 } });
            const playerImage = this.add.image(10, 70 + index * 120 + 10, player.name).setScale(0.05);
            this.titansContainer.add([playerText, playerImage]);
        });
    }
    
    calculateTotalArmorPieces(players) {
        return players.reduce((total, player) => total + player.armorPieces, 0);
    }

    clearContainer(container) {
        container.removeAll(true);
    }

    rollDice() {
        //Tirar dado
        if(this.turnvalid){
            this.turnvalid = false
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
    
                if (this.turn === 'god') {
                    this.turn = 'titan';
                } else {
                    this.turn = 'god';
                }
                this.turnvalid = true
            }, 1000);
    
            this.updateBoard(); 
        }
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
        //Verificar Duelo
        const godAt2 = this.gods.find(player => player.position === 2);
        const godAt7 = this.gods.find(player => player.position === 7);
        const titanAt2 = this.titans.find(player => player.position === 2);
        const titanAt7 = this.titans.find(player => player.position === 7);

        if (this.turn === 'god') { // Aquí verifica si el jugador actual es dios
            if ((currentPlayer.position === 2 && (titanAt2 || titanAt7)) || (currentPlayer.position === 7 && (titanAt2 || titanAt7))) { //Si el dios está en 2 o / y si hay un titán en 2 o 7
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

    startDuel() { //Empezar duelo
        this.scene.pause('MainScene');
        this.scene.run('DuelScene', { duelPlayers: this.duelPlayers });
    }

    checkForStore(currentPlayer) { //Verificar Tienda
        if (currentPlayer.position === 5) {
            this.storePlayer = currentPlayer;
            this.scene.pause('MainScene');
            this.scene.run('StoreScene', { storePlayer: this.storePlayer });
        }
    }

    pauseGame() { //Menú de pausa
        this.pauseMenu.setVisible(true);
        this.turnvalid = false
        this.rollDiceButton.disableInteractive();
    }

    createPauseMenu() { //Crear menú
        //Botones
        const buttonBContinue = this.add.graphics();
        buttonBContinue.fillStyle(0x7f4949, 1); 
        buttonBContinue.fillRoundedRect(0, 6, 200, 30, 10);
        buttonBContinue.fillStyle(0xf6d3d0, 1); 
        buttonBContinue.fillRoundedRect(0, 0, 200, 30, 10);

        const buttonBExitS = this.add.graphics();
        buttonBExitS.fillStyle(0x7f4949, 1); 
        buttonBExitS.fillRoundedRect(0, 6, 200, 30, 10);
        buttonBExitS.fillStyle(0xf6d3d0, 1); 
        buttonBExitS.fillRoundedRect(0, 0, 200, 30, 10);

        const buttonBExitNS = this.add.graphics();
        buttonBExitNS.fillStyle(0x7f4949, 1); 
        buttonBExitNS.fillRoundedRect(0, 6, 200, 30, 10);
        buttonBExitNS.fillStyle(0xf6d3d0, 1); 
        buttonBExitNS.fillRoundedRect(0, 0, 200, 30, 10);

        const background = this.add.rectangle(0, 0, 400, 300, 0xEEE7E2).setOrigin(0.5);

        const continueButtonText = this.add.text(100, 17, 'Continuar', { fontSize: '18px', color: '#000' }).setOrigin(0.5)
        const continueButton = this.add.container(-100, -80, [buttonBContinue, continueButtonText]);
        const hitAreaC = this.add.zone(0, 0, 200, 50).setOrigin(0, 0).setInteractive();
        continueButton.add(hitAreaC)

        const saveButtonText = this.add.text(100, 17, 'Guardar y Salir', { fontSize: '18px', color: '#000' }).setOrigin(0.5);
        const saveButton = this.add.container(-100, -20, [buttonBExitS, saveButtonText]);
        const hitAreaS = this.add.zone(0, 0, 200, 50).setOrigin(0, 0).setInteractive();
        saveButton.add(hitAreaS)

        const exitButtonText = this.add.text(100, 17, 'Salir sin Guardar', { fontSize: '18px', color: '#000' }).setOrigin(0.5);
        const exitButton = this.add.container(-100, 40, [buttonBExitNS, exitButtonText]);
        const hitAreaNS = this.add.zone(0, 0, 200, 50).setOrigin(0, 0).setInteractive();
        exitButton.add(hitAreaNS)

        hitAreaC.on('pointerdown', () => {
            this.pauseMenu.setVisible(false);
            this.turnvalid = true
            this.rollDiceButton.setInteractive();
        });

        hitAreaC.on('pointerover', () => {
            buttonBContinue.clear();
            buttonBContinue.fillStyle(0x7f4949, 1); 
            buttonBContinue.fillRoundedRect(0, 6, 200, 30, 10);
            buttonBContinue.fillStyle(0xb8dbc0, 1); 
            buttonBContinue.fillRoundedRect(0, 0, 200, 30, 10);
        });
        
        hitAreaC.on('pointerout', () => {
            buttonBContinue.clear();
            buttonBContinue.fillStyle(0x7f4949, 1); 
            buttonBContinue.fillRoundedRect(0, 6, 200, 30, 10);
            buttonBContinue.fillStyle(0xf6d3d0, 1); 
            buttonBContinue.fillRoundedRect(0, 0, 200, 30, 10);
        });

        hitAreaS.on('pointerdown', () => {
            this.saveGame();
            window.location.href = '../html/inicio.html';
        });

        hitAreaS.on('pointerover', () => {
            buttonBExitS.clear();
            buttonBExitS.fillStyle(0x7f4949, 1); 
            buttonBExitS.fillRoundedRect(0, 6, 200, 30, 10);
            buttonBExitS.fillStyle(0xb8dbc0, 1); 
            buttonBExitS.fillRoundedRect(0, 0, 200, 30, 10);
        });
        
        hitAreaS.on('pointerout', () => {
            buttonBExitS.clear();
            buttonBExitS.fillStyle(0x7f4949, 1); 
            buttonBExitS.fillRoundedRect(0, 6, 200, 30, 10);
            buttonBExitS.fillStyle(0xf6d3d0, 1); 
            buttonBExitS.fillRoundedRect(0, 0, 200, 30, 10);
        });

        hitAreaNS.on('pointerdown', () => {
            window.location.href = '../html/inicio.html';
        });

        hitAreaNS.on('pointerover', () => {
            buttonBExitNS.clear();
            buttonBExitNS.fillStyle(0x7f4949, 1); 
            buttonBExitNS.fillRoundedRect(0, 6, 200, 30, 10);
            buttonBExitNS.fillStyle(0xb8dbc0, 1); 
            buttonBExitNS.fillRoundedRect(0, 0, 200, 30, 10);
        });
        
        hitAreaNS.on('pointerout', () => {
            buttonBExitNS.clear();
            buttonBExitNS.fillStyle(0x7f4949, 1); 
            buttonBExitNS.fillRoundedRect(0, 6, 200, 30, 10);
            buttonBExitNS.fillStyle(0xf6d3d0, 1); 
            buttonBExitNS.fillRoundedRect(0, 0, 200, 30, 10);
        });

        this.pauseMenu.add([background, continueButton, saveButton, exitButton]);
    }

    saveGame() { //Guardar Partida
        const gameState = {
            gods: this.gods.map(player => ({
                ...player,
                spritePosition: { x: player.sprite.x, y: player.sprite.y }
            })),
            titans: this.titans.map(player => ({
                ...player,
                spritePosition: { x: player.sprite.x, y: player.sprite.y }
            })),
            currentPlayerIndex: this.currentPlayerIndex,
            turn: this.turn
        };
        localStorage.setItem('savedGameState', JSON.stringify(gameState));
        alert('Partida guardada exitosamente.');
    }

    loadGame() { //Cargar partida
        const savedGameState = JSON.parse(localStorage.getItem('savedGameState'));
        const playSavedGame = JSON.parse(localStorage.getItem('playSavedGame'));
        if (playSavedGame && savedGameState) {
            this.currentPlayerIndex = savedGameState.currentPlayerIndex;
            this.turn = savedGameState.turn;
            this.updateBoard();
            console.log('Partida cargada exitosamente.');
        } else {
            console.log('No hay partidas guardadas.');
        }
    }

    verifyVictory() { //Verificar la victoria
        const godsArmorPieces = this.gods.reduce((sum, player) => sum + player.armorPieces, 0);
        const titansArmorPieces = this.titans.reduce((sum, player) => sum + player.armorPieces, 0);

        const options = JSON.parse(localStorage.options);
        const piecesToWin = options.pieces || 5;

        if (godsArmorPieces >= piecesToWin) {
            alert('¡Victoria de los Dioses!');
            window.location.href = '../index.html';
        } else if (titansArmorPieces >= piecesToWin) {
            alert('Victoria de los Titanes!');
            window.location.href = '../index.html';
        }
    }
}

export default MainScene;