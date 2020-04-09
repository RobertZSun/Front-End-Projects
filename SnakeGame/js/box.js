/*
 * @Description: 
 * @Author: Zhe Sun
 * @Github: https://github.com/RobertZSun
 * @Date: 2020-04-07 22:55:43
 * @LastEditors: Zhe Sun
 * @LastEditTime: 2020-04-08 13:23:05
 */

function Box(parentNode, options) {
    this.parentNode = parentNode;
    options = options || {};
    // set up the attributes
    this.backgroundColor = options.backgroundColor || 'red';
    this.width = options.width || 20;
    this.height = options.height || 20;
    this.x = options.x || 0;
    this.y = options.y || 0;


    // to create div elements
    this.createdDiv = document.createElement('div');
    parentNode.appendChild(this.createdDiv);

    // initialize the style of the div
    this.init();
}

Box.prototype.init = function () {
    this.createdDiv.style.backgroundColor = this.backgroundColor;
    this.createdDiv.style.width = this.width + 'px';
    this.createdDiv.style.height = this.height + 'px';
    this.createdDiv.style.left = this.x + 'px';
    this.createdDiv.style.top = this.y + 'px';
    this.createdDiv.style.position = 'absolute';

}

// generate random position to the boxes
Box.prototype.generateRandomPosition = function () {
    var numOfBoxesFitOneRow = this.parentNode.offsetWidth / this.width - 1;
    var numOfBoxesFitOneColumn = this.parentNode.offsetHeight / this.height - 1;
    var positionX = Tools.getRandom(0, numOfBoxesFitOneRow) * this.width;
    var positionY = Tools.getRandom(0, numOfBoxesFitOneColumn) * this.height;

    this.createdDiv.style.left = positionX + 'px';
    this.createdDiv.style.top = positionY + 'px'
}