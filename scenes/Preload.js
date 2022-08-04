//Vorladen der Variablen und Bilder sowie Sprites
let naechsteSzene = "";
let tuer;
let herzenAnzahl = 1;
let cursors;
let spieler;
let monster;
let monsterCollideWorld = { oben: false, rechts: false, unten: false, links: false };
let monsterCollideMoebel = { oben: false, rechts: false, unten: false, links: false };
let spielerFakePosition = { x: 0, y: 0 };
let spieler1;
let items;
let item;
let item1;
let item2;
let collide = false;
let inventar = [];
let aktivesItem;
let eKey;
let fKey;
let initialSpeed = true;
let moebel;
let sceneList = [];
let missedItemsErsteEtage = [];
let gameover = false;
let abstandsZaehler = 0;

//level
let schluessel;

//level 1 Flur
let leveltuer;
let wand;
let flurtuer;
let schlafzimmertuer;
let schlafzimmertuer1;
let wctuer;
let arbeitstuer;


let itemGroupArray = [];
let lebenGroup;
let abstandsStartwertXLeben = 73;

//Interface
let userInterface;
let inventarGroup;


let heartbeatsound = false;
//Sounds 
let heartbeat;
let creakydoor;
let collect;



class Preload extends Phaser.Scene {
    constructor() {
        super("Preload");
    }

    preload() {
        this.load.spritesheet("spieler", "/assets/images/Spieler.png", {
            frameWidth: 48,
            frameHeight: 48,
        });
        this.load.spritesheet("monster", "/assets/images/monster.png", {
            frameWidth: 45,
            frameHeight: 50,
        });

        this.load.spritesheet("leveltuer", "/assets/images/tuerlevel.png", {
            frameWidth: 20,
            frameHeight: 78,
        });

        this.load.image("schlafzimmerboden", "/assets/images/schlafzimmer_boden.png");
        this.load.image("blackbar", "/assets/images/blackbars.png");
        this.load.image("cola", "/assets/images/cola.png");
        this.load.image("essen", "/assets/images/Apfel.png"); //apfel
        this.load.image("herz", "/assets/images/herz.png");
        this.load.image("schluessel", "/assets/images/schluessel.png");
        this.load.image("box", "/assets/images/Playerbox.png");
        this.load.image("itembox", "/assets/images/itembox.png");
        this.load.image("bett", "/assets/images/bett.png");
        this.load.image("teppich", "/assets/images/teppich.png");
        this.load.image("schrank", "/assets/images/schrank.png");
        this.load.image("tuer", "/assets/images/tur.png");
        this.load.image("flurboden", "/assets/images/flurboden.png");
        this.load.image("wandgrau", "/assets/images/wandgrau.png");
        this.load.image("wandtreppe", "/assets/images/wandtreppe.png");
        this.load.image("gameover", "/assets/images/gameover.png");
        this.load.image("blackbarflur", "/assets/images/blackbarflur.png");
        this.load.image("tuerfront", "/assets/images/tuerfront.png");
        this.load.image("badezimmerboden", "/assets/images/Badezimmerboden.png");
        this.load.image("tuerWC", "/assets/images/tuerWC.png");
        this.load.image("tuerwork", "/assets/images/tuerwork.png");
        this.load.image("blackbarH", "/assets/images/BlackbarHorizontal.png")
        this.load.image("tuerschlafzimmer", "/assets/images/tuerschlafzimmer.png")
        this.load.image("herrenzimmer", "/assets/images/Kuche.png")

        //Load audio files
        this.load.audio('heartbeat', '/assets/audio/heartbeat.mp3');
        this.load.audio('creakydoor', '/assets/audio/creakydoor.mp3');
        this.load.audio('collect', '/assets/audio/collect.mp3');
    }

    create() {
        this.scene.switch("Homescreen");
    }
}