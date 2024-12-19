
import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
import newGochi from "./gochi.js";
// Initializes the socket IO connection
// Its important to note that during development this should be "localhost", but as soon as
// we host the backend online on Railway, we need to change this to the correct URL
export const socket = io("http://127.0.0.1:3000");
export const ioSocket = socket.connect("http://127.0.0.1:3000");

createControls()

let myGochi = newGochi();

function createControls() {

    let menu = document.createElement('section');
    menu.id = 'menuBar';

    let playButton = document.createElement('button');
    playButton.innerHTML = 'Play';
    playButton.addEventListener('click', () => {
        console.log('play');

        // this.playGochi()
    });

    menu.appendChild(playButton);

    let button = document.createElement('button');
    button.innerHTML = 'feed';
    button.addEventListener('click', () => {
        feedGochi();
    });

    menu.appendChild(button);

    document.getElementById('app').appendChild(menu);
}






ioSocket.on("greet", (data) => {
    console.log("Server says: ", data);
});

ioSocket.on("feed", (data) => {
    console.log(data);

});

function feedGochi() {
    ioSocket.emit("feed", "nom nom");
    myGochi.feedGochi();
}






//let myGochi = new Gochi();