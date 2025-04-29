export default class UI {
    // real screen dimensions
    width = -1;
    height = -1;

    brain = null;
    appContainer = null;

    scaleX = 1;
    scaleY = 1;



    constructor(brain, appContainer) {
        this.brain = brain;
        this.appContainer = appContainer;
        this.setScreenDimensions();
        this.brain.loadPreviousScores();

        console.log(this);
    }


    setScreenDimensions(width, height) {
        this.width = width || document.documentElement.clientWidth;
        this.height = height || document.documentElement.clientHeight;

        this.scaleX = this.width / this.brain.width;
        this.scaleY = this.height / this.brain.height;



    }

    calculateScaledX(x) {
        return x * this.scaleX | 0;
    }

    calculateScaledY(y) {
        return y * this.scaleY | 0;
    }

    drawBorderSingle(left, top, width, height) {
        let border = document.createElement('div');

        border.style.zIndex = 10;
        border.style.position = 'fixed';

        border.style.left = left + 'px';
        border.style.top = top + 'px';

        border.style.width = width + 'px';
        border.style.height = height + 'px';
        border.style.backgroundImage = 'linear-gradient(to bottom, #ea148e, #ff3770, #ff5f53, #ff873a, #ffac2a, #f9b32b, #f2b92e, #ecbf33, #efab32, #ef9836, #ec853b, #e67342)';
        border.style.borderRadius = '5px';

        this.appContainer.append(border);
    }

    drawBorder() {
        // top border
        this.drawBorderSingle(0, 0, this.width, this.calculateScaledY(this.brain.borderThickness));
        // left
        this.drawBorderSingle(0, 0, this.calculateScaledX(this.brain.borderThickness), this.height);
        // right
        this.drawBorderSingle(this.width - this.calculateScaledX(this.brain.borderThickness), 0, this.calculateScaledX(this.brain.borderThickness), this.height);
        this.drawBorderSingle(0, this.height - this.calculateScaledY(this.brain.borderThickness), this.width, this.calculateScaledY(this.brain.borderThickness));
    }

    drawPaddle(paddle) {
        let div = document.createElement('div');

        div.style.zIndex = 10;
        div.style.position = 'fixed';

        div.style.left = this.calculateScaledX(paddle.left) + 'px';
        div.style.top = this.calculateScaledY(paddle.top) + 'px';

        div.style.width = this.calculateScaledX(paddle.width) + 'px';
        div.style.height = this.calculateScaledY(paddle.height) + 'px';

        div.style.backgroundColor = paddle.color;

        this.appContainer.append(div);
    }

    draw() {
        // clear previous render

        this.appContainer.innerHTML = '';
        this.setScreenDimensions();



        if (this.brain.isPaused()) {
            // Display start message
            this.drawStartMessage();
        } else {
            // Draw game elements
            this.drawBorder();
            this.drawPaddle(this.brain.leftPaddle);
            this.drawBall(this.brain.ball);
            this.drawBlocks(this.brain.blocks);
            this.note();
        }

        this.drawBorder();
        this.drawPaddle(this.brain.leftPaddle);
        this.drawBall(this.brain.ball);
        this.drawBlocks(this.brain.blocks);


        if (this.brain.checkBallPaddleCollision()) {
            // Perform actions when collision is detected
            this.brain.handleBallPaddleCollision();
        }

        if (this.brain.checkBallBlockCollision()) {
            // Perform actions when collision is detected
            // For example, update score or reflect ball velocity
        }

        if (this.brain.handleLevelCompletion()) {
            this.drawLevelMessages();

        }


        this.setBackgroundColor('linear-gradient(to left bottom, #2d4d7a, #004259, #003233, #102019, #0c0e07)');

        this.updateLivesDisplay();

        this.updateScoreDisplay();

        this.levelnote();

    }


    drawBall(ball) {
        let div = document.createElement('div');

        div.style.zIndex = 10;
        div.style.position = 'fixed';

        // Calculate scaled position and size for the ball
        let scaledX = this.calculateScaledX(ball.x - ball.radius);
        let scaledY = this.calculateScaledY(ball.y - ball.radius);
        let scaledSize = Math.min(this.calculateScaledX(ball.radius * 2), this.calculateScaledY(ball.radius * 2));

        div.style.left = scaledX + 'px';
        div.style.top = scaledY + 'px';
        div.style.width = scaledSize + 'px';
        div.style.height = scaledSize + 'px';
        div.style.borderRadius = '50%';
        div.style.backgroundColor = ball.color;

        this.appContainer.append(div);
    }

    drawBlocks(blocks) {
        blocks.forEach(block => {
            let div = document.createElement('div');

            div.style.zIndex = 10;
            div.style.position = 'fixed';

            // Calculate scaled position and size for the block
            let scaledX = this.calculateScaledX(block.left);
            let scaledY = this.calculateScaledY(block.top);
            let scaledWidth = this.calculateScaledX(block.width);
            let scaledHeight = this.calculateScaledY(block.height);

            div.style.left = scaledX + 'px';
            div.style.top = scaledY + 'px';
            div.style.width = scaledWidth + 'px';
            div.style.height = scaledHeight + 'px';
            div.style.backgroundColor = block.color;
            div.style.border = '1px solid black';


            this.appContainer.append(div);
        });
    }


    drawStartMessage() {
        this.removeMessages();
        let startMessage = document.createElement('div');
        startMessage.id = 'start-message';
        startMessage.innerText = 'Press "s" to start';
        startMessage.style.position = 'fixed';
        
        // Calculate position based on scaled dimensions
        startMessage.style.left = '50%';
        startMessage.style.top = '50%';
        startMessage.style.transform = `translate(-50%, -50%)`;
    
        // Calculate font size based on scaled dimensions
        let fontSize = Math.min(this.calculateScaledX(24), this.calculateScaledY(24));
        startMessage.style.fontSize = `${fontSize}px`;
        
        startMessage.style.color = 'black';
        startMessage.style.zIndex = '100';
        this.appContainer.appendChild(startMessage);
    }

    drawLevelMessages() {
        this.removeMessages();
        let levelMessage = document.createElement('div');
        levelMessage.id = 'level-message';
        levelMessage.innerText = 'Congratulations! Press "s" to start again';
        levelMessage.style.position = 'fixed';
        levelMessage.style.left = '50%';
        levelMessage.style.top = '60%';
        levelMessage.style.transform = 'translate(-50%, -50%)';
        levelMessage.style.fontSize = '24px';
        levelMessage.style.color = 'black';
        levelMessage.style.zIndex = '100';
        this.appContainer.appendChild(levelMessage);
    }

    removeMessages() {
        // Remove existing messages if they exist
        const startMessage = document.getElementById('start-message');
        if (startMessage) {
            startMessage.remove();
        }

        const levelMessage = document.getElementById('level-message');
        if (levelMessage) {
            levelMessage.remove();
        }
    }

    setBackgroundColor(color) {
        document.body.style.backgroundImage = color;
    }

    updateLivesDisplay() {
        // Check if the lives display already exists, if so, update its content
        let livesDisplay = document.getElementById('lives-display');
        if (!livesDisplay) {
            // If lives display doesn't exist, create it
            livesDisplay = document.createElement('div');
            livesDisplay.id = 'lives-display';
            livesDisplay.style.position = 'fixed';
            livesDisplay.style.top = '20px';
            livesDisplay.style.left = '20px';
            livesDisplay.style.color = 'white';
            livesDisplay.style.zIndex = '100';
            this.appContainer.appendChild(livesDisplay);
        }

        if (this.brain.lives > 0) {
            livesDisplay.innerText = `Lives: ${this.brain.lives}`;
        } else {
            livesDisplay.innerText = "Game Over, Press 's' to start again";
            this.brain.handleBallLost();
        }
        livesDisplay.style.top = this.calculateScaledY(20) + 'px';
        livesDisplay.style.left = this.calculateScaledX(20) + 'px';
        livesDisplay.style.fontSize = this.calculateScaledX(16) + 'px';
    }

    drawScore() {
        let scoreDisplay = document.getElementById('score-display');
        if (!scoreDisplay) {
            scoreDisplay = document.createElement('div');
            scoreDisplay.id = 'score-display';
            scoreDisplay.style.position = 'fixed';
            scoreDisplay.style.top = '20px';
            scoreDisplay.style.right = '20px';
            scoreDisplay.style.color = 'white';
            scoreDisplay.style.zIndex = '100';
            this.appContainer.appendChild(scoreDisplay);
        }
        scoreDisplay.innerText = `Score: ${this.brain.score}`;
        scoreDisplay.style.top = this.calculateScaledY(20) + 'px';
        scoreDisplay.style.right = this.calculateScaledX(20) + 'px';
        scoreDisplay.style.fontSize = this.calculateScaledX(16) + 'px';
    }

    drawPreviousScores() {
        let scoresContainer = document.getElementById('previous-scores');

        if (!scoresContainer) {
            scoresContainer = document.createElement('div');
            scoresContainer.id = 'previous-scores';
            scoresContainer.style.display = 'block';
            scoresContainer.style.position = 'fixed';
            scoresContainer.style.color = 'white';
            scoresContainer.style.zIndex = '110';
            this.appContainer.appendChild(scoresContainer);
        }

        const headerFontSize = Math.min(this.calculateScaledX(16), this.calculateScaledY(16));
        scoresContainer.innerHTML = `<strong style="font-size: ${headerFontSize}px;">Previous best Scores:</strong><br>`;


        // Calculate scaled position and font size for scores container
        scoresContainer.style.top = this.calculateScaledY(80) + 'px';
        scoresContainer.style.right = this.calculateScaledX(20) + 'px';

        // Loop through previous scores and append them as div elements with scaled font size
        this.brain.previousScores.forEach(score => {
            const scoreDiv = document.createElement('div');
            scoreDiv.textContent = score;
            scoreDiv.style.fontSize = this.calculateScaledX(16) + 'px';
            scoresContainer.appendChild(scoreDiv);
        });
    }

    updateScoreDisplay() {
        this.drawScore();
        this.drawPreviousScores();
    }

    note() {
        // Check if the lives display already exists, if so, update its content
        let pauseNote = document.getElementById('pause-note');
        if (!pauseNote) {
            // If lives display doesn't exist, create it
            pauseNote = document.createElement('div');
            pauseNote.id = 'pause-note';
            pauseNote.style.position = 'fixed';
            pauseNote.style.top = '90px';
            pauseNote.style.left = '90px';
            pauseNote.style.color = 'white';
            pauseNote.style.zIndex = '100';
            this.appContainer.appendChild(pauseNote);
        }
        pauseNote.innerText = `Press "p" to pause`;

        pauseNote.style.top = this.calculateScaledY(900) + 'px';
        pauseNote.style.left = this.calculateScaledX(20) + 'px';
        pauseNote.style.fontSize = this.calculateScaledX(16) + 'px';
    }

    levelnote() {
        let levelNote = document.getElementById('level-note');
        let progress = this.brain.currentLevel;
        if (!levelNote) {
            let levelNote = document.getElementById('level-note');
            if (!levelNote) {
                levelNote = document.createElement('div');
                levelNote.id = 'level-note';
                levelNote.style.position = 'fixed';
                levelNote.style.top = '90px';
                levelNote.style.left = '90px';
                levelNote.style.color = 'white';
                levelNote.style.zIndex = '100';
                this.appContainer.appendChild(levelNote);
            }

            // Determine the level progression
            let levelProgress = `${progress}/3`;

            levelNote.innerText = `Level ${levelProgress}`;

            levelNote.style.top = this.calculateScaledY(0) + 'px';
            levelNote.style.left = this.calculateScaledX(465) + 'px';
            levelNote.style.fontSize = this.calculateScaledX(16) + 'px';
            
        }
    }
}