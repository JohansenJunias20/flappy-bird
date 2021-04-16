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
    this.load.image("ready", 'assets/message.png');


    this.load.image('number0', 'assets/0.png')
    this.load.image('number1', 'assets/1.png')
    this.load.image('number2', 'assets/2.png')
    this.load.image('number3', 'assets/3.png')
    this.load.image('number4', 'assets/4.png')
    this.load.image('number5', 'assets/5.png')
    this.load.image('number6', 'assets/6.png')
    this.load.image('number7', 'assets/7.png')
    this.load.image('number8', 'assets/8.png')
    this.load.image('number9', 'assets/9.png')
    this.load.image('gameover', 'assets/gameover.png')
    this.load.image('scoreboard', 'assets/score_board.png')

}
var baseTexture;
var bird;
const birdPosition = {
    x: undefined,
    y: undefined
}
var base;
var pipes;
var isStart = false;
var startOnce = false;
const distanceBetweenPipes = 200
const distanceBetweenTopAndBottom = 140
const velocityPipes = -75
const jumpBirdVelocity = -300;
var scores = 0;
var readyMsg;
var cetakScore = false;
var scoreSprite = []
var best = 0;
function create() {
    birdPosition.x = this.cameras.main.width / 4;
    birdPosition.y = this.cameras.main.height / 2;
    const ref = this;
    // menambah sprite pada canvas dengan physics
    base = this.physics.add.sprite(null, null, 'base');
    base.depth = 5
    bird = this.physics.add.sprite(birdPosition.x, birdPosition.y, 'flyer');
    this.anims.create({
        key: 'clap',
        frames: this.anims.generateFrameNumbers('flyer', { start: 0, end: 2 }),
        frameRate: 10,
        repeat: -1
    });
    this.pipeTop = this.physics.add.group();
    this.pipeBottom = this.physics.add.group();



    bird.body.width = bird.width / 1.5
    bird.body.offset.x = (bird.width - bird.body.width) / 2
    bird.body.allowGravity = false

    base.setPosition(base.width / 2, this.cameras.main.height - base.height / 2)
    base.setImmovable(true)
    base.body.allowGravity = false
    bird.setCollideWorldBounds(true)

    this.physics.add.collider(bird, base)
    cursors = this.input.keyboard.createCursorKeys();
    mouse = this.input.activePointer;
    var temp = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'bg');
    console.log(this)
    temp.displayWidth = this.cameras.main.width
    temp.displayHeight = this.cameras.main.height
    temp.depth = -1
    bird.anims.play('clap')

    readyMsg = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2 - base.height + 50, "ready");
    scoreSprite.push(this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 4, "number0"));
    scoreSprite.push(this.add.sprite(this.cameras.main.width / 2 + scoreSprite[0].width, this.cameras.main.height / 4, "number0"));
    scoreSprite.push(this.add.sprite(this.cameras.main.width / 2 + scoreSprite[0].width * 2, this.cameras.main.height / 4, "number0"));
    scoreSprite = scoreSprite.map(el => {
        el.depth = 10;
        el.setAlpha(0);
        return el;
    })

    bestSprite.push(this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 4, "number0"));
    bestSprite.push(this.add.sprite(this.cameras.main.width / 2 + bestSprite[0].width, this.cameras.main.height / 4, "number0"));
    bestSprite.push(this.add.sprite(this.cameras.main.width / 2 + bestSprite[0].width * 2, this.cameras.main.height / 4, "number0"));
    bestSprite = bestSprite.map(el => {
        el.depth = 10;
        el.setAlpha(0);
        return el;
    })

    this.gameover = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 4, 'gameover');
    this.gameover.setAlpha(0);
    this.gameover.depth = 30;
    this.scoreboard = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2, 'scoreboard');
    // this.scoreboard.displayWidth = this.cameras.main.width/2 - 10;
    // this.scoreboard.displayWidth = this.cameras.main.width/2 - 10;
    this.scoreboard.setScale(0.4);
    this.scoreboard.setAlpha(0);
    this.scoreboard.depth = 30;

}
var mouse;
var isCrash = false;
var spacePressed = false;
var stillPlay = true;

function destroyPipes(ref){
    console.log("destroying pipes");
    console.log(game.pipeTop)
    ref.pipeTop.clear();
    ref.pipeBottom.clear();
}

function generatePipes(){
    
}

function update() {
    // nothing required here
    if (cursors.space.isDown && !spacePressed && stillPlay) {
        // this.pipes.clear(true)
        console.log(this.pipes)
        spacePressed = true
        bird.setVelocityY(jumpBirdVelocity)
        bird.body.allowGravity = true
        isStart = true;

    }

    if (spacePressed && cursors.space.isUp && stillPlay) {
        spacePressed = false

    }
    if(!stillPlay){
        if(mouse.leftButtonDown()){
            isStart = true;
            destroyPipes(this);
            stillPlay = true;
            bird.setPosition(birdPosition.x,birdPosition.y);
            bird.anims.play('clap');
            bird.allowGravity = false;
            this.scoreboard.setAlpha(0);
            var arrScore = scores.toString().split('');
            scoreSprite = scoreSprite.map(el => {
                el.setAlpha(0);
                return el;
            })
            const ref = this;   
            arrScore.forEach((arr, i) => {
                scoreSprite[i].setAlpha(1)
                scoreSprite[i].depth = 51
                scoreSprite[i].setTexture(`number${arr}`);
                scoreSprite[i].setPosition(ref.cameras.main.width / 3.2, this.cameras.main.height / 2);
            })
        }
    }
    if (isStart) {
        if (!startOnce) {
            scoreSprite[0].setAlpha(1)
            readyMsg.setAlpha(0);
            console.log("pipes:")
            console.log(this.pipeTop)
            startOnce = true;
            for (let i = 0; i < 4; i++) {
                var tempTop = this.pipeTop.create(
                    this.cameras.main.width + 50 + distanceBetweenPipes * i,
                    Math.floor(Math.random() * 100) + 0,
                    'pipe'
                );
                var tempBot = this.pipeBottom.create(
                    this.cameras.main.width + 50 + distanceBetweenPipes * i,
                    tempTop.y + tempTop.height + distanceBetweenTopAndBottom,
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
                this.physics.add.overlap(bird, tempBot, crash.bind(this));
                this.physics.add.overlap(bird, tempTop, crash.bind(this));

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
            this.physics.add.overlap(bird, tempBot, crash.bind(this));
            this.physics.add.overlap(bird, tempTop, crash.bind(this));
            cetakScore = false;
        }
        this.pipeTop.children.entries.forEach(element => {
            if (bird.x >= element.x) {
                if (!cetakScore) {
                    console.log("add scores!");
                    scores++;
                    console.log(scores.toString().split(''))
                    var arrScore = scores.toString().split('');
                    scoreSprite = scoreSprite.map(el => {
                        el.setAlpha(0);
                        return el;
                    })
                    var originPos = {
                        x: this.cameras.main.width / 2,
                        y: this.cameras.main.height / 4
                    }
                    var tw = scoreSprite[0].width * arrScore.length;
                    var startpos = originPos.x - tw / 2 + scoreSprite[0].width / 2;
                    console.log(scoreSprite)
                    arrScore.forEach((arr, i) => {
                        scoreSprite[i].setAlpha(1)
                        scoreSprite[i].setTexture(`number${arr}`);
                        scoreSprite[i].setPosition(startpos, this.cameras.main.height / 4);
                        startpos += scoreSprite[0].width;
                    })
                    cetakScore = true;
                }
            }
        });
    }
}

var bestSprite = []
function crash(bird, pipe) {
    stillPlay = false;
    bird.setGravityY(800);
    stopPipes(this.pipeTop, this.pipeBottom)
    this.gameover.setAlpha(1);
    scoreSprite.forEach(child => {
        child.setAlpha(0)
    })
    bird.anims.stop();
    this.scoreboard.setAlpha(1);
    if (best <= scores) {
        best = scores;
        var arrScore = best.toString().split('');
        bestSprite = bestSprite.map(el => {
            el.setAlpha(0);

            return el;
        })
        const ref = this;
        arrScore.forEach((arr, i) => {
            bestSprite[i].setAlpha(1)
            bestSprite[i].depth = 51
            bestSprite[i].setTexture(`number${arr}`);
            bestSprite[i].setPosition(ref.cameras.main.width * 0.7, ref.cameras.main.height / 2);
        })

    }
    var arrScore = scores.toString().split('');
    scoreSprite = scoreSprite.map(el => {
        el.setAlpha(0);
        return el;
    })
    const ref = this;
    arrScore.forEach((arr, i) => {
        scoreSprite[i].setAlpha(1)
        scoreSprite[i].depth = 51
        scoreSprite[i].setTexture(`number${arr}`);
        scoreSprite[i].setPosition(ref.cameras.main.width / 3.2, this.cameras.main.height / 2);
    })
    startOnce = false;
    // isCrash = true;
    // bird.body.allowGravity = false;
    // bird.setPosition(birdPosition.x,birdPosition.y);
    // scores=0;
    // isStart = false;
    // startOnce = false;
    // console.log(this.pipeTop)
    // this.pipeTop.destroy();
    // this.pipeBottom.destroy();
}

function stopPipes(pipeTop, pipeBottom) {
    pipeTop.children.iterate(child => {
        child.setVelocityX(0)
        return child;
    })
    pipeBottom.children.iterate(child => {
        child.setVelocityX(0)
        return child;
    })
}