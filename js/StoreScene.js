
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

    preload(){
        this.load.image('tiendafondo', '../assets/UI/fondo.jpg');
    }

    create() {
        this.add.image(0, 0, 'tiendafondo').setOrigin(0.5);
        this.resizeBackground();
        window.addEventListener('resize', ()=>this.resizeBackground());

        this.add.text(400, 100, 'Tienda', { fontSize: '32px', fontFamily: 'Greconian', color: '#000' }).setOrigin(0.5);

        this.storeInfo = this.add.text(400, 150, `Bienvenido a la tienda, ${this.storePlayer.name}!`, { fontSize: '18px', fontFamily: 'Selanik', color: '#000' }).setOrigin(0.5);

        this.playerGoldText = this.add.text(400, 250, `Tienes ${this.storePlayer.gold} monedas`,  { fontSize: '18px', color: '#000' }).setOrigin(0.5);
        this.priceInfo = this.add.text(400, 350, `¡Comprar una pieza son ${this.armorPrice} monedas!`, { fontSize: '18px', color: '#000' }).setOrigin(0.5);

        this.buyButton = this.add.text(400, 400, 'Comprar Pieza de Armadura', { fontSize: '18px', fontFamily: 'greconian', color: '#000' }).setOrigin(0.5).setInteractive();
        this.buyButton.on('pointerdown', () => this.buyArmorPiece());

        const exitButton = this.add.text(400, 500, 'Salir', { fontSize: '18px',fontFamily: 'greconian', color: '#000' }).setOrigin(0.5).setInteractive();
        exitButton.on('pointerdown', () => this.exitStore());
    }

    resizeBackground() {
        const { width, height } = this.sys.game.canvas;
        const scaleX = width / this.background.width;
        const scaleY = height / this.background.height;
        const scale = Math.max(scaleX, scaleY);

        this.background.setScale(scale).setScrollFactor(0);

        this.cameras.main.setBounds(0, 0, width, height);
        this.cameras.main.centerOn(width / 2, height / 2);
    }

    buyArmorPiece() {
        this.buyButton.setVisible(false)
        if (this.storePlayer.gold >= this.armorPrice && !this.armorbought) {
            this.armorbought = true
            this.storePlayer.gold -= this.armorPrice;
            this.storePlayer.armorPieces += 1;
            this.playerGoldText.setText(`Tienes ${this.storePlayer.gold} monedas`);
            this.storeInfo.setText(`¡Has comprado una pieza de armadura! Ahora tienes ${this.storePlayer.armorPieces} piezas de armadura.`);
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
