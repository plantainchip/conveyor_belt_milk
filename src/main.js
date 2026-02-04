import {
    compareObjects, mobileCheck
} from "./util";

import kaplay from "kaplay";
import "kaplay/global"; // uncomment if you want to use without the k. prefix

// kaplay();
kaplay({
    width: 480,
    height: 432,
    background: [0, 0, 255,],
    scale: 1.5
})
// loadRoot("./"); // A good idea for Itch.io publishing later

//load sprites first
loadSprite("bean", "./sprites/bean.png");
loadSprite("grassbackground", "./sprites/cowbackground.png");
loadSprite("plainbackground", "./sprites/plainbackground.png");
loadSprite("cyanmilk", "./sprites/cyanmilk.png"); 
loadSprite("magentamilk", "./sprites/magentamilk.png");
loadSprite("yellowmilk", "./sprites/yellowmilk.png");
loadSprite("keymilk", "./sprites/keymilk.png");
loadSprite("title", "./sprites/title.png");
loadAseprite("cow","./sprites/cowsprite.png", "./sprites/cowsprite.json");
loadAseprite("conveyor", "./sprites/conveyorbelt.png", "./sprites/conveyorbelt.json");
loadAseprite("splat", "./sprites/splat.png", "./sprites/splat.json");
loadMusic("bgm", "./sprites/VillageSongWAV.wav");
loadSound("cowjumpsfx", "./sprites/cowjumpsfx.mp3");
loadSound("cowsplatsfx", "./sprites/cowsplatsfx.mp3");
loadSound("cowmoosfx", "./sprites/cowmoosfx.mp3");


scene("start", () => {
    add([ sprite("title"), ]);
    onClick(() => go("game"));
    onKeyPress("space", () => go("game"));
    onTouchStart(() => go("game"));
});


scene("game", () => {
    add([ sprite("grassbackground"), ]);

    setGravity(1650);

    const music = play("bgm",{
        music: true,
        volume: 0.5,
        loop: true,
    })

    // player
    const cowplayer = add([
        sprite("cow", {
            anim: "walk",
        }),
        scale(0.9),
        pos(60, 0),
        area(),
        body(),
        anchor("center"),
        animate(), 
    ]);

    // platform floor
    add([
        sprite("conveyor", {
            anim: "convey",
        }), 
        pos(0, height() - 48),
        outline(4),
        area(),
        body({ isStatic: true }),
        animate(),
        "conveyor",
    ]);

    //cowplayer movement - spacebar to jump
    onKeyPress("space", () => {
        if (cowplayer.isGrounded()) {
            play("cowjumpsfx", {
                volume: 0.7,
            });
            cowplayer.jump();
            cowplayer.play("jump");
        }
    });
    //cowplayer movement - left click to jump
    onClick(() => {
        if (cowplayer.isGrounded()) {
            play("cowjumpsfx", {
                volume: 0.7,           
            });
            cowplayer.jump();
            cowplayer.play("jump");
        }
    });

    onTouchStart(() => {
        if (cowplayer.isGrounded()) {
            play("cowjumpsfx", {
                volume: 0.7,           
            });
            cowplayer.jump();
            cowplayer.play("jump");
        }
    });

    // wanted milk box
    const match = add([
        choose([
            sprite("yellowmilk"), 
            sprite("cyanmilk"), 
            sprite("magentamilk"), 
            sprite("keymilk")
        ]),
        pos(340,24),
        "match"
    ])


    // scores and other variables
    let score = 0;
    let isNowBeef = false;
    const scoreLabel = add([text(score), pos(8, 8),]);
    scoreLabel.color = rgb(189, 154, 120);
    let max = 4;

    // spawn obstacles, destroy them offscreen, update score
    function spawnBox() {
        max -= 0.1;
        const box = add([
            choose([
                sprite("yellowmilk"), 
                sprite("cyanmilk"), 
                sprite("magentamilk"), 
                sprite("keymilk")
            ]),
            area(),
            pos(width(), height() - 48),
            anchor("botleft"),
            move(LEFT, 240),
            offscreen(), 
            "obstacle",
        ]);

        // if player dodges box and it moves off screen
        box.onUpdate(() => {
            if(box.pos.x <= 0 && !isNowBeef) {
                box.destroy();
                score++;
                scoreLabel.text = score
            }
        });

        if (max <= 1){
            max = 3;    
        }

        wait(rand(1, max), () => {
            spawnBox();
        });
    }
    spawnBox();

    // collision detection - if cow hits box
    cowplayer.onCollide("obstacle", (obstacle) => {
        if (compareObjects(obstacle.sprite, match.sprite)) {
            play("cowmoosfx", {
                volume: 0.7,
            });
            score += 100;
            scoreLabel.text = score;
            obstacle.destroy(); 
        } else {
            music.paused = true;
            play("cowsplatsfx", {
                volume: 0.7,           
            });
            destroy(cowplayer);
            const milklose = add([
                sprite("splat", { anim: "splatter",}),
                anchor("center"), 
            ]);
            milklose.pos = cowplayer.pos;
            shake();
            isNowBeef = true;
            wait(0.8, () => {
                // loser
                if (localStorage.getItem("user")){
                    go("lose", score);
                } else {
                    go("username",score)
                }
                
            });
        }
    });

    // cowplayer platform walk animation
    cowplayer.onCollide("conveyor", () => {
        cowplayer.play("walk");
    });
})

scene("username", (score) => {

    // check if localStorage.getItem("user") is true or not in game scene
    let username = localStorage.getItem("user");
    add([ sprite("plainbackground"), pos(0, 0),]);
    add([text("Type your name and press enter"), pos(width()/2,height()/2 - 50), scale(0.5), anchor("center"), color(0,0,0)]);

    const obj = add([   
        text("______"),
        textInput(),
        pos(width()/2, height()/2),
        anchor("center"),
        scale(0.5),
    ])

    
    if(mobileCheck()){
        username = prompt("enter username")
        localStorage.setItem("user", username)
        go("lose",score);
        
    } else {
        obj.onInput(()=>{
            console.log(obj.typedText)
            localStorage.setItem("user", obj.typedText)
            username = obj.typedText
        })
    }

    


    // add([text(username), pos(width()/2,60), scale(1.3), anchor("center"), color(0,0,0)]);
    onKeyPress("enter", () => go("lose",score));
    onTouchStart(() => go("lose",score));
    

})

scene("lose", (score) => {
    // localstorage here
    let highscore = localStorage.getItem("high");
    if (highscore && score > highscore) {
        localStorage.setItem("high", score);
        highscore = score;
    }

    if(!highscore) {
        localStorage.setItem("high", score);
        highscore = score;
    }
    console.log(highscore)
    

    add([ sprite("plainbackground"), pos(0, 0),]);
    add([text("Game Over"), pos(width()/2,30), scale(1.3), anchor("center"), color(0,0,0)]);
    add([text("Highscores"), pos(width() / 2, 80), anchor("center"), scale(0.6), color(0,0,0)]);
    add([text(localStorage.getItem("user") + " - " + (highscore || 0)), pos(width() / 2, 120), anchor("center"), scale(0.6), color(50,50,50)]);

    add([text("Score: " + score ), pos(width() / 2, height() / 2 + 150), anchor("center"), scale(0.6), color(255,255,219)]);
    add([text("Click to Restart"), pos(width() / 2, height() / 2 + 180), anchor("center"), scale(0.6), color(255,255,219)]);
    onClick(() => go("game"));
    onKeyPress("space", () => go("game")); 
    onTouchStart(() => go("game"));
});

go("start");