/*
 * @Description: 
 * @Author: Zhe Sun
 * @Github: https://github.com/RobertZSun
 * @Date: 2020-04-08 21:39:46
 * @LastEditors: Zhe Sun
 * @LastEditTime: 2020-04-09 04:14:58
 */
(function () {
    var gameObject;

    function Game(parentNode) {
        this.parentNode = parentNode;
        this.food = new Food();
        this.snake = new Snake();
        gameObject = this;
    }

    Game.prototype.start = function () {
        // render the food and snake to the screen
        this.food.render(this.parentNode);
        this.snake.render(this.parentNode);
        runSnake();
        controlSnakeDirection();
    }


    function runSnake() {
        var loopID = setInterval(function () {
            // gameObject.snake.move(gameObject.food);
            this.snake.move(this.food, this.parentNode);
            this.snake.render(this.parentNode);

            // check whether hit the boundary
            /*since the snake head is always at the very front
            then we just need to check the snake head position*/
            var maxXinOneRow = this.parentNode.offsetWidth / this.snake.width;
            var maxYinOneRow = this.parentNode.offsetHeight / this.snake.height;

            var snakeHeadX = this.snake.body[0].x;
            var snakeHeadY = this.snake.body[0].y;
            var xCheck = snakeHeadX < 0 || snakeHeadX > maxXinOneRow - 1;
            var yCheck = snakeHeadY < 0 || snakeHeadY > maxYinOneRow - 1;
            if (xCheck || yCheck) {
                alert("Game Over!");
                clearInterval(loopID);
            }
        }.bind(gameObject), 150)
    }

    function controlSnakeDirection() {
        // document.onkeydown = function () {
        // }
        document.addEventListener('keydown', function (e) {

            // left: 37  up: 38 right: 39  down: 40
            switch (e.keyCode) {
                case 37:
                    this.snake.direction = 'left';
                    break;
                case 38:
                    this.snake.direction = 'up';
                    break;
                case 39:
                    this.snake.direction = 'right';
                    break;
                case 40:
                    this.snake.direction = 'down';
                    break;
                default:
                    break;
            }

        }.bind(gameObject), false);
    }

    window.Game = Game;
})()