class Homescreen extends Phaser.Scene {
  constructor() {
    super("Homescreen");
  }

  preload() {
    this.load.image('begonetitle', '/assets/images/Begone.png');
  }

  create() {
    var startText = this.add.text(530, 500, "Spiel starten", { fontSize: 16 });
    startText.setInteractive({ useHandCursor: true });
    startText.on('pointerdown', () => this.clickButton());
    var endText = this.add.text(530, 550, "Spiel beenden")
    endText.setInteractive({ useHandCursor: true });
    endText.on('pointerdown', () => this.clickButton2());
    var titleimage = this.add.image(600, 150, 'begonetitle');

    sceneList = [];
    inventar = [];
    missedItemsErsteEtage = [];
    itemGroupArray = [];
  }

  clickButton() {
    this.scene.setActive(false);
    this.scene.setActive(true, "Schlafzimmer");
    this.scene.start("Schlafzimmer");
  }

  clickButton2() {
    game.destroy();
  }
}