EnemyShep = function(index, game, bullets, type){
    var x = lengthWorld.padding + Math.random() * (300  - 100) + 100;
    var y = lengthWorld.padding + Math.random() * (300  - 100) + 100;

    this.game = game;
    this.bullets = bullets;

    this.squadron = game.add.physicsGroup(Phaser.Physics.P2JS); 
    this.squadron.physicsBodyType = Phaser.Physics.P2JS;
    this.squadron.setAll('smoothed', false);
    this.squadron.setAll('enableBody', true);
    this.squadron.inertia = { 
        x: 0, y: 0,
        rotation: 0,
        speed: 400
    };
    this.squadron.reviveFirst = function(){
        this.playerCapt = this.create(
            lengthWorld.padding + 100, 
            lengthWorld.padding + 100, 
            'player'
        );
        this.playerCapt.index = 0;
        game.camera.follow(this.playerCapt);
        this.playerCapt.body.collides(bulletsCollisionGroup, hitResources, this);        
    } 
    if(type == 'player'){
        game.physics.p2.setCollisionGroup(this.squadron, playerCollisionGroup);
    }    

    this.getShep = function(){
        var randPositionShift = Math.random() * (500 - 50) + 50;
        var shep = this.squadron.create(lengthWorld.padding + randPositionShift, lengthWorld.padding + randPositionShift, 'player');
        shep.physicsBodyType = Phaser.Physics.P2JS;
        hitShep.enableBody = true;
        shep.body.collides(this.bullets, hitShep);   
        return shep;
    }

}

function create() {
    //  Enable P2
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.setImpactEvents(true);
    game.physics.p2.restitution = 0.8;    
    
    playerCollisionGroup = game.physics.p2.createCollisionGroup();
    enemiesCollisionGroup = game.physics.p2.createCollisionGroup();
    resourcesCollisionGroup = game.physics.p2.createCollisionGroup(); 
    bulletsCollisionGroup = game.physics.p2.createCollisionGroup(); 

    game.physics.p2.updateBoundsCollisionGroup();

    game.world.setBounds(0, 0, lengthWorld.x, lengthWorld.y);
    background = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'background');

    game.input.mouse.capture = true; // If true the DOM mouse events will have event.

    // Just to display the bounds [ru] Отображаем границу
    bounds = new Phaser.Rectangle(
        lengthWorld.padding, 
        lengthWorld.padding, 
        game.world.width - lengthWorld.padding, 
        game.world.height - lengthWorld.padding
    );
    var graphicsBounds = game.add.graphics(bounds.x, bounds.y);
    graphicsBounds.lineStyle(4, 0xffd900, 1);
    graphicsBounds.drawRect(0, 0, bounds.width - lengthWorld.padding, bounds.height - lengthWorld.padding);
    poly = new Phaser.Polygon([
    	new Phaser.Point(0, 0), new Phaser.Point(game.world.width, 0 ),
		new Phaser.Point(game.world.width, game.world.height), 		  new Phaser.Point(0, game.world.height),
		new Phaser.Point(0, game.world.height - lengthWorld.padding), new Phaser.Point(game.world.width - lengthWorld.padding, game.world.height - lengthWorld.padding),
		new Phaser.Point(game.world.width - lengthWorld.padding, lengthWorld.padding),  new Phaser.Point(lengthWorld.padding, lengthWorld.padding),
		new Phaser.Point(lengthWorld.padding, game.world.height - lengthWorld.padding), new Phaser.Point(0, game.world.height - lengthWorld.padding)
	]);
    graphics = game.add.graphics(0, 0);
    graphics.beginFill(0xff0000, 0.5);
    graphics.drawPolygon(poly.points);
    graphics.endFill();
    //

    // Group free resources // Группа свободных ресурсов
    balls = game.add.group();
    //balls = game.add.physicsGroup(Phaser.Physics.P2JS);        
    balls.enableBody = true;
    balls.physicsBodyType = Phaser.Physics.P2JS;
    // balls.setAll('outOfBoundsKill', true);
    // balls.setAll('checkWorldBounds', true);
    // balls.setAll('body.mass', 0.1);
    // balls.setAll('body.damping', 0);
    balls.setAll('name', 'ball');
    
    createBalls(countBalls);
        
    // squadronPlayer = game.add.group(null , null, 'player', Phaser.Physics.P2JS);
    squadronPlayer = game.add.physicsGroup(Phaser.Physics.P2JS); 
    squadronPlayer.physicsBodyType = Phaser.Physics.P2JS;
    squadronPlayer.setAll('smoothed', false);
    // squadronPlayer.setAll('speed', 500);
    // squadronPlayer.setAll('minSpeed', 300);
    squadronPlayer.setAll('enableBody', true);
    // squadronPlayer.setAll('inertia', { x: 0, y: 0 });
    game.physics.p2.setCollisionGroup(squadronPlayer, playerCollisionGroup);
    squadronPlayer.playerCapt = {};
    squadronPlayer.inertia = { x: 0, y: 0, rotation: 0, speed: 400, minSpeed: 150 };
    squadronPlayer.reviveFirst = function(){
        this.playerCapt = this.create(lengthWorld.padding + 100, lengthWorld.padding + 100, 'player');
        //this.playerCapt.enableBody = true;
        this.playerCapt.index = 0;
        game.camera.follow(this.playerCapt);
        this.playerCapt.body.collides(bulletsCollisionGroup, hitResources, this);        
    }
    squadronPlayer.reviveFirst();
    for (var i = 0; i < defaultShepCount; i++){
        sqadronAppend();
    }

    fireButton = game.input.activePointer.leftButton;

    // bullets // заряды
    bullets = game.add.physicsGroup(Phaser.Physics.P2JS);
    bulletsSetParm();
    var eqSheep = 5;
    enemies = []
    for (var i=0; i < eqSheep; i++){
        enemies.push(new EnemyShep(i, game, bullets));
        shep = enemies[i].getShep()
        game.physics.p2.enable(shep, false);
        shep.enableBody = true;
        shep.physicsBodyType = Phaser.Physics.P2JS;

        shep.body.setCollisionGroup(enemiesCollisionGroup);
        shep.body.collides(bulletsCollisionGroup);
    }    

    //game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER, 0.1, 0.1);    
    vulkaiser = game.add.sprite(20, 0, 'vulkaiser');
    //vulkaiser.x = game.camera.width - vulkaiser.width
    vulkaiser.y = game.camera.height - vulkaiser.height
    vulkaiser.fixedToCamera = true;

    // timer for message for warning when death zone
    timerBlambVulkaiser = game.time.create(false);
    timerBlambVulkaiser.loop(400, blambVulkaiser, this);
    ////warning text
    dangerFount =  game.add.text(vulkaiser.x + vulkaiser.width, game.camera.height - vulkaiser.height, '- Danger ! -');
    dangerFount.visible = false;
    dangerFount.fixedToCamera = true;    
    dangerFount.fontSize = 50;
    dangerFount.fontWeight = 'bold';
    dangerFount.fill = '#f80000';
    textToRestart = game.add.text(game.camera.width / 2, game.camera.height / 2, "Click the mouse button to continue.", { font: "65px Arial", fill: "#ffff00", align: "center" });
    textToRestart.anchor.set(0.5);
    textToRestart.inputEnabled = true;
    textToRestart.visible = false;

    //  Create death player on Timer
    deathTimer = game.time.create(false);
}

function blambVulkaiser(){ 
    vulkaiser.visible = !vulkaiser.visible;
    dangerFount.visible = !dangerFount.visible;
}

function bulletsSetParm(){
    bullets.physicsBodyType = Phaser.Physics.P2JS;
    bullets.createMultiple(1, 'bullet', 0, false);
    bullets.enableBody = true;
    bullets.setAll('name', 'bullet');    
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('body.mass', 0.1);
    bullets.setAll('body.damping', 0);    
    bulletsTimer = game.time.create(false);
    bullets.setAll('body.fixedRotation',true);
    // bullets.idle = false; // флаг холостого патрона, создавая корабль при попадании
    // pull
}

function createBalls(count){
// Create and placing spherical resources
    for (var i = 0; i < count; i++)
    {
        var randomBoundsX = Math.floor(Math.random() * (bounds.width  - bounds.x) + bounds.x);
        var randomBoundsY = Math.floor(Math.random() * (bounds.height - bounds.y) + bounds.y);
        var ball = balls.create(randomBoundsX, randomBoundsY, 'ball');        
        ball.body.setRectangle(40, 40);
        ball.idle = false; // флаг холостого ресурса, создавая корабль при попадании
        ball.body.setCollisionGroup(resourcesCollisionGroup);
        ball.body.collides(bulletsCollisionGroup);
        ball.scale.set(0.5);
    }
    //
}

function death(){
    squadronPlayer.removeAll()
    // player.kill();
    countScore = 0;
    bullets.removeAll();
    textToRestart.visible = true;

    //the "click to restart" handler
    game.input.onTap.addOnce(restart,this);
}

function restart(){    
    balls.removeAll();
    textToRestart.visible = false;

    // player.revive();
    squadronPlayer.removeAll();
    squadronPlayer.reviveFirst();
    //bullets.createMultiple(1, 'bullet', 0, false);
    bulletsSetParm();
    // player.body.x = game.world.centerX;
    // player.body.y = game.world.centerY;
    // player.body.x = lengthWorld.padding * 1.5, 
    // player.body.y = lengthWorld.padding * 1.5;
    createBalls(countBalls);
}

// Check jobs collides [ru] Рабочая проверка на столкновения
function checkVeg(body1, body2) { 
    if (body1.sprite.key == 'ball' && body2.sprite.key  == 'bullet' || body2.sprite.key == 'ball' && body1.sprite.key  == 'bullet'){
        body1.sprite.kill();
        body2.sprite.kill();
    }
	return true;
}

function hitResources(body1, body2){
    console.info([body2.sprite.name, body1.sprite.name])
    console.info([body2.sprite.key, body1.sprite.key])
    if (!body2.hasCollided && !body1.hasCollided){
        body1.sprite.kill();
        body2.sprite.kill();    
        body1.hasCollided = true;
        body2.hasCollided = true;                

        // проверка на колизию группы патронов с одним элементом ресурсов
        // checking for collided groups bullet with one element resurce
        if (body2.sprite.key == 'ball' && !body2.sprite.idle){
            prisonSprite = body2.sprite;
        } else if (body1.sprite.key == 'ball' && !body1.sprite.idle){
            prisonSprite = body1.sprite;
        } else {
            prisonSprite = false;
        }

        if (prisonSprite) {
            prisonSprite.idle = true;
            sqadronAppend();
            // var beforeShep = squadronPlayer.getTop();
            // squadronPlayer.create(squadronPlayer.playerCapt.x+20, squadronPlayer.playerCapt.y+20, 'player');
            // var newShep = squadronPlayer.getTop();     
            // // squadronPlayer.getTop().index = squadronPlayer.length;
            // var lastIndex = squadronPlayer.length - 1;
            // for (var sL = 0; sL < squadronPlayer.length; sL++){
            //     if (sL != lastIndex){
            //         game.physics.p2.createDistanceConstraint(
            //             squadronPlayer.children[sL], newShep, newShep.height + 5, 
            //             [squadronPlayer.children[sL].width, squadronPlayer.children[sL].height  ],
            //             [newShep.width, newShep.height], 0.5);        
            //     }
            // }
            
        }        
        // playerItem.index = squadronPlayer.length;
        //  Attach to the first body the mouse hit
        // game.physics.p2.createSpring(squadronPlayer.playerCapt, playerItem, 5, 30, 50);
    }
}

function sqadronAppend(){

    var beforeShep = squadronPlayer.getTop();
        squadronPlayer.create(squadronPlayer.playerCapt.x+20, squadronPlayer.playerCapt.y+20, 'player');
    var newShep = squadronPlayer.getTop();     
    // squadronPlayer.getTop().index = squadronPlayer.length;
    var lastIndex = squadronPlayer.length - 1;
    for (var sL = 0; sL < squadronPlayer.length; sL++){
        if (sL != lastIndex){
            game.physics.p2.createDistanceConstraint(
                squadronPlayer.children[sL], newShep, newShep.height + 5, 
                [squadronPlayer.children[sL].width, squadronPlayer.children[sL].height  ],
                [newShep.width, newShep.height], 0.5);        
        }
        // squadronPlayer.children[sL]
    }
}


function hitShep(bullet, shep){
    console.info('hitShep');
    bullet.sprite.kill();
    shep.sprite.kill();
    countScore++;
}
    
// EnemyShep.prototype.update = function() {

// };