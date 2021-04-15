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
    this.load.image('bg', 'assets/background-day.png');
    this.load.image("ready",'assets/message.png');

}
var baseTexture;
var bird;
var base;
var pipes;
var isStart = false;
var startOnce = false;
const distanceBetweenPipes = 200
const distanceBetweenTopAndBottom = 140
const velocityPipes = -75
const jumpBirdVelocity = -300
var readyMsg;
function create() {
    const ref = this;
    // menambah sprite pada canvas dengan physics
    base = this.physics.add.sprite(null, null, 'base');
    base.depth = 5
    bird = this.physics.add.sprite(this.cameras.main.width / 4, this.cameras.main.height / 2, 'flyer');
    this.anims.create({
        key: 'clap',
        frames: this.anims.generateFrameNumbers('flyer', { start: 0, end: 2 }),
        frameRate: 10,
        repeat: -1
    });
    this.pipeTop = this.physics.add.group();
    this.pipeBottom = this.physics.add.group();


    // this.pipes.children.iterate(function (child) {
    //     child.body.allowGravity = false
    //     child.setImmovable(true)
    //     child.setVelocityX(-50)
    //     return child
    //     //child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    // });

    bird.body.width = bird.width / 1.5
    bird.body.offset.x = (bird.width - bird.body.width) / 2
    bird.body.allowGravity = false
    
    base.setPosition(base.width / 2, this.cameras.main.height - base.height / 2)
    base.setImmovable(true)
    base.body.allowGravity = false
    bird.setCollideWorldBounds(true)

    this.physics.add.collider(bird, base)
    cursors = this.input.keyboard.createCursorKeys();
    var temp = this.add.sprite(this.cameras.main.width/2,this.cameras.main.height/2,'bg');
    console.log(this)
    temp.displayWidth = this.cameras.main.width
    temp.displayHeight = this.cameras.main.height
    temp.depth = -1
    bird.anims.play('clap')

    readyMsg = this.add.sprite(this.cameras.main.width/2,this.cameras.main.height/2 - base.height + 50,"ready");

}
var spacePressed = false;
function update() {
    // nothing required here
    if (cursors.space.isDown && !spacePressed) {
        // this.pipes.clear(true)
        console.log(this.pipes)
        spacePressed = true
        bird.setVelocityY(jumpBirdVelocity)
        bird.body.allowGravity = true
        isStart = true;

    }

    if (spacePressed && cursors.space.isUp) {
        spacePressed = false

    }
    if (isStart) {
        if (!startOnce) {
            readyMsg.setAlpha(0);
            console.log(readyMsg)
            startOnce = true;
            for (let i = 0; i < 4; i++) {
                var tempTop = this.pipeTop.create(
                    this.cameras.main.width + 50 + distanceBetweenPipes * i,
                    Math.floor(Math.random() * 100) + 0,
                    'pipe'
                );
                var tempBot = this.pipeBottom.create(
                    this.cameras.main.width + 50 + distanceBetweenPipes * i,
                    tempTop.y+tempTop.height+distanceBetweenTopAndBottom,
                    'pipe'
                );
                tempTop.body.allowGravity = false;
                tempTop.angle = 180
                tempTop.setImmovable(true)
                tempTop.setVelocityX(velocityPipes)

                tempBot.body.allowGravity = false;
                tempBot.setImmovable(true)
                tempBot.setVelocityX(velocityPipes)
                // this.physics.add.collider(bird,temp);
                this.physics.add.overlap(bird,tempBot,crash);
                this.physics.add.overlap(bird,tempTop,crash);
            }
        }

        if (this.pipeTop.children.entries[0].x <= -50) {
            this.pipeTop.children.entries[0].destroy();
            this.pipeBottom.children.entries[0].destroy();
            var lastChild = this.pipeTop.children.entries[this.pipeTop.children.entries.length - 1];
            var y = Math.floor(Math.random() * 100) + 0;
            var tempTop = this.pipeTop.create(lastChild.x + distanceBetweenPipes, y, 'pipe')
            var tempBot = this.pipeBottom.create(lastChild.x + distanceBetweenPipes, y + tempTop.height + distanceBetweenTopAndBottom, 'pipe')
            tempTop.body.allowGravity = false;
            tempTop.angle = 180
            tempTop.setVelocityX(velocityPipes)

            tempBot.body.allowGravity = false;
            tempBot.setVelocityX(velocityPipes)
        }
    }
}

function crash(){
    console.log("game over!")
}