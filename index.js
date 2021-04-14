var config = {
    type: Phaser.AUTO,
    width: 300,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: { y: 650 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
var game = new Phaser.Game(config);
function preload() {

    //  You can fill the preloader with as many assets as your game requires

    //  Here we are loading an image. The first parameter is the unique
    //  string by which we'll identify the image later in our code.

    //  The second parameter is the URL of the image (relative)
    this.load.spritesheet('flyer', 'assets/birdsheets.png', {
        frameWidth: 34,
        frameHeight: 24
    });
    baseTexture = this.load.image('base', 'assets/base.png');
    this.load.image('pipe', 'assets/pipe-green.png');

}
var baseTexture;
var bird;
var base;
var pipes;
function create() {
    const ref = this;
    // menambah sprite pada canvas dengan physics
    base = this.physics.add.sprite(null, null, 'base');
    base.depth = 5
    bird = this.physics.add.sprite(this.cameras.main.width / 4, this.cameras.main.height / 2 - base.height, 'flyer');
    this.anims.create({
        key: 'clap',
        frames: this.anims.generateFrameNumbers('flyer', { start: 0, end: 2 }),
        frameRate: 10,
        repeat: -1
    });

    this.pipes = this.physics.add.group({
        key: 'pipe',
        repeat: 3,
        setXY: {
            x: ref.cameras.main.width / 2,
            y: ref.cameras.main.height,
            stepX: ref.cameras.main.width / 2
        }
    })
    this.pipes.children.iterate(function (child) {
        child.body.allowGravity = false
        child.setImmovable(true)
        child.setVelocityX(-50)
        return child
        //child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });

    bird.body.width = bird.width / 1.5
    bird.body.offset.x = (bird.width - bird.body.width) / 2
    bird.body.allowGravity = false
    //bird.body.offset.y = bird.height/2
    //this.add.sprite(x,y,keyImage) menambah
    base.setPosition(base.width / 2, this.cameras.main.height - base.height / 2)
    base.setImmovable(true)
    base.body.allowGravity = false
    bird.setCollideWorldBounds(true)

    this.physics.add.collider(bird, base)
    cursors = this.input.keyboard.createCursorKeys();

    bird.anims.play('clap')
}
var spacePressed = false;
function update() {
    // nothing required here
    if (cursors.space.isDown && !spacePressed) {
        this.pipes.clear(true)

        spacePressed = true
        bird.setVelocityY(-350)
        bird.body.allowGravity = true
        //pipes.delete(100,200,'pipe')
        //console.log(pipes.children)

    }

    if (spacePressed && cursors.space.isUp) {
        spacePressed = false

    }
}


    </script >