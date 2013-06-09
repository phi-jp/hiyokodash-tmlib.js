/*
 * main.js
 */

var SCREEN_WIDTH    = 960;
var SCREEN_HEIGHT   = 680;
var SCREEN_CENTER_X = SCREEN_WIDTH/2;
var SCREEN_CENTER_Y = SCREEN_HEIGHT/2;

var PLAYER_WIDTH    = 64;
var PLAYER_HEIGHT   = 64;

var ENEMY_WIDTH     = 64;
var ENEMY_HEIGHT    = 64;

var BG_WIDTH        = SCREEN_WIDTH*2;
var BG_HEIGHT       = SCREEN_HEIGHT;

var GROUND_HEIGHT   = 600;

var ASSETS = {
    "hiyoko": "img/hiyoko.png",
    "karasu": "img/karasu.png",
    "bg": "img/bg.png",

    "flySE": "se/fly.mp3",

    "mainBGM": "bgm/main-bgm.mp3",
};


/*
 * main
 */
tm.main(function() {
    var app = tm.app.CanvasApp("#world");
    app.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
    app.fitWindow();

    var loadingScene = tm.app.LoadingScene({
        assets: ASSETS,
        nextScene: GameScene,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
    });

    app.replaceScene(loadingScene);

    app.run();
});


/*
 * game scene
 */
tm.define("GameScene", {
    superClass: "tm.app.Scene",

    init: function() {
        this.superInit();

        var bgm = tm.asset.AssetManager.get("mainBGM");
        bgm.setVolume(0.5).setLoop(true).play();

        this.bg = Background().addChildTo(this);
        this.bg.x = 0;
        this.bg.y = 0;

        this.player = Player().addChildTo(this);
        this.player.x = 150;
        this.player.y = GROUND_HEIGHT;

        this.enemyGroup = tm.app.CanvasElement().addChildTo(this);
    },

    update: function(app) {
        if (app.frame % 60 == 0) {
            var enemy = Enemy().addChildTo(this.enemyGroup);

            enemy.x = SCREEN_WIDTH;
            enemy.y = Math.rand(0, SCREEN_HEIGHT-enemy.height);
        }

        var self = this;
        var ec = this.enemyGroup.children;
        ec.each(function(enemy) {

            if (self.player.isHitElement(enemy)) {
                alert("Game Over");
                app.stop();
            };
        });
    },

    onpointingstart: function() {
        this.player.fly();
    },
});


/*
 * player
 */
tm.define("Player", {
    superClass: "tm.app.Sprite",

    init: function() {
        this.superInit("hiyoko", PLAYER_WIDTH, PLAYER_HEIGHT);
        this.scaleX *= -1;

        this.vy = 1;
    },

    update: function() {
        this.vy += 1;
        this.y += this.vy;

        if (this.y > GROUND_HEIGHT) {
            this.y = GROUND_HEIGHT;
        }
    },

    fly: function() {
        this.vy = -16;
        var se = tm.asset.AssetManager.get("flySE").clone();
        se.volume = 1;
        se.play();
    }
});


/*
 * enemy
 */
tm.define("Enemy", {
    superClass: "tm.app.Sprite",

    init: function() {
        this.superInit("karasu", ENEMY_WIDTH, ENEMY_HEIGHT);
    },

    update: function() {
        this.x -= 8;

        if (this.x < -this.width) {
            this.remove();
        }
    }
});


/*
 * bg
 */
tm.define("Background", {
    superClass: "tm.app.Shape",

    init: function() {
        this.superInit(BG_WIDTH+SCREEN_WIDTH, BG_HEIGHT);

        var c = this.canvas;

        var texture = tm.asset.AssetManager.get("bg");

        c.drawTexture(texture, 0, 0, BG_WIDTH, BG_HEIGHT);
        c.drawTexture(texture, 0, 0, 600, 561, BG_WIDTH, 0, SCREEN_WIDTH, BG_HEIGHT);

        this.origin.set(0, 0);
    },

    update: function() {
        this.x -= 8;

        if (this.x < -BG_WIDTH) {
            this.x = 0;
        }
    },
});


