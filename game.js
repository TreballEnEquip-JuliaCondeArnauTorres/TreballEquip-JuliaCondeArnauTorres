
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
        this.load.audio('soJoc', 'musica_joc.mp3');
    }

    create() {
        this.cameras.main.setBackgroundColor('#2b4141');
        
        //musica de fons
        this.jocActiu = true;

        this.musicaFons = this.sound.add('soJoc', { loop: false, volume: 0.5 });
        this.musicaFons.play();

        this.musicaFons.on('complete', () => {
            this.finalitzarJoc();
        });
        
        //dibuixar els carrils
        this.posicionsX = [415, 565, 715, 865];
        const tecles = ['D', 'F', 'J', 'K'];

        this.posicionsX.forEach((posX, i) => {
            this.add.rectangle(posX, 360, 100, 720, 0xffffff, 0.1);
            this.add.circle(posX, 600, 40, 0x000000, 0.5).setStrokeStyle(4, 0xffffff);
            
            this.add.text(posX, 670, tecles[i],{
                fontSize: '40px', 
                fontFamily: '"Bangers", cursive', 
                fill: '#fff',
                padding: { left: 10, right: 10, top: 10, bottom: 10 }
            }).setOrigin(0.5).setDepth(10);

            //detectar premer tecla
            this.input.keyboard.on(`keydown-${tecles[i]}`, () => {
                this.comprovarInputNota(i); 
            });

            //detectar soltar tecla
            this.input.keyboard.on(`keyup-${tecles[i]}`, () => {
                this.alliberarInputNota(i); 
            });
        });

        this.add.text(640, 50, 'OPERACIÓ', { 
            fontSize: '50px', 
            fontFamily: '"Bangers", cursive', 
            fill: '#ff4d4d',
            stroke: '#000000',
            strokeThickness: 6,
            padding: {left: 10, right: 10, top: 20, bottom:10 }
        }).setOrigin(0.5);

         this.puntuacio = 0;
         this.comboActual = 0;
         this.comboMaxim = 0;
         this.multiplicador = 1;
         this.textPuntuacio = this.add.text(1100, 50, 'PUNTS: 0', { 
            fontSize: '40px', 
            fontFamily: '"Bangers", cursive', 
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 5,
            padding: {left: 10, right: 10, top: 10, bottom:10 }
        }).setOrigin(0.5);

        this.textCombo = this.add.text(1100, 150, '', {
            fontSize: '55px', fontFamily: '"Bangers", cursive', fill: '#ffffff',
            stroke: '#000000', strokeThickness: 6, align: 'center',
            padding: {left: 10, right: 10, top: 10, bottom:10 }
        }).setOrigin(0.5).setVisible(false);

        this.add.text(20, 20, 'ESC per tornar al menú', { 
            fontSize: '24px',
            fontFamily: '"Bangers", cursive', 
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
            padding: { left: 5, right: 10, top: 5, bottom: 5 }
        });
        //tornar al menu amb ESC
        this.input.keyboard.on('keydown-ESC', () => {
            this.musicaFons.stop();
            this.scene.start('MenuScene');
        });

        this.add.text(20, 55, 'P per pausar el joc', { 
            fontSize: '24px',
            fontFamily: '"Bangers", cursive', 
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
            padding: { left: 5, right: 10, top: 5, bottom: 5 }
        });
        //pausar el joc amb P
        this.input.keyboard.on('keydown-P', () => {
            this.musicaFons.pause();
            this.scene.pause(); //congelar escena
            this.scene.launch('PausaScene'); //obrir escena pausa
        });

        this.events.on('resume', () => {
            this.musicaFons.resume();
        });

        this.notes = []; //llista per guardar notes
            
        this.programarSeguentNota();

    }

    crearNota(){

        if (!this.jocActiu) return;
        let carrilAleatori = Phaser.Math.Between(0, 3);

        //20% probabilitat nota llarga
        let esLlarga = Phaser.Math.Between(1, 10) > 8; 
        let alcada = esLlarga ? 250 : 50;
        let color = esLlarga ? 0x00ffff : 0x00ff00;
        
        let novaNota = this.add.rectangle(this.posicionsX[carrilAleatori], -150, 50, alcada, color);
        novaNota.carrilId = carrilAleatori;
        novaNota.esLlarga = esLlarga;
        novaNota.mantinguda = false;
        
        //afegir nova nota a la llista
        this.notes.push(novaNota);
    }
    
    comprovarInputNota(carril){
    
        let encert = false;

        for (let i = this.notes.length - 1; i >= 0; i--) {
            let nota = this.notes[i];
            
            let partBaixa = nota.y + (nota.height / 2);

            if (nota.carrilId === carril && partBaixa > 550 && partBaixa < 650) { 
                encert = true;
                this.comboActual++;
                if (this.comboActual > this.comboMaxim) {
                this.comboMaxim = this.comboActual;
                }
                this.actualitzarMultiplicador();

                if (nota.esLlarga) {

                    nota.mantinguda = true;
                    nota.fillColor = 0xffffff; 
                    this.puntuacio += 5*this.multiplicador;
                    this.textPuntuacio.setText(`PUNTS: ${this.puntuacio}`);
                } else {

                    this.puntuacio += 10*this.multiplicador;
                    this.textPuntuacio.setText(`PUNTS: ${this.puntuacio}`);
                    this.canviarColorPantalla('#4CAF50'); 
                    nota.destroy();
                    this.notes.splice(i, 1);
                }
                this.actualitzarInterficie();
                break;
            }
        }
        //si no encerta
        if (!encert) {
            console.log("FALLADA!");
            this.canviarColorPantalla('#ff4d4d');
            this.trencarCombo(); 
        }
    }

    actualitzarMultiplicador() {
        if (this.comboActual >= 30) {
            this.multiplicador = 4;
            this.textCombo.setColor('#ff0000');
        }
        else if (this.comboActual >= 20){
            this.multiplicador = 3;
            this.textCombo.setColor('#ff7300');
        } 
        else if (this.comboActual >= 10) {
            this.multiplicador = 2;
            this.textCombo.setColor('#fff000');
        }
        else{
            this.multiplicador = 1;
            this.textCombo.setColor('#ffffff');
        }
    }

    trencarCombo() {
        this.comboActual = 0;
        this.multiplicador = 1;
        this.textCombo.setColor('#ffffff')
        this.canviarColorPantalla('#ff4d4d'); 
        this.actualitzarInterficie();
    }

    actualitzarInterficie() {
        this.textPuntuacio.setText(`PUNTS: ${this.puntuacio}`);
        if (this.comboActual >= 3) {
            this.textCombo.setText(`${this.comboActual} COMBO\nx${this.multiplicador}`);
            this.textCombo.setVisible(true);
        } else {
            this.textCombo.setVisible(false);
        }
    }
    alliberarInputNota(carril) {

        for (let i = this.notes.length - 1; i >= 0; i--) {
            let nota = this.notes[i];
            
            if (nota.carrilId === carril && nota.mantinguda) {

                let partDalt = nota.y - (nota.height / 2);
                
                //si passa pel cercle
                if (partDalt > 500 && partDalt < 700) {
                    this.puntuacio += 20; 
                    this.textPuntuacio.setText(`PUNTS: ${this.puntuacio}`);
                    this.canviarColorPantalla('#4CAF50');
                } else {
                    this.canviarColorPantalla('#ff4d4d');
                }
                
                nota.destroy();
                this.notes.splice(i, 1);
                break;
            }
        }
    }
   
    canviarColorPantalla(color) {
        this.cameras.main.setBackgroundColor(color);
        this.time.delayedCall(100, () => {
            this.cameras.main.setBackgroundColor('#2b4141');
        });
    }

    programarSeguentNota() {
        //si la canco s'ha acabat
        if (!this.jocActiu) return;

        //temps aleatori
        let tempsAleatori = Phaser.Math.Between(600, 1500); 
        
        this.time.delayedCall(tempsAleatori, () => {
            this.crearNota();
            this.programarSeguentNota(); //bucle infinit aleatori
        });
    }
    
    finalitzarJoc() {
        this.jocActiu = false;

        //esborrar les notes que queden per pantalla
        for (let i = 0; i < this.notes.length; i++) {
            this.notes[i].destroy();
        }
        this.notes = [];

        this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.8).setDepth(20);

        let puntsPerGuanyar = 700;
        let hasGuanyat = this.puntuacio >= puntsPerGuanyar;
        
        let missatge = hasGuanyat ? 'OPERACIÓ COMPLETADA!' : 'OPERACIÓ FALLIDA...';
        let colorMissatge = hasGuanyat ? '#4CAF50' : '#ff4d4d';

        //victoria o derrota
        this.add.text(640, 200, missatge, { 
            fontSize: '80px', 
            fontFamily: '"Bangers", cursive', 
            fill: colorMissatge,
            stroke: '#000000',
            strokeThickness: 8,
            padding: { x: 20, y: 20 }
        }).setOrigin(0.5).setDepth(21);

        //puntuacio final
        this.add.text(640, 350, `PUNTUACIÓ FINAL: ${this.puntuacio}`, { 
            fontSize: '60px', 
            fontFamily: '"Bangers", cursive', 
            fill: '#ffffff',
            padding: { x: 20, y: 20 }
        }).setOrigin(0.5).setDepth(21);

        //combo maxim
        this.add.text(640, 450, `COMBO MÀXIM: ${this.comboMaxim} NOTES SEGUIDES!`, { 
            fontSize: '40px', 
            fontFamily: '"Bangers", cursive', 
            fill: '#f1c40f',
            stroke: '#000000',
            strokeThickness: 5,
            padding: { x: 20, y: 20 }
        }).setOrigin(0.5).setDepth(21);

        this.add.text(640, 550, 'Prem ESC per tornar al menú', { 
            fontSize: '30px', 
            fontFamily: '"Bangers", cursive', 
            fill: '#ff4d4d',
            padding: { x: 10, y: 10 }
        }).setOrigin(0.5).setDepth(21);

    }

    update() {

        if (!this.jocActiu) return;

        for (let i = this.notes.length - 1; i >= 0; i--) {
            let nota = this.notes[i];
            nota.y += 5; // velocitat de caiguda

            //calcular la part de dalt de la nota
            let partDalt = nota.y - (nota.height / 2);

            if (partDalt > 750) {
                if (!nota.mantinguda) {
                    this.canviarColorPantalla('#ff4d4d');
                }
                nota.destroy();
                this.notes.splice(i, 1);
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
        let titolPausa = this.add.text(640, 250, 'PAUSA', { 
            fontSize: '80px', 
            fontFamily: '"Bangers", cursive', 
            fill: '#4ce1fe',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5);

        //text instruccions
        let textInstruccions = this.add.text(640, 450, 'Prem la tecla "P" per reprendre la operació', { 
            fontSize: '30px', 
            fontFamily: '"Bangers", cursive', 
            fill: '#ffffff' 
        }).setOrigin(0.5);

        let reprenent = false;

        //P per reprendre el joc
        this.input.keyboard.on('keydown-P', () => {
            if(reprenent) return; //ignorar la tecla si ja esta reprenent
            reprenent = true;
            
            titolPausa.setVisible(false);
            textInstruccions.setVisible(false);
            
            let comptador = 3;

            let textComptador = this.add.text(640, 360, comptador.toString(), {
                fontSize: '150px',
                fontFamily: '"Bangers", cursive',
                fill: '#ff4d4d',
                stroke: '#000000',
                strokeThickness: 10,
                padding: { x: 20, y: 20 }
            }).setOrigin(0.5);

            //temporitzador
            this.time.addEvent({
                delay: 1000, 
                repeat: 2, //executar 3 vegades
                callback: () => {
                    comptador--;
                    if (comptador > 0) {
                        textComptador.setText(comptador.toString());
                    } else {
                        //quan arriba a 0
                        this.scene.stop(); //tancar el menú de pausa
                        this.scene.resume('JocScene'); //descongelar el joc de fons
                    }
                }
            });
        });
    }
};

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