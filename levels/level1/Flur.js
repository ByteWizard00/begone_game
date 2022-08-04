class Flur extends Phaser.Scene {
  constructor() {
    super("Flur");
    this.x = 70;
    this.sceneName = "Flur";
    this.spielerKnockback = "";
  }

  init() {
    abstandsStartwertXLeben = 73;
    itemGroupArray = [];
    initialSpeed = true;
    collide = false;
    this.x = 70;
  }

  create() {
    heartbeat = this.sound.add("heartbeat"); //Herzschlag sound
    heartbeat.setVolume(0.2);
    creakydoor = this.sound.add("creakydoor"); //Door sound
    creakydoor.setVolume(0.05);
    
    if (sceneList !== null && sceneList !== undefined && sceneList[sceneList.length - 1] !== this.sceneName) {
      sceneList.push(this.sceneName);
    }

    let background1 = this.add.image(600, 350, "flurboden");

    wand = this.physics.add.staticGroup();
    wand.create(600, 68.5, "wandgrau").setName("wandgrau_flur");
    wand.create(1039, 350, "blackbar").setScale(3.5).refreshBody();
    wand.create(161, 350, "blackbar").setScale(3.5).refreshBody();
    wand.create(850.5, 607.5, "wandtreppe").setScale(0.9).refreshBody();
    wand.create(320, 420, "blackbarflur").setName("wandlinks_flur");
    wand.create(855, 420, "blackbarflur").setName("wandrechts_flur");
    wand.create(600, 900, "blackbarH").setScale(4).refreshBody().setName("wandunten_flur");

    schlafzimmertuer = this.physics.add.staticGroup();
    schlafzimmertuer.create(240, 600, "blackbar");

    schlafzimmertuer1 = this.physics.add.staticGroup();
    schlafzimmertuer1.create(600, 82, "tuerschlafzimmer");

    wctuer = this.physics.add.staticGroup();
    wctuer.create(331, 82, "tuerWC");

    arbeitstuer = this.physics.add.staticGroup();
    arbeitstuer.create(869, 82, "tuerwork");

    leveltuer = this.physics.add.staticSprite(929, 661, "leveltuer");

    spieler = this.physics.add.sprite(300, 650, "spieler");
    monster = this.physics.add.sprite(500, 400, "monster");

    let playerbox = this.add.image(30, 30, "box");
    spieler1 = this.physics.add.sprite(30, 30, "spieler");
    let itembox = this.add.image(this.x + 150, 40, "itembox");

    if (
      sceneList !== null && sceneList[sceneList.length - 2] === undefined? sceneList[sceneList.length - 1] === "WC" : sceneList[sceneList.length - 2] === "WC") {
      spieler.setX(331);
      spieler.setY(200);
    }

    if (sceneList !== null && sceneList[sceneList.length - 2] === undefined? sceneList[sceneList.length - 1] === "Schlafzimmer1" : sceneList[sceneList.length - 2] === "Schlafzimmer1") {
      spieler.setX(600);
      spieler.setY(200);
    }

    if (sceneList !== null && sceneList[sceneList.length - 2] === undefined? sceneList[sceneList.length - 1] === "Arbeitszimmer" : sceneList[sceneList.length - 2] === "Arbeitszimmer") {
      spieler.setX(869);
      spieler.setY(200);
    }

    //Inventaranzeige
    inventarGroup = this.physics.add.staticGroup();
    this.add.text(this.x, 32, "Inventar:", { fontSize: 16 });
    this.inventarBox(inventar);

    lebenGroup = this.physics.add.staticGroup();
    this.add.text(this.x, 10, "HP:", { fontSize: 16 });
    abstandsStartwertXLeben = 73; //Abstand zwischen den Herz-Grafiken

    //Korrekte Lebensanzahl mit Herzen nach Szenenwechsel
    for (let index = 0; index < herzenAnzahl; index++) {
      if (index === 0) {
        lebenGroup.create(this.x + 45, 18, "herz");
      } else {
        lebenGroup.create(this.x + abstandsStartwertXLeben, 18, "herz");
        abstandsStartwertXLeben += 20;
      }
    }

    // Geh-Animation des Spielers
    this.anims.create({
      key: "up",
      frames: this.anims.generateFrameNumbers("spieler", { start: 8, end: 11 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "down",
      frames: this.anims.generateFrameNumbers("spieler", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("spieler", { start: 4, end: 7 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("spieler", {
        start: 12,
        end: 15,
      }),
      frameRate: 10,
      repeat: -1,
    });

    // Geh-Animation des Monsters
    this.anims.create({
      key: "up-monster",
      frames: this.anims.generateFrameNumbers("monster", {
        start: 27,
        end: 35,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "down-monster",
      frames: this.anims.generateFrameNumbers("monster", {
        start: 18,
        end: 26,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "left-monster",
      frames: this.anims.generateFrameNumbers("monster", { start: 9, end: 17 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "right-monster",
      frames: this.anims.generateFrameNumbers("monster", { start: 0, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    // Geh-Animation des Spielers in der oberen Anzeige
    this.anims.create({
      key: "box-down",
      frames: this.anims.generateFrameNumbers("spieler", { start: 0, end: 3 }),
      frameRate: 5,
      repeat: -1,
    });

    // Tür-Animation wenn diese offen ist
    this.anims.create({
      key: "leveltuer",
      frames: [{ key: "leveltuer", frame: 1 }],
      frameRate: 10,
      repeat: -1,
    });

    spieler1.anims.play("box-down"); // Spieler bewegt sich oben links

    eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    let self = this;

    wand.children.iterate(function (child) {
      self.physics.add.collider(monster, child, (monster, child) => {
        self.collisionWand(child);
      });
    });

    //Spieler kann mit Item kollidieren und mit der Taste-E aufsammeln
        if (inventar.includes(item2) && schluessel !== null) {
          this.inventarBox(inventar);
          leveltuer.anims.play("leveltuer");
        }

    // Kollision Spieler/Monster und Umgebung
    this.physics.add.collider(spieler, monster);
    this.physics.add.collider(spieler, wand);
    this.physics.add.collider(monster, wand);

    spieler.setCollideWorldBounds(true);
    // monster.setCollideWorldBounds(true);

    // Türkollisionen mit...
    // ...Schlafzimmertür
    this.physics.add.collider(spieler, schlafzimmertuer, () => {
      this.schlafzimmertuer();
    });

    // ...Schlafzimmertür1
    this.physics.add.collider(spieler, schlafzimmertuer1, () => {
      this.schlafzimmertuer1();
    });

    // ...WC Tür
    this.physics.add.collider(spieler, wctuer, () => {
      this.wctuer();
    });

    // ...Arbeitstür
    this.physics.add.collider(spieler, arbeitstuer, () => {
      this.arbeitstuer();
    });

    // ...Leveltür
    this.physics.add.collider(spieler, leveltuer, () => {
      this.tuerFreischalten();
    });

    this.inventarAktivesItem();

    cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    this.monster_KI(); // Bewegung des Monsters + Spielerverfolgung

    // Spielerbewegung
    if (initialSpeed == true) {
      // Normal
      if (
        !cursors.up.isDown &&
        !cursors.down.isDown &&
        !cursors.left.isDown &&
        !cursors.right.isDown
      ) {
        spieler.anims.stop(null, true); // Wenn keine Pfeiltaste gedrückt wird, bleibt er stehen Animation stoppt
      }

      if (cursors.up.isDown) {
        spieler.setVelocityY(-150);
        spieler.anims.play("up", true);
      } else if (cursors.down.isDown) {
        spieler.setVelocityY(150);
        spieler.anims.play("down", true);
      } else {
        spieler.setVelocityY(0);
      }
      if (cursors.left.isDown) {
        spieler.setVelocityX(-150);
        spieler.anims.play("left", true);
      } else if (cursors.right.isDown) {
        spieler.setVelocityX(150);
        spieler.anims.play("right", true);
      } else {
        spieler.setVelocityX(0);
      }
    } else {
      if (cursors.up.isDown) {
        // Wenn Item Getränkedose verwendet wird
        spieler.setVelocityY(-220);
        spieler.anims.play("up", true);
      } else if (cursors.down.isDown) {
        spieler.setVelocityY(220);
        spieler.anims.play("down", true);
      } else {
        spieler.setVelocityY(0);
      }
      if (cursors.left.isDown) {
        spieler.setVelocityX(-220);
        spieler.anims.play("left", true);
      } else if (cursors.right.isDown) {
        spieler.setVelocityX(220);
        spieler.anims.play("right", true);
      } else {
        spieler.setVelocityX(0);
      }
    }
  }

  // Überprüft, ob Item in Inventar ist.
  ItemInInventar = (name) =>
    inventar.find((elem) => elem.name === name) ? true : false;

  // Welches Item gerade verwendet wird
  inventarItemFaehigkeit = () => {
    switch (aktivesItem?.name) {
      case "cola":
        this.cola();
        break;
      case "essen":
        this.essen();
        break;
      default:
    }
  };

  // Auswahl des aktiven Items aus der Inventar Liste
  inventarAktivesItem() {
    let key1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
    key1.on("down", () => {
      aktivesItem = inventar[0];
      this.inventarItemFaehigkeit();
    });
    let key2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
    key2.on("down", () => {
      aktivesItem = inventar[1];
      this.inventarItemFaehigkeit();
    });
    let key3 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
    key3.on("down", () => {
      aktivesItem = inventar[2];
      this.inventarItemFaehigkeit();
    });
  }

  // Funktion um den Itemnamen in dem Array zu finden
  getChildByName = (name) => {
    return itemGroupArray.find((elem) => elem.name === name);
  };

  //Anzeige der Items in der oberen Box
  inventarBox(inventar_items) {
    inventarGroup.clear(true);
    itemGroupArray = [];
    let abstandsZaehler = this.x + 110;
    if (inventar_items.length > 0) {
      inventar_items.forEach((element) => {
        let item, item1, item2;
        switch (element?.name) {
          case "cola":
            item = inventarGroup.create(abstandsZaehler, 40, "cola");
            item.setName("cola");
            itemGroupArray.push(item);
            break;
          case "essen":
            item1 = inventarGroup.create(abstandsZaehler, 40, "essen");
            item1.setName("essen");
            itemGroupArray.push(item1);
            break;
          case "schluessel":
            item2 = inventarGroup.create(abstandsZaehler, 40, "schluessel");
            item2.setName("schluessel");
            itemGroupArray.push(item2);
            break;
          default:
            break;
        }
        abstandsZaehler += 40;
      });
    }
  }

  // Fügt dem Charakter ein weiteres Leben hinzu
  lebenHinzufuegen() {
    lebenGroup.create(this.x + abstandsStartwertXLeben, 18, "herz");
    herzenAnzahl++;
    abstandsStartwertXLeben += 20;
  }

  // Nimmt den Charakter ein Leben
  lebenNehmen() {
    if (herzenAnzahl > 0) {
      lebenGroup.remove(lebenGroup.getLast(true), true);
      herzenAnzahl--;
    }
  }

  // Item Events
  // Getränkedose Item Effekt (Geschwindigkeit für den Spieler wird für kurze Zeit erhöht)
  cola() {
    initialSpeed = false;
    setTimeout(() => {
      initialSpeed = true;
    }, 5000); // 5 Sekunden hält der Effekt an
    inventar = inventar.filter((item) => item.name !== "cola"); // Das Item mit dem Namen "cola" wird aus dem Inventar entfernt/gefiltert
    let childbynameCola = this.getChildByName("cola");
    if (childbynameCola.active === true) {
      childbynameCola.disableBody(true, true);
    }
  }

  // Essen Item Effekt (+1 Leben)
  essen() {
    this.lebenHinzufuegen();
    inventar = inventar.filter((item) => item.name !== "essen"); // Das Item mit dem Namen "essen" wird aus dem Inventar entfernt/gefiltert
    let childbynameEssen = this.getChildByName("essen");
    if (childbynameEssen?.active === true) {
      childbynameEssen.disableBody(true, true);
    }
  }

  // Monster Events
  monster_KI() {
    this.collisionWand(monster.x, monster.y);
    if (heartbeatsound && this.calcDistanzMonsterSpieler() > 250) {
      heartbeat.stop();
      heartbeatsound = false;
    }
    if (!heartbeatsound && this.calcDistanzMonsterSpieler() < 250) {
      heartbeatsound = true;
      heartbeat.play();
    }
    this.collisionWand(monster.x, monster.y);
    if (
      this.calcDistanzMonsterSpieler() < 150 &&
      this.calcDistanzMonsterSpieler() > 50
    ) {
      // Wenn die Distanz zwischen dem Monster und Spieler genau dazwischen liegt, soll er den Spieler verfolgen
      this.spielerVerfolgen();
    } else if (this.calcDistanzMonsterSpieler() <= 50) {
      // Wenn das Monster nah genug am Spieler ist, bekommt der Spieler Schaden und einen Rückstoß, sofern er mehr als ein Leben hat.
      if (this.spielerKnockback !== "") {
        switch (this.spielerKnockback) {
          case "oben":
            spieler.setTint(0xff0000);
            spieler?.setY(monster.y + 100);
            this.spielerKnockback = "";
            this.lebenNehmen();
            setTimeout(() => {
              spieler.clearTint();
            }, 500);
            spieler.clearTint();
            break;
          case "rechts":
            spieler.setTint(0xff0000);
            spieler?.setX(monster.x - 100);
            this.spielerKnockback = "";
            this.lebenNehmen();
            setTimeout(() => {
              spieler.clearTint();
            }, 500);
            break;
          case "unten":
            spieler.setTint(0xff0000);
            spieler?.setY(monster.y - 100);
            this.spielerKnockback = "";
            this.lebenNehmen();
            setTimeout(() => {
              spieler.clearTint();
            }, 500);
            break;
          case "links":
            spieler.setTint(0xff0000);
            spieler?.setY(monster.x + 100);
            this.spielerKnockback = "";
            this.lebenNehmen();
            setTimeout(() => {
              spieler.clearTint();
            }, 500);
            break;
          default:
            break;
        }
        if (herzenAnzahl === 0) {
          // Wenn der Spieler kein Leben mehr hat, ist das Spiel vorbei
          this.gameOver();
        }
      }
    }
    // Wenn das Monster mit der Welt kollidiert
    else if (monsterCollideWorld.links) {
      monster?.setVelocityX(180);
      monster?.anims.play("right-monster", true);
    } else if (monsterCollideWorld.rechts) {
      monster?.setVelocityX(-180);
      monster?.anims.play("left-monster", true);
    } else if (monsterCollideWorld.oben) {
      monster?.setVelocityY(180);
      monster?.anims.play("down-monster", true);
    } else if (monsterCollideWorld.unten) {
      monster?.setVelocityY(-180);
      monster?.anims.play("up-monster", true);
    } else if (monsterCollideMoebel.links) {
      monster?.setVelocityX(180);
      monster?.anims.play("right-monster", true);
    } else if (monsterCollideMoebel.rechts) {
      monster?.setVelocityX(-180);
      monster?.anims.play("left-monster", true);
    } else if (monsterCollideMoebel.oben) {
      monster?.setVelocityY(180);
      monster?.anims.play("down-monster", true);
    } else if (monsterCollideMoebel.unten) {
      monster?.setVelocityY(-180);
      monster?.anims.play("up-monster", true);
    }
  }

  // Berechnung Abstand Spieler und Monster mit Mathvektorabstandsformel
  calcDistanzMonsterSpieler() {
    let x = spieler.x - monster.x;
    let y = spieler.y - monster.y;
    return Math.sqrt(x * x + y * y);
  }

  // Monster verfolgt den Spieler
  spielerVerfolgen() {
    // Spieler ist über dem Monster
    if (monster?.y >= spieler?.y) {
      monster?.setVelocityY(-120);
      monster?.anims.play("up-monster", true);
      this.spielerKnockback = "oben";
    }
    // Spieler ist unter dem Monster
    else if (monster?.y <= spieler?.y) {
      monster?.setVelocityY(120);
      monster?.anims.play("down-monster", true);
      this.spielerKnockback = "unten";
    }
    // Spieler ist links vom Monster
    if (monster?.x <= spieler?.x) {
      monster?.setVelocityX(120);
      monster?.anims.play("right-monster", true);
      this.spielerKnockback = "links";
    }
    // Spieler ist rechts vom Monster
    else if (monster?.x >= spieler?.x) {
      monster?.setVelocityX(-120);
      monster.anims.play("left-monster", true);
      this.spielerKnockback = "rechts";
    } else return;
  }

  // Spiel ist vorbei
  gameOver() {
    gameover = true;
    this.scene.setActive(false);
    this.scene.setActive(true, "Over");
    this.scene.switch("Over");
  }

  collisionWand(child) {
    let canvasHoehe = 700;
    let weltUnten = canvasHoehe - monster.height;
  
    if (child.name === "wandrechts_flur") {
      monsterCollideWorld = { oben: false, rechts: true, unten: false, links: false };
    }
    else if (child.name === "wandlinks_flur") {
      monsterCollideWorld = { oben: false, rechts: false, unten: false, links: true };
    }
    else if (child.name === "wandgrau_flur") {
      monsterCollideWorld = { oben: true, rechts: false, unten: false, links: false };
    }
    else if (child.name === "wandunten_flur") {
      monsterCollideWorld = { oben: false, rechts: false, unten: true, links: false };
    }
  }

  // Abfrage wo das Monster mit den Möbeln kollidiert
  collisionMoebel(child) {
    let hoehe = child.y;
    let weite = child.x;

    let moebelOben = hoehe - monster.height / 2,
      moebelRechts = weite + monster.width / 2,
      moebelUnten = hoehe + monster.height / 2,
      moebelLinks = weite - monster.width / 2;

    if (moebelRechts <= monster.x) {
      monsterCollideMoebel = {
        oben: false,
        rechts: true,
        unten: false,
        links: false,
      };
    } else if (moebelLinks >= monster.x) {
      monsterCollideMoebel = {
        oben: false,
        rechts: false,
        unten: false,
        links: true,
      };
    } else if (moebelOben >= monster.y) {
      monsterCollideMoebel = {
        oben: true,
        rechts: false,
        unten: false,
        links: false,
      };
    } else if (moebelUnten <= monster.y) {
      monsterCollideMoebel = {
        oben: false,
        rechts: false,
        unten: true,
        links: false,
      };
    }
  }

  // Szenenwechsel zu Schlafzimmer
  schlafzimmertuer() {
    creakydoor.play();
    heartbeat.stop();
    this.scene.setActive(false);
    this.scene.setActive(true, "Schlafzimmer");
    this.scene.start("Schlafzimmer");
  }

  schlafzimmertuer1() {
    creakydoor.play();
    heartbeat.stop();
    this.scene.setActive(false);
    this.scene.setActive(true, "Schlafzimmer1");
    this.scene.start("Schlafzimmer1");
  }

  // Szenenwechsel zu WC
  wctuer() {
    creakydoor.play();
    heartbeat.stop();
    this.scene.setActive(false);
    this.scene.setActive(true, "WC");
    this.scene.switch("WC");
  }

  // Szenenwechsel zu Arbeitszimmer
  arbeitstuer() {
    creakydoor.play();
    heartbeat.stop();
    this.scene.setActive(false);
    this.scene.setActive(true, "Arbeitszimmer");
    this.scene.switch("Arbeitszimmer");
  }

  // Szenenwechsel zu Level 2
  tuerFreischalten() {
    creakydoor.play();
    heartbeat.stop();
    if (schluessel && item2 !== null) {
      this.scene.switch("Erdgeschoss");
    }
  }
}
