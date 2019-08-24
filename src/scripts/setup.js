//Define variables that might be used in more
//than one function
import * as PIXI from "pixi.js";
import MapLoader from './maploader';
import Char from "./char";
import keyboard from "./keyboard";

let dungeon, explorer, treasure, door, textures, state;
let Sprite = PIXI.Sprite;

let aliveObjects = [];
let player;
let currentMap;

function setup(app) {
    console.log(app);
    //There are 3 ways to make sprites from textures atlas frames
    textures = app.loader.resources["assets/sprites/dungeon.json"].textures;
    let map = new MapLoader(app.loader.resources["assets/maps/room.json"].data, textures);

    // draw the map
    for (let tile of map.tiles) {
        app.stage.addChild(tile);
    }
    currentMap = map;

    let wizzard = new Char(app.loader.resources["assets/chars/wizzard.json"].data, textures, [50, 50]);
    aliveObjects.push(wizzard);
    player = wizzard;

    app.stage.addChild(wizzard.sprite);

    //Set the game state
    state = play;

    app.ticker.add(delta => gameLoop(delta));


    //Make the treasure box using the alias
    treasure = new Sprite(textures["crate.png"]);
    app.stage.addChild(treasure);

    //Position the treasure next to the right edge of the canvas
    treasure.x = app.renderer.width - treasure.width - 48;
    treasure.y = app.renderer.height / 2 - treasure.height / 2;
    app.stage.addChild(treasure);

    //Make the exit door
    door = new Sprite(textures["doors_all.png"]);
    door.position.set(32, 0);
    app.stage.addChild(door);

    //Make the blobs
    let numberOfBlobs = 6,
        spacing = 48,
        xOffset = 150;

    //Make as many blobs as there are `numberOfBlobs`
    for (let i = 0; i < numberOfBlobs; i++) {

        //Make a blob
        let blob = new Sprite(textures["lizard_m_idle_anim_f3.png"]);

        //Space each blob horizontally according to the `spacing` value.
        //`xOffset` determines the point from the left of the screen
        //at which the first blob should be added.
        let x = spacing * i + xOffset;

        //Give the blob a random y position
        //(`randomInt` is a custom function - see below)

        let y = randomInt(0, app.renderer.height - blob.height);

        //Set the blob's position
        blob.x = x;
        blob.y = y;

        //Add the blob sprite to the stage
        app.stage.addChild(blob);
    }
}


//Capture the keyboard arrow keys
let left = keyboard("ArrowLeft"),
    up = keyboard("ArrowUp"),
    right = keyboard("ArrowRight"),
    down = keyboard("ArrowDown");

let handleVelocity = () => {
    player.vx = 0;
    player.vy = 0;
    if (left.isDown && !right.isDown) {
        player.vx = -player.velocity;
    }
    if (!left.isDown && right.isDown) {
        player.vx = player.velocity;
    }
    if (up.isDown && !down.isDown) {
        player.vy = -player.velocity;
    }
    if (!up.isDown && down.isDown) {
        player.vy = player.velocity;
    }
};


/**
 * "play" gameloop state
 * @param delta
 */
let play = (delta) => {
    handleVelocity()
    for (let aliveObject of aliveObjects) {
        aliveObject.move(currentMap);
    }
};

let gameLoop = (delta) => {
    state(delta);
};

//The `randomInt` helper function
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default setup;