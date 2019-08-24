import * as PIXI from "pixi.js";

async function createApp(resources) {
    let Application = PIXI.Application;

    let type = "WebGL";
    if (!PIXI.utils.isWebGLSupported()) {
        type = "canvas";
    }

    PIXI.utils.sayHello(type);

//Create a Pixi Application
    let app = new Application({
        width: 512,         // default: 800
        height: 512,        // default: 600
        antialias: true,    // default: false
        transparent: false, // default: false
        resolution: 1       // default: 1
    });


// fill entire window
    /* app.renderer.view.style.position = "absolute";
     app.renderer.view.style.display = "block";
     app.renderer.autoDensity = true;
     app.renderer.resize(window.innerWidth, window.innerHeight);
    */
//Add the canvas that Pixi automatically created for you to the HTML document
    document.body.appendChild(app.view);


//load a JSON file and run the `setup` function when it's done
    return new Promise((resolve, reject) => {

        app.loader
            .add(resources)

            .load(() => resolve(app));
    });
}

export default createApp;
