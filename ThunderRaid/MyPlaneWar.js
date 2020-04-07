// initialize the plane
var fighter_toImported = document.createElement('div');
fighter_toImported.id = 'battle_aircraft';
fighter_toImported.style.left = '143px'
fighter_toImported.style.bottom = '20px';
fighter_toImported.innerHTML = '<img src="images/me.png" alt="">';

var view = document.getElementById('view');
view.appendChild(fighter_toImported);

var fighter = document.getElementById('battle_aircraft');

var retryButton = document.getElementById('retryButton');
retryButton.onclick = function () {
    document.location.reload(false);
}

var gameOver = document.getElementById('gameOver');

var finalScore = 0;

var scoreBoard = document.getElementById('scoreBoard');
var scoreArea = scoreBoard.getElementsByTagName('span');
scoreArea[1].innerText = finalScore;

// create the action to let fighter follow the mouse
document.onmousemove = function (e) {

    console.log(view.offsetLeft, view.offsetWidth, e.clientX);

    if (e.clientX < view.offsetLeft + 34) {
        var fighterX = 0;
    } else if (e.clientX > view.offsetLeft + view.offsetWidth - 34) {
        var fighterX = view.offsetWidth - 34;
    } else {
        var fighterX = e.clientX - 17 - view.offsetLeft;
    }
    fighter.style.left = fighterX + 'px';

    if (e.clientY < view.offsetTop + 24) {
        var fighterY = 0;
    } else if (e.clientY > view.offsetTop + view.offsetHeight - 24) {
        var fighterY = view.offsetHeight - 24;
    } else {
        var fighterY = e.clientY - 12 - view.offsetTop;
    }
    fighter.style.top = fighterY + 'px';

    if (fighterY >= 0 && fighterY <= view.offsetHeight - 24 && fighterX >= 0 && fighterX <= view.offsetWidth - 34) {
        fighter.inRange = true;
    }
}

// create class bullets to store the bullets' positions
var bullets = {
    name: 'bullet',
    num: 1,
    width: 6,
    height: 14,
    collection: [], // ['id|left|top']
    path: 'images/b.png',
}

function bulletRain(bullet) {
    setInterval(function () {
        // var fighter = document.getElementById('battle_aircraft')
        if (fighter.inRange) {
            var singleOneBullet = document.createElement('div');
            singleOneBullet.id = bullet.name + bullet.num;
            var lengthTemp = bullet.collection.length;
            if (lengthTemp < 50) {
                bullet.collection[lengthTemp] = singleOneBullet.id + '|';
                bullet.num++;
                singleOneBullet.style.width = bullet.width + 'px';
                singleOneBullet.style.height = bullet.height + 'px';
                singleOneBullet.style.position = 'absolute';
                singleOneBullet.style.background = 'url(' + bullet.path + ')';
                singleOneBullet.style.top = parseInt(fighter.style.top) + 6 + 'px';
                singleOneBullet.style.left = parseInt(fighter.style.left) + 14 + 'px';
                view.appendChild(singleOneBullet);
                bullet.collection[lengthTemp] += singleOneBullet.style.left + '|';
                bullet.collection[lengthTemp] += singleOneBullet.style.top;
            }
        }
    }, 500);
}

bulletRain(bullets);

function bulletsFly() {
    if (fighter.inRange) {
        for (let i = 0; i < bullets.collection.length; i++) {
            var singleBulletPositionInfo = bullets.collection[i].split("|");
            var singleBullet = document.getElementById(singleBulletPositionInfo[0]);
            singleBulletPositionInfo[2] = (parseInt(singleBulletPositionInfo[2]) - 4) + 'px';
            singleBullet.style.top = singleBulletPositionInfo[2];
            bullets.collection[i] = singleBulletPositionInfo[0] + '|' + singleBulletPositionInfo[1] + '|' + singleBulletPositionInfo[2];
            if (parseInt(singleBulletPositionInfo[2]) < 0) {
                var ammoToBeRemoved = document.getElementById(singleBulletPositionInfo[0]);
                ammoToBeRemoved.parentNode.removeChild(ammoToBeRemoved);
                bullets.collection.splice(i, 1);
            }
        }
    }
}


// create class enemyPlanes to store the enemyPlanes' positions
var enemyPlanes = {
    name: 'enemyPlane',
    num: 1,
    width: 34,
    height: 24,
    collection: [], // ['id|left|top']
    path: 'images/foe.png',
}

var createPlanesID = null;
function createEnemyPlanes(enemyPlanes) {
    createPlanesID = setInterval(function () {
        // var fighter = document.getElementById('battle_aircraft')
        if (fighter.inRange) {
            var singleOneEnemyPlane = document.createElement('div');
            singleOneEnemyPlane.id = enemyPlanes.name + enemyPlanes.num;
            var lengthTemp = enemyPlanes.collection.length;
            if (lengthTemp < 50) {
                enemyPlanes.collection[lengthTemp] = singleOneEnemyPlane.id + '|';
                enemyPlanes.num++;
                singleOneEnemyPlane.style.width = enemyPlanes.width + 'px';
                singleOneEnemyPlane.style.height = enemyPlanes.height + 'px';
                singleOneEnemyPlane.style.position = 'absolute';
                singleOneEnemyPlane.style.background = 'url(' + enemyPlanes.path + ')';
                singleOneEnemyPlane.style.top = 0; parseInt(fighter.style.top) + 6 + 'px';
                singleOneEnemyPlane.style.left = parseInt(286 * Math.random()) + 'px';
                view.appendChild(singleOneEnemyPlane);
                enemyPlanes.collection[lengthTemp] += singleOneEnemyPlane.style.left + '|';
                enemyPlanes.collection[lengthTemp] += singleOneEnemyPlane.style.top;
            }
        }
    }, 500);
}

createEnemyPlanes(enemyPlanes);

function enemyPlanesFly() {
    if (fighter.inRange) {
        for (let i = 0; i < enemyPlanes.collection.length; i++) {
            var singleEnemyPlanePositionInfo = enemyPlanes.collection[i].split("|");
            var singleEnemyPlane = document.getElementById(singleEnemyPlanePositionInfo[0]);
            singleEnemyPlanePositionInfo[2] = (parseInt(singleEnemyPlanePositionInfo[2]) + 3) + 'px';
            singleEnemyPlane.style.top = singleEnemyPlanePositionInfo[2];
            enemyPlanes.collection[i] = singleEnemyPlanePositionInfo[0] + '|' + singleEnemyPlanePositionInfo[1] + '|' + singleEnemyPlanePositionInfo[2];
            if (parseInt(singleEnemyPlanePositionInfo[2]) > 568) {
                var planesToBeRemoved = document.getElementById(singleEnemyPlanePositionInfo[0]);
                planesToBeRemoved.parentNode.removeChild(planesToBeRemoved);
                enemyPlanes.collection.splice(i, 1);
            }
        }
    }
}

function checkCollision() {
    for (let i = 0; i < enemyPlanes.collection.length; i++) {
        var singleEnemyPlanePositionInfo = enemyPlanes.collection[i].split("|");
        var singleEnemyPlane = document.getElementById(singleEnemyPlanePositionInfo[0]);

        var planeXBegin = parseInt(singleEnemyPlanePositionInfo[1]);
        var planeXEnd = planeXBegin + enemyPlanes.width;

        var planeYBegin = parseInt(singleEnemyPlanePositionInfo[2]);
        var planeYEnd = planeYBegin + enemyPlanes.height;

        for (let j = 0; j < bullets.collection.length; j++) {
            var singleBulletPositionInfo = bullets.collection[j].split("|");
            var singleBullet = document.getElementById(singleBulletPositionInfo[0]);

            var bulletXBegin = parseInt(singleBulletPositionInfo[1]);
            var bulletYBegin = parseInt(singleBulletPositionInfo[2]);

            var xOverlapChecking = bulletXBegin >= planeXBegin && bulletXBegin <= planeXEnd;
            var yOverlapChecking = bulletYBegin <= planeYEnd && bulletYBegin >= planeYBegin;

            if (xOverlapChecking && yOverlapChecking) {
                // remove enemy plane
                singleEnemyPlane.parentNode.removeChild(singleEnemyPlane);
                enemyPlanes.collection.splice(i, 1);
                finalScore++;

                // remove bullet which hit the enemy plane
                singleBullet.parentNode.removeChild(singleBullet);
                bullets.collection.splice(j, 1);
            }
        }

        var planeXBegin = parseInt(singleEnemyPlanePositionInfo[1]);
        var fighterXOverlapChecking = fighter.offsetLeft >= planeXBegin && fighter.offsetLeft <= planeXEnd
        var fighterYOverlapChecking = fighter.offsetTop <= planeYEnd && (fighter.offsetTop + fighter.offsetHeight) >= planeYBegin
        if (fighterXOverlapChecking && fighterYOverlapChecking) {
            fighter.inRange = false;
            gameOver.style.display = 'block';
            clearInterval(loopID);
            clearInterval(createPlanesID);
            document.onmousemove = null;
            scoreBoard.className = 'highlight';
        }
    }
}

var loopID = setInterval(function () {
    bulletsFly();
    enemyPlanesFly();
    checkCollision();
    scoreArea[1].innerText = finalScore;
}, 20);