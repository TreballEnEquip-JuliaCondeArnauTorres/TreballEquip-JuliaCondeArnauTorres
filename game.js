//config basica de Phaser
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#4ce1fe',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// iniciar joc amb la config
const game = new Phaser.Game(config);

function preload() {
    
}

function create() {

    this.add.text(250, 280, 'Phaser funciona', { 
        fontSize: '32px', 
        fill: '#ca0fca',
        fontFamily: 'Arial'
    });
}

function update() {

}