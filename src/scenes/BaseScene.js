import Phaser from "phaser";

export class BaseScene extends Phaser.Scene {
    constructor(key, config) {
        super(key);
        this.config = config;
        this.screenCenter = [ this.config.width / 2, this.config.height / 2 ];
        this.fontOptions = { fontSize: '32px', fill: '#FFF' };
        this.lineHeight = 42;
    }

    create() {
        this.add.image(0, 0, 'sky').setOrigin(0);

        if (this.config.canGoBack) {
            const backBtn = this.add.image(this.config.width - 10, this.config.height - 10, 'back')
                .setOrigin(1)
                .setScale(2)
                .setInteractive();

            backBtn.on('pointerup', () => {
                this.scene.start('MenuScene');
            })
        }
    }

    createMenu(menu, setupMenuEvents) {
        menu.forEach((menuItem, i) => {
            const menuPosition = [this.screenCenter[0], this.screenCenter[1] + (i * this.lineHeight)];
            menuItem.textGO = this.add
                .text(...menuPosition, menuItem.text, this.fontOptions)
                .setOrigin(0.5);

            setupMenuEvents(menuItem);
        })
    }
}