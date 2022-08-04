# Begone Codebeispiele

### Name & Matrikelnummern: Christopher Tolstich 5194690 | Ramon Bendinger 5194195 | Quoc An Frank Nguyen 5201042

### **Für die Dokumentation -> siehe PDF Datei im Aulis Projekt Anhang**

<br>

# Table of Contents

## Allgemeine Funktionen

## 1.1 [Spielerbewegung](#spielerbewegung)

## 1.2 [Items aufsammeln](#items_aufsammeln)

## 1.3 [Geschwindigkeitsbooster](#geschwindigkeit_booster)

## 1.4 [Leben](#leben_behandlung)

## 1.5 [Inventaranzeige](#Inventaranzeige)

## 1.6 [Monsterbewegung + Kollisionserkennung + Spielerverfolgung](#monster)

<br >

## Level Funktionen

## 2.1 [Verschlossene Tür](#level_verschlossene_tuer)

<br>

---

<br>

# Allgemeine Funktionen

## 1.1 <a id="spielerbewegung"></a> Spielerbewegung

<br>

> ### Spielerbewegung ohne den Booster
>
> ### Initial Speed (Anfangsgeschwindigkeit) ist ein Boolean. Dieser überprüft, ob der Booster genommen wurde mit false.

```javascript
// In der Phaser Update Funktion
if (initialSpeed == true) {
  // normale Spielerbewegung
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
}
```

## 1.2 <a id="items_aufsammeln"></a> Items aufsammeln: **Apfel** und die **Getränkedose**

<br>

> ### Damit Phaser weiß, welches Item mit dem Spieler gerade kollidiert muss durch die "static group" iteriert werden.

> ### Beim drücken der E-Taste und bei der Kollision zwischen dem Spieler und des Objektes wird die Funktion "interaction" der Klasse aufgerufen.

<br>

```javascript
//In der Phaser Create Funktion
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
```

```javascript
//Seperate Funktion
//Spieler interagiert mit Item
  interaction(child) {
    if (collide) {
      if (!inventar.includes(child)) {
        child.disableBody(true, true);
        inventar.push(child);
        missedItemsErsteEtage = missedItemsErsteEtage.filter((item) => item.name !== child.name);
        this.inventarBox(inventar); //Inventaranzeige
      }
    }
  }
```

<br>

## 1.3 <a id="geschwindigkeit_booster"></a> Geschwindigkeit erhöhen, beim Aufsammeln der Getränkedose (Booster)

<br>

```javascript
//Seperate Funktion
cola() {
    initialSpeed = false;
    setTimeout(() => {
      initialSpeed = true;
      //Das Item mit dem Namen "cola" wird aus dem Inventar entfernt/gefiltert
      inventar = inventar.filter((item) => item.name !== "cola");
    }, 5000);
    let childbynameCola = this.getChildByName("cola");
    if (childbynameCola.active === true) {
      childbynameCola.disableBody(true, true);
    }
  }

```

```javascript
// in der Update Funktion wird Initialspeed für 5 Sekunden auf false gesetzt und der Spieler bewegt sich schneller
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
```

<br>

---

## 1.4 <a id="leben_behandlung"></a> Leben

<br>

```javascript

//Seperate Funktion
lebenHinzufuegen() {
    lebenGroup.create(this.x + abstandsStartwertXLeben, 18, "herz");
    herzenAnzahl++;
    abstandsStartwertXLeben += 20;
  }

```

```javascript

//Seperate Funktion
lebenNehmen() {
    if (herzenAnzahl > 0) {
      lebenGroup.remove(lebenGroup.getLast(true), true); //Entfernt letztes Item der Gruppe leben
      herzenAnzahl--;
    }
  }

```

> ### Leben als Herz hinfügen, beim Aufsammeln des Apfels

```javascript

//Seperate Funktion
essen() {
    this.lebenHinzufuegen();
    this.x = this.x + 20;
    //Item wird aus der Inventarliste gelöscht
    inventar = inventar.filter((item) => item.name !== "essen");
    let childbynameEssen = this.getChildByName("essen");
    if (childbynameEssen.active === true) {
      childbynameEssen.disableBody(true, true);
    }
  }

```

<br>

---

## 1.5 <a id="Inventaranzeige"></a> Inventaranzeige

<br>

```javascript
//Überprüft, ob Item in Inventar ist.
ItemInInventar = (name) =>
  inventar.find((elem) => elem.name === name) ? true : false;

// Aufgerufen über die Funktion inventarAktivesItem
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
}
```

> ### Tasten mit Items werden verknüpft

```javascript

//Auswahl des aktiven Items aus der Inventar-Liste
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

```

> ### Anzeige der Items in den oberen Kästen

```javascript

  inventarBox(inventar_items) { //Parameter bekommt inventar-array übergeben
    inventarGroup.clear(true); //löscht die Inventar-static-group der Box
    itemGroupArray = [];
    //Bestimmung des Abstandes zwischen den Items der Box
    let abstandsZaehler = this.x + 110;
    if (inventar_items.length > 0) {
      inventar_items.forEach((element) => {
        console.log(element?.name);
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
        abstandsZaehler += 40;
      });
    }
  }

```

<br>

---

## 1.6 <a id="monster"></a> Monsterbewegung

<br>

> ### Berechnung der Distanz zwischen Monster und Spieler, mithilfe der Formel zur Berechnung des Abstandes zwischen zwei 2d-Vektoren.

```javascript

calcDistanzMonsterSpieler() {
    let x = spieler.x - monster.x;
    let y = spieler.y - monster.y;
    return Math.sqrt((x * x) + (y * y));
  }

```

<br>

> ### Moebel Monster Kollision

```javascript
  // In die create-Funtion der Klasse
  moebel.children.iterate(function (child) {
    self.physics.add.collider(monster, child, (monster child) => {
      self.collisionMoebel(child);
    });
  });
```
 
```javascript
collisionMoebel(child) { //Parameter(child) = erzeugtes Moebelobjekt
    let hoehe = child.y;
    let weite = child.x;

    let moebelOben = hoehe - monster.height / 2, 
    moebelRechts = weite + monster.width / 2, 
    moebelUnten = hoehe + monster.height / 2, 
    moebelLinks = weite - monster.width / 2;

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
```

<br>

<br>

> Kollsion Monster mit inneren Wänden

```javascript
 // Abfrage, mit welcher inneren Wamd das Monster kollidiert
  collisionInnereWand(child) {
    if (child.name === "wandrechts_work") {
      monsterCollideWorld = { oben: false, rechts: true, unten: false, links: false };
    }
    else if (child.name === "wandlinks_work") {
      monsterCollideWorld = { oben: false, rechts: false, unten: false, links: true };
    }
    else if (child.name === "wandgrau_work") {
      monsterCollideWorld = { oben: true, rechts: false, unten: false, links: false };
    }
    else if (child.name === "wandunten_work") {
      monsterCollideWorld = { oben: false, rechts: false, unten: true, links: false };
    }
  }
```


```javascript
// In die create-Funktion der Klasse 
wand.children.iterate(function (child) {
  self.physics.add.collider(monster, child, (monster, child) => {
    self.collisionInnereWand(child);
  });
});
```

<br>

> Kollison Monster mit der Begrenzung der Welt

```javascript
//Kollision Weltborder ohne innere Wände
// x,y = Position des Monsters im Canvas / monster.x, monster.y
collisionWand(x, y) {  
    let canvasWeite = 1200;
    let canvasHoehe = 700;
    let weltRechts = canvasWeite - monster.width,
    weltLinks = monster.width,
    weltOben = monster.height,
    weltUnten = canvasHoehe - monster.height;

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

```

> ### Bewegung des Monsters zum Verfolgen des Spielers

```javascript

spielerVerfolgen() {
    //Spieler ist über dem Monster
    if (monster.y >= spieler.y) {
      monster.setVelocityY(-100); //Bewegung nach oben
      monster.anims.play("up-monster", true);
      this.spielerKnockback = "oben";
    }

    //Spieler ist unter dem Monster
    else if (monster.y <= spieler.y) {
      monster.setVelocityY(100); //Bewegung nach unten
      monster.anims.play("down-monster", true);
      this.spielerKnockback = "unten";
    }

    //Spieler ist links vom Monster
    if (monster.x <= spieler.x) {
      monster.setVelocityX(100); //Bewegung nach kinks
      monster.anims.play("right-monster", true);
      this.spielerKnockback = "links";
    }

    //Spieler ist rechts vom Monster
    else if (monster.x >= spieler.x) {
      monster.setVelocityX(-100);// Bewegung nach rechts
      monster.anims.play("left-monster", true);
      this.spielerKnockback = "rechts";
    }
    else return;
  }

```

<br>

> ### Monster KI

```javascript

//Aufgerufen durch Phaser create-Funktion
monster_KI() {
    if (heartbeatsound && this.calcDistanzMonsterSpieler() > 250) {
      heartbeat.stop();
      heartbeatsound = false;
    }
    if (!heartbeatsound && this.calcDistanzMonsterSpieler() < 250) {
      heartbeatsound = true;
      heartbeat.play();
    }
    if (this.calcDistanzMonsterSpieler() < 150 && this.calcDistanzMonsterSpieler() > 50) {
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

```

<br>

<br>

<br>

# 2. Level Funktionen

## 2.1 Tür aktivieren / öffnen 

```javascript
//Spieler kann mit Item kollidieren und mit der Taste-E aufsammeln
  if (inventar.includes(item2) && schluessel !== null) {
    this.inventarBox(inventar);
    leveltuer.anims.play("leveltuer");
  }
```

> Animation zur Änderung des Türgriffs von rot (verschlossen) zu grün (offen)

```javascript

this.anims.create({
  key: "leveltuer",
  frames: [{ key: "leveltuer", frame: 1 }],
  frameRate: 10,
  repeat: -1,
});

```

## 2.2 <a id="level_verschlossene_tuer"></a> Verschlossene Tür

```javascript

// Alles in Phaser Create-Funktion des Levels
let eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

let self = this;
this.physics.add.collider(spieler, item2, () => {
  eKey?.on("down", () => {
    if (!inventar.includes(item2)) {
      schluessel = item2; //variable schluessel ist global in der preload.js
      inventar.push(schluessel);
      item2.disableBody(true, true); //schlüssel wird entfernt
      this.inventarBox(inventar); //Angezeigtes Inventar wird aktualisiert
      leveltuer.anims.play("leveltuer"); //
    }
  });
});

```

> Funktion tuerFreischalten wird aufgerufen, wenn der Spieler mit dem leveltuer Objekt kollidiert

```javascript

this.physics.add.collider(spieler, leveltuer, () => {
  this.tuerFreischalten();
});

```

> Überprüft, ob das globale Objekt schluessel von preload.js und das Item2 der Gruppe etwas enthalten. <br>
>Wenn ja wird in das nächste Level gewechselt.

```javascript

tuerFreischalten() {
    if (schluessel && item2 !== null) { //schluessel-Objekt ist global definiert in preload.js
      this.scene.switch("Erdgeschoss");
    }
}

```