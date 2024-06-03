
class DuelScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DuelScene' });
    }

    init(data) {
        this.duelPlayers = data.duelPlayers;

        this.bet = Math.floor((this.duelPlayers[0].gold / 2 + this.duelPlayers[1].gold / 2) / 2); //Media de las medias
        if (this.bet > this.duelPlayers[0].gold){
            this.bet = this.duelPlayers[0].gold
        } else if(this.bet > this.duelPlayers[1].gold){
            this.bet = this.duelPlayers[1].gold
        }
        this.player1Score = 0
        this.player2Score = 0
    }

    create() {
        this.cameras.main.setBackgroundColor('#ffffff');

        this.add.text(400, 100, 'Duelo', { fontSize: '32px', color: '#000' }).setOrigin(0.5);

        this.duelInfo = this.add.text(400, 150, `¡Duelo entre ${this.duelPlayers[0].name} (${this.duelPlayers[0].type}) y ${this.duelPlayers[1].name} (${this.duelPlayers[1].type})!`, { fontSize: '18px', color: '#000' }).setOrigin(0.5);

        this.betInfoText = this.add.text(400, 200, 'Introduce las monedas a apostar:', { fontSize: '18px', color: '#000' }).setOrigin(0.5);

        this.betInfoGold = this.add.text(400, 300, `¡${this.duelPlayers[0].name} (${this.duelPlayers[0].type}) tiene ${this.duelPlayers[0].gold} monedas y ${this.duelPlayers[1].name} (${this.duelPlayers[1].type}) tiene ${this.duelPlayers[1].gold} monedas!`, { fontSize: '18px', color: '#000' }).setOrigin(0.5);

        this.betText = this.add.text(400, 350, 'Apuesta', { fontSize: '18px', color: '#000' }).setOrigin(0.5);

        this.updateBetText()

        this.addBetB = this.add.text(350, 350, '+', { fontSize: '18px', color: '#000' }).setOrigin(0.5).setInteractive();
        this.addBetB.on('pointerdown', () => this.addBet());

        this.removeBetB = this.add.text(450, 350, '-', { fontSize: '18px', color: '#000' }).setOrigin(0.5).setInteractive();
        this.removeBetB.on('pointerdown', () => this.removeBet());

        this.duelButton = this.add.text(400, 400, 'Iniciar Duelo', { fontSize: '18px', color: '#000' }).setOrigin(0.5).setInteractive();
        this.duelButton.on('pointerdown', () => this.startDuel());

        //Segunda parte del duelo, tirar los dados

        this.infoBattleText = this.add.text(400, 200, 'Tirad los dados:', { fontSize: '18px', color: '#000' }).setOrigin(0.5);
        this.infoBattleText.setVisible(false)

        this.infoBattleP1 = this.add.text(400, 300, `Dado de ${this.duelPlayers[0].name} (${this.duelPlayers[0].type}): `, { fontSize: '18px', color: '#000' }).setOrigin(0.5);
        this.infoBattleP1.setVisible(false)

        this.buttonDice1 = this.add.text(400, 350, '¡Tirar!', { fontSize: '18px', color: '#000' }).setOrigin(0.5).setInteractive();;
        this.buttonDice1.on('pointerdown', () => this.throwDice1());
        this.buttonDice1.setVisible(false)

        this.dice1 = this.add.text(450, 350, '-', { fontSize: '18px', color: '#000' }).setOrigin(0.5);
        this.dice1.setVisible(false)

        this.infoBattleP2 = this.add.text(400, 450, `Dado de ${this.duelPlayers[1].name} (${this.duelPlayers[1].type}): `, { fontSize: '18px', color: '#000' }).setOrigin(0.5);
        this.infoBattleP2.setVisible(false)

        this.buttonDice2 = this.add.text(400, 500, '¡Tirar!', { fontSize: '18px', color: '#000' }).setOrigin(0.5).setInteractive();;
        this.buttonDice2.on('pointerdown', () => this.throwDice2());
        this.buttonDice2.setVisible(false)

        this.dice2 = this.add.text(450, 500, '-', { fontSize: '18px', color: '#000' }).setOrigin(0.5);
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
        console.log(this.bet)

        this.betInfoText.setVisible(false);
        this.betInfoGold.setVisible(false);
        this.betText.setVisible(false);
        this.addBetB.setVisible(false);
        this.removeBetB.setVisible(false);
        this.duelButton.setVisible(false);

        this.infoBattleText.setVisible(true);
        this.infoBattleP1.setVisible(true);
        this.buttonDice1.setVisible(true);
        this.dice1.setVisible(true);
        this.infoBattleP2.setVisible(true);
        this.buttonDice2.setVisible(true);
        this.dice2.setVisible(true);

        this.player1Score = 0
        this.player2Score = 0

        this.dice1.setText('-')
        this.dice2.setText('-')
    }

    throwDice1(){
        if (this.player1Score == 0){
            this.player1Score = Phaser.Math.Between(1, 6);
            console.log(this.player1Score)
            this.dice1.setText(this.player1Score)
            this.verifyResult()
        }
    }

    throwDice2(){
        if(this.player2Score == 0){
            this.player2Score = Phaser.Math.Between(1, 6);
            console.log(this.player2Score)
            this.dice2.setText(this.player2Score)
            this.verifyResult()
        }
    }

    verifyResult(){
        if (this.player1Score != 0 && this.player2Score != 0){

            const player1 = this.duelPlayers[0];
            const player2 = this.duelPlayers[1];

            if(this.player1Score == this.player2Score){
                this.startDuel()
                this.duelInfo.setText(`¡Empate, tirad de nuevo!`);
            } else if (this.player1Score > this.player2Score){
                this.duelInfo.setText(`¡${player1.name} ganó el duelo!`);
                player1.gold += this.bet*2
                player2.gold -= this.bet;
                this.finalDuel()
            } else {
                this.duelInfo.setText(`¡${player2.name} ganó el duelo!`);
                player2.gold += this.bet*2
                player1.gold -= this.bet;
                this.finalDuel()
            }
        }
    }

    finalDuel(){
        setTimeout(() => {
            this.scene.resume('MainScene');
            this.scene.stop('DuelScene');
        }, 2000);
    
    }
}

export default DuelScene;
