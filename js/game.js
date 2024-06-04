import MainScene from './MainScene.js';
import DuelScene from './DuelScene.js';
import StoreScene from './StoreScene.js';

var config = {
    type: Phaser.AUTO,
    domCreateContainer: true,
    width: 1500,
    height: 800,
    backgroundColor: '#ffffff',
    parent: 'game-container',
    scene: [MainScene, DuelScene, StoreScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0},
            debug: false
        }
    }
};

var game = new Phaser.Game(config);
