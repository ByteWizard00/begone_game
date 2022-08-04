var config = {
  type: Phaser.Auto,
  width: 1200,
  height: 700,
  backgroundcolor: 0x000000,
  autoCenter: true,
  // scale: {
  //   mode: Phaser.Scale.FIT,
  //   autoCenter: Phaser.Scale.CENTER_BOTH,
  //   },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  scene: [Preload, Homescreen, Schlafzimmer, Flur, WC, Schlafzimmer1, Arbeitszimmer, Erdgeschoss, Untergeschoss, Draußen, Over],
}

var game = new Phaser.Game(config);


