const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

const gravity = 0.7
const maxVelocity = 5

c.fillRect(0, 0, canvas.width, canvas.height);

class Sprite{
    constructor({position, velocity, color = 'red'}){
         this.position = position,
         this.velocity = velocity,
         this.height = 150,
         this.width = 50,
         this.lastKey,
         this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            width: 150,
            height: 50
        },
        this.color = color,
        this.isAttacking = false;
    }

    draw(){
        // character
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, this.width, this.height);

        // attack box
        if (this.isAttacking){
            c.fillStyle = 'green'
            c.fillRect(
                this.attackBox.position.x, 
                this.attackBox.position.y, 
                this.attackBox.width, 
                this.attackBox.height
            );
        };
    };

    update(){
        this.draw();
        this.attackBox.position.x = this.position.x;
        this.attackBox.position.y = this.position.y;
        if ((this.position.y + this.height + this.velocity.y) >= canvas.height){
            this.position.y = (canvas.height - this.height)
            this.velocity.y = 0
        }else{
            this.position.y += this.velocity.y
            this.velocity.y += gravity
        };
        if ((this.position.x + this.width + this.velocity.x) >= canvas.width){
            this.position.x = (canvas.width - this.width);
            this.velocity.x = 0;
        }else if ((this.position.x + this.velocity.x) <= 0){
            this.position.x = 0;
            this.velocity.x = 0;
        }else{
            this.position.x += this.velocity.x
        };
    };

    attack(){
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 100);
    }
}

const player = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    }
})

const enemy = new Sprite({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue'
})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    }
}

function animate(){
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();

    // player movement
    if ((keys.a.pressed) && (player.lastKey == 'a')){
        if (player.velocity.x > (maxVelocity * -1)){
            player.velocity.x += -1;
        }
    }else if ((keys.d.pressed) && (player.lastKey == 'd')){
        if (player.velocity.x < maxVelocity){
            player.velocity.x += 1
        }
    }else{
        player.velocity.x = 0;
    };

    // enemy movement
    if ((keys.ArrowLeft.pressed) && (enemy.lastKey == 'ArrowLeft')){
        if (enemy.velocity.x > (maxVelocity * -1)){
            enemy.velocity.x += -1;
        }
    }else if ((keys.ArrowRight.pressed) && (enemy.lastKey == 'ArrowRight')){
        if (enemy.velocity.x < maxVelocity){
            enemy.velocity.x += 1
        }
    }else{
        enemy.velocity.x = 0;
    };

    // detect for colision
    if ((player.isAttacking) &&
        ((player.attackBox.position.x + player.attackBox.width) >= enemy.position.x) && 
        (player.attackBox.position.x <= (enemy.position.x + enemy.width) &&
        ((player.attackBox.position.y + player.attackBox.height) >= enemy.position.y)) &&
        (player.attackBox.position.y <= (enemy.position.y + enemy.height))){
        console.log('hit');
        player.isAttacking = false;
    }
}

animate()

window.addEventListener('keydown', (event) => {
    switch (event.key){
        case 'w':
            player.velocity.y = -20;
            player.lastKey = 'w'
            break;
        case 'a':
            keys.a.pressed = true;
            player.lastKey = 'a'
            break;
        case 'd':
            keys.d.pressed = true;
            player.lastKey = 'd'
            break;
        case ' ':
            player.attack();
            break;
    }
    switch (event.key) {
        case 'ArrowUp':
            enemy.velocity.y = -20;
            enemy.lastKey = 'ArrowUp'
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = 'ArrowLeft'
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            enemy.lastKey = 'ArrowRight'
            break;
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'a':
            keys.a.pressed = false;
            break;
        case 'd':
            keys.d.pressed = false;
            break;
    }
    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
    }
})