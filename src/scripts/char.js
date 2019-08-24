import * as PIXI from "pixi.js";


export default class Char {
    constructor(charDefinition, textures, coords = [0, 0]) {
        this.textures = textures;
        this.charDefinition = charDefinition;

        this.velocity = charDefinition['velocity'];
        this.vx = 0;
        this.vy = 0;

        this.sprite = this._getSprite();

        this.sprite.x = coords[0];
        this.sprite.y = coords[1];
    }

    _getSprite() {
        let sprite = new PIXI.Sprite(
            this.textures[this.charDefinition['textures']['idle'][0]]
        );
        sprite.x = this.x;
        sprite.y = this.y;
        return sprite;
    }

    move() {
        //Apply the velocity values to the cat's
        //position to make it move
        this.sprite.x += this.vx;
        this.sprite.y += this.vy;
    }

}