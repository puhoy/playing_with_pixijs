import * as PIXI from "pixi.js";
import hitTestRectangle from "../hitTestRectangle";


export default class SpriteWrapperBase {
    textures: any;
    definition: any;
    velocity: any;
    vx: number;
    vy: number;
    sprite: any; // "main" sprite in this container
    state: string;
    container: any;


    /**
     *
     * @param definition  json definition
     * @param textures
     * @param coords
     * @param state
     */
    constructor(definition: any, textures: any, coords = [0, 0], state = 'idle') {
        this.textures = textures;
        this.definition = definition;
        this.state = state;

        this.sprite = this._getSprite();
        this.container = new PIXI.Container();
        this.container.addChild(this.sprite);

        this.container.x = coords[0];
        this.container.y = coords[1];
    }

    _getSprite() {
        let sprite = PIXI.AnimatedSprite.fromFrames(this.definition['states'][this.state]['textures']);
        sprite.animationSpeed = this.definition['states'][this.state]['speed'];
        sprite.play();

        return sprite;
    }

    updateLayersOrder() {
        this.container.children.sort(function (a: any, b: any) {
            a.zIndex = a.zIndex || 0;
            b.zIndex = b.zIndex || 0;
            return b.zIndex - a.zIndex
        });
    }

    animate() {
        let textures = [];
        for (let texturePath of this.definition['states'][this.state]['textures']) {
            textures.push(this.textures[texturePath]);
        }
        this.sprite.textures = textures;
        this.sprite.animationSpeed = this.definition['states'][this.state]['speed'];
        this.sprite.play();
    }

    /**
     * code to move the sprite
     *
     * has to return the new state!
     *
     * @param map
     */
    move(map: any) {
        return this.state
    }

    moveAndAnimate(map: any) {
        let state = this.move(map);

        if (state !== this.state) {
            this.state = state;
            this.animate();
        }
    }

    collidesWith(spriteWrapper: SpriteWrapperBase) {
        return hitTestRectangle(spriteWrapper.container, this.container) // todo: this does not use bounds from spritewrapper yet
    }

    coordsTopLeft() {
        return [this.container.x, this.container.y];
    }

    coordsTopRight() {
        return [this.container.x + this.container.width, this.container.y];
    }

    coordsBottomRight() {
        return [this.container.x + this.container.width, this.container.y + this.container.height];
    }

    coordsBottomLeft() {
        return [this.container.x, this.container.y + this.container.height];
    }

}