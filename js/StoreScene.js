
class StoreScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StoreScene' });
    }

    init(data) {
        this.storePlayer = data.storePlayer;
        this.options = JSON.parse(localStorage.options);
        this.armorPrice = this.options.price || 10;
        this.armorbought = false
    }

    create() {
        this.cameras.main.setBackgroundColor('#ffffff');

        this.add.text(400, 100, 'Tienda', { fontSize: '32px', color: '#000' }).setOrigin(0.5);

        this.storeInfo = this.add.text(400, 200, `Bienvenido a la tienda, ${this.storePlayer.name}!`, { fontSize: '18px', color: '#000' }).setOrigin(0.5);

        this.playerGoldText = this.add.text(400, 300, `Tienes ${this.storePlayer.gold} monedas. ¡Comprar una pieza son ${this.armorPrice} monedas!`, { fontSize: '18px', color: '#000' }).setOrigin(0.5);

        this.buyButton = this.add.text(400, 400, 'Comprar Pieza de Armadura', { fontSize: '18px', color: '#000' }).setOrigin(0.5).setInteractive();
        this.buyButton.on('pointerdown', () => this.buyArmorPiece());

        const exitButton = this.add.text(400, 500, 'Salir', { fontSize: '18px', color: '#000' }).setOrigin(0.5).setInteractive();
        exitButton.on('pointerdown', () => this.exitStore());
    }

    buyArmorPiece() {
        this.buyButton.setVisible(false)
        if (this.storePlayer.gold >= this.armorPrice && !this.armorbought) {
            this.armorbought = true
            this.storePlayer.gold -= this.armorPrice;
            this.storePlayer.armorPieces += 1;
            this.playerGoldText.setText(`Tienes ${this.storePlayer.gold} monedas.`);
            this.storeInfo.setText(`¡Has comprado una pieza de armadura! Ahora tienes ${this.storePlayer.armorPieces} piezas.`);
        } else {
            this.storeInfo.setText('No tienes suficientes monedas para comprar una pieza de armadura.');
        }

        setTimeout(() => {
            this.exitStore()
        }, 2000);

    }

    exitStore(){
        this.scene.resume('MainScene');
        this.scene.stop('StoreScene');
    }
}

export default StoreScene;
