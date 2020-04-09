/*
 * @Description: 
 * @Author: Zhe Sun
 * @Github: https://github.com/RobertZSun
 * @Date: 2020-04-08 02:16:43
 * @LastEditors: Zhe Sun
 * @LastEditTime: 2020-04-09 03:11:29
 */

(function () {
    var parentEle = document.getElementById('map');
    var game = new Game(parentEle);
    game.start();
})()

// game.snake.move();
// var r = Tools.getRandom(0, 255);
// var g = Tools.getRandom(0, 255);
// var b = Tools.getRandom(0, 255);

// var food = new Food({
//     backgroundColor: 'rgb(' + r + ',' + g + ',' + b + ')',
// });

// food.render(parentEle);



// setInterval(function () {
//     game.snake.move();
//     game.snake.render(parentEle);

// }, 400);