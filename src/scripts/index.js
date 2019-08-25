import '../styles/index.scss';

import createApp from "./createApp";
import setup from "./setup";

async function game() {
    let resources = [
        "assets/sprites/dungeon.json",
        "assets/maps/room.json",
        "assets/chars/wizzard.json",
        "assets/weapons/green_staff.json"
    ];

    let app = await createApp(resources);
    setup(app);
}

game();