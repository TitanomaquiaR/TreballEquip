
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
        this.load.image('tiendafondo', '../assets/UI/FondoTienda.png');
    }

    create() {
        this.background = this.add.image(0, 0, 'tiendafondo').setOrigin(0.5);
        this.resizeBackground();
        window.addEventListener('resize', ()=>this.resizeBackground());

        const posX = this.cameras.main.width / 2;
        const posY = this.cameras.main.height / 2;

        const wrapperWidth = 600;
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

        this.add.text(posX, textStartY, 'TIENDA', { fontSize: '32px', fontFamily: 'Greconian', color: '#000' }).setOrigin(0.5);

        this.storeInfo = this.add.text(posX, textStartY + 50, `Bienvenido a la tienda, ${this.storePlayer.name}!`, { fontSize: '18px', fontFamily: 'Selanik', color: '#000' }).setOrigin(0.5);

        this.playerGoldText = this.add.text(posX, textStartY + 130, `Tienes ${this.storePlayer.gold} monedas`,  { fontSize: '18px', fontFamily: 'Selanik', color: '#000' }).setOrigin(0.5);
        this.priceInfo = this.add.text(posX, textStartY + 180, `¡Comprar una pieza son ${this.armorPrice} monedas!`, { fontSize: '18px', fontFamily: 'Selanik', color: '#000' }).setOrigin(0.5);

        this.buyButton = this.add.text(posX, textStartY + 250, 'Comprar Pieza de Armadura', { fontSize: '18px', fontFamily: 'Greconian', color: '#000' }).setOrigin(0.5).setInteractive();
        this.buyButton.on('pointerdown', () => this.buyArmorPiece());

        const exitButton = this.add.text(posX, textStartY + 350, 'Salir', { fontSize: '18px',fontFamily: 'Greconian', color: '#000' }).setOrigin(0.5).setInteractive();
        exitButton.on('pointerdown', () => this.exitStore());
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
