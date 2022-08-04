let button;
let button2;

class Over extends Phaser.Scene {
    constructor() {
        super("Over");
    }

    create() {
        this.cameras.main.fadeIn(1000);
        this.add.image(600, 150, 'gameover');

        this.textFadeIn();
    }

    clickButton() {
        this.scene.setActive(false);
        this.scene.setActive(true, "Homescreen");
        this.scene.switch("Homescreen");
    }

    clickButton2() {
        game.destroy();
    }

    textFadeIn() {
        // this.cameras.main.fadeIn(10000);
        var neuText = this.add.text(540, 470, "Neues Spiel");
        neuText.setInteractive({ useHandCursor: true });
        neuText.on('pointerdown', () => this.clickButton());

        var endText = this.add.text(530, 550, "Spiel beenden");
        endText.setInteractive({ useHandCursor: true });
        endText.on('pointerdown', () => this.clickButton2());
    }
}