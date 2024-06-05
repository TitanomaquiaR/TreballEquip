
class StoreScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StoreScene' });
    }

    init(data) { //Cargamos el precio y la info del jugador
        this.storePlayer = data.storePlayer;
        this.options = JSON.parse(localStorage.options);
        this.armorPrice = this.options.price || 10;
        this.armorbought = false
    }

    preload(){ //Fondo
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

        //Botones y texto
        const textStartY = posY - wrapperHeight / 2 + 50;

        this.add.text(posX, textStartY, 'TIENDA', { fontSize: '32px', color: '#000' }).setOrigin(0.5);

        this.storeInfo = this.add.text(posX, textStartY + 50, `Bienvenido a la tienda, ${this.storePlayer.name}!`, { fontSize: '18px',  color: '#000' }).setOrigin(0.5);

        this.playerGoldText = this.add.text(posX, textStartY + 130, `Tienes ${this.storePlayer.gold} monedas`,  { fontSize: '18px',  color: '#000' }).setOrigin(0.5);
        this.priceInfo = this.add.text(posX, textStartY + 180, `¡Comprar una pieza son ${this.armorPrice} monedas!`, { fontSize: '18px',  color: '#000' }).setOrigin(0.5);

        const buttonBackgroundA = this.add.graphics();
        buttonBackgroundA.fillStyle(0x7f4949, 1); 
        buttonBackgroundA.fillRoundedRect(0, 6, 300, 50, 10);
        buttonBackgroundA.fillStyle(0xf6d3d0, 1); 
        buttonBackgroundA.fillRoundedRect(0, 0, 300, 50, 10);

        const buyButtonText = this.add.text(150, 25, 'Comprar Pieza de Armadura', { fontSize: '18px', color: '#000' }).setOrigin(0.5);
        this.buyButton = this.add.container(posX - 150, textStartY + 225, [buttonBackgroundA, buyButtonText]);
        const hitAreaB = this.add.zone(0, 0, 300, 50).setOrigin(0, 0).setInteractive();
        this.buyButton.add(hitAreaB)
        hitAreaB.on('pointerdown', () => this.buyArmorPiece());

        hitAreaB.on('pointerover', () => {
            buttonBackgroundA.clear();
            buttonBackgroundA.fillStyle(0x7f4949, 1); 
            buttonBackgroundA.fillRoundedRect(0, 6, 300, 50, 10);
            buttonBackgroundA.fillStyle(0xb8dbc0, 1); 
            buttonBackgroundA.fillRoundedRect(0, 0, 300, 50, 10);
        });
        
        hitAreaB.on('pointerout', () => {
            buttonBackgroundA.clear();
            buttonBackgroundA.fillStyle(0x7f4949, 1); 
            buttonBackgroundA.fillRoundedRect(0, 6, 300, 50, 10);
            buttonBackgroundA.fillStyle(0xf6d3d0, 1); 
            buttonBackgroundA.fillRoundedRect(0, 0, 300, 50, 10);
        });

        const buttonBackgroundE = this.add.graphics();
        buttonBackgroundE.fillStyle(0x7f4949, 1); 
        buttonBackgroundE.fillRoundedRect(0, 6, 150, 50, 10);
        buttonBackgroundE.fillStyle(0xf6d3d0, 1); 
        buttonBackgroundE.fillRoundedRect(0, 0, 150, 50, 10);

        const exitButtonText = this.add.text(75, 25, 'Salir', { fontSize: '18px', color: '#000' }).setOrigin(0.5);
        this.exitButton = this.add.container(posX - 75, textStartY + 300, [buttonBackgroundE, exitButtonText]);
        const hitAreaE = this.add.zone(0, 0, 150, 50).setOrigin(0, 0).setInteractive();
        this.exitButton.add(hitAreaE)
        hitAreaE.on('pointerdown', () => this.exitStore());

        hitAreaE.on('pointerover', () => {
            buttonBackgroundE.clear();
            buttonBackgroundE.fillStyle(0x7f4949, 1); 
            buttonBackgroundE.fillRoundedRect(0, 6, 150, 50, 10);
            buttonBackgroundE.fillStyle(0xb8dbc0, 1); 
            buttonBackgroundE.fillRoundedRect(0, 0, 150, 50, 10);
        });
        
        hitAreaE.on('pointerout', () => {
            buttonBackgroundE.clear();
            buttonBackgroundE.fillStyle(0x7f4949, 1); 
            buttonBackgroundE.fillRoundedRect(0, 6, 150, 50, 10);
            buttonBackgroundE.fillStyle(0xf6d3d0, 1); 
            buttonBackgroundE.fillRoundedRect(0, 0, 150, 50, 10);
        });
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

    buyArmorPiece() { //Comprar armadura (Verificando si se ha comprado o si tiene dinero)
        this.buyButton.setVisible(false)
        if (this.storePlayer.gold >= this.armorPrice && !this.armorbought) {
            this.armorbought = true
            this.storePlayer.gold -= this.armorPrice;
            this.storePlayer.armorPieces += 1;
            this.playerGoldText.setText(`Tienes ${this.storePlayer.gold} monedas`);
            this.storeInfo.setText(`¡Has comprado una pieza de armadura! \n\n\n Ahora tienes ${this.storePlayer.armorPieces} piezas de armadura.`);
        }

        setTimeout(() => {
            this.exitStore()
        }, 2000);

    }

    exitStore(){ //Salir
        this.scene.resume('MainScene');
        this.scene.stop('StoreScene');
    }
}

export default StoreScene;
