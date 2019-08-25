import * as PIXI from 'pixi.js';

import SpriteWrapperBase from "./spriteWrapperBase";
import Item from "./item";


export default class Char extends SpriteWrapperBase {
    equipped: Item;
    container: any;

    constructor(definition: any, textures: any, coords = [0, 0]) {
        super(definition, textures, coords);
        this.sprite.zIndex = 0;
        this.velocity = definition['velocity'];
        this.vx = 0;
        this.vy = 0;
        this.equipped;
    }



    move(map: any) {
        let state = 'idle';

        if (this.vx < 0) {
            state = 'running';
            this.sprite.scale.x = -1;
            this.sprite.anchor.set(1, 0);
            if (this.equipped) {
                this.equipped.sprite.zIndex = 1;
                this.updateLayersOrder();
                this.equipped.sprite.angle = 10;
                this.equipped.sprite.x = 5;
            }
            // moving left
            if (map.getCollisions(...this.coordsBottomLeft()) || map.getCollisions(...this.coordsTopLeft())) {
                this.vx = 1;
            }
        } else if (this.vx > 0) {
            // right
            state = 'running';
            this.sprite.scale.x = 1;
            this.sprite.anchor.set(0, 0);
            if (this.equipped) {
                this.equipped.sprite.zIndex = -1;
                this.updateLayersOrder();
                this.equipped.sprite.angle = -10;
                this.equipped.sprite.x = 10;
            }
            if (map.getCollisions(...this.coordsBottomRight()) || map.getCollisions(...this.coordsTopRight())) {
                this.vx = -1;
            }
        }

        if (this.vy < 0) {
            state = 'running';
            // moving up
            if (map.getCollisions(...this.coordsTopLeft()) || map.getCollisions(...this.coordsTopRight())) {
                this.vy = 1;
            }
        } else if (this.vy > 0) {
            state = 'running';
            if (map.getCollisions(...this.coordsBottomLeft()) || map.getCollisions(...this.coordsBottomRight())) {
                this.vy = -1;
            }
        }

        this.container.x += this.vx;
        this.container.y += this.vy;
        return state
    }

    equip(item: Item) {
        this.equipped = item;
        this.equipped.sprite.y = this.sprite.height + 4;
        this.container.addChild(item.sprite)
    }
}