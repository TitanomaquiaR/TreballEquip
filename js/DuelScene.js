
class DuelScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DuelScene' });
    }

    init(data) { //Cargar datos jugador + media de la apuesta sugerida
        this.duelPlayers = data.duelPlayers;

        this.bet = Math.floor((this.duelPlayers[0].gold / 2 + this.duelPlayers[1].gold / 2) / 2); //Media de las medias
        if (this.bet > this.duelPlayers[0].gold){
            this.bet = this.duelPlayers[0].gold
        } else if(this.bet > this.duelPlayers[1].gold){
            this.bet = this.duelPlayers[1].gold
        }
        //Valor dados
        this.player1Score = 0
        this.player2Score = 0
    }

    preload(){ //Fondo
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

        //Botones y textos
        const textStartY = posY - wrapperHeight / 2 + 50;

        this.add.text(posX, textStartY, 'DUELO', { fontSize: '32px', color: '#000' }).setOrigin(0.5);

        this.duelInfo = this.add.text(posX, textStartY + 50, `¡Duelo entre ${this.duelPlayers[0].name} (${this.duelPlayers[0].type}) y ${this.duelPlayers[1].name} (${this.duelPlayers[1].type})!`, { fontSize: '18px', color: '#000' }).setOrigin(0.5);

        this.betInfoText = this.add.text(posX, textStartY + 100, 'Introduce las monedas a apostar:', { fontSize: '18px', color: '#000' }).setOrigin(0.5);

        this.betInfoGold = this.add.text(posX, textStartY + 150 , `¡${this.duelPlayers[0].name} (${this.duelPlayers[0].type}) tiene ${this.duelPlayers[0].gold} monedas y ${this.duelPlayers[1].name} (${this.duelPlayers[1].type}) tiene ${this.duelPlayers[1].gold} monedas!`, { fontSize: '18px', color: '#000' }).setOrigin(0.5);

        this.betText = this.add.text(posX, textStartY + 250, 'Apuesta', { fontSize: '18px', color: '#000' }).setOrigin(0.5);

        this.updateBetText();

        const buttonBackgroundA = this.add.graphics();
        buttonBackgroundA.fillStyle(0x7f4949, 1); 
        buttonBackgroundA.fillRoundedRect(0, 3, 25, 25, 10);
        buttonBackgroundA.fillStyle(0xf6d3d0, 1); 
        buttonBackgroundA.fillRoundedRect(0, 0, 25, 25, 10);

        const addbetBText = this.add.text(12, 12, '+', { fontSize: '18px', color: '#000' }).setOrigin(0.5);
        this.addBetB = this.add.container(posX - 60, textStartY + 235, [buttonBackgroundA, addbetBText]);
        const hitAreaA = this.add.zone(0, 0, 25, 25).setOrigin(0, 0).setInteractive();
        this.addBetB.add(hitAreaA)
        hitAreaA.on('pointerdown', () => this.addBet());

        hitAreaA.on('pointerover', () => {
            buttonBackgroundA.clear();
            buttonBackgroundA.fillStyle(0x7f4949, 1); 
            buttonBackgroundA.fillRoundedRect(0, 3, 25, 25, 10);
            buttonBackgroundA.fillStyle(0xb8dbc0, 1); 
            buttonBackgroundA.fillRoundedRect(0, 0, 25, 25, 10);
        });
        
        hitAreaA.on('pointerout', () => {
            buttonBackgroundA.clear();
            buttonBackgroundA.fillStyle(0x7f4949, 1); 
            buttonBackgroundA.fillRoundedRect(0, 3, 25, 25, 10);
            buttonBackgroundA.fillStyle(0xf6d3d0, 1); 
            buttonBackgroundA.fillRoundedRect(0, 0, 25, 25, 10);
        });

        const buttonBackgroundR = this.add.graphics();
        buttonBackgroundR.fillStyle(0x7f4949, 1); 
        buttonBackgroundR.fillRoundedRect(0, 3, 25, 25, 10);
        buttonBackgroundR.fillStyle(0xf6d3d0, 1); 
        buttonBackgroundR.fillRoundedRect(0, 0, 25, 25, 10);

        const removebetBText = this.add.text(12, 12, '-', { fontSize: '18px', color: '#000' }).setOrigin(0.5);
        this.removeBetB = this.add.container(posX + 35, textStartY + 235, [buttonBackgroundR, removebetBText]);
        const hitAreaR = this.add.zone(0, 0, 25, 25).setOrigin(0, 0).setInteractive();
        this.removeBetB.add(hitAreaR)
        hitAreaR.on('pointerdown', () => this.removeBet());

        hitAreaR.on('pointerover', () => {
            buttonBackgroundR.clear();
            buttonBackgroundR.fillStyle(0x7f4949, 1); 
            buttonBackgroundR.fillRoundedRect(0, 3, 25, 25, 10);
            buttonBackgroundR.fillStyle(0xb8dbc0, 1); 
            buttonBackgroundR.fillRoundedRect(0, 0, 25, 25, 10);
        });
        
        hitAreaR.on('pointerout', () => {
            buttonBackgroundR.clear();
            buttonBackgroundR.fillStyle(0x7f4949, 1); 
            buttonBackgroundR.fillRoundedRect(0, 3, 25, 25, 10);
            buttonBackgroundR.fillStyle(0xf6d3d0, 1); 
            buttonBackgroundR.fillRoundedRect(0, 0, 25, 25, 10);
        });

        const buttonBackground1 = this.add.graphics();
        buttonBackground1.fillStyle(0x7f4949, 1); 
        buttonBackground1.fillRoundedRect(0, 6, 200, 50, 10);
        buttonBackground1.fillStyle(0xf6d3d0, 1); 
        buttonBackground1.fillRoundedRect(0, 0, 200, 50, 10);

        const buttonTextDuel = this.add.text(100, 25, 'Iniciar Duelo', { fontSize: '22px', color: '#000' }).setOrigin(0.5);
        this.duelButton = this.add.container(posX - 100, textStartY + 325, [buttonBackground1, buttonTextDuel]);
        const hitAreaDB = this.add.zone(0, 0, 200, 50).setOrigin(0, 0).setInteractive();
        this.duelButton.add(hitAreaDB);
        hitAreaDB.on('pointerdown', () => this.startDuel());

        hitAreaDB.on('pointerover', () => {
            buttonBackground1.clear();
            buttonBackground1.fillStyle(0x7f4949, 1); 
            buttonBackground1.fillRoundedRect(0, 6, 200, 50, 10);
            buttonBackground1.fillStyle(0xb8dbc0, 1); 
            buttonBackground1.fillRoundedRect(0, 0, 200, 50, 10);
        });
        
        hitAreaDB.on('pointerout', () => {
            buttonBackground1.clear();
            buttonBackground1.fillStyle(0x7f4949, 1); 
            buttonBackground1.fillRoundedRect(0, 6, 200, 50, 10);
            buttonBackground1.fillStyle(0xf6d3d0, 1); 
            buttonBackground1.fillRoundedRect(0, 0, 200, 50, 10);
        });

        //Segunda parte del duelo, tirar los dados

        this.infoBattleText = this.add.text(posX, textStartY + 100, 'Tirad los dados:', { fontSize: '18px', color: '#000' }).setOrigin(0.5);
        this.infoBattleText.setVisible(false)

        this.infoBattleP1 = this.add.text(posX, textStartY + 150, `Dado de ${this.duelPlayers[0].name} (${this.duelPlayers[0].type}): `, { fontSize: '18px', color: '#000' }).setOrigin(0.5);
        this.infoBattleP1.setVisible(false)

        const buttonBackgroundP1 = this.add.graphics();
        buttonBackgroundP1.fillStyle(0x7f4949, 1); 
        buttonBackgroundP1.fillRoundedRect(0, 6, 150, 30, 10);
        buttonBackgroundP1.fillStyle(0xf6d3d0, 1); 
        buttonBackgroundP1.fillRoundedRect(0, 0, 150, 30, 10);

        const buttonDice1Text = this.add.text(75, 15, '¡Tirar!', { fontSize: '18px', color: '#000' }).setOrigin(0.5);
        this.buttonDice1 = this.add.container(posX - 125, textStartY + 180, [buttonBackgroundP1, buttonDice1Text]);
        const hitAreaP1 = this.add.zone(0, 0, 150, 50).setOrigin(0, 0).setInteractive();
        this.buttonDice1.add(hitAreaP1);
        hitAreaP1.on('pointerdown', () => this.throwDice1());

        hitAreaP1.on('pointerover', () => {
            buttonBackgroundP1.clear();
            buttonBackgroundP1.fillStyle(0x7f4949, 1); 
            buttonBackgroundP1.fillRoundedRect(0, 6, 150, 30, 10);
            buttonBackgroundP1.fillStyle(0xb8dbc0, 1); 
            buttonBackgroundP1.fillRoundedRect(0, 0, 150, 30, 10);
        });
        
        hitAreaP1.on('pointerout', () => {
            buttonBackgroundP1.clear();
            buttonBackgroundP1.fillStyle(0x7f4949, 1); 
            buttonBackgroundP1.fillRoundedRect(0, 6, 150, 30, 10);
            buttonBackgroundP1.fillStyle(0xf6d3d0, 1); 
            buttonBackgroundP1.fillRoundedRect(0, 0, 150, 30, 10);
        });

        this.buttonDice1.setVisible(false)

        this.dice1 = this.add.text(posX + 50, textStartY + 200 , '-', { fontSize: '18px', color: '#000' }).setOrigin(0.5);
        this.dice1.setVisible(false)

        this.infoBattleP2 = this.add.text(posX, textStartY + 300, `Dado de ${this.duelPlayers[1].name} (${this.duelPlayers[1].type}): `, { fontSize: '18px', color: '#000' }).setOrigin(0.5);
        this.infoBattleP2.setVisible(false)

        const buttonBackgroundP2 = this.add.graphics();
        buttonBackgroundP2.fillStyle(0x7f4949, 1); 
        buttonBackgroundP2.fillRoundedRect(0, 6, 150, 30, 10);
        buttonBackgroundP2.fillStyle(0xf6d3d0, 1); 
        buttonBackgroundP2.fillRoundedRect(0, 0, 150, 30, 10);

        const buttonDice2Text = this.add.text(75, 15, '¡Tirar!', { fontSize: '18px', color: '#000' }).setOrigin(0.5);
        this.buttonDice2 = this.add.container(posX - 125, textStartY + 330, [buttonBackgroundP2, buttonDice2Text]);
        const hitAreaP2 = this.add.zone(0, 0, 150, 50).setOrigin(0, 0).setInteractive();
        this.buttonDice2.add(hitAreaP2);
        hitAreaP2.on('pointerdown', () => this.throwDice2());

        hitAreaP2.on('pointerover', () => {
            buttonBackgroundP2.clear();
            buttonBackgroundP2.fillStyle(0x7f4949, 1); 
            buttonBackgroundP2.fillRoundedRect(0, 6, 150, 30, 10);
            buttonBackgroundP2.fillStyle(0xb8dbc0, 1); 
            buttonBackgroundP2.fillRoundedRect(0, 0, 150, 30, 10);
        });
        
        hitAreaP2.on('pointerout', () => {
            buttonBackgroundP2.clear();
            buttonBackgroundP2.fillStyle(0x7f4949, 1); 
            buttonBackgroundP2.fillRoundedRect(0, 6, 150, 30, 10);
            buttonBackgroundP2.fillStyle(0xf6d3d0, 1); 
            buttonBackgroundP2.fillRoundedRect(0, 0, 150, 30, 10);
        });

        this.buttonDice2.setVisible(false)

        this.dice2 = this.add.text(posX + 50, textStartY + 350, '-', { fontSize: '18px', color: '#000' }).setOrigin(0.5);
        this.dice2.setVisible(false)
    }

    resizeBackground() { //Reescalar fondo
        const { width, height } = this.sys.game.canvas;
        const bgWidth = this.background.width;
        const bgHeight = this.background.height;

        const scaleX = width / bgWidth;
        const scaleY = height / bgHeight;
        const scale = Math.max(scaleX, scaleY);

        this.background.setScale(scale).setScrollFactor(0);

        this.background.setPosition(width / 2, height / 2);
    }

    updateBetText(){ //Cambiar texto de la apuesta
        this.betText.setText(this.bet)
    }

    addBet(){ //Añadir apuesta
        if(this.bet < this.duelPlayers[0].gold && this.bet < this.duelPlayers[1].gold){
            this.bet +=1
            this.updateBetText() 
        }
    }

    removeBet(){ //Retirar apuesta
        if(this.bet > 1){
            this.bet -= 1
            this.updateBetText()
        }
    }

    startDuel() { //Empezar duelo
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

    throwDice1(){ //Lanzar dado jugador 1
        if (this.player1Score == 0){
            this.player1Score = Phaser.Math.Between(1, 6);
            console.log(this.player1Score)
            this.dice1.setText(this.player1Score)
            this.verifyResult()
        }
    }

    throwDice2(){ //Lanzar dado jugador 2
        if(this.player2Score == 0){
            this.player2Score = Phaser.Math.Between(1, 6);
            console.log(this.player2Score)
            this.dice2.setText(this.player2Score)
            this.verifyResult()
        }
    }

    verifyResult(){ //Verificar resultado
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

    finalDuel(){ //Salir
        setTimeout(() => {
            this.scene.resume('MainScene');
            this.scene.stop('DuelScene');
        }, 2000);
    
    }
}

export default DuelScene;
