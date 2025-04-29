import Brain from "./brain.js";
import UI from "./ui.js";



function validateIndexHtml() {
    if (document.querySelectorAll("#app").length != 1) {
        throw Error("More or less than one div with id 'app' found!");
    }
    if (document.querySelectorAll("div").length != 1) {
        throw Error("More or less than one div found in index.html!");
    }
}



function main() {
    validateIndexHtml();
    let appDiv = document.querySelector("#app");
    let brain = new Brain();
    let ui = new UI(brain, appDiv);



    document.addEventListener('keydown', (e) => {
        if (e.key === 's') {
            if (brain.isPaused()) {
                brain.resume(); // Start the game when "s" is pressed
            }
        
        }
        // Other key event handling...
    });

    

    

    document.addEventListener('keydown', (e) => {
        if (e.key === 'p' || e.key === 'P') {
            brain.togglePause();
        }
    });

    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'a':
                if (!brain.isPaused()) {
                    brain.startMovePaddle(brain.leftPaddle, -1);
                    break;
                }
            
            case 'd':
                if (!brain.isPaused()) {
                    brain.startMovePaddle(brain.leftPaddle, 1);
                    break;
                }
        }
    });

    document.addEventListener('keyup', (e) => {
        switch (e.key) {
            case 'a':
                if (!brain.isPaused()) {
                    brain.stopMovePaddle(brain.leftPaddle, -1);
                    break;
                }
            case 'd':
                if (!brain.isPaused()) {
                    brain.stopMovePaddle(brain.leftPaddle, 1);
                    break;
                }
        }

    });

    function uiDrawRepeater(ui) {
        ui.draw(); // Always draw UI regardless of game state
        setTimeout(() => uiDrawRepeater(ui), 0); // Schedule the next draw
    }
    
    uiDrawRepeater(ui);

}

// =============== ENTRY POINT ================
console.log("App startup...");
main();
