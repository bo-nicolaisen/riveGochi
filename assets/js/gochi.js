
class Gochi {
    #sad;
    #happy;
    #mid;
    #play;
    #eat;
    #die;
    #respawn;
    #gochiData;
    #storageName = 'myGochi'

    constructor () {
        this.gochiState = 'happy';

        // setup data
        this.#gochiData = this.ReadLocalStorageData();
        console.log(this.#gochiData);

        if (this.#gochiData === null) {
            this.#gochiData = {
                lastFeed: {
                    timeStamp: new Date().getTime(),
                },
                lastPlay: {
                    timeStamp: new Date().getTime(),
                },
                lastInteraction: {
                    timeStamp: new Date().getTime(),
                },
                hunger: 1,
                bored: 1,
                lonliness: 1
            }
        }

        // setup rive scene
        this.RiveScene = new rive.Rive({
            src: "./assets/rive/gochi2.riv",
            canvas: document.getElementById("canvas"),
            artboard: "board",
            autoplay: true,
            stateMachines: "gochiState",
            onLoad: () => {

                this.RiveScene.resizeDrawingSurfaceToCanvas();
                this.RiveScene.setTextRunValue("test", "RiveGochi");

                this.initGochi()

            },

        });
    }

    initGochi() {

        let inputs = this.RiveScene.stateMachineInputs('gochiState');

        this.#play = inputs.find(i => i.name === 'play')
        this.#eat = inputs.find(i => i.name === 'eat')
        this.#die = inputs.find(i => i.name === 'die')
        this.#respawn = inputs.find(i => i.name === 'respawn')
        this.#sad = inputs.find(i => i.name === 'sad')
        this.#happy = inputs.find(i => i.name === 'happy')
        this.#mid = inputs.find(i => i.name === 'mid')

        this.createControls()
        console.log(this.#gochiData);

        this.gameLoop = setInterval(this.upDate.bind(this), 1000);


    }

    createControls() {

        let menu = document.createElement('section');
        menu.id = 'menuBar';

        let playButton = document.createElement('button');
        playButton.innerHTML = 'Play';
        playButton.addEventListener('click', () => {
            console.log('play');

            this.playGochi()
        });

        menu.appendChild(playButton);

        let button = document.createElement('button');
        button.innerHTML = 'feed';
        button.addEventListener('click', () => {
            this.feedGochi();
        });

        menu.appendChild(button);

        document.getElementById('app').appendChild(menu);
    }

    feedGochi() {

        if (this.#gochiData.hunger <= 0) {
            return;
        }

        this.#eat.fire()
        this.#gochiData.hunger -= 1;
        this.#gochiData.lastFeed.timeStamp = new Date().getTime();
        this.SaveLocalStorageData(this.#gochiData);
    }

    playGochi() {
        console.log(this.gochiState);


        if (this.gochiState !== 'happy') {
            return;
        }


        console.log('play call');
        this.#play.fire()
        this.#gochiData.lastPlay.timeStamp = new Date().getTime();
        this.#gochiData.bored -= 1;
        this.SaveLocalStorageData(this.#gochiData);
    }

    upDate() {
        // console.log(this.#gochiData.bored);
        if (this.gochiState == 'dead') {
        } else {
            this.currentTimeStamp = new Date().getTime();
            //console.log(this.gochiState);

            if (this.currentTimeStamp - this.#gochiData.lastFeed.timeStamp > 1500) {

                this.#gochiData.hunger += 0.1;
                // console.log('hunger level: ' + this.#gochiData.hunger);
            }

            if (this.currentTimeStamp - this.#gochiData.lastPlay.timeStamp > 10) {
                this.#gochiData.bored += 0.1;
            }

            if (this.currentTimeStamp - this.#gochiData.lastInteraction.timeStamp > 10) {
                this.#gochiData.lonliness += 0.1;
            }

            if (this.#gochiData.hunger < 0 && this.gochiState !== 'happy') {
                this.gochiState = 'happy';
                this.#happy.fire();
            }

            if (this.#gochiData.hunger > 2 && this.gochiState !== 'sad') {
                console.log('sad');

                this.gochiState = 'sad';cd nodeserver
                this.#sad.fire();
            }

            if (this.#gochiData.hunger > 1 && this.#gochiData.hunger < 2 && this.gochiState !== 'mid') {
                this.gochiState = 'mid';
                this.#mid.fire();
            }

            if (this.#gochiData.hunger > 3) {
                this.gochiState = 'dead';
                this.die()
            }
        }

    }

    die() {

        this.#die.fire();
        this.#gochiData = null
        this.SaveLocalStorageData(this.#gochiData);
    }


    SaveLocalStorageData(myData) {
        let mySerializedData = JSON.stringify(myData)
        localStorage.setItem(this.#storageName, mySerializedData)
    }

    ReadLocalStorageData() {
        let myDatatstring = localStorage.getItem(this.#storageName)
        let myData = JSON.parse(myDatatstring)
        return myData
    }



}


/* "load", // When Rive has successfully loaded in the Rive file
    "loaderror", // When Rive cannot load the Rive file
    "play", // When Rive plays an entity or resumes the render loop
    "pause", // When Rive pauses the render loop and playing entity
    "stop", // When Rive stops the render loop and playing entity
    "loop", // (Singular animations only) When Rive loops an animation 
    "advance", // When Rive advances the animation in a frame
    "statechange", // When a Rive state change is detected
    "riveevent", // When a Rive Event gets reported */



