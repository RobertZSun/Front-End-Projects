/*
 * @Description: 
 * @Author: Zhe Sun
 * @Github: https://github.com/RobertZSun
 * @Date: 2020-04-08 20:56:58
 * @LastEditors: Zhe Sun
 * @LastEditTime: 2020-04-09 04:25:05
 */
(function () {
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
})()

// testing code...
// var map = document.getElementById('map');
// var snake = new Snake();
// snake.render(map);