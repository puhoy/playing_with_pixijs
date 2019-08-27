import * as PIXI from "pixi.js";

export default class MapLoader {
    constructor(mapJson, textures) {
        this.mapJson = mapJson;
        this.textures = textures;

        this.tileWidth;
        this.tileHeight;
        this.tileCountX;
        this.tileCountY;

        this.collisionMap;

        this.tiles = this.createSprites();
    }

    getCollisions(x, y) {
        let sprites = this._getSpritesUnderCoords(x, y);
        for (let sprite of sprites) {
            if (sprite && sprite.canCollide) {
                return true;
            }
        }
        return false;

    }

    _getSpritesUnderCoords(x, y) {
        //console.log(x, y)
        let tiles = [];
        for (let layer of this.collisionMap) {
            let tileIndexX = Math.floor(x / this.tileWidth);
            let tileIndexY = Math.floor(y / this.tileHeight);

            let tileIndex = tileIndexY * this.tileCountX + tileIndexX;
            tiles.push(layer[tileIndex]);
            //console.log(tileIndexX, tileIndexY, '->', tileIndex)
        }

        return tiles;
    }

    createSprites() {
        let x = 0;
        let y = 0;
        this.tileWidth = this.mapJson['tile_dimensions']['width'];
        this.tileHeight = this.mapJson['tile_dimensions']['height'];
        this.tileCountY = this.mapJson['layers'][0].length;
        this.tileCountX = this.mapJson['layers'][0][0].length;

        let tilesToDraw = [];  // just a list to pass to pixi
        this.collisionMap = [
            /*
            [  // list of layers
              [tile, tile, tile, ...] // first layer
              [tile, tile, tile, ...] // next layer
              ...
            ]
            * */
        ];
        for (let layer of this.mapJson['layers']) {
            let collisionLayer = [];
            this.collisionMap.push(collisionLayer);

            for (let row of layer) {
                for (let tileName of row) {
                    const tilePath = this.getTilePath(tileName);
                    if (tilePath) {
                        let tile = new PIXI.Sprite(
                            this.textures[tilePath]
                        );
                        tile.x = x;
                        tile.y = y;
                        tile.canCollide = this.mapJson['can_collide'][tileName] || false;

                        tilesToDraw.push(tile);
                        collisionLayer.push(tile);
                    } else {
                        collisionLayer.push(null);
                    }
                    x += this.tileWidth;
                }
                x = 0;
                y += this.tileHeight;
            }
            x = 0;
            y = 0;
        }
        return tilesToDraw;
    }

    /**
     * return random coords for the player to spawn
     */
    spawnPlayer() {
        return this._getLocationInArea('player_spawn')
    }

    spawnItem() {
        return this._getLocationInArea('item_spawn')
    }

    _getLocationInArea(area) {
        let xStart = this.mapJson['areas'][area]['x_start'] * this.tileWidth;
        let yStart = this.mapJson['areas'][area]['y_start'] * this.tileHeight;
        let xEnd = this.mapJson['areas'][area]['x_end'] * this.tileWidth;
        let yEnd = this.mapJson['areas'][area]['y_end'] * this.tileHeight;

        let randX = Math.random() * (xEnd - xStart) + xStart;
        let randY = Math.random() * (yEnd - yStart) + yStart;

        return [randX, randY]
    }

    getTilePath(name) {
        const tilePath = this.mapJson['tile_mapping'][name];
        if (name && !tilePath) {
            console.error(`cannot find ${name} in mapping!`);
        }
        // if its an array, pick a random one!
        if (Array.isArray(tilePath)) {
            let items = tilePath;
            let item = items[Math.floor(Math.random() * items.length)];
            return item;
        } else {
            return tilePath;
        }
    }


}