import SpriteWrapperBase, {DIRECTION} from "./spriteWrapperBase";
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

    animate() {
        super.animate();
        if (this.equipped) {
            this.updateLayersOrder();

            this.equipped.sprite.anchor.set(this.direction % 1, 0);


            this.equipped.sprite.scale.x = this.direction;
            this.equipped.sprite.x = this.direction;
            this.equipped.sprite.zIndex = this.direction; // -1 -> "behind" other sprite
            this.equipped.sprite.angle = 10 * this.direction;
        }
    }


    move(map: any) {
        let state = 'idle';

        if (this.vx < 0) {
            state = 'running';
            this.direction = DIRECTION.LEFT;
            this.sprite.scale.x = -1;
            this.sprite.anchor.set(1, 0);
            // moving left
            if (map.getCollisions(...this.coordsBottomLeft()) || map.getCollisions(...this.coordsTopLeft())) {
                this.vx = 1;
            }
        } else if (this.vx > 0) {
            // right
            state = 'running';
            this.direction = DIRECTION.RIGHT;
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

        this.container.x += this.vx;
        this.container.y += this.vy;
        return state
    }

    equip(item: Item) {
        this.equipped = item;
        this.equipped.sprite.y = 15;
        this.container.addChild(item.sprite);
        this.animate()
    }
}