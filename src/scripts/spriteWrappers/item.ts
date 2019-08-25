import SpriteWrapperBase from "./spriteWrapperBase";


export default class Item extends SpriteWrapperBase {
    constructor(definition: any, textures: any, coords = [0, 0], state = 'idle') {
        super(definition, textures, coords, state);
        this.sprite.anchor.set(0.5);
        this.sprite.pivot.set(this.sprite.width/2, this.sprite.height/2);
        this.sprite.angle = Math.random() * 360;
    }
}