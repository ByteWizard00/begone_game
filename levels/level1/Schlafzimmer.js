class Schlafzimmer extends Phaser.Scene {
  constructor() {
    super("Schlafzimmer");
    this.x = 70;
    this.sceneName = "Schlafzimmer";
    this.spielerKnockback = "";
  }

  init() {
    heartbeat = null;
    if (gameover) {
      herzenAnzahl = 1;
    }
    itemGroupArray = [];
    initialSpeed = true;
    collide = false;
    this.x = 70;
    spieler?.setX(400);
    spieler?.setY(400);
    gameover = false;
  }

  create() {
    heartbeat = this.sound.add("heartbeat"); //Herzschlag sound
    heartbeat.setVolume(0.2);
    creakydoor = this.sound.add("creakydoor"); //Door sound
    creakydoor.setVolume(0.03);

    if ((sceneList !== null && sceneList !== undefined) && sceneList[sceneList.length - 1] !== this.sceneName) {
      sceneList.push(this.sceneName);
    }

    let background = this.add.image(600, 350, "schlafzimmerboden");
    let teppich = this.add.image(550, 350, "teppich");

    moebel = this.physics.add.staticGroup();
    moebel.create(200, 400, "bett");
    moebel.create(500, 54, "schrank");

    tuer = this.physics.add.staticGroup();
    tuer.create(1130, 350, 'tuer').setScale(1.3).refreshBody();

    let wand = this.physics.add.staticGroup();
    wand.create(1150, 100, 'blackbar').setScale(2).refreshBody();
    wand.create(1150, 600, 'blackbar').setScale(2).refreshBody();

    spieler = this.physics.add.sprite(400, 400, "spieler");
    monster = this.physics.add.sprite(1000, 40, "monster");

    let playerbox = this.add.image(30, 30, "box");
    spieler1 = this.physics.add.sprite(30, 30, "spieler");
    let itembox = this.add.image(this.x + 150, 40, "itembox");

    // Spieler spawnt bei der Tür
    if ((sceneList !== null && sceneList[sceneList.length - 2] === undefined) ? sceneList[sceneList.length - 1] === "Flur" : sceneList[sceneList.length - 2] === "Flur") {
      spieler.setX(1000);
      spieler.setY(350);
    }

    // Überprüfung, ob Items noch nicht eingesammelt in der Szene
    items = this.physics.add.staticGroup();

    // if (sceneList[sceneList.length - 2] === undefined ? sceneList[sceneList.length - 1] : sceneList[sceneList.length - 2] !== "Flur" && (missedItemsErsteEtage === null || missedItemsErsteEtage === undefined)) {
    //   item = items.create(200, 300, "cola");
    //   item1 = items.create(100, 300, "essen");
    //   item.setName("cola");
    //   item1.setName("essen");
    //   missedItemsErsteEtage.push(item);
    //   missedItemsErsteEtage.push(item1);
    // }
    // else {
    //   items.clear();
    //   missedItemsErsteEtage.forEach(element => {
    //     let missingItem = items.create(element.x, element.y, element.name);
    //     missingItem.setName(element.name);
    //   });
    // }

    // Inventaranzeige
    inventarGroup = this.physics.add.staticGroup();
    this.add.text(this.x, 32, "Inventar:", { fontSize: 16 });
    this.inventarBox(inventar);

    // Lebensanzeige
    lebenGroup = this.physics.add.staticGroup();
    this.add.text(this.x, 10, "HP:", { fontSize: 16 });
    abstandsStartwertXLeben = 73; //Abstand zwischen den Herz-Grafiken

    // Korrekte Lebensanzahl mit Herzen nach Szenenwechsel
    for (let index = 0; index < herzenAnzahl; index++) {
      if (index === 0) {
        lebenGroup.create(this.x + 45, 18, "herz");
      }
      else {
        lebenGroup.create(this.x + abstandsStartwertXLeben, 18, "herz");
        abstandsStartwertXLeben += 20;
      }
    }

    // Geh-Animationen des Spielers
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
      frames: this.anims.generateFrameNumbers("spieler", { start: 12, end: 15 }),
      frameRate: 10,
      repeat: -1,
    });

    // Geh-Animationen des Monsters
    this.anims.create({
      key: "up-monster",
      frames: this.anims.generateFrameNumbers("monster", { start: 27, end: 35 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "down-monster",
      frames: this.anims.generateFrameNumbers("monster", { start: 18, end: 26 }),
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

    spieler1.anims.play("box-down"); // Spieler bewegt sich oben links

    eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    let self = this;
    let childactive;

    //Spieler kann mit Item kollidieren und mit der Taste-E aufsammeln 
    items.children.iterate(function (child) {
      self.physics.add.collider(spieler, child, (spieler, child) => {
        eKey?.on("down", () => self.interaction(childactive));
        childactive = child;
        collide = true;
        setTimeout(() => {
          collide = false;
        }, 500);
      });
    });

    moebel.children.iterate(function (child) {
      self.physics.add.collider(monster, child, (monster, child) => {
        self.collisionMoebel(child);
      });
    });

    // Collider Spieler/Monster und Umgebung
    this.physics.add.collider(spieler, monster);
    this.physics.add.collider(spieler, moebel);
    this.physics.add.collider(spieler, wand);
    this.physics.add.collider(monster, moebel);

    spieler.setCollideWorldBounds(true);
    monster.setCollideWorldBounds(true);

    // Türkollision
    this.physics.add.collider(spieler, tuer, () => {
      this.flurtuer();
    })

    this.physics.add.collider(monster, wand, () => {
      monster.setVelocityX(-180);
    });

    this.inventarAktivesItem();

    cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    this.monster_KI();  // Bewegung des Monsters + Spielerverfolgung
    // Spielerbewegung
    if (initialSpeed == true) { // Normal
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
    } else { // Wenn Item Getränkedose verwendet wird
      if (cursors.up.isDown) {
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

  // Spieler sammelt den Gegenstand auf sobald er kollidiert
  interaction(child) {
    if (collide) {
      if (!inventar.includes(child)) { // Damit das Item nur einmal im Inventar auftaucht
        collect.play();
        child.disableBody(true, true); // Das Item verschwindet vom Screen
        inventar.push(child); // Das Item wird im Inventar hinzugefügt
        missedItemsErsteEtage = missedItemsErsteEtage.filter((item) => item.name !== child.name); // Aus der Liste der Items, die nicht aufgehoben wurden verschwindet das Item
        this.inventarBox(inventar); //Inventaranzeige
      }
    }
  }

  // Überprüft, ob Item in Inventar ist.
  ItemInInventar = (name) => inventar.find((elem) => elem.name === name) ? true : false;

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
    abstandsZaehler = this.x + 110; // Anzeige für das Item in der ersten Box
    if (inventar_items.length > 0) {
      inventar_items.forEach((element) => {
        let item, item1, item2;
        switch (element?.name) {
          case "cola":
            if (this.getChildByName("cola") == null) {
              item = inventarGroup.create(abstandsZaehler, 40, "cola");
              item.setName("cola");
              itemGroupArray.push(item);
            }
            break;
          case "essen":
            if (this.getChildByName("essen") == null) {
              item1 = inventarGroup.create(abstandsZaehler, 40, "essen");
              item1.setName("essen");
              itemGroupArray.push(item1);
            }
            break;
          case "schluessel":
            if (this.getChildByName("schluessel") == null) {
              item2 = inventarGroup.create(abstandsZaehler, 40, "schluessel");
              item2.setName("schluessel");
              itemGroupArray.push(item2);
            }
            break;
          default:
            break;
        }
        abstandsZaehler += 40; // Jedes weitere Item erhält einen weiteren Abstand (Zentrierung in der Box)
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

    if (this.calcDistanzMonsterSpieler() < 150 && this.calcDistanzMonsterSpieler() > 50) { // Wenn die Distanz zwischen dem Monster und Spieler genau dazwischen liegt, soll er den Spieler verfolgen
      this.spielerVerfolgen();
    }
    else if (this.calcDistanzMonsterSpieler() <= 50) { // Wenn das Monster nah genug am Spieler ist, bekommt der Spieler Schaden und einen Rückstoß, sofern er mehr als ein Leben hat.
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
        if (herzenAnzahl === 0) { // Wenn der Spieler kein Leben mehr hat, ist das Spiel vorbei
          this.gameOver();
          heartbeat.stop();
        }
      }
    }

    // Wenn das Monster mit der Welt kollidiert
    else if (monsterCollideWorld.links) {
      monster?.setVelocityX(180);
      monster?.anims.play("right-monster", true)
    }
    else if (monsterCollideWorld.rechts) {
      monster?.setVelocityX(-180);
      monster?.anims.play("left-monster", true)
    }
    else if (monsterCollideWorld.oben) {
      monster?.setVelocityY(180);
      monster?.anims.play("down-monster", true)
    }
    else if (monsterCollideWorld.unten) {
      monster?.setVelocityY(-180);
      monster?.anims.play("up-monster", true)
    }

    else if (monsterCollideMoebel.links) {
      monster?.setVelocityX(180);
      monster?.anims.play("right-monster", true)
    }
    else if (monsterCollideMoebel.rechts) {
      monster?.setVelocityX(-180);
      monster?.anims.play("left-monster", true)
    }
    else if (monsterCollideMoebel.oben) {
      monster?.setVelocityY(180);
      monster?.anims.play("down-monster", true)
    }
    else if (monsterCollideMoebel.unten) {
      monster?.setVelocityY(-180);
      monster?.anims.play("up-monster", true)
    }
  }

  // Berechnung Abstand Spieler und Monster mit Mathvektorabstandsformel
  calcDistanzMonsterSpieler() {
    let x = spieler.x - monster.x;
    let y = spieler.y - monster.y;
    return Math.sqrt((x * x) + (y * y));
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

  // Abfrage, wo das Monster mit der Welt kollidiert
  collisionWand(x, y) {
    let canvasWeite = 1200;
    let canvasHoehe = 700;
    let weltRechts = canvasWeite - monster.width, weltLinks = monster.width, weltOben = monster.height, weltUnten = canvasHoehe - monster.height;
    if (weltRechts <= x) {
      monsterCollideWorld = { oben: false, rechts: true, unten: false, links: false };
    }
    else if (weltLinks >= x) {
      monsterCollideWorld = { oben: false, rechts: false, unten: false, links: true };
    }
    else if (weltOben >= y) {
      monsterCollideWorld = { oben: true, rechts: false, unten: false, links: false };
    }
    else if (weltUnten <= y) {
      monsterCollideWorld = { oben: false, rechts: false, unten: true, links: false };
    }
  }

  // Abfrage wo das Monster mit den Möbeln kollidiert
  collisionMoebel(child) {
    let hoehe = child.y;
    let weite = child.x;

    let moebelOben = hoehe - monster.height / 2, moebelRechts = weite + monster.width / 2, moebelUnten = hoehe + monster.height / 2, moebelLinks = weite - monster.width / 2;

    if (moebelRechts <= monster.x) {
      monsterCollideMoebel = { oben: false, rechts: true, unten: false, links: false };
    }
    else if (moebelLinks >= monster.x) {
      monsterCollideMoebel = { oben: false, rechts: false, unten: false, links: true };
    }
    else if (moebelOben >= monster.y) {
      monsterCollideMoebel = { oben: true, rechts: false, unten: false, links: false };
    }
    else if (moebelUnten <= monster.y) {
      monsterCollideMoebel = { oben: false, rechts: false, unten: true, links: false };
    }
  }

  // Szenenwechsel zu Flur
  flurtuer() {
    creakydoor.play();
    heartbeat.stop();
    this.scene.setActive(false);
    this.scene.setActive(true, "Flur");
    this.scene.switch("Flur");
  }
}