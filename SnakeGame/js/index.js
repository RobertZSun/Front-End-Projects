/*
 * @Description: 
 * @Author: Zhe Sun
 * @Github: https://github.com/RobertZSun
 * @Date: 2020-04-09 04:23:33
 * @LastEditors: Zhe Sun
 * @LastEditTime: 2020-04-09 04:49:19
 */
// ------------------------------Tools------------------------------
;(function (window, undefined) {
    var Tools = {
        getRandom: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    }
    window.Tools = Tools;
 })(window, undefined)

// ------------------------------food------------------------------
;(function (window, undefined) {
    // the position of the food
    var position = 'absolute';

    // to record the food created previously
    var elements = [];

    function Food(options) {

        options = options || {};
        // set up the attributes
        this.width = options.width || 20;
        this.height = options.height || 20;
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.backgroundColor = options.backgroundColor || 'red';
        this.box = null;

    }

    Food.prototype.render = function (parentNode) {

        // to eliminate the previous food box if it exists
        remove();

        // to be placed at random position
        var numOfBoxesFitOneRow = parentNode.offsetWidth / this.width - 1;
        var numOfBoxesFitOneColumn = parentNode.offsetHeight / this.height - 1;
        this.x = Tools.getRandom(0, numOfBoxesFitOneRow) * this.width;
        this.y = Tools.getRandom(0, numOfBoxesFitOneColumn) * this.height;

        // 随机设置x和y的值
        // this.x = Tools.getRandom(0, parentNode.offsetWidth / this.width - 1) * this.width;
        // this.y = Tools.getRandom(0, parentNode.offsetHeight / this.height - 1) * this.height;

        // to create div elements
        var createdDiv = document.createElement('div');
        parentNode.appendChild(createdDiv);

        // initialize the style of the div
        createdDiv.style.width = this.width + 'px';
        createdDiv.style.height = this.height + 'px';
        createdDiv.style.position = position;
        createdDiv.style.left = this.x + 'px';
        createdDiv.style.top = this.y + 'px';
        createdDiv.style.backgroundColor = this.backgroundColor;

        elements.push(createdDiv);
        this.box = createdDiv;
    }

    function remove() {
        for (let i = elements.length - 1; i >= 0; i--) {

            // delete the div food box
            var divToBeRemoved = elements[i];
            divToBeRemoved.parentNode.removeChild(divToBeRemoved);

            // delete the div food box in the elements array
            elements.splice(i, 1);
        }
    }


    Food.prototype.getRandomPosition = function (parentNode) {
        // generate random position to the food
        var numOfBoxesFitOneRow = parentNode.offsetWidth / this.width - 1;
        var numOfBoxesFitOneColumn = parentNode.offsetHeight / this.height - 1;
        var positionX = Tools.getRandom(0, numOfBoxesFitOneRow) * this.width;
        var positionY = Tools.getRandom(0, numOfBoxesFitOneColumn) * this.height;

        this.box.style.left = positionX + 'px';
        this.box.style.top = positionY + 'px';
    }

    window.Food = Food;
})(window, undefined)
// ------------------------------snake------------------------------
;(function (window, undefined) {
    var position = 'absolute';
    // to record snake body parts created previously
    var bodyElements = [];

    function Snake(params) {
        var params = params || {};
        this.width = params.width || 20;
        this.height = params.height || 20;

        this.direction = params.direction || 'right';
        this.body = [{
                x: 3,
                y: 2,
                color: 'red'
            },
            {
                x: 2,
                y: 2,
                color: 'blue'
            },
            {
                x: 1,
                y: 2,
                color: 'blue'
            }
        ]
    }

    Snake.prototype.render = function (parentNode) {
        remove();

        for (let i = 0, len = this.body.length; i < len; i++) {
            var singleBodyPart = this.body[i];

            // create each singleBodyPart to the parentNode element
            var div = document.createElement('div');

            div.style.position = position;
            div.style.width = this.width + 'px';
            div.style.height = this.height + 'px';
            div.style.left = singleBodyPart.x * this.width + 'px';
            div.style.top = singleBodyPart.y * this.height + 'px';
            div.style.backgroundColor = singleBodyPart.color;
            parentNode.appendChild(div);
            bodyElements.push(div);
        }
    }

    // Snake.prototype.move = function (foodBox) {
    Snake.prototype.move = function (foodBox, parentNode) {
        /* control the body move, to let the latter single one part of body
           move to the former one's position */
        for (let i = this.body.length - 1; i > 0; i--) {
            var singleOneBodyPart = this.body[i];
            this.body[i].x = this.body[i - 1].x;
            this.body[i].y = this.body[i - 1].y;
        }

        // control the snake's head moving
        // determine the snake's head moving direction
        var snakeHead = this.body[0];
        switch (this.direction) {
            case 'right':
                snakeHead.x += 1;
                break;
            case 'left':
                snakeHead.x -= 1;
                break;
            case 'up':
                snakeHead.y -= 1;
                break;
            case 'down':
                snakeHead.y += 1;
                break;
            default:
                break;
        }

        // to see whether the snake head hit the food box and overlaps each other
        var headX = snakeHead.x * this.width;
        var headY = snakeHead.y * this.height;
        if (headX === foodBox.x && headY === foodBox.y) {
            // snake increased one body part
            var toBeAppended = this.body[this.body.length - 1];
            this.body.push({
                x: toBeAppended.x,
                y: toBeAppended.y,
                color: toBeAppended.color
            });
            // generate another food box
            
            foodBox.render(parentNode);
        }

    }

    function remove() {
        for (let i = bodyElements.length - 1; i >= 0; i--) {

            // delete the div each single one snake body part
            var partToBeRemoved = bodyElements[i];
            partToBeRemoved.parentNode.removeChild(partToBeRemoved);

            // delete the div each single one snake body part in the bodyElements array
            bodyElements.splice(i, 1);
        }
    }

    window.Snake = Snake;
})(window, undefined)
// ------------------------------game------------------------------
;(function (window, undefined) {
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
})(window, undefined)

// ------------------------------main------------------------------
;(function (window, undefined) {
    var parentEle = document.getElementById('map');
    var game = new Game(parentEle);
    game.start();
})(window, undefined)
