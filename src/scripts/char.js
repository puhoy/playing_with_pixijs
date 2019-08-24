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

        this.state = 'idle';
    }

    _getSprite() {
        let sprite = PIXI.AnimatedSprite.fromFrames(this.charDefinition['states']['idle']['textures']);
        sprite.animationSpeed = this.charDefinition['states']['idle']['speed'];
        sprite.play();


        //let sprite = new PIXI.Sprite(
        //    this.textures[this.charDefinition['textures']['idle'][0]]
        //);
        sprite.x = this.x;
        sprite.y = this.y;
        return sprite;
    }

    move(map) {
        let state = 'idle';

        if (this.vx < 0) {
            state = 'running';
            this.sprite.scale.x = -1;
            this.sprite.anchor.set(1, 0);
            // moving left
            if (map.getCollisions(...this.coordsBottomLeft()) || map.getCollisions(...this.coordsTopLeft())) {
                this.vx = 1;
            }
        } else if (this.vx > 0) {
            // right
            state = 'running';
            this.sprite.scale.x = 1;
            this.sprite.anchor.set(0, 0);
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

        this.sprite.x += this.vx;
        this.sprite.y += this.vy;
        if (state !== this.state) {
            let textures = [];
            for (let texturePath of this.charDefinition['states'][state]['textures']) {
                textures.push(this.textures[texturePath]);
            }
            console.log('set textures to ', textures, `(${state})`);
            this.sprite.textures = textures;
            this.sprite.animationSpeed = this.charDefinition['states'][state]['speed'];
            this.sprite.play();
        }
        this.state = state;

    }

    coordsTopLeft() {
        return [this.sprite.x, this.sprite.y];
    }

    coordsTopRight() {
        return [this.sprite.x + this.sprite.width, this.sprite.y];
    }

    coordsBottomRight() {
        return [this.sprite.x + this.sprite.width, this.sprite.y + this.sprite.height];
    }

    coordsBottomLeft() {
        return [this.sprite.x, this.sprite.y + this.sprite.height];
    }

}