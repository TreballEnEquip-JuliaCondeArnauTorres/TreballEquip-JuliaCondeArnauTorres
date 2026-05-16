
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
        this.cameras.main.setBackgroundColor('#2b4141');
        
        //dibuixar els carrils
        this.posicionsX = [415, 565, 715, 865];

        this.posicionsX.forEach(posX => {
            this.add.rectangle(posX, 360, 100, 720, 0xffffff, 0.1);
            this.add.circle(posX, 600, 40, 0x000000, 0.5).setStrokeStyle(4, 0xffffff);
        });

        this.add.text(640, 50, 'OPERACIÓ', { 
            fontSize: '50px', 
            fontFamily: '"Bangers", cursive', 
            fill: '#ff4d4d',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        const tecles = ['D', 'F', 'J', 'K'];
        for (let i = 0; i < 4; i++) {
            this.add.text(this.posicionsX[i], 670, tecles[i], { 
                fontSize: '40px', 
                fontFamily: '"Bangers", cursive', 
                fill: '#fff',
                padding: {left: 10, right: 10, top: 10, bottom:10 }
            }).setOrigin(0.5);
        }

         this.puntuacio = 0;
         this.textPuntuacio = this.add.text(1100, 50, 'PUNTS: 0', { 
            fontSize: '40px', 
            fontFamily: '"Bangers", cursive', 
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 5
        }).setOrigin(0.5);

        this.add.text(20, 20, 'ESC per tornar al menú', { fontSize: '16px', fill: '#ffffff' });
        //tornar al menu amb ESC
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start('MenuScene');
        });

        //pausar el joc amb P
        this.input.keyboard.on('keydown-P', () => {
            this.scene.pause(); //congelar escena
            this.scene.launch('PausaScene'); //obrir escena pausa
        });
            //nota provisional
            this.notaProvisional = this.add.rectangle(this.posicionsX[0], 0, 50, 50, 0x00ff00);
            //detectar input D
            this.input.keyboard.on('keydown-D', () => {
            //comprovar que la nota esta a la zona
            if (this.notaProvisional && this.notaProvisional.y > 550 && this.notaProvisional.y < 650) { 
                console.log("PERFECTE!");
                
                this.cameras.main.setBackgroundColor('#4CAF50');
                setTimeout(() => {
                    this.cameras.main.setBackgroundColor('#2b4141');
                }, 100);

                //reiniciar nota
                this.notaProvisional.y = 0;
            } else {
                //fallada
                console.log("FALLADA!");

                this.cameras.main.setBackgroundColor('#ff4d4d');
                setTimeout(() => {
                    this.cameras.main.setBackgroundColor('#2b4141');
                }, 100);
            }
        });
    }

    update() {
        if (this.notaProvisional) {
            this.notaProvisional.y += 5; //velocitat de caiguda
            if (this.notaProvisional.y > 750) {
                this.notaProvisional.y = 0;
            }
        }
    }
}

//escena pausa
class PausaScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PausaScene' });
    }

    create() {
        this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.8);

        //text de pausa
        this.add.text(640, 250, 'PAUSA', { 
            fontSize: '80px', 
            fontFamily: '"Bangers", cursive', 
            fill: '#4ce1fe',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5);

        //text instruccions
        this.add.text(640, 450, 'Prem la tecla "P" per reprendre la operació', { 
            fontSize: '30px', 
            fontFamily: '"Bangers", cursive', 
            fill: '#ffffff' 
        }).setOrigin(0.5);

        //P per reprendre el joc
        this.input.keyboard.on('keydown-P', () => {
            this.scene.stop(); //tancar el menú de pausa
            this.scene.resume('JocScene'); //descongelar el joc de fons
        });
    }
}

//config basica de Phaser
const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    backgroundColor: '#000000',
    scene: [MenuScene, JocScene, PausaScene] 
};

//iniciar el joc amb la config
const game = new Phaser.Game(config);