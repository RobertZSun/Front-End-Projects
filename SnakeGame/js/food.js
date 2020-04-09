/*
 * @Description: 
 * @Author: Zhe Sun
 * @Github: https://github.com/RobertZSun
 * @Date: 2020-04-08 13:25:01
 * @LastEditors: Zhe Sun
 * @LastEditTime: 2020-04-09 04:24:21
 */
(function () {
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
})()