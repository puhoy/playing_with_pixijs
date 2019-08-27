//Define variables that might be used in more
//than one function
import * as PIXI from "pixi.js";
import MapLoader from './maploader';
import Char from "./spriteWrappers/char";
import keyboard from "./keyboard";
import Item from "./spriteWrappers/item";

let textures, state;

let aliveObjects = [];
let itemsOnMap = [];

let player;
let currentMap;
let width;
let height;
let container;
let App;

function setup(app) {
    //There are 3 ways to make sprites from textures atlas frames
    App = app
    textures = App.loader.resources["assets/sprites/dungeon.json"].textures;
    let map = new MapLoader(App.loader.resources["assets/maps/room.json"].data, textures);
    width = App.renderer.width;
    height = App.renderer.height;
    container = new PIXI.Container();

    let particleContainer = new PIXI.ParticleContainer();
    // draw the map
    for (let tile of map.tiles) {
        particleContainer.addChild(tile);
    }
    container.addChild(particleContainer)
    currentMap = map;

    let wizzard = new Char(App.loader.resources["assets/chars/wizzard.json"].data, textures, map.spawnPlayer());
    container.addChild(wizzard.container);
    aliveObjects.push(wizzard);

    player = wizzard;

    let greenStaff = new Item(App.loader.resources["assets/weapons/green_staff.json"].data, textures, map.spawnItem());
    container.addChild(greenStaff.container);
    itemsOnMap.push(greenStaff);

    App.stage.addChild(container);

    //Set the game state
    state = play;
    App.ticker.add(delta => gameLoop(delta));
}


//Capture the keyboard arrow keys
let left = keyboard("ArrowLeft"),
    up = keyboard("ArrowUp"),
    right = keyboard("ArrowRight"),
    down = keyboard("ArrowDown");

let handleInput = () => {
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

    handleInput();

    for (let aliveObject of aliveObjects) {
        aliveObject.moveAndAnimate(currentMap);
    }

    for (let item of itemsOnMap) {
        if(item.collidesWith(player)) {
            player.equip(item)
            container.removeChild(item.container);
        }
    }

    let xMiddle = width / 2;
    let yMiddle = height / 2;
    
    let xPlayerMiddle = player.container.width / 2;
    let yPlayerMiddle = player.container.height / 2;

    container.x = -player.container.x -xPlayerMiddle + xMiddle;
    container.y = -player.container.y -yPlayerMiddle + yMiddle;
};

let gameLoop = (delta) => {
    state(delta);
};

//The `randomInt` helper function
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default setup;