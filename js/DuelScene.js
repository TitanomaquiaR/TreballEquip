
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

    preload(){
        this.load.image('duelofondo', '../assets/UI/FondoDuelo.jpg');
    }

    create() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        this.background = this.add.image(0, 0, 'duelofondo').setOrigin(0.5);
        this.resizeBackground();
        window.addEventListener('resize', ()=>this.resizeBackground());

        const posX = this.cameras.main.width / 2;
        const posY = this.cameras.main.height / 2;

        const wrapperWidth = 800;
        const wrapperHeight = 450;
        const wrapper = this.add.rectangle(
            posX, 
            posY, 
            wrapperWidth, 
            wrapperHeight, 
            0xffffff, 
            0.8
        ).setOrigin(0.5);

        const textStartY = posY - wrapperHeight / 2 + 50;

        this.add.text(posX, textStartY+20, 'DUELO', { fontSize: '32px', fontFamily: 'Greconian', color: '#000' }).setOrigin(0.5);

        this.duelInfo = this.add.text(posX, textStartY + 100, `¡Duelo entre ${this.duelPlayers[0].name} (${this.duelPlayers[0].type}) y ${this.duelPlayers[1].name} (${this.duelPlayers[1].type})!`, { fontSize: '18px', color: '#000' }).setOrigin(0.5);

        this.betInfoText = this.add.text(posX, textStartY + 150, 'Introduce las monedas a apostar:', { fontSize: '18px', fontFamily: 'Selanik', color: '#000' }).setOrigin(0.5);

        this.betInfoGold = this.add.text(posX, textStartY + 200, `¡${this.duelPlayers[0].name} (${this.duelPlayers[0].type}) tiene ${this.duelPlayers[0].gold} monedas y ${this.duelPlayers[1].name} (${this.duelPlayers[1].type}) tiene ${this.duelPlayers[1].gold} monedas!`, { fontSize: '18px', color: '#000' }).setOrigin(0.5);

        this.betText = this.add.text(posX, textStartY + 280, 'Apuesta', { fontSize: '18px', fontFamily: 'Selanik', color: '#000' }).setOrigin(0.5);

        this.updateBetText();

        this.createButton(posX - 50, textStartY + 280, '+', this.addBet.bind(this));
        this.createButton(posX + 50, textStartY + 280, '-', this.removeBet.bind(this));
        this.createButton(posX, textStartY + 350, 'Iniciar Duelo', this.startDuel.bind(this));

        //Segunda parte del duelo, tirar los dados

        this.infoBattleText = this.add.text(posX, textStartY + 60, 'Tirad los dados:', { fontSize: '18px', fontFamily: 'Selanik', color: '#000' }).setOrigin(0.5);
        this.infoBattleText.setVisible(false)

        this.infoBattleP1 = this.add.text(posX, textStartY + 160, `Dado de ${this.duelPlayers[0].name} (${this.duelPlayers[0].type}): `, { fontSize: '18px', fontFamily: 'Selanik', color: '#000' }).setOrigin(0.5);
        this.infoBattleP1.setVisible(false)

        this.buttonDice1 = this.createButton(posX - 50, textStartY + 200, '¡Tirar!', this.throwDice1.bind(this), false, 'buttonDice1');
        this.dice1 = this.add.text(posX + 50, textStartY + 200, '-', { fontSize: '18px', fontFamily: 'Selanik', color: '#000' }).setOrigin(0.5);
        this.dice1.setVisible(false)

        this.infoBattleP2 = this.add.text(posX, textStartY + 250, `Dado de ${this.duelPlayers[1].name} (${this.duelPlayers[1].type}): `, { fontSize: '18px', fontFamily: 'Selanik', color: '#000' }).setOrigin(0.5);
        this.infoBattleP2.setVisible(false)

        this.buttonDice2 = this.createButton(posX - 50, textStartY + 280, '¡Tirar!', this.throwDice2.bind(this), false, 'buttonDice2');
        this.dice2 = this.add.text(posX + 50, textStartY + 280, '-', { fontSize: '18px', fontFamily: 'Selanik', color: '#000' }).setOrigin(0.5);
        this.dice2.setVisible(false)
    }

    resizeBackground() {
        const { width, height } = this.sys.game.canvas;
        const bgWidth = this.background.width;
        const bgHeight = this.background.height;

        // Determine scale to fit the image proportionally
        const scaleX = width / bgWidth;
        const scaleY = height / bgHeight;
        const scale = Math.max(scaleX, scaleY);

        // Set the scale and re-position the image to the center
        this.background.setScale(scale).setScrollFactor(0);

        // Center the background image
        this.background.setPosition(width / 2, height / 2);
    }

    createButton(x, y, text, callback, visible = true, key = null) {
        const button = this.add.text(x, y, text, { fontSize: '18px', fontFamily: 'Selanik', color: '#fff', backgroundColor: '#000' }).setOrigin(0.5).setInteractive();
        button.on('pointerover', () => button.setStyle({ backgroundColor: '#555' }));
        button.on('pointerout', () => button.setStyle({ backgroundColor: '#000' }));
        button.on('pointerdown', () => {
            button.setStyle({ backgroundColor: '#aaa' });
            callback();
        });
        button.on('pointerup', () => button.setStyle({ backgroundColor: '#555' }));
        button.setVisible(visible);

        if (key) {
            this[key] = button;
        }

        return button;
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
                this.duelInfo.setText(`¡Empate, tirad de nuevo!`);
                setTimeout(() => {
                    this.startDuel()
                }, 1000)
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
