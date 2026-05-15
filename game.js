//escena menu
class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
       this.load.image('fonsMenu', 'foto_menu.jpg');
       this.load.audio('soMenu', 'musica_menu.mp3');

    }

    create() {
        let fons = this.add.image(640, 360, 'fonsMenu');
        fons.setDisplaySize(1280, 720);
        this.cameras.main.setBackgroundColor('#a8d5e2');

        let musicaFons = this.sound.add('soMenu', { loop: true, volume: 0.5 });
        musicaFons.play();

        //estil cartoon
        this.add.text(640, 210, 'PARENTAL DUTIES\nRITME!', { 
            fontSize: '110px', 
            fill: '#ff4d4d',
            fontFamily: '"Bangers", cursive', 
            stroke: '#000000',
            strokeThickness: 12,
            align: 'center',
            shadow: { offsetX: 6, offsetY: 6, color: '#000000', fill: true },
            padding: { right: 20, bottom: 20, left: 20, top: 20 } 
            
        }).setOrigin(0.5);

        //boto jugar
        let botoJugar = this.add.text(640, 500, '✚ SALVAR EL NADÓ', { 
            fontSize: '45px', 
            fill: '#ffffff',
            fontFamily: '"Bangers", cursive',
            backgroundColor: '#4CAF50',
            padding: { x: 25, y: 15 },
            stroke: '#000000',
            strokeThickness: 4
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

        //efecte hover
        botoJugar.on('pointerover', () => botoJugar.setScale(1.1));
        botoJugar.on('pointerout', () => botoJugar.setScale(1));

        //on click, iniciar el joc
        botoJugar.on('pointerdown', () => {
            musicaFons.stop();
            this.scene.start('JocScene');
        });
    }
}

//escena joc
class JocScene extends Phaser.Scene {
    constructor() {
        super({ key: 'JocScene' });
    }

    preload() {
        
    }

    create() {
        this.add.text(640, 300, 'Partida', { fontSize: '32px', fill: '#00ff00' }).setOrigin(0.5);
        
        this.add.text(640, 500, 'ESC per tornar al menú', { fontSize: '16px', fill: '#ffffff' }).setOrigin(0.5);

        //tornar al menu amb ESC
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start('MenuScene');
        });
    }

    update() {
        
    }
}

//config basica de Phaser
const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    backgroundColor: '#000000',
    scene: [MenuScene, JocScene] 
};

//iniciar el joc amb la config
const game = new Phaser.Game(config);