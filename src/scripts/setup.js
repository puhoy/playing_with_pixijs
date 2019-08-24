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
let width
let height
let container


function setup(app) {
    //There are 3 ways to make sprites from textures atlas frames
    textures = app.loader.resources["assets/sprites/dungeon.json"].textures;
    let map = new MapLoader(app.loader.resources["assets/maps/room.json"].data, textures);
    width = app.renderer.width;
    height = app.renderer.height;
    container = new PIXI.Container();

    // draw the map
    for (let tile of map.tiles) {
        container.addChild(tile);
    }
    currentMap = map;

    let wizzard = new Char(app.loader.resources["assets/chars/wizzard.json"].data, textures, [50, 50]);
    aliveObjects.push(wizzard);
    player = wizzard;

    container.addChild(wizzard.sprite);


    app.stage.addChild(container)

    //Set the game state
    state = play;
    app.ticker.add(delta => gameLoop(delta));
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
    let xMiddle = width / 2;
    let yMiddle = height / 2;
    
    let xPlayerMiddle = player.sprite.width / 2;
    let yPlayerMiddle = player.sprite.height / 2;

    container.x = -player.sprite.x -xPlayerMiddle + xMiddle;
    container.y = -player.sprite.y -yPlayerMiddle + yMiddle;
};

let gameLoop = (delta) => {
    state(delta);
};

//The `randomInt` helper function
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default setup;