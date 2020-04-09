/*
 * @Description: 
 * @Author: Zhe Sun
 * @Github: https://github.com/RobertZSun
 * @Date: 2020-04-07 22:31:26
 * @LastEditors: Zhe Sun
 * @LastEditTime: 2020-04-09 03:23:44
 */

 (function () {
    var Tools = {
        getRandom: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    }
    window.Tools = Tools;
 })()
