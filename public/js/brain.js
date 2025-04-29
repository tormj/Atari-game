export class Paddle {
    width = 200;
    height = 50;
    top = 0;
    left = 0;

    color = 'rgb(248, 246, 240)';

    #isMoving = false;

    #intervalId = null;

    constructor(left, top, color) {
        this.left = left;
        this.top = top;
        this.color = color;
    }

    validateAndFixPosition(borderThickness) {
        if (this.left < borderThickness) {
            this.left = borderThickness;
            clearInterval(this.#intervalId);
            this.#intervalId = null;
        }

        if ((this.left + this.width) > 1000 - borderThickness) {
            this.left = (1000 - borderThickness) - (this.width);
            clearInterval(this.#intervalId);
            this.#intervalId = null;
        }

        console.log(this.left);
    }


    startMove(step, borderThickness) {
        if (this.#intervalId !== null) return;

        //this.top += step * 10;
        //this.validateAndFixPosition(borderThickness);

        this.#intervalId = setInterval(() => {
            this.left += step * 30;
            // 0 - border
            this.validateAndFixPosition(borderThickness);

        }, 30);

        //step = undefined;
    }

    stopMove(borderThickness) {
        if (!this.#intervalId) return;
        clearInterval(this.#intervalId);
        this.#intervalId = null;
        this.validateAndFixPosition(borderThickness);
    }
}

export class Block {
    width = 120;
    height = 30;
    top = 0;
    left = 0;
    color = 'green';
    borderColor = 'black'; 

    constructor(left, top, color) {
        this.left = left;
        this.top = top;
        this.color = color;
    
    }
    

    
}



export class Ball {

    radius = 0; // Radius of the ball
    color = 'violet'; // Color of the ball
    x = 0; // x-coordinate of the center of the ball
    y = 0; // y-coordinate of the center of the ball
    dx = 1; // Velocity in the x-direction
    dy = -1; // Velocity in the y-dire

    constructor(x, y, color, radius) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = radius;
    }

    #intervalId = null;

    move() {
        this.x += this.dx;
        this.y += this.dy;
    }


}

export default class Brain {
    width = 1000;
    height = 1000;
    borderThickness = 30;
    blocks = [];
    #isPaused = false;
    numRows = 1;
    currentLevel = 1;
    lives = 3;
    score = 0;
    previousScores = [];
    
    


    leftPaddle = new Paddle(300,800, '#F8F6F0');

    ball = new Ball(500, 500, 'violet', 15)

    constructor() {
        console.log("Brain ctor");
        this.#isPaused = true; // Initialize the game as paused
        this.createBlocks(this.numRows);
        this.moveBall();
        this.score = 0;
        
        

    }

    moveBall() {
        setInterval(() => {
            if (!this.#isPaused) { // Only move the ball if the game is not paused
                this.ball.move();
                this.handleWallCollision();
            }
            if (this.ball.y + this.ball.radius > this.height - this.borderThickness) {
                this.handleBallLost(); // Invoke method to handle loss of life
            }
        }, );
    }
    
    

    movePaddle(paddle, step){
        paddle.left += step * 50;
    }

    togglePause() {
        this.#isPaused = !this.#isPaused;
    }

    isPaused() {
        return this.#isPaused;
    }

    handlePause() {
        // Perform any necessary actions when the game is paused
        // For example, stop updating game state or animations
    }

    resume() {
        this.#isPaused = false;
    }
    pause() {
        this.#isPaused = true;
    }
    

    startMovePaddle(paddle, step) {
        paddle.startMove(step, this.borderThickness);
    }

    stopMovePaddle(paddle) {
        paddle.stopMove(this.borderThickness);
    }

    handleWallCollision() {
        // Check collision with left and right walls
        if (this.ball.x - this.ball.radius < this.borderThickness || this.ball.x > this.width - this.borderThickness) {
            console.log(this.ball.x, this.ball.radius, this.width, this.borderThickness);
            this.ball.dx = -this.ball.dx; // Reverse direction
        }

        // Check collision with top and  wall
        if (this.ball.y - this.ball.radius < this.borderThickness) {
            this.ball.dy = -this.ball.dy; // Reverse direction
        }
    }

    checkBallPaddleCollision() {
        const ball = this.ball;
        const paddle = this.leftPaddle;
    
        // Check if the ball intersects with the paddle
        if (
            ball.x + ball.radius > paddle.left &&
            ball.x - ball.radius < paddle.left + paddle.width &&
            ball.y + ball.radius > paddle.top &&
            ball.y - ball.radius < paddle.top + paddle.height
        ) {
            return true; // Collision detected
        }
    
        return false; // No collision
    }
    
    handleBallPaddleCollision() {
    const ball = this.ball;
    const paddle = this.leftPaddle;

    if (this.checkBallPaddleCollision()) {
         // Calculate the position of the ball relative to the center of the paddle
    const relativeX = ball.x - (paddle.left + paddle.width / 2);

    console.log("Relative X:", relativeX);

    // Normalize the relative position
    const normalizedRelativeX = relativeX / (paddle.width / 2);
    console.log("Normalized Relative X:", normalizedRelativeX);

    // Define the maximum bounce angle (in radians)
    const MAX_BOUNCE_ANGLE = (5 * Math.PI) / 12; // 75 degrees

    // Calculate the bounce angle based on the normalized relative position
    let bounceAngleX = normalizedRelativeX * MAX_BOUNCE_ANGLE;

    // Ensure the bounce angle is within the allowed range
    bounceAngleX = Math.max(-MAX_BOUNCE_ANGLE, Math.min(MAX_BOUNCE_ANGLE, bounceAngleX));

    // Calculate new horizontal velocity using trigonometry
    const speed = Math.sqrt(ball.dx ** 2 + ball.dy ** 2);
    ball.dx = speed * Math.sin(bounceAngleX);
    ball.dy = speed *- Math.cos(bounceAngleX);
     }
 

    }

    createBlocks(numRows) {
        const rowColors = ['#E11763', '#50C878', '#1da2d8'];
        const numCols = Math.floor((this.width - 2 * this.borderThickness - 30) / (120 + 10)); // Calculate the number of columns based on available space
        const startX = this.borderThickness + 10; // Start the blocks from the left border
        const startY = this.borderThickness + 10; // Start the blocks from the top border
        const paddingX = 10;
        const paddingY = 20;
       

        for (let row = 0; row < numRows; row++) {
            const color = rowColors[row % rowColors.length]; 
            for (let col = 0; col < numCols; col++) {
                const left = startX + col * (120 + paddingX);
                const top = startY + row * (20 + paddingY);
                this.blocks.push(new Block(left, top, color));
            }
        }
    }
1
    checkBallBlockCollision() {
        for (let i = 0; i < this.blocks.length; i++) {
            const block = this.blocks[i];
            const ball = this.ball;
    
            // Calculate the coordinates of the edges of the block
            const blockRight = block.left + block.width;
            const blockBottom = block.top + block.height;
    
            // Check collision with each block
            if (
                ball.x + ball.radius > block.left && // Ball's right edge is to the right of the block's left edge
                ball.x - ball.radius < blockRight && // Ball's left edge is to the left of the block's right edge
                ball.y + ball.radius > block.top && // Ball's bottom edge is below the block's top edge
                ball.y - ball.radius < blockBottom // Ball's top edge is above the block's bottom edge
            ) {

                ball.dy = -ball.dy;

                // Remove the block from the array
                this.blocks.splice(i, 1);

                this.score++;

                // Save score to local storage
                this.saveScore();

                return true;
                
            }
            
        }
    
        // No collision detected with any block
        return false;
    }

    initLevel() {
        // Clear previous blocks
        this.blocks = [];
        // Create blocks for the current level  
        this.createBlocksForLevel(this.numRows);
        // Reset ball speed
        this.resetBallSpeed();
    }

    createBlocksForLevel(level) {
        this.numRows = 1 + level; // Increase number of rows with each level
        this.createBlocks(this.numRows)
    }

    resetBallSpeed() {
        // Increase ball speed with each level
        this.ball.dx = Math.sign(this.ball.dx) * (Math.abs(this.ball.dx) + this.currentLevel);
        this.ball.dy = Math.sign(this.ball.dy) * (Math.abs(this.ball.dy) + this.currentLevel);
    }

    handleLevelCompletion() {
        if (this.blocks.length === 0) {
            this.pause(); // Pause the game
            this.ball.x = 500; // Reset ball's x-coordinate
            this.ball.y = 500; // Reset ball's y-coordinate
            this.ball.dx = 1; // Reset ball's horizontal velocity
            this.ball.dy = -1; // Reset ball's vertical velocity
            this.currentLevel++;
            if (this.currentLevel <= 3 && this.currentLevel != 1) { // Assuming there are 3 levels
                console.log("this.level");
                console.log("this.lives");
                this.initLevel();
            }if(this.blocks.length === 0 && this.currentLevel === 4 && this.lives > 0) {
                this.saveScoreToList();
                this.restartGame();
            
            return true;
        }
        return false;
    }
}

    handleBallLost() {
        if (this.lives > 0) {
            this.lives--;
            // Reset the ball position and resume the game
            this.ball.x = this.width / 2;
            this.ball.y = this.height / 2;
            this.ball.dy = -this.ball.dy;
            console.log("1");
            this.pause(); // Pause the game until the player presses 's' to start
        } else {
            // Game over logic can be added here
            this.pause();
            this.saveScoreToList();
            this.restartGame();
            
        }
    }

    restartGame() {
        this.lives = 3;
        this.currentLevel = 1;
        this.numRows = 2;
        this.blocks = []; // Clear the blocks array
        this.createBlocks(this.numRows); // Create new blocks
        this.ball.dx = 1; // Reset ball's horizontal velocity
        this.ball.dy = -1; // Reset ball's vertical velocity
        this.score = 0; 
        this.saveScore();
    }

    saveScore() {
        localStorage.setItem('gameScore', this.score);
    }

    loadScore() {
        const savedScore = localStorage.getItem('gameScore');
        if (savedScore !== null) {
            this.score = parseInt(savedScore);
        }
    }
    saveScoreToList() {
        this.previousScores.push(this.score);
        this.previousScores.sort((a, b) => b - a);
        this.previousScores = this.previousScores.slice(0, 5);
        localStorage.setItem('previousScores', JSON.stringify(this.previousScores));
    }

    loadPreviousScores() {
        const savedScores = localStorage.getItem('previousScores');
        if (savedScores !== null) {
            this.previousScores = JSON.parse(savedScores);
        }
    }

    renderPreviousScores() {
        console.log("Rendering previous scores:", this.previousScores); // Add this line for debugging
    }

    
    
}




