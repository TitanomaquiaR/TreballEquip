
class DuelScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DuelScene' });
    }

    init(data) {
        this.duelPlayers = data.duelPlayers;

        this.bet = Math.floor((this.duelPlayers[0].gold / 2 + this.duelPlayers[1].gold / 2) / 2); //Media de las medias
    }

    create() {
        this.cameras.main.setBackgroundColor('#ffffff');

        this.add.text(400, 100, 'Duelo', { fontSize: '32px', color: '#000' }).setOrigin(0.5);

        this.duelInfo = this.add.text(400, 150, `¡Duelo entre ${this.duelPlayers[0].name} (${this.duelPlayers[0].type}) y ${this.duelPlayers[1].name} (${this.duelPlayers[1].type})!`, { fontSize: '18px', color: '#000' }).setOrigin(0.5);

        this.betInfoText = this.add.text(400, 200, 'Introduce las monedas a apostar:', { fontSize: '18px', color: '#000' }).setOrigin(0.5);

        this.betInfoGold = this.add.text(400, 300, `¡${this.duelPlayers[0].name} (${this.duelPlayers[0].type}) tiene ${this.duelPlayers[0].gold} monedas y ${this.duelPlayers[1].name} (${this.duelPlayers[1].type}) tiene ${this.duelPlayers[1].gold} monedas!`, { fontSize: '18px', color: '#000' }).setOrigin(0.5);

        this.betText = this.add.text(400, 350, 'Apuesta', { fontSize: '18px', color: '#000' }).setOrigin(0.5);

        this.updateBetText()

        const addBetB = this.add.text(350, 350, '+', { fontSize: '18px', color: '#000' }).setOrigin(0.5).setInteractive();
        addBetB.on('pointerdown', () => this.addBet());

        const removeBetB = this.add.text(450, 350, '-', { fontSize: '18px', color: '#000' }).setOrigin(0.5).setInteractive();
        removeBetB.on('pointerdown', () => this.removeBet());

        const duelButton = this.add.text(400, 400, 'Iniciar Duelo', { fontSize: '18px', color: '#000' }).setOrigin(0.5).setInteractive();
        duelButton.on('pointerdown', () => this.startDuel());

        this.infoBattleText = this.add.text(400, 200, 'Tirad los dados:', { fontSize: '18px', color: '#000' }).setOrigin(0.5);
        this.infoBattleText.setVisible(false)

        this.infoBattleP1 = this.add.text(400, 250, `Dado de ${this.duelPlayers[0].name} (${this.duelPlayers[0].type}): `, { fontSize: '18px', color: '#000' }).setOrigin(0.5);
        this.infoBattleP1.setVisible(false)

        const buttonDice1 = this.add.text(400, 300, '¡Tirar!', { fontSize: '18px', color: '#000' }).setOrigin(0.5);
        buttonDice1.on('pointerdown', () => this.diceP2());
        buttonDice1.setVisible(false)

        this.dice1 = this.add.text(450, 300, '-', { fontSize: '18px', color: '#000' }).setOrigin(0.5);
        this.dice1.setVisible(false)

        this.infoBattleP2 = this.add.text(400, 400, `Dado de ${this.duelPlayers[1].name} (${this.duelPlayers[1].type}): `, { fontSize: '18px', color: '#000' }).setOrigin(0.5);
        this.infoBattleP2.setVisible(false)

        const buttonDice2 = this.add.text(400, 450, '¡Tirar!', { fontSize: '18px', color: '#000' }).setOrigin(0.5);
        buttonDice2.on('pointerdown', () => this.diceP2());
        buttonDice2.setVisible(false)

        this.dice2 = this.add.text(450, 450, '-', { fontSize: '18px', color: '#000' }).setOrigin(0.5);
        this.dice2.setVisible(false)
    }

    updateBetText(){
        this.betText.setText(this.bet)
    }

    addBet(){
        if(this.bet < this.duelPlayers[0].gold && this.bet < this.duelPlayers[1].gold){
            this.bet +=1
            this.updateBetText() 
        }
    }

    removeBet(){
        if(this.bet > 1){
            this.bet -= 1
            this.updateBetText()
        }
    }

    startDuel() {
        // Guardar el valor del input de monedas
        console.log(this.bet)

        this.betInfoText.setVisible(false);
        this.betInfoGold.setVisible(false);
        addBetB.setVisible(false);
        removeBetB.setVisible(false);
        duelButton.setVisible(false);

        this.infoBattleText.setVisible(true);
        this.infoBattleP1.setVisible(true);
        buttonDice1.setVisible(true);
        this.dice1.setVisible(true);
        this.infoBattleP2.setVisible(true);
        buttonDice2.setVisible(true);
        this.dice2.setVisible(true);


        const player1 = this.duelPlayers[0];
        const player2 = this.duelPlayers[1];

        // Ocultar el input de monedas y el texto de Duelo
        
        const player1Score = Math.random() * player1.armorPieces;
        const player2Score = Math.random() * player2.armorPieces;

        if (player1Score > player2Score) {
            player1.gold += 5;
            player2.gold -= 3;
            this.duelInfo.setText(`${player1.name} ganó el duelo!`);
        } else {
            player1.gold -= 3;
            player2.gold += 5;
            this.duelInfo.setText(`${player2.name} ganó el duelo!`);
        }

        this.finalDuel()
    }

    diceP1(){

    }

    diceP2(){

    }

    finalDuel(){
        setTimeout(() => {
            this.scene.resume('MainScene');
            this.scene.stop('DuelScene');
        }, 2000);
    
    }
}

export default DuelScene;
